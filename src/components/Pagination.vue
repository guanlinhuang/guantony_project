<template>
    <nav aria-label="Page navigation example">
      <ul class="pagination justify-content-center">
        <li class="page-item">
          <a class="page-link" href="#" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        <li class="page-item" v-for="page in pages.total_pages" :key="page"
        :class="{ 'active': page === pages.current_page }">
        <!--若當前頁碼與資料庫傳來的頁碼相同，則會顯示深藍色
        active 設定按鈕顯示深藍色樣式(bootstrap)，可知道當前頁面是哪一頁
        page是名稱自定義，pages是後端資料傳來 -->
          <a class="page-link" href="#" @click.prevent="updatePage(page)">
            {{ page }}
          </a>
        </li>
        <li class="page-item">
          <a class="page-link" href="#" aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
  </template>

<script>
// :pages="{ 頁碼資訊 }"
// @emitPages="更新頁面事件"
export default {
  props: ['pages'],
  methods: {
    updatePage (page) {
      this.$emit('emit-pages', page)
    }
  }
}
</script>
