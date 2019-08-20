<template>
  <div id="app">
    <router-view v-if="isRouterAlive" />
  </div>
</template>

<script>
export default {
  data () {
    return {
      isRouterAlive: false
    }
  },
  created () {
    this.isRouterAlive = true
    // this.$router.push({
    //   name: "login"
    // });
  }
}
</script>
<style>
html,
body,
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
}
</style>
