import { property, compact, map } from '@dword-design/functions'
import cheerio from 'cheerio'
import axios from 'axios'
import micromatch from 'micromatch'
import handleError from './model/handle-error'
import { TOKEN_KEY } from './model/constants'
import badgeMatches from './model/badge-matches.json'

const run = async () => {
  const token = localStorage.getItem(TOKEN_KEY)
  const userName = window.location.href.match(/github\.com\/(.*?)\?/)[1]
  const github = axios.create({ baseURL: 'https://api.github.com' })
  const $headlines = document.querySelectorAll('#user-repositories-list h3')

  const readmes =
    $headlines
    |> map(async $headline => {
      const repositoryName = $headline.querySelector('a').textContent.trim()
      try {
        return (
          github.get(`/repos/${userName}/${repositoryName}/readme`, {
            headers: {
              ...(token && { Authorization: `token ${token}` }),
              Accept: 'application/vnd.github.v3.html',
            },
          })
          |> await
          |> property('data')
        )
      } catch (error) {
        handleError(error)
      }
      return undefined
    })
    |> Promise.all
    |> await

  readmes.forEach((readme, index) => {
    if (!readme) {
      return
    }
    const $headlineContainer = $headlines[index].parentNode
    const $repository = $headlineContainer.parentNode
    let $badges = $repository.querySelector(
      '.github-better-repository-list-badges'
    )
    if (!$badges) {
      $badges = document.createElement('div')
      $badges.classList.add('github-better-repository-list-badges')
      $headlineContainer.after($badges)
    }
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
  })
}

run()
