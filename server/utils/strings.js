/**
 * Check whether a string is a valid base64
 * Use Regex approach 
 * @param {string} str 
 * @returns {boolean}
 */
export const isBase64Encoded = (str) => {
  const BASE64_REGEX = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
  return BASE64_REGEX.test(str);
}

/**
 * Check whether a string is a valid url
 * Regex approach
 * @param {string} str
 * @returns {boolean}
 */
export const isUrl = (str) => {
  var pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
  return !!pattern.test(str);
}