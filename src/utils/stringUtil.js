/**
 * 判断字符串是否为空
 * @param {*} data 
 * @returns 
 */
export function isBlank(data) {
  if (
    data == null ||
    data === 'null' ||
    data === '' ||
    data === undefined ||
    data === 'undefined' ||
    data === 'unknown'
  ) {
    return true;
  } else {
    return false;
  }
}

/**
 * 判断str是否包含substr
 * @param {*} str 
 * @param {*} substr 
 * @returns 
 */
 export function isContains(str, substr) {
  return str.indexOf(substr) >= 0;
}