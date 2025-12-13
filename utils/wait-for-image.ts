export default img =>
  img.complete
    ? undefined
    : new Promise(resolve => {
        img.addEventListener('load', resolve);
        img.onerror = resolve;
      });
