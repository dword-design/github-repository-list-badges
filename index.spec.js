import tester from '@dword-design/tester'
import testerPluginPuppeteer from '@dword-design/tester-plugin-puppeteer'
import execa from 'execa'
import P from 'path'

export default tester(
  {
    async works() {
      await this.page.goto(
        'https://github.com/github-repository-list-badges?tab=repositories',
        { waitUntil: 'networkidle0' }
      )

      const repositoriesList = await this.page.waitForSelector(
        '#user-repositories-list'
      )
      await repositoriesList.$$eval('relative-time', els =>
        els.forEach(el => (el.innerText = 'today'))
      )
      expect(await repositoriesList.screenshot()).toMatchImageSnapshot(this)
    },
  },
  [
    { before: () => execa.command('base prepublishOnly') },
    testerPluginPuppeteer({
      launchOptions: {
        args: [
          `--load-extension=${P.join(process.cwd(), 'dist')}`,
          `--disable-extensions-except=${P.join(process.cwd(), 'dist')}`,
        ],
        headless: false,
      },
    }),
  ]
)
