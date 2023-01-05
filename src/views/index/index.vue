<template>
  <div>
    <h1>Welcome to Vue 2.7 Apollo example</h1>
    <p>List of countries.</p>
    <ul>
      <li v-for="country in countries" :key="country.code">{{ country.name }}: {{ country.code }}</li>
    </ul>
  </div>
</template>

<script>
import gql from 'graphql-tag'

export default {
  apollo: {
    // Simple query that will update the 'hello' vue property
    countries: gql`{
      countries {
        code
        name
      }
    }`,
  }
}
</script>
