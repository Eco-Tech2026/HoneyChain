/**
 * Sample data used ONLY in demo mode. This must never be blended with
 * real API results — ScanService checks DEMO_MODE once at the top of
 * a scan and routes entirely to either real scanners or this file.
 */

const DEMO_BREACHES = [
  {
    name: 'LinkedIn',
    domain: 'linkedin.com',
    breachDate: '2021-04-01',
    addedDate: '2021-06-29',
    description:
      'A dataset containing LinkedIn profile information, scraped and later redistributed, was found circulating publicly.',
    dataClasses: ['Email addresses', 'Names', 'Usernames', 'Phone numbers'],
    isSensitive: false,
    containsPasswordData: false,
  },
  {
    name: 'Example Forum',
    domain: 'exampleforum.com',
    breachDate: '2019-11-12',
    addedDate: '2019-12-02',
    description:
      'A community forum suffered a database compromise exposing member account records.',
    dataClasses: ['Email addresses', 'Usernames', 'Password-related data', 'IP addresses'],
    isSensitive: false,
    containsPasswordData: true,
  },
];

const DEMO_SERVICE_ASSOCIATIONS = {
  confirmed: [
    { service: 'LinkedIn', reason: 'Confirmed breach exposure' },
    { service: 'Example Forum', reason: 'Confirmed breach exposure' },
  ],
  publicAssociation: [
    { service: 'GitHub', reason: 'Public association found in an indexed public page' },
  ],
  unableToVerify: [
    { service: 'Google', reason: 'Login status cannot be verified' },
    { service: 'Apple', reason: 'Login status cannot be verified' },
  ],
};

const DEMO_PUBLIC_EXPOSURE = [
  {
    source: 'Example Forum (public thread)',
    type: 'Public webpage',
    detected: 'Email address',
    risk: 'Medium',
    dateSeen: '2024-03-08',
  },
  {
    source: 'Public code repository listing',
    type: 'Public webpage',
    detected: 'Email address',
    risk: 'Low',
    dateSeen: '2024-08-19',
  },
];

const DEMO_DOMAIN_SECURITY = {
  domain: 'example.com',
  mx: { status: 'ok', label: 'Configured', detail: 'MX records found' },
  spf: { status: 'ok', label: 'Configured', detail: 'SPF record present' },
  dkim: { status: 'unknown', label: 'Could not verify', detail: 'No common DKIM selector responded' },
  dmarc: { status: 'warn', label: 'Policy weak', detail: 'DMARC record present with policy "none"' },
  https: { status: 'ok', label: 'Available', detail: 'HTTPS reachable with a valid certificate' },
  domainAgeYears: null,
};

module.exports = {
  DEMO_BREACHES,
  DEMO_SERVICE_ASSOCIATIONS,
  DEMO_PUBLIC_EXPOSURE,
  DEMO_DOMAIN_SECURITY,
};
