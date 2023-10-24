<template>
    <Loading :active="isLoading"></Loading>
    <div class="container">
      <div class="row mt-4">
        <div class="col-md-7">
          <table class="table align-middle">
            <thead>
            <tr>
              <th>圖片</th>
              <th>商品名稱</th>
              <th>價格</th>
              <th></th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in products" :key="item.id">
              <td style="width: 200px">
                <div style="height: 100px; background-size: cover; background-position: center"
                     :style="{backgroundImage: `url(${item.imageUrl})`}"></div>
              </td>
              <td><a href="#" class="text-dark">{{ item.title }}</a></td>
              <td>
                <div class="h5" v-if="!item.price">{{ item.origin_price }} 元</div>
                <del class="h6" v-if="item.price">原價 {{ item.origin_price }} 元</del>
                <div class="h5" v-if="item.price">現在只要 {{ item.price }} 元</div>
              </td>
              <td>
                <div class="btn-group btn-group-sm">
                  <button type="button" class="btn btn-outline-secondary"
                          @click="getProduct(item.id)">
                    查看更多
                  </button>
                  <button type="button" class="btn btn-outline-danger"
                  :disabled="status.loadingItem === item.id"
                        @click="addCart(item.id)">
                        <div v-if="this.status.loadingItem === item.id"
                      class="spinner-grow text-danger spinner-grow-sm" role="status">
                      <!-- 按下按鈕後，進入disabled狀態，暫時無法再按一次(當兩邊id相同時） -->
                    <span class="visually-hidden">Loading...</span>
                  </div>
                    加到購物車
                  </button>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <!-- 購物車列表 -->
        <div class="col-md-5">
        <div class="sticky-top">
          <table class="table align-middle">
            <thead>
              <tr>
                <th></th>
                <th>品名</th>
                <th style="width: 130px">數量</th>
                <th>單價</th>
              </tr>
            </thead>
            <tbody>
            <template  v-if="cart.carts">
              <tr v-for="item in cart.carts" :key="item.id">
                <td>
                  <button type="button" class="btn btn-outline-danger btn-sm"
                          :disabled="status.loadingItem === item.id"
                          @click="removeCartItem(item.id)">
                          <i class="bi bi-trash3"></i>
                  </button>
                </td>
                <td>
                  {{ item.product.title }}
                  <div class="text-success" v-if="item.coupon">
                    已套用優惠券
                  </div>
                  <!-- 有輸入優惠券，consle跟api才會顯示優惠券代碼，頁面也會顯示已套用優惠券 -->
                </td>
                <td>
                  <div class="input-group input-group-sm">
                    <input type="number" class="form-control"
                          min="1"
                          :disabled="item.id === status.loadingItem"
                          @change="updateCart(item)"
                          v-model.number="item.qty">
                          <div class="input-group-text">/ {{ item.product.unit }}</div>
                  </div>
                  <!-- min最小值 1 可避免0或負 -->
                </td>
                <td class="text-end">
                  <small v-if="cart.final_total !== cart.total" class="text-success">折扣價：</small>
                  {{ $filters.currency(item.final_total) }}
                </td>
                <!-- // 若最終價格不等於原價，會顯示折扣價： -->
                <!-- // *** cart.final_total可換item.final_total? -->
              </tr>
            </template>
            </tbody>
            <tfoot>
            <tr>
              <td colspan="3" class="text-end">總計</td>
              <td class="text-end">{{ $filters.currency(cart.total) }}</td>
            </tr>
            <tr v-if="cart.final_total !== cart.total">
              <td colspan="3" class="text-end text-success">折扣價</td>
              <td class="text-end text-success">{{ $filters.currency(cart.final_total) }}</td>
            </tr>
            <!-- // ***要該用cart還是item (in cart.carts) -->
            </tfoot>
          </table>
          <div class="input-group mb-3 input-group-sm">
            <input type="text" class="form-control" v-model="coupon_code" placeholder="請輸入優惠碼">
            <div class="input-group-append">
              <button class="btn btn-outline-secondary" type="button" @click="addCouponCode">
                套用優惠碼
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  </template>

<script>
export default {
  data () {
    return {
      products: [],
      product: {}, // ??
      status: {
        loadingItem: '' // 對應品項 id
      },
      cart: {},
      coupon_code: ''
    }
  },
  methods: {
    getProducts () { // 取的商品列表_all
      const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/products/all` // *** api改${}
      this.isLoading = true
      this.$http.get(url).then((response) => {
        this.products = response.data.products
        console.log('getproducts:', response)
        this.isLoading = false
      })
    },
    getProduct (id) { // 取得商品id，並導到指定頁面
      this.$router.push(`/user/product/${id}`)
    },
    addCart (id) { // 加入購物車
      const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/cart`
      this.status.loadingItem = id // 用於disabled狀態
      const cart = {
        product_id: id,
        qty: 1
      }
      this.$http.post(url, { data: cart })
        .then((res) => {
          this.status.loadingItem = ''
          // 回傳成功後清空，讓兩邊id不再相同，否則會一直處於disabled狀態，因為用戶可能會想再加一個相同的商品
          console.log('addCart', res)
          this.getCart()
        })
    },
    getCart () { // 取得購物車列表
      const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/cart`
      this.isLoading = true
      this.$http.get(url).then((response) => {
        console.log('getCart', response)
        this.cart = response.data.data
        this.isLoading = false
      })
    },
    updateCart (item) { // 更新購物車
      const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/cart/${item.id}`
      this.isLoading = true
      this.status.loadingItem = item.id // 用於disabled狀態
      const cart = {
        product_id: item.product_id,
        qty: item.qty
      }
      this.$http.put(url, { data: cart }).then((res) => {
        console.log('updateCart', res)
        this.status.loadingItem = ''
        this.getCart()
      })
    },
    removeCartItem (id) {
      this.status.loadingItem = id
      const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/cart/${id}`
      this.isLoading = true
      this.$http.delete(url).then((response) => {
        this.$httpMessageState(response, '移除購物車品項')
        this.status.loadingItem = ''
        this.getCart()
        this.isLoading = false
        console.log('removeCartItem', response)
      })
    },
    addCouponCode () {
      const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/coupon` // 該api有計算公式？ 計算公式都是後端才會做的事嗎？
      const coupon = {
        code: this.coupon_code
      }
      this.isLoading = true
      this.$http.post(url, { data: coupon }).then((response) => { // 把輸入的優惠碼傳到資料庫，自動與"取得優惠券列表api"(管理控制台)配對，配對成功後會自動計算最終價格?
        this.$httpMessageState(response, '加入優惠券')
        this.getCart()
        this.isLoading = false
        console.log('addCouponCode', response)
      })
    }
  },
  created () {
    this.getProducts()
    this.getCart()
  }
}
</script>
