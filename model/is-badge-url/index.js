import { some } from '@dword-design/functions'

import badgeRegexes from './badge-regexes.json'

export default url => badgeRegexes |> some(regex => new RegExp(regex).test(url))
