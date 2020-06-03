export default img =>
  img.complete
    ? undefined
    : new Promise(resolve => {
        img.onload = resolve
        img.onerror = resolve
      })
