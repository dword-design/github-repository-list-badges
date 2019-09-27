const $ = require('jquery')
const shieldman = require('shieldman')
const GitHub = require('github-api')
const axios = require('axios')

const token = '0c6062e4e326c10ced6d3a8ad34ac66ab2b8a8fa'

const github = new GitHub({
  token: '0c6062e4e326c10ced6d3a8ad34ac66ab2b8a8fa',
})

const userName = window.location.href.match(/github\.com\/(.*?)\?/)[1]
const $containers = $('#user-repositories-list h3').parent().parent()

$containers.each(function () {
  (async () => {
    const $headlineContainer = $(this).find('h3').parent()
    const repositoryName = $headlineContainer.find('a').text().trim()
    const repository = github.getRepo(userName, repositoryName)

    try {
      const [{ name: packageName }, readme] = await Promise.all([
        repository.getContents(undefined, 'package.json').then(({ data: { content, encoding } }) => JSON.parse(Buffer.from(content, encoding).toString())),
        repository.getReadme().then(({ data: { content, encoding } }) => Buffer.from(content, encoding).toString()),
      ])

      const shieldMatch = readme.match(/<!--@shields\((.*)\)-->/) || undefined
      const shieldNames = shieldMatch !== undefined
        ? shieldMatch[1].split(/,\s*/).map(part => part.substr(1, part.length - 2))
        : []

      const shieldsHtml = shieldNames
        .map(shieldName => shieldman(shieldName, { npmName: packageName, repo: `${userName}/${repositoryName}`, branch: 'master' }))
        .map(({ link, text, image }) => `<a href="${link}"><img alt="${text}" src="${image}"></a>`)
        .join(' ')

      $(`<div>${shieldsHtml}</div>`).insertAfter($headlineContainer)
    } catch (e) {
      if ((e.response || {}).status !== 404) {
        throw e
      }
    }
  })()
})
