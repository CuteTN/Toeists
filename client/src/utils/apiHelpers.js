/**
 * @param {object} queryObj 
 * @returns {string} Filter out nullish and empty field, not includes the first question mark character in the result
 */
export const convertToQueryString = (queryObj = {}) => {
  const result = Object.entries(queryObj)
    .map(([key, value]) => value != null && value !== ''? `${key}=${value}` : "")
    .filter(s => s)
    .join('&');

  return result;
}