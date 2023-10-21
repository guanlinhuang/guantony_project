<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <router-link class="navbar-brand" to="/user/cart">用戶端範例</router-link>
      </div>
    </nav>
    <div class="container-fluid mt-3 position-relative">
      <ToastMessages></ToastMessages>
      <router-view/>
    </div>
  </template>

<script>
import emitter from '@/methods/emitter'
import ToastMessages from '@/components/ToastMessages.vue'
export default {
  components: {
    ToastMessages
  },
  provide () { // 外層加入provide // 可讓內層元件可以使用外層的功能
    return {
      emitter
    }
  },
  created () {
  }
}
</script>
