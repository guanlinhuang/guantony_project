<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="container mt-5">
    <form class="row justify-content-center" @submit.prevent="signIn">
      <div class="col-md-6">
        <h1 class="h3 mb-3 font-weight-normal">請先登入</h1>
        <div class="mb-2">
          <label for="inputEmail" class="sr-only">Email address</label>
          <input
            type="email"
            id="inputEmail"
            class="form-control"
            placeholder="Email address"
            required
            autofocus
            v-model="user.username"
          />
        </div>
        <div class="mb-2">
          <label for="inputPassword" class="sr-only">Password:zzxxccvv</label>
          <input
            type="password"
            id="inputPassword"
            class="form-control"
            placeholder="Password"
            required
            v-model="user.password"
          />
        </div>

        <div class="text-end mt-4">
          <button class="btn btn-lg btn-primary btn-block" type="submit">
            登入
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      user: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    // signIn () {
    //   console.log('login')
    //   // 串接api之前，先把路徑組起來，加入環境變數
    //   const api = `${process.env.VUE_APP_API}admin/signin` // api路經 // env環境變數站點的位置＋登入的實際API
    //   this.$http.post(api, this.user) // 使用this.$http來取得他的方法 //（api路經 , 夾帶的資料）
    //     .then((res) => { // 串接
    //       const { token, expired } = res.data // 先建立變數跟值
    //       console.log(token, expired)
    //       document.cookie = `hexToken=${token};expires=${new Date(expired)}` // hexToken名稱自定義 // new Date 可轉換為日期
    //       console.log(res)
    //     })
    // },
    signIn () {
      const api = `${process.env.VUE_APP_API}admin/signin`
      this.$http.post(api, this.user)
        .then((res) => {
          if (res.data.success) {
            const { token, expired } = res.data
            // console.log(token, expired)
            document.cookie = `hexToken=${token};expires=${new Date(expired)}`
            this.$router.push('/dashboard/products') // 登入成功後，跳轉到指定頁面
            // console.log(res)
          }
        })
    }
  }
}
</script>
