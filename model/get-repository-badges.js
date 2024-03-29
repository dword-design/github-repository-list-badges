import { compact, map, property, some } from '@dword-design/functions'
import { handleError } from '@dword-design/github-web-extension-utils'
import axios from 'axios'
import cheerio from 'cheerio'

import { BADGES_CLASS, TOKEN_KEY } from './constants'
import isBadgeUrl from './is-badge-url'
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
          [$(img).attr('data-canonical-src'), $(img).attr('src')]
          |> compact
          |> some(isBadgeUrl)
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
