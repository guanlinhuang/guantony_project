<template>
    <div>
      <Loading :active="isLoading"></Loading>
      <div class="text-end mt-4">
        <button class="btn btn-primary" @click="openCouponModal(true)">
          建立新的優惠券
        </button>
      </div>
      <table class="table mt-4">
        <thead>
        <tr>
          <th>名稱</th>
          <th>折扣百分比</th>
          <th>到期日</th>
          <th>是否啟用</th>
          <th>編輯</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, key) in coupons" :key="key">
          <td>{{ item.title }}</td>
          <td>{{ item.percent }}%</td>
          <td>{{ $filters.date(item.due_date) }}</td>
          <td>
            <span v-if="item.is_enabled === 1" class="text-success">啟用</span>
            <span v-else class="text-muted">未啟用</span>
          </td>
          <td>
            <div class="btn-group">
              <button class="btn btn-outline-primary btn-sm"
                      @click="openCouponModal(false, item)"
              >編輯</button>
              <button class="btn btn-outline-danger btn-sm"
                      @click="openDelCouponModal(item)"
              >刪除</button>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
      <couponModal :coupon="tempCoupon" ref="couponModal"
      @update-coupon="updateCoupon"/>
      <DelModal :item="tempCoupon" ref="delModal" @del-item="delCoupon"/>
    </div>
  </template>

<script>
import CouponModal from '@/components/CouponModal.vue'
import DelModal from '@/components/DelModal.vue' // 多個主要元件共用刪除元件DelModal
export default {
  components: { CouponModal, DelModal },
  props: {
    config: Object
  },
  data () {
    return {
      coupons: {},
      tempCoupon: {
        title: '',
        is_enabled: 0, // 0 = false 1 = true
        percent: 100,
        code: ''
      },
      isLoading: false, // 沒有進入讀取狀態
      isNew: false // 判斷是否"新增"或"修改"狀態
    }
  },
  methods: {
    // 建立新的優惠券視窗 // 編輯視窗
    openCouponModal (isNew, item) {
      this.isNew = isNew
      if (this.isNew) {
        this.tempCoupon = {
          due_date: new Date().getTime() / 1000 // 轉換毫秒 // 為Unix Timestamp 格式
        }
        console.log(this.tempCoupon) // 1697551343.808
      } else {
        this.tempCoupon = { ...item }
      }
      this.$refs.couponModal.showModal()
      // 連到couponModal，再連到modalMixin，呼叫showModal()
    },
    // 刪除視窗
    openDelCouponModal (item) {
      this.tempCoupon = { ...item }
      const delComponent = this.$refs.delModal
      delComponent.showModal()
      // 連到DelModal，再連到modalMixin，呼叫showModal()
    },
    // 從遠端資料庫撈資料 // 方法:get
    getCoupons () {
      this.isLoading = true // 取得遠端資料時，進入讀取狀態
      const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/coupons`
      this.$http.get(url, this.tempProduct).then((response) => { // *****
        this.coupons = response.data.coupons
        this.isLoading = false // 遠端資料已取得完畢，關閉讀取效果
        console.log('getCoupons', response)
      })
    },
    // 編輯(新增)優惠券 // 儲存優惠券到遠端資料庫 // 方法:post/put
    updateCoupon (tempCoupon) {
      if (this.isNew) { // 新增的 API
        const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/coupon`
        this.$http.post(url, { data: tempCoupon }).then((response) => {
          console.log(response, tempCoupon)
          this.$httpMessageState(response, '新增優惠券')
          this.getCoupons() // 儲存後重新渲染畫面
          this.$refs.couponModal.hideModal() // 儲存後關閉視窗
        })
      } else { // 編輯的 API
        const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/coupon/${this.tempCoupon.id}`
        this.$http.put(url, { data: this.tempCoupon }).then((response) => {
          console.log(response)
          this.$httpMessageState(response, '新增優惠券')
          this.getCoupons()
          this.$refs.couponModal.hideModal()
        })
      }
    },
    // 刪除優惠券 // 從遠端資料庫移除優惠券 // 方法:delete
    delCoupon () {
      const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/coupon/${this.tempCoupon.id}`
      this.isLoading = true
      this.$http.delete(url).then((response) => {
        console.log(response, this.tempCoupon)
        this.$httpMessageState(response, '刪除優惠券')
        const delComponent = this.$refs.delModal
        delComponent.hideModal()
        this.getCoupons()
      })
    }
  },
  created () {
    this.getCoupons()
  }
}
</script>
