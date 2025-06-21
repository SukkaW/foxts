/**
 * If you know the input is probably an IP, you can use this function to quickly determine the version of the IP
 */
export function fastIpVersion(probablyIp: string): 4 | 6 | 0 {
  return probablyIp.includes(':')
    ? 6
    : (
      probablyIp.includes('.')
        ? 4
        : 0
    );
}
