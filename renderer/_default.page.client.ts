export { render }

import { createApp } from './app'
import { ApolloClient, InMemoryCache, NormalizedCacheObject } from '@apollo/client'
// import fetch from 'cross-fetch'

async function getPageContext(route: string) {
  console.log(`${route}index.pageContext.json`)
  return fetch(route === '/' ? '/index.pageContext.json' : `${route}/index.pageContext.json`)
    .then(r => r.json())
    .then(json => json.pageContext)
}

let app: ReturnType<typeof createApp>['app'];
let router: ReturnType<typeof createApp>['router'];
let defaultClient: ApolloClient<NormalizedCacheObject>;

async function render(pageContext) {
  if (!app) {
    defaultClient = new ApolloClient({
      cache: new InMemoryCache().restore(pageContext.apolloInitialState),
    })

    const newApp = createApp(pageContext, defaultClient)
    app = newApp.app;
    router = newApp.router;

    router.beforeEach(async (to, from, next) => {
      const newPageContext = await getPageContext(to.path)
      await render(newPageContext)
      next()
    })
  
    app.$mount('#app')
  } else {
    defaultClient.cache.restore(pageContext.apolloInitialState)
    app.changePage(pageContext)
  }
  
  // document.title = getPageTitle(pageContext)
}

// export const clientRouting = true
