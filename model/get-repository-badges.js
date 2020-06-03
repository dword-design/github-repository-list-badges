import { property, compact, map } from '@dword-design/functions'
import cheerio from 'cheerio'
import axios from 'axios'
import micromatch from 'micromatch'
import { handleError } from '@dword-design/github-web-extension-utils'
import { TOKEN_KEY, BADGES_CLASS } from './constants'
import badgeMatches from './badge-matches.json'

import waitForImage from './wait-for-image'

const token = localStorage.getItem(TOKEN_KEY)
const userName = window.location.href.match(/github\.com\/(.*?)\?/)[1]
const github = axios.create({ baseURL: 'https://api.github.com' })

export default async name => {
  try {
    const readme =
      github.get(`/repos/${userName}/${name}/readme`, {
        headers: {
          ...(token && { Authorization: `token ${token}` }),
          Accept: 'application/vnd.github.v3.html',
        },
      })
      |> await
      |> property('data')

    const $ = cheerio.load(readme)
    const $badges = document.createElement('div')
    $badges.classList.add(BADGES_CLASS)
    $badges.innerHTML = $('img')
      .filter(
        (imageIndex, img) =>
          micromatch(
            [$(img).attr('data-canonical-src'), $(img).attr('src')] |> compact,
            badgeMatches
          ).length > 0
      )
      .map((badgeIndex, badge) => {
        const $link = $(badge).closest('a')
        return $link.length > 0 ? $link : $(badge)
      })
      .map((wrapperIndex, wrapper) => $.html(wrapper))
      .get()
      .join('\n')
    await ($badges.querySelectorAll('img') |> map(waitForImage) |> Promise.all)
    return $badges
  } catch (error) {
    handleError(error, {
      name: 'GitHub Repository List Badges',
      slug: 'github-repository-list-badges',
    })
  }
  return undefined
}
