const { ApolloClient, HttpLink, InMemoryCache, gql } = require('@apollo/client')
const fetch = require('cross-fetch')
const { prerender } = require('vite-plugin-ssr/prerender')

function makeApolloClient() {
  const apolloClient = new ApolloClient({
    ssrMode: true,
    link: new HttpLink({
      uri: 'https://countries.trevorblades.com',
      fetch
    }),
    cache: new InMemoryCache()
  })
  return apolloClient
}

const apolloClient = makeApolloClient()
const pageContextInit = {
  apolloClient
}

// console.log(apolloClient.query({query: gql`
// {
//   countries {
//     code
//     name
//   }
// }
// `}))
console.log("starting prerender")

prerender({
  pageContextInit
})
