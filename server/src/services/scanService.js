const BreachScanner = require('../scanners/BreachScanner');
const PasteExposureScanner = require('../scanners/PasteExposureScanner');
const DomainScanner = require('../scanners/DomainScanner');
const ReputationScanner = require('../scanners/ReputationScanner');
const PublicMentionScanner = require('../scanners/PublicMentionScanner');
const { calculateRiskScore } = require('./riskScoreService');
const { generateRecommendations } = require('./recommendationService');
const { extractDomain, maskEmail, isLikelyDisposable } = require('../utils/emailUtils');
const logger = require('../utils/logger');

/**
 * ScanService is the single orchestration point for a scan. Each
 * scanner is independent and swappable (see scanners/), so adding or
 * removing a data provider never touches this file's control flow —
 * only the scanner's own implementation.
 */
class ScanService {
  constructor(config) {
    this.config = config;
    this.demoMode = config.demoMode;

    this.breachScanner = new BreachScanner({ apiKey: config.hibpApiKey, demoMode: this.demoMode });
    this.pasteScanner = new PasteExposureScanner({ demoMode: this.demoMode });
    this.domainScanner = new DomainScanner({ demoMode: this.demoMode });
    this.reputationScanner = new ReputationScanner({ demoMode: this.demoMode });
    this.publicMentionScanner = new PublicMentionScanner({
      demoMode: this.demoMode,
      apiKey: config.searchApiKey,
      apiUrl: config.searchApiUrl,
    });
  }

  async runScan(email) {
    const domain = extractDomain(email);
    const masked = maskEmail(email);
    logger.info('Starting scan', { email: masked });

    const stageStatus = {};

    const [breachResult, pasteResult, domainResult, publicResult] = await Promise.all([
      this._runStage('breach', () => this.breachScanner.scan(email), stageStatus),
      this._runStage('paste', () => this.pasteScanner.scan(email), stageStatus),
      this._runStage('domain', () => this.domainScanner.scan(domain), stageStatus),
      this._runStage('publicExposure', () => this.publicMentionScanner.scan(email), stageStatus),
    ]);

    const breaches = breachResult.breaches || [];
    const publicExposure = publicResult.results || [];

    const reputationResult = await this._runStage(
      'reputation',
      () => this.reputationScanner.build({ breaches, publicExposure }),
      stageStatus
    );

    const riskScore = calculateRiskScore({ breaches, publicExposure, domainSecurity: domainResult });
    const recommendations = generateRecommendations({ breaches, publicExposure, domainSecurity: domainResult });

    const anyStageFailed = Object.values(stageStatus).some((s) => s === 'error' || s === 'rate_limited');
    const overallStatus = anyStageFailed ? 'partial' : 'completed';

    return {
      status: overallStatus,
      demoMode: this.demoMode,
      emailMasked: masked,
      isDisposableEmail: isLikelyDisposable(email),
      domain,
      stageStatus,
      breaches,
      pasteExposure: pasteResult.pastes || [],
      publicExposure,
      services: {
        confirmed: reputationResult.confirmed || [],
        publicAssociation: reputationResult.publicAssociation || [],
        unableToVerify: reputationResult.unableToVerify || [],
      },
      domainSecurity: domainResult,
      riskScore,
      recommendations,
      scannedAt: new Date().toISOString(),
    };
  }

  async _runStage(name, fn, stageStatus) {
    try {
      const result = await fn();
      stageStatus[name] = result.status || 'completed';
      return result;
    } catch (err) {
      logger.error(`Scan stage "${name}" threw unexpectedly`, { error: err.message });
      stageStatus[name] = 'error';
      return {};
    }
  }
}

module.exports = ScanService;
