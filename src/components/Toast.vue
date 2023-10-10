<!-- // 製作單一元件樣式排版 -->
<template>
    <div class="toast" role="alert" aria-live="assertive" aria-atomic="true" ref="toast">
      <div class="toast-header">
        <span :class="`bg-${msg.style}`" class="p-2 rounded me-2 d-inline-block"></span>
        <strong class="me-auto">{{ msg.title }}</strong>
        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <div class="toast-body" v-if="msg.content">
        {{ msg.content }}
      </div>
    </div>
  </template>
  <!-- // 上方程式碼來自bootstrap官網 -->
<script>
import Toast from 'bootstrap/js/dist/toast' // 匯入原生js
export default {
  name: 'Toast', // 不設也可以，設了等於自定義元件的名稱，在 Vue 的開發工具就會以這個名稱顯示。若沒有設定就會以該元件的檔名為名稱顯示
  props: [
    'msg'
  ],
  mounted () {
    const toastEl = this.$refs.toast
    const toast = new Toast(toastEl, {
      delay: 6000
    })
    toast.show()
  }
}
</script>
