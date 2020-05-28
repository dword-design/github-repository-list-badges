import { property } from '@dword-design/functions'
import cheerio from 'cheerio'
import axios from 'axios'

const token = '0c6062e4e326c10ced6d3a8ad34ac66ab2b8a8fa'

const userName = window.location.href.match(/github\.com\/(.*?)\?/)[1]
const github = axios.create({ baseURL: 'https://api.github.com' })
const $headlines = document.querySelectorAll('#user-repositories-list h3')

$headlines.forEach(async $headline => {
  const $headlineContainer = $headline.parentNode
  const $repository = $headlineContainer.parentNode
  const repositoryName = $headline.querySelector('a').textContent.trim()

  try {
    const readme =
      github.get(`/repos/${userName}/${repositoryName}/readme`, {
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3.html',
        },
      })
      |> await
      |> property('data')
    let $badges = $repository.querySelector(
      '.github-better-repository-list-badges'
    )
    if (!$badges) {
      $badges = document.createElement('div')
      $badges.classList.add('github-better-repository-list-badges')
      $headlineContainer.after($badges)
    }
    const $ = cheerio.load(readme)
    $badges.innerHTML = $('[data-canonical-src^="https://img.shields.io"]')
      .parent()
      .map((index, badge) => $(badge).html())
      .get()
      .join('\n')
  } catch (error) {
    console.error(error)
  }
})
