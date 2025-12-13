import badgeRegexes from './badge-regexes.json';

export default (url: string) =>
  badgeRegexes.some(regex => new RegExp(regex).test(url));
