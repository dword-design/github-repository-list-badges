import { handleError } from '@dword-design/github-web-extension-utils';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { compact } from 'lodash-es';

const github = axios.create({ baseURL: 'https://api.github.com' });

export default async (name: string) => {
  const token = localStorage.getItem(TOKEN_KEY);
  const userName = globalThis.location.href.match(/github\.com\/(.*?)\?/)![1];

  try {
    const { data: readme } = await github.get(
      `/repos/${userName}/${name}/readme`,
      {
        headers: {
          ...(token && { Authorization: `token ${token}` }),
          Accept: 'application/vnd.github.v3.html',
        },
      },
    );

    const $ = cheerio.load(readme);
    const $badges = document.createElement('div');
    $badges.classList.add(BADGES_CLASS);

    $badges.innerHTML = $('img')
      .filter((imageIndex, img) =>
        compact([$(img).attr('data-canonical-src'), $(img).attr('src')]).some(
          url => isBadgeUrl(url),
        ),
      )
      .map((badgeIndex, badge) => {
        const $link = $(badge).closest('a');
        return $link.length > 0 ? $link : $(badge);
      })
      .map((wrapperIndex, wrapper) => $.html(wrapper))
      .get()
      .join('\n');

    await Promise.all(
      [...$badges.querySelectorAll('img')].map(image => waitForImage(image)),
    );

    return $badges;
  } catch (error) {
    handleError(error, {
      name: 'GitHub Repository List Badges',
      slug: 'github-repository-list-badges',
    });
  }

  return;
};
