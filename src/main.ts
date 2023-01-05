import Vue, { provide, markRaw, reactive } from 'vue';
import App from './App.vue';
import VueApollo, { ApolloProvider } from 'vue-apollo';
import VueRouter from 'vue-router';
import { createRouter } from './router';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';

interface PageContext {
  apolloClient?: ApolloClient<NormalizedCacheObject>;
  apolloInitialState?: any
}

export function createApp(pageContext: PageContext) {
  Vue.use(VueRouter)
  const router = createRouter();

  let app;

  if (pageContext.apolloClient != null) {
    Vue.use(VueApollo)
    const apolloProvider = new ApolloProvider({
      defaultClient: pageContext.apolloClient
    })

    app = new Vue({
      router,
      apolloProvider,
      render: h => h(App)
    });
  } else {
    app = new Vue({
      router,
      render: h => h(App)
    });
  }

  Vue.prototype.$pageContext = reactive({ ...pageContext });

  // // We use `app.changePage()` to do Client Routing
  objectAssign(app, {
    changePage: (newPageContext: PageContext) => {
      Object.assign(Vue.prototype.$pageContext, newPageContext)
      if (newPageContext.apolloInitialState != null && pageContext.apolloClient != null)
        pageContext.apolloClient.cache.restore(newPageContext.apolloInitialState)
      // rootComponent.Page = markRaw(pageContext.Page)
      // rootComponent.pageProps = markRaw(pageContext.pageProps || {})
    }
  })

  return { app, router }
}

// // Same as `Object.assign()` but with type inference
function objectAssign<Obj, ObjAddendum>(obj: Obj, objAddendum: ObjAddendum): asserts obj is Obj & ObjAddendum {
  Object.assign(obj, objAddendum)
}
