<template>
  <div id="app">
    <div class="layout">
      <div class="navigation">
        <a href="/" class="logo">
          <img src="./logo.svg" height="64" width="64" alt="logo" />
        </a>
        <Link to="/">Home</Link>
        <Link to="/test">Test</Link>
      </div>
      <div class="content">
        <h1>Current urlPathname: {{ $pageContext.urlPathname }}</h1>
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import Link from './Link.vue'
</script>

<style>
body {
  margin: 0;
  font-family: sans-serif;
}
* {
  box-sizing: border-box;
}
a {
  text-decoration: none;
}
</style>

<style scoped>
.layout {
  display: flex;
  max-width: 900px;
  margin: auto;
}
.content {
  padding: 20px;
  border-left: 2px solid #eee;
  padding-bottom: 50px;
  min-height: 100vh;
}
.navigation {
  padding: 20px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1.8em;
}
.logo {
  margin-top: 20px;
  margin-bottom: 10px;
}
</style>
