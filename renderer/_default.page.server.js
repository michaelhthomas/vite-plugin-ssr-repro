import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import { createRenderer } from 'vue-server-renderer'
import fetch from 'cross-fetch'
import { escapeInject, dangerouslySkipEscape } from 'vite-plugin-ssr'
import { createApp } from './app'
import logoUrl from './logo.svg'

export { render }
export { onBeforeRender }
// See https://vite-plugin-ssr.com/data-fetching
export const passToClient = ['pageProps', 'routeParams', 'apolloInitialState', 'urlPathname']

async function render(pageContext) {
  // See https://vite-plugin-ssr.com/head
  const { documentProps } = pageContext
  const title = (documentProps && documentProps.title) || 'Vite SSR app'
  const desc = (documentProps && documentProps.description) || 'App using Vite + vite-plugin-ssr'

  const { appHtml } = pageContext

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" href="${logoUrl}" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="${desc}" />
        <title>${title}</title>
      </head>
      <body>
        ${dangerouslySkipEscape(appHtml)}
      </body>
    </html>`

  return {
    documentHtml,
    pageContext: {
      // We can add some `pageContext` here, which is useful if we want to do page redirection https://vite-plugin-ssr.com/page-redirection
    }
  }
}

async function onBeforeRender(pageContext) {
  const { app, router } = createApp(pageContext, pageContext.apolloClient)

  router.push(pageContext.urlPathname);
  await new Promise(function (resolve, reject) {
    return router.onReady(resolve, reject);
  });

  const renderer = createRenderer()
  const appHtml = await renderer.renderToString(app)
  const apolloInitialState = pageContext.apolloClient.extract()

  return {
    pageContext: {
      apolloInitialState,
      appHtml
    }
  }
}
