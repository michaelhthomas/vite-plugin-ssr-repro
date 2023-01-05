import { createApp } from './main'
import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client'

const root = document.getElementById('app');

if (root?.innerHTML === '') {
  console.log('rendering')
  const { app } = createApp({})
  app.$mount('#app')
}
else {
  console.log('hydrating')
  const pageContext = JSON.parse(document.getElementById('cognito-ssr_pageContext')?.textContent ?? 'null');

  const apolloClient = new ApolloClient({
    // link: createHttpLink({
    //   uri: 'https://countries.trevorblades.com',
    //   fetch
    // }),
    cache: new InMemoryCache().restore(pageContext.apolloInitialState),
  })

  const { app, router } = createApp({ apolloClient })

  router.beforeEach(async (to, from, next) => {
    if (!from || app.$isServer) next();

    const pageContextUrl = (to.fullPath === '/' ? '' : to.fullPath) + '/index.pageContext.json';
    console.log(pageContextUrl)

    const pageContext = await fetch(pageContextUrl)
      .then(r => r.json())
      .catch(e => console.error('error fetching page context: ', e));
    
    if (pageContext)
      app.changePage(pageContext);

    next()
  })

  // wait until router is ready before mounting to ensure hydration match
  router.onReady(() => {
    app.$mount('#app')
  })
}
