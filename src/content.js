const $ = require('jquery')
const shieldman = require('shieldman')

const userName = window.location.href.match(/github\.com\/(.*?)\?/)[1]

const $containers = $('#user-repositories-list h3').parent()

$containers.each(function () {

  const repositoryName = $(this).find('h3 a').text()
  const shield = shieldman('travis', { repo: repositoryName })
  console.log(shield)
  $(`<div><a href="${shield.link}"><img alt="${shield.text}" src="{$shield.image}"></a></div>`).appendTo($(this))
})
