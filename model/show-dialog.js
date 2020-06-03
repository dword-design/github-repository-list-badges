import { endent } from '@dword-design/functions'

export default () => {
  let $dialog = document.querySelector('.github-repository-list-badges-dialog')
  if ($dialog) {
    $dialog.remove()
  }
  $dialog = document.createElement('div')
  $dialog.setAttribute('role', 'dialog')
  $dialog.classList.add(
    'github-repository-list-badges-dialog',
    'Box',
    'Box--overlay',
    'Box-overlay--wide',
    'd-flex',
    'flex-column',
    'anim-fade-in',
    'fast',
    'position-fixed'
  )
  $dialog.style.left = '50%'
  $dialog.style.top = '50%'
  $dialog.style.transform = 'translate(-50%, -50%)'
  $dialog.style.maxWidth = 'calc(100% - 32px)'
  $dialog.style.zIndex = 34

  const $header = document.createElement('div')
  $header.classList.add('Box-header')

  const $close = document.createElement('button')
  $close.classList.add('Box-btn-octicon', 'btn-octicon', 'float-right')
  $close.setAttribute('type', 'button')
  $close.setAttribute('aria-label', 'Close dialog')
  $close.innerHTML =
    '<svg class="octicon octicon-x" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48L7.48 8z"></path></svg>'
  $close.onclick = () => $dialog.remove()
  $header.append($close)

  const $title = document.createElement('h3')
  $title.classList.add('Box-title')
  $title.innerHTML = endent`
    <svg class="octicon octicon-alert text-red" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <path fill-rule="evenodd" d="M8.893 1.5c-.183-.31-.52-.5-.887-.5s-.703.19-.886.5L.138 13.499a.98.98 0 000 1.001c.193.31.53.501.886.501h13.964c.367 0 .704-.19.877-.5a1.03 1.03 0 00.01-1.002L8.893 1.5zm.133 11.497H6.987v-2.003h2.039v2.003zm0-3.004H6.987V5.987h2.039v4.006z"></path>
    </svg>
    <span class="sr-only">Error:</span>
    GitHub Repository List Badges
  `
  $header.append($title)
  $dialog.append($header)
  document.body.append($dialog)
  return $dialog
}
