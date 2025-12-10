import lighthouse from 'lighthouse'
import puppeteer from 'puppeteer'
import { URL } from 'url'

// 调整为实际 H5 预览地址
const TARGET = process.env.LH_URL || 'http://localhost:4173/#/pages/matches/matches'

;(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] })
  const endpoint = browser.wsEndpoint()
  const { port } = new URL(endpoint)

  const runnerResult = await lighthouse(TARGET, {
    port,
    output: 'json',
    logLevel: 'info'
  })

  console.log('Performance score', runnerResult.lhr.categories.performance.score)
  console.log('LCP', runnerResult.lhr.audits['largest-contentful-paint'].displayValue)
  console.log('TTI', runnerResult.lhr.audits['interactive'].displayValue)

  await browser.close()
})()

