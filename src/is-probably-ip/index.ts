/**
 * Check if a hostname is an IP. You should be aware that this only works
 * because `hostname` is already garanteed to be a valid hostname!
 */
export function isProbablyIpv4(hostname: string): boolean {
  const len = hostname.length;

  // Cannot be shorted than 1.1.1.1 or longer than 255.255.255.255
  if (len < 7 || len > 15) {
    return false;
  }

  let numberOfDots = 0;

  for (let i = 0; i < len; i += 1) {
    const code = hostname.charCodeAt(i);

    if (code === 46 /* '.' */) {
      numberOfDots += 1;
    } else if (code < 48 /* '0' */ || code > 57 /* '9' */) {
      return false;
    }
  }

  return (
    numberOfDots === 3
    && hostname.charCodeAt(0) !== 46 /* '.' */
    && hostname.charCodeAt(len - 1) !== 46 /* '.' */
  );
}

export function isProbablyIpv6(hostname: string): boolean {
  const len = hostname.length;
  if (len < 3) {
    return false;
  }

  let start = hostname[0] === '[' ? 1 : 0;
  let end = len;

  if (hostname[end - 1] === ']') {
    end -= 1;
  }

  // We only consider the maximum size of a normal IPV6. Note that this will
  // fail on so-called "IPv4 mapped IPv6 addresses" but this is a corner-case
  // and a proper validation library should be used for these.
  if (end - start > 39) {
    return false;
  }

  /* eslint-disable sukka/no-single-return -- here it goes */
  let hasColon = false;

  for (; start < end; start += 1) {
    const code = hostname.charCodeAt(start);

    if (code === 58 /* ':' */) {
      hasColon = true;
    } else if (
      (code < 48 || code > 57) // does not match 0-9
      && (code < 97 || code > 102) // and does not match a-f
      && (code < 65 || code > 90) // and does not match A-F
    ) {
      // does not contain any characters that are required in a valid IPv6
      return false;
    }
  }

  return hasColon;
  /* eslint-enable sukka/no-single-return -- here it goes */
}

export const isProbablyIp = (hostname: string) => isProbablyIpv4(hostname) || isProbablyIpv6(hostname);
