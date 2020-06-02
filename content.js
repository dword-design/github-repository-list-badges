import { property, endent } from '@dword-design/functions'
import cheerio from 'cheerio'
import axios from 'axios'
import showDialog from './model/show-dialog'

const TOKEN_KEY = 'github-better-repository-list-token'

const token = localStorage.getItem(TOKEN_KEY)
const accessTokenUrl = '/settings/tokens/new?scopes=repo'
const userName = window.location.href.match(/github\.com\/(.*?)\?/)[1]
const github = axios.create({ baseURL: 'https://api.github.com' })
const $headlines = document.querySelectorAll('#user-repositories-list h3')

const getTokenMessage = (error, repositoryName) => {
  switch (error.response?.status) {
    case 401:
      return `The access token is not valid. Create a new <a href="${accessTokenUrl}" target="_blank">GitHub access token</a>.`
    case 403:
      if (error.response.headers['x-ratelimit-remaining'] === '0') {
        return `API rate limit exceeded for current IP. GitHub API requests are limited to 60 per hour per IP address. By providing a <a href="${accessTokenUrl}" target="_blank">GitHub access token</a>, you can increase the limit to <strong>5.000</strong> requests per hour.`
      }
      return `You are not allowed to access GitHub API. Create a new <a href="${accessTokenUrl}" target="_blank">GitHub access token</a>.`
    case 404:
      return `The repository '${repositoryName}' cannot be found, is private, or is missing a README.md file. If a README.md file exists, create a new <a href="${accessTokenUrl}" target="_blank">GitHub access token</a> or adjust the permissions of the existing token.`
    default:
      return undefined
  }
}

$headlines.forEach(async $headline => {
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
    const tokenMessage = getTokenMessage(error, repositoryName)
    if (tokenMessage) {
      let $flash = document.querySelector(
        '.github-better-repository-list-flash'
      )
      if ($flash) {
        $flash.remove()
      }
      $flash = document.createElement('div')
      $flash.classList.add(
        'github-better-repository-list-flash',
        'flash',
        'flash-error',
        'position-fixed',
        'box-shadow-medium'
      )
      $flash.style.bottom = '16px'
      $flash.style.right = '16px'
      $flash.style.zIndex = 33
      $flash.style.padding = 0
      $flash.innerHTML = endent`
        <button
          class="close-button js-flash-close position-absolute text-orange"
          style="right: 16px; top: 50%; transform: translateY(-50%)"
          type="button"
        >
          <!-- <%= octicon "x", :"aria-label" => "Close" %> -->
          <svg width="12" height="16" viewBox="0 0 12 16" class="octicon octicon-x" aria-label="Close" role="img">
            <path
              fill-rule="evenodd"
              d="M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48L7.48 8z"
            />
          </svg>
        </button>
        <svg
          class="octicon octicon-alert position-absolute"
          style="left: 16px; top: 50%; transform: translateY(-50%)"
          pxmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          width="16"
          height="16"
          aria-hidden="true"
        >
          <path fill-rule="evenodd" d="M8.893 1.5c-.183-.31-.52-.5-.887-.5s-.703.19-.886.5L.138 13.499a.98.98 0 000 1.001c.193.31.53.501.886.501h13.964c.367 0 .704-.19.877-.5a1.03 1.03 0 00.01-1.002L8.893 1.5zm.133 11.497H6.987v-2.003h2.039v2.003zm0-3.004H6.987V5.987h2.039v4.006z"></path>
        </svg>
      `
      const $flashButton = document.createElement('button')
      $flashButton.type = 'button'
      $flashButton.style.padding = '16px 40px'
      $flashButton.classList.add('btn-link', 'text-orange', 'bg-red-light')
      $flashButton.innerText = 'GitHub Better Repository List Error'
      $flash.append($flashButton)
      $flashButton.onclick = () => {
        const $dialog = showDialog()

        const $token = document.createElement('input')
        $token.classList.add('form-control', 'input-block')
        $token.type = 'text'
        $token.placeholder = 'Access token'
        $token.setAttribute('aria-label', 'Access token')
        $token.required = true

        const $form = document.createElement('form')
        $form.onsubmit = event => {
          event.preventDefault()
          localStorage.setItem(TOKEN_KEY, $token.value)
          window.location.reload()
        }
        $dialog.append($form)

        const $body = document.createElement('div')
        $body.classList.add('Box-body')
        $form.append($body)

        const $message = document.createElement('p')
        $message.innerHTML = tokenMessage
        $body.append($message)

        $body.append($token)

        const $footer = document.createElement('div')
        $footer.classList.add('Box-footer', 'text-right')
        $form.append($footer)

        const $cancel = document.createElement('button')
        $cancel.type = 'button'
        $cancel.classList.add('btn', 'mr-2')
        $cancel.innerText = 'Cancel'
        $cancel.onclick = () => $dialog.remove()
        $footer.append($cancel)

        const $save = document.createElement('button')
        $save.classList.add('btn', 'btn-primary')
        $save.type = 'submit'
        $save.innerText = 'Save'
        $footer.append($save)
      }

      document.body.prepend($flash)
    } else {
      throw error
    }
  }
})
