import Vue, { provide, markRaw, reactive } from 'vue'
import PageShell from './PageShell.vue'
export { createApp }
import VueApollo, { ApolloProvider } from 'vue-apollo'
import VueRouter from 'vue-router'
import { router } from './router';
import { PageContextBuiltIn } from 'vite-plugin-ssr'

function createApp(pageContext, apolloClient) {
  const { Page, pageProps } = pageContext
  const PageWithLayout = Vue.component("PageWithLayout", {
    render(h) {
      return h(
        PageShell,
        [ h(Page) ]
      )
    }
  });

  Vue.use(VueRouter)
  Vue.use(VueApollo)

  Vue.prototype.$pageContext = reactive({ ...pageContext });

  const apolloProvider = new ApolloProvider({
    defaultClient: apolloClient
  })

  const app = new Vue({
    router,
    apolloProvider,
    render: h => h(PageWithLayout)
  });

  // We use `app.changePage()` to do Client Routing, see `_default.page.client.js`
  objectAssign(app, {
    changePage: (pageContext: PageContextBuiltIn) => {
      Object.assign(Vue.prototype.$pageContext, pageContext)
      // rootComponent.Page = markRaw(pageContext.Page)
      // rootComponent.pageProps = markRaw(pageContext.pageProps || {})
    }
  })

  return { app, router }
}

// Same as `Object.assign()` but with type inference
function objectAssign<Obj, ObjAddendum>(obj: Obj, objAddendum: ObjAddendum): asserts obj is Obj & ObjAddendum {
  Object.assign(obj, objAddendum)
}
