// 千分號
export function currency (num) {
  const n = parseInt(num, 10)
  return `${n.toFixed(0).replace(/./g, (c, i, a) => (i && c !== '.' && ((a.length - i) % 3 === 0) ? `, ${c}`.replace(/\s/g, '') : c))}`
}

//
export function date (time) {
  const localDate = new Date(time * 1000)
  return localDate.toLocaleDateString() // Locale:語言
}
// toLocaleDateString() 與 toISOString() 顯示不同
// toLocaleDateString() 可顯示為 2023/10/13
// toISOString() 可顯示為 2023-10-13T15:37:00.450Z
