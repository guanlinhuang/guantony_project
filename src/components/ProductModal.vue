<template>
  <!-- Modal -->
  <div
    class="modal fade"
    id="exampleModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
    ref="modal"
  >
    <!-- 透過ref方式存取這個DOM元素 -->
    <div class="modal-dialog modal-xl" role="document">
      <div class="modal-content border-0">
        <div class="modal-header bg-dark text-white">
          <h5 class="modal-title" id="exampleModalLabel">
            <span>新增產品</span>
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <!-- // 每個input需綁定v-model -->
        <!-- tempProduct.imageUrl 會自動產生 -->
        <div class="modal-body">
          <div class="row">
            <div class="col-sm-4">
              <div class="mb-3">
                <label for="image" class="form-label">輸入圖片網址</label>
                <input
                  type="text"
                  class="form-control"
                  id="image"
                  v-model="tempProduct.imageUrl"
                  placeholder="請輸入圖片連結"
                />
              </div>
              <div class="mb-3">
                <label for="customFile" class="form-label"
                  >或 上傳圖片
                  <i class="fas fa-spinner fa-spin"></i>
                </label>
                <input
                  type="file"
                  id="customFile"
                  class="form-control"
                  ref="fileInput"
                  @change="uploadFile"
                />
              </div>
              <img class="img-fluid" :src="tempProduct.imageUrl" alt="" />
              <!-- 延伸技巧，多圖 -->
              <div class="mt-5" v-if="tempProduct.images">
                <div v-for="(image, key) in tempProduct.images" class="mb-3 input-group" :key="key">
                  <input
                    type="url"
                    class="form-control form-control"
                    v-model="tempProduct.images[key]"
                    placeholder="請輸入連結"
                  />
                  <button
                    type="button"
                    class="btn btn-outline-danger"
                    @click="tempProduct.images.splice(key, 1)"
                  >
                    移除
                  </button>
                </div>
                <div
                  v-if="
                    tempProduct.images[tempProduct.images.length - 1] || !tempProduct.images.length
                  "
                >
                  <button
                    class="btn btn-outline-primary btn-sm d-block w-100"
                    @click="tempProduct.images.push('')"
                  >
                    新增圖片
                  </button>
                </div>
              </div>
            </div>
            <div class="col-sm-8">
              <div class="mb-3">
                <label for="title" class="form-label">標題</label>
                <input
                  type="text"
                  class="form-control"
                  id="title"
                  v-model="tempProduct.title"
                  placeholder="請輸入標題"
                />
              </div>
              <div class="row gx-2">
                <div class="mb-3 col-md-6">
                  <label for="category" class="form-label">分類</label>
                  <input
                    type="text"
                    class="form-control"
                    id="category"
                    v-model="tempProduct.category"
                    placeholder="請輸入分類"
                  />
                </div>
                <div class="mb-3 col-md-6">
                  <label for="price" class="form-label">單位</label>
                  <input
                    type="text"
                    class="form-control"
                    id="unit"
                    v-model="tempProduct.unit"
                    placeholder="請輸入單位"
                  />
                </div>
              </div>
              <div class="row gx-2">
                <div class="mb-3 col-md-6">
                  <label for="origin_price" class="form-label">原價</label>
                  <input
                    type="number"
                    class="form-control"
                    id="origin_price"
                    v-model.number="tempProduct.origin_price"
                    placeholder="請輸入原價"
                  />
                </div>
                <div class="mb-3 col-md-6">
                  <label for="price" class="form-label">售價</label>
                  <input
                    type="number"
                    class="form-control"
                    id="price"
                    v-model.number="tempProduct.price"
                    placeholder="請輸入售價"
                  />
                </div>
              </div>
              <hr />
              <div class="mb-3">
                <label for="description" class="form-label">產品描述</label>
                <textarea
                  type="text"
                  class="form-control"
                  id="description"
                  v-model="tempProduct.description"
                  placeholder="請輸入產品描述"
                ></textarea>
              </div>
              <div class="mb-3">
                <label for="content" class="form-label">說明內容</label>
                <textarea
                  type="text"
                  class="form-control"
                  id="content"
                  v-model="tempProduct.content"
                  placeholder="請輸入產品說明內容"
                ></textarea>
              </div>
              <div class="mb-3">
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="tempProduct.is_enabled"
                    :true-value="1"
                    :false-value="0"
                    id="is_enabled"
                  />
                  <label class="form-check-label" for="is_enabled">
                    是否啟用
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
            取消
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="$emit('update-product', tempProduct)"
          >
            確認
          </button>
        </div>
      </div>
    </div>
</div>
</template>

<script>
// import Modal from 'bootstrap/js/dist/modal'
import modalMixin from '@/mixins/modalMixin'

export default {
  props: {
    // 設定內層所接收的props
    product: {
      type: Object, // 預期傳進來的型別是物件，所以先定義類型為物件
      default () {
        return {}
      } // 如外層沒有正確傳遞，給它一個預設值-空的物件
    }
  },

  // 為什麼不在ProductModal.vue建空白的tempProduct？
  // 因為除了新增用，還有編輯也會用到，所以在Products.vue建立空白的tempProduct
  // 每次打開 modal 時，傳送進來的資料都不一樣，要去監聽product的內容有沒有做更動，如有做更動，就把傳進來的資料寫到tempProduct
  // 舉例來說，
  // 1.如果是新增產品，打開 modal 時傳的是一個空物件
  // 2.如果是編輯產品，就會傳入該產品的資料 tempProduct{}
  // 因為單向數據流，開發者不可移直接修改外層的資料，所以在內層再定義一個tempProduct，把這個資料給儲存起來
  // Products openModal () 的 (2)先清空tempProduct 連線到 watch: 的 product () 的 this.tempProduct = this.product，連帶著這裡的tempProduct也清空
  watch: {
    product () {
      this.tempProduct = this.product
    }
  },
  data () {
    return {
      modal: {},
      tempProduct: {}
    }
  },
  methods: {
    // showModal () {
    //   this.modal.show()
    // },
    // hideModal () {
    //   this.modal.hide()
    // },
    uploadFile () {
      const uploadedFile = this.$refs.fileInput.files[0] // 將DOM元素裡的上傳的圖片內容取出
      console.dir(uploadedFile)
      const formData = new FormData() // 創建一個新的FormData對象，才能透過API形式將圖片內容傳送到遠端資料庫
      formData.append('file-to-upl', uploadedFile)
      console.log(formData)
      const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/upload`
      this.$http.post(url, formData).then((response) => {
        console.log(response.data)
        if (response.data.success) { // 如果上傳成功，圖片路徑會寫入data裡
          this.tempProduct.imageUrl = response.data.imageUrl
        }
      })
    }
  },
  // mounted () {
  //   this.modal = new Modal(this.$refs.modal)
  // } // 透過refs方式將DOM元素指向外層元件的ref modal
  mixins: [modalMixin] // 新增屬性
}
</script>

<!-- created:在模板渲染成html前調用，即通常初始化某些屬性值，然後再渲染成視圖。

mounted:在模板渲染成html後調用，通常是初始化頁面完成後，再對html的dom節點進行一些需要的操作。 -->

<!-- var myModal = new bootstrap.Modal(document.getElementById('myModal'), {
    keyboard: false -->
