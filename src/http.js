export default function fetchData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        data: ['1155665', '4433221', '5544332', '5544332', '1155665', '4433221']
      })
    }, 1000)
  })
}
