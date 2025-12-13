import { expect, test } from '@playwright/test';

import self from './is-badge-url';

const tests = {
  'https://badge.fury.io/js/safe-require.svg': true,
  'https://ci.appveyor.com/api/projects/status/xbooh370dinuyi0y/branch/master?svg=true': true,
  'https://codecov.io/gh/potato4d/nuxt-basic-auth-module/branch/master/graph/badge.svg': true,
  'https://codecov.io/github/depcheck/depcheck/coverage.svg?branch=master': true,
  'https://david-dm.org/TheAifam5/webext-webpack-plugin.svg': true,
  'https://img.shields.io/badge/os-linux%20%7C%C2%A0macos%20%7C%C2%A0windows-blue': true,
  'https://img.shields.io/badge/renovate-enabled-brightgreen': true,
  'https://img.shields.io/coveralls/dword-design/functions': true,
  'https://img.shields.io/david/dword-design/functions': true,
  'https://img.shields.io/github/workflow/status/dword-design/functions/build': true,
  'https://img.shields.io/npm/v/@dword-design/functions.svg': true,
  'https://opencollective.com/depcheck/all/badge.svg?label=financial+contributors': true,
  'https://snyk.io/test/github/nuxt-community/nuxt-i18n/badge.svg?style=flat-square': true,
  'https://travis-ci.org/depcheck/depcheck.svg?branch=master': true,
};

for (const [string, result] of Object.entries(tests)) {
  test(string, () => expect(self(string)).toEqual(result));
}
