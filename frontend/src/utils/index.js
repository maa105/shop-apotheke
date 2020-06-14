
export const getWindowSize = () => {
  return {
    width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
    height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
  };
};


export const getStrSorter = (key) => (a, b) => {
  a = a[key];
  b = b[key];
  console.log(a, b);
  a = (a || '').toLowerCase();
  b = (b || '').toLowerCase();
  console.log(a > b ? 1 : a < b ? -1 : 0);
  return a > b ? 1 : a < b ? -1 : 0;
};
