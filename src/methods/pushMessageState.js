import emitter from '@/methods/emitter' // 要先載入emitter套件

export default function (response, title = '更新') { // 也可空字串 title = ' '
  if (response.data.success) {
    emitter.emit('push-message', {
      style: 'success',
      title: `${title}成功`
    })
  } else {
    // 有些訊息是字串，有些則是陣列，在此統一格式
    const message = typeof response.data.message === 'string'
      ? [response.data.message] // 三元運算子，?=true :=false，當作 if 的簡潔寫法 // [ ]為解構賦值
      : response.data.message
    emitter.emit('push-message', {
      style: 'danger',
      title: `${title}失敗`,
      content: message.join('、') // 訊息內容是從後端傳進來，使用join方式把陣列一一取出來，中間以頓號區隔，並傳到content
    })
  }
}
