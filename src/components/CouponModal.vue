<template>
    <div class="modal fade" id="couponModal" tabindex="-1" role="dialog"
         aria-labelledby="exampleModalLabel" aria-hidden="true" ref="modal">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">優惠券</h5>
            <button type="button" class="btn-close"
                    data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label for="title">標題</label>
              <input type="text" class="form-control" id="title" v-model="tempCoupon.title"
                     placeholder="請輸入標題">
            </div>
            <div class="mb-3">
              <label for="coupon_code">優惠碼</label>
              <input type="text" class="form-control" id="coupon_code" v-model="tempCoupon.code"
                     placeholder="請輸入優惠碼">
            </div>
            <div class="mb-3">
              <label for="due_date">到期日</label>
              <input type="date" class="form-control" id="due_date"
                     v-model="due_date">
            </div>
            <div class="mb-3">
              <label for="price">折扣百分比</label>
              <input type="number" class="form-control" id="price"
                     v-model.number="tempCoupon.percent" placeholder="請輸入折扣百分比">
                     <!-- 加上修飾符 .number 才能改變其資料型態為 number，否則儘管輸入數字也會是 string -->
            </div>
            <div class="mb-3">
              <div class="form-check">
                <input class="form-check-input" type="checkbox"
                       :true-value="1"
                       :false-value="0"
                       v-model="tempCoupon.is_enabled" id="is_enabled">
                <label class="form-check-label" for="is_enabled">
                  是否啟用
                </label>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary"
                    @click="$emit('update-coupon', tempCoupon)">更新優惠券
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
<script>
import modalMixin from '@/mixins/modalMixin'
export default {
  name: 'couponModal',
  props: { // p253
    coupon: {}
  },
  data () {
    return {
      tempCoupon: {},
      due_date: ''
    }
  },
  emits: ['update-coupon'],
  // 這裡定義 emits: ['update-coupon']
  // 只是單純要說明我們使用 update-coupon 來對外層發送自定義事件
  // 算是一種比較謹慎的方式，所以不加上也可以
  // 但提醒一下，有些 ESLint 規範如果沒加這個，會出現警告或是錯誤唷！
  watch: {
    coupon () {
      this.tempCoupon = this.coupon
      // 將時間格式改為 YYYY-MM-DD
      console.log(this.tempCoupon.due_date) // 1697551289.253
      const dateAndTime = new Date(this.tempCoupon.due_date * 1000) // due_date /1000 轉換為毫秒是為了方便時間轉換，但傳進來之後又拿這個值去 *1000 會相互抵銷 (先轉換毫秒會對我們之後要處理日期會比較方便)
        .toISOString().split('T') // toISOString():返回YYYY-MM-DD  // split('T') 把原字串依照指定的符號分割成子字串，即把日期和時間分開
      this.due_date = dateAndTime[0] // 陣列含有日期和時間兩個元素，日期的索引位置為0
      console.log(this.due_date) // 2023-10-17
      console.log(dateAndTime) // Tue Oct 17 2023 21:58:37 GMT+0800 (中部標準時間)
      // [this.due_date] = dateAndTime // 透過解構，把陣列第一個元素賦值到 this.due_date // [] 為解構賦值，可以把陣列或物件中的資料解開擷取成為獨立變數
    },
    due_date () {
      this.tempCoupon.due_date = Math.floor(new Date(this.due_date) / 1000)
      // 已經在有日期的情況下，監聽到要更改別的日期，就會需要重新賦予值到 this.tempCoupon.due_date
      // 可不用加Math.floor，但怕日期後面有幾分幾秒，所以把Math.floor當成一種慣例
      console.log(this.tempCoupon.due_date)
    }
  },
  mixins: [modalMixin] // 使用 mixin 整合相同程式碼
}
</script>
