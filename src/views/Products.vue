<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <loading :active="isLoading"></loading>
  <div class="text-end">
    <button
      type="button"
      class="btn btn-primary"
      @click="openModal(true)"
      >新增產品
    </button>
     <!-- (4)利用methods去觸發 -->
     <!-- 原 @click="$refs.productModal.showModal()" 改為 @click="openModal"
      增加產品，$refs.productModal移到method裡 -->
  </div>
  <table class="table mt-4">
    <thead>
      <tr>
        <th width="120">分類</th>
        <th>產品名稱</th>
        <th width="120">原價</th>
        <th width="120">售價</th>
        <th width="100">是否啟用</th>
        <th width="200">編輯</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in products" :key="item.id">
        <td>{{ item.category }}</td>
        <td>{{ item.title }}</td>
        <td class="text-right">{{ item.origin_price }}</td>
        <td class="text-right">{{ item.price }}</td>
        <td>
          <span class="text-success" v-if="item.is_enabled">啟用</span>
          <span class="text-muted" v-else>未啟用</span>
        </td>
        <td>
          <div class="btn-group">
            <button class="btn btn-outline-primary btn-sm" @click="openModal(false, item)">編輯</button>
            <button class="btn btn-outline-danger btn-sm"
            @click="openDelProductModal(item)">刪除</button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
  <!-- 前內後外 -->
  <ProductModal ref="productModal" :product="tempProduct"
  @update-product="updateProduct"></ProductModal>
  <DelModal :item="tempProduct" ref="delModal" @del-item="delProduct"/>
</template>

<script>
import ProductModal from '../components/ProductModal.vue' // 將ProductModal元件載進來，才能使用該元件的方法呼叫
import DelModal from '@/components/DelModal.vue' // 將DelModal元件載進來，才能使用該元件的方法呼叫

// 為什麼不在ProductModal.vue建空白的tempProduct？
// 因為除了新增用，還有編輯也會用到，所以在Products.vue建立空白的tempProduct
export default {
  data () {
    return {
      products: [], // 所有產品
      pagination: {}, // 每個產品資料(分頁資訊)
      tempProduct: {},
      isNew: false, // 判斷是否"新增"或"修改"狀態
      isLoading: false // 沒有進入讀取狀態
    }
  },
  components: {
    ProductModal, // 區域註冊
    DelModal
  },
  inject: ['emitter'],
  methods: {
    getProducts () { // 從遠端資料庫撈資料
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/products` // 透過這個api取得遠端資料
      this.isLoading = true // 取得遠端資料時，進入讀取狀態
      this.$http.get(api) // 因為改成get，即只取得資料，所以後面不需加入任何this.user
        .then((res) => {
          if (res.data.success) {
            this.isLoading = false // 遠端資料已取得完畢，關閉讀取效果
            console.log(res.data)
            this.products = res.data.products
            this.pagination = res.data.pagination // 將遠端資料data儲存到這裡的data，並選染到頁面，也可看開發人員工具的vue
          }
        })
    },
    // (1)加入openModal(套用在”增加產品“按鈕上)
    openModal (isNew, item) {
      // console.log(isNew, item)
      if (isNew) {
        this.tempProduct = {}
      } else { // 如果參數傳入false，則執行else // ... 用來展開形式把資料給取出來
        this.tempProduct = { ...item }
      }
      this.isNew = isNew // this.isNew = 傳入的參數
      // (2)先清空tempProduct
      // this.tempProduct = {}
      // (3)再把內層Modal給打開
      const productComponent = this.$refs.productModal
      productComponent.showModal()
    },
    // 1.把外層傳的資料用updateProduct儲存起來
    updateProduct (item) {
      this.tempProduct = item
      // updateProduct 透過 isNew 去判斷目前是新增還是編輯，來決定要打新增的 API 或是編輯的 API
      // 新增的 API // 不做if判斷 // 原const改let宣告，以利後面的變數蓋過前面
      let api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/product`
      let httpMethod = 'post'

      // 編輯的 API // 不是新增產品的狀態下，重新調整api路徑
      // this.isNew 為 false 時，返回 true，進而決定編輯的API
      if (!this.isNew) {
        api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/product/${item.id}`
        httpMethod = 'put'
      }
      // 之所以「!this.isNew」為true時，條件成立，進入執行區塊，
      // 是因為這個「true」就是if判斷條件成立不成立的依據，跟新增編輯狀態沒什麼關係
      const productComponent = this.$refs.productModal
      // 2.將儲存起來的資料發送到遠端
      // 中括號[]可載入方法post或put // 原this.$http[httpMethod] 改為 this.$http[httpMethod]
      this.$http[httpMethod](api, { data: this.tempProduct })
        .then((response) => {
          console.log(response)
          // 3.確認資料後，關閉modal
          productComponent.hideModal()
          // 4.要重新取得列表資料，所以要觸發getProducts來重新渲染畫面
          // this.getProducts()
          if (response.data.success) {
            this.getProducts()
            this.emitter.emit('push-message', {
              style: 'success',
              title: '更新成功'
            })
          } else {
            this.emitter.emit('push-message', {
              style: 'danger',
              title: '更新失敗',
              content: response.data.message.join('、')
            })
          }
        })
    },
    // 開啟刪除 Modal
    openDelProductModal (item) {
      this.tempProduct = { ...item } // ... 以展開方式把要刪除的當前的產品資料取出來
      const delProduct = this.tempProduct
      console.log(delProduct) // 測試有沒有成功取出產品資料
      const delComponent = this.$refs.delModal
      delComponent.showModal()
    },
    delProduct () {
      const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/product/${this.tempProduct.id}`
      this.$http.delete(url).then((response) => {
        console.log(response.data)
        const delComponent = this.$refs.delModal
        delComponent.hideModal() // 確認資料後，關閉modal
        this.getProducts() // 觸發getProducts來重新渲染畫面
      })
    }
  },
  created () {
    this.getProducts() // 觸發methods
  }
}

</script>

<!-- 原:api_path/admin/products?page=:page 改為個人api ${process.env.VUE_APP_PATH} -->
<!-- 因為連到 VUE_APP_PATH，即個人api，所以需要登入自己的帳密，才能取得個人資料庫res.tata -->
