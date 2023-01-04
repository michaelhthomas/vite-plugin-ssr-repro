<template>
  <router-link :to="to" :class="{ active: $pageContext.urlPathname === $attrs.href }">
    <slot />
  </router-link>
</template>

<script setup>
const props = defineProps({
  to: String
})
</script>

<style scoped>
a {
  padding: 3px 10px;
}
a.active {
  background-color: #eee;
}
</style>
