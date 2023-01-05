import { ApolloClient, HttpLink, InMemoryCache, gql } from '@apollo/client'
import fetch from 'cross-fetch'
import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'
import { renderState } from './src/renderer.js'

const routesToPrerender = [
  '/',
  '/test',
  '/404'
]

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

const toAbsolute = (p) => path.resolve(__dirname, p)

const manifest = JSON.parse(
  fs.readFileSync(toAbsolute('dist/static/ssr-manifest.json'), 'utf-8'),
)

const template = fs.readFileSync(toAbsolute('dist/static/index.html'), 'utf-8')

const { render } = await import('./dist/server/entry-server.js')

// function makeApolloClient() {
//   const apolloClient = new ApolloClient({
//     ssrMode: true,
//     link: new HttpLink({
//       uri: 'https://countries.trevorblades.com',
//       fetch
//     }),
//     cache: new InMemoryCache()
//   })
//   return apolloClient
// }

// const apolloClient = makeApolloClient()
// const pageContextInit = {
//   apolloClient
// }

async function prerender() {
  // pre-render each route...
  for (const url of routesToPrerender) {
    const [appHtml, preloadLinks, pageContext] = await render(url, manifest)

    const html = template
      .replace(`<!--preload-links-->`, preloadLinks)
      .replace(`<!--app-html-->`, appHtml)
      .replace(`<!--page-context-->`, renderState(pageContext))

    const filePath = `dist/static${url === '/' ? '' : url}/index.html`
    const pageContextPath = `dist/static${url === '/' ? '' : url}/index.pageContext.json`
    fs.mkdirSync(path.dirname(filePath), { recursive: true })
    fs.writeFileSync(toAbsolute(filePath), html)
    fs.writeFileSync(toAbsolute(pageContextPath), JSON.stringify(pageContext))
    console.log('pre-rendered: ', filePath)
  }

  // done, delete ssr manifest and write spa entrypoint
  console.log('writing spa entrypoint')
  fs.writeFileSync(toAbsolute('dist/static/spa-entrypoint.html'), template)
  fs.unlinkSync(toAbsolute('dist/static/ssr-manifest.json'))
}

console.log("starting prerender")

prerender()
