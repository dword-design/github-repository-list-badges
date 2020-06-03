import { property, compact, map } from '@dword-design/functions'
import cheerio from 'cheerio'
import axios from 'axios'
import micromatch from 'micromatch'
import handleError from './handle-error'
import { TOKEN_KEY } from './constants'
import badgeMatches from './badge-matches.json'

import waitForImage from './wait-for-image'

const token = localStorage.getItem(TOKEN_KEY)
const userName = window.location.href.match(/github\.com\/(.*?)\?/)[1]
const github = axios.create({ baseURL: 'https://api.github.com' })

export default async $headline => {
  const $headlineContainer = $headline.parentNode
  const $repository = $headlineContainer.parentNode
  const repositoryName = $headline.querySelector('a').textContent.trim()
  try {
    const readme =
      github.get(`/repos/${userName}/${repositoryName}/readme`, {
        headers: {
          ...(token && { Authorization: `token ${token}` }),
          Accept: 'application/vnd.github.v3.html',
        },
      })
      |> await
      |> property('data')
    let $badges = $repository.querySelector(
      '.github-better-repository-list-badges'
    )
    if ($badges) {
      $badges.remove()
    }
    $badges = document.createElement('div')
    $badges.classList.add('github-better-repository-list-badges')
    const $ = cheerio.load(readme)
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
    handleError(error)
  }
  return undefined
}
