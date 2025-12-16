export const TOKEN_KEY = 'github-repository-list-badges-token';

export const BADGES_CLASS = 'github-repository-list-badges-badges';

export const BADGE_REGEXES = [
  String.raw`^https:\/\/img\.shields\.io\/`,
  String.raw`^https:\/\/travis-ci\.org\/`,
  String.raw`^https:\/\/ci\.appveyor\.com\/`,
  String.raw`^https:\/\/coveralls\.io\/`,
  String.raw`^https:\/\/david-dm\.org\/`,
  String.raw`^https:\/\/snyk\.io\/`,
  String.raw`^https://github\.com/.*/.*/workflows/.*/.*\.svg$`,
  String.raw`^https:\/\/opencollective\.com/.*/badge\.svg`,
  String.raw`^https:\/\/codecov\.io\/`,
  String.raw`^https:\/\/badge\.fury\.io\/`,
];
