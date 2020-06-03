import { map } from '@dword-design/functions'
import getRepositoryBadges from './model/get-repository-badges'

const run = async () => {
  const $headlines = document.querySelectorAll('#user-repositories-list h3')

  const $badges = await ($headlines |> map(getRepositoryBadges) |> Promise.all)
  console.log($badges)
  $badges.forEach(async ($repoBadges, index) => {
    if ($repoBadges) {
      $headlines[index].after($repoBadges)
    }
  })
}

run()
