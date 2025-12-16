export default (url: string) =>
  BADGE_REGEXES.some(regex => new RegExp(regex).test(url));
