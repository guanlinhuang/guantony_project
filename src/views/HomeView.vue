<template>
  <navbar></navbar>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import Navbar from '../components/Navbar.vue'

export default {
  name: 'HomeView',
  components: {
    HelloWorld,
    Navbar
  },
  created () {
    console.log(process.env.VUE_APP_API, process.env.VUE_APP_PATH)
  } // 檢查是否有把環境變數加到專案中
}
</script>
