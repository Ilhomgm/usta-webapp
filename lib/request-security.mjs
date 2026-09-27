const loopback = new Set(['localhost','127.0.0.1','[::1]']);
export function originAllowed(origin, requestOrigin, configuredOrigin) {
  if (!origin) return false;
  if (configuredOrigin) return origin === configuredOrigin;
  if (origin === requestOrigin) return true;
  try {
    const received = new URL(origin);
    const expected = new URL(requestOrigin);
    return received.origin === origin && loopback.has(received.hostname) && loopback.has(expected.hostname)
      && received.protocol === expected.protocol && received.port === expected.port;
  } catch { return false; }
}
export function secureCookie(requestOrigin) {
  const url = new URL(requestOrigin);
  return url.protocol === 'https:' || !loopback.has(url.hostname);
}
