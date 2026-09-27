const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Runs a scan against the backend. Never appends the email to a URL —
 * it always travels in the POST body — so it never ends up in server
 * access logs, browser history, or a shared/bookmarked link.
 */
export async function runScan(email) {
  let response;
  try {
    response = await fetch(`${API_BASE}/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
  } catch (err) {
    throw new ApiError('NETWORK_ERROR', 'Could not reach the scan service. Check your connection and try again.');
  }

  let body = null;
  try {
    body = await response.json();
  } catch (err) {
    // no-op — handled below via !response.ok
  }

  if (!response.ok) {
    const message = body?.message || 'Something went wrong running the scan.';
    throw new ApiError(body?.error || 'UNKNOWN_ERROR', message, response.status);
  }

  return body;
}

export class ApiError extends Error {
  constructor(code, message, status) {
    super(message);
    this.code = code;
    this.status = status;
  }
}
