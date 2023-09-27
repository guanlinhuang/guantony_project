<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <navbar></navbar>
    <div class="container-fluid mt-3 position-relative">
        <ToastMessages></ToastMessages>
        <router-view></router-view>
    </div>
</template>
<!-- container-fluid 為bootstrap的屬性 -->

<script>
import emitter from '@/methods/emitter'
import ToastMessages from '@/components/ToastMessages.vue'
import Navbar from '../components/Navbar.vue'

export default {
  components: {
    Navbar,
    ToastMessages
  },
  provide () {
    return {
      emitter
    }
  },
  created () {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1') // 取出token
    // console.log(token)
    this.$http.defaults.headers.common.Authorization = `${token}`
    const api = `${process.env.VUE_APP_API}api/user/check`
    this.$http.post(api, this.user)
      .then((res) => {
        if (!res.data.success) {
          this.$router.push('/login') // 登入失敗後，跳轉到登入頁面
        //   console.log(res)
        }
      })
  }
}

</script>
