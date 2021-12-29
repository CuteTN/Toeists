const FULL_MATCH_FACTOR = 10000;
const WORD_MATCH_FACTOR = 1000;
const CHAR_MATCH_FACTOR = 100;

/**
 * @param {string} queryString 
 * @param {string} destString 
 * @returns {number} The higher the better
 */
export const getMatchPoint = (queryString, destString) => {
  let result = 0;
  queryString = (queryString ?? '').toLowerCase();
  destString = (destString ?? '').toLowerCase();
  const queryChars = queryString.split('').filter(c => c.trim());
  const queryWords = queryString.split(' ').filter(w => w.trim());

  if (destString.includes(queryString))
    result += FULL_MATCH_FACTOR - (destString.length - queryString.length);

  queryWords.forEach(w => {
    if (destString.includes(w))
      result += w.length * WORD_MATCH_FACTOR;
  })

  let curPos = 0;
  queryChars.forEach(c => {
    const nextPos = destString.indexOf(c, curPos);
    if (nextPos >= 0) {
      result += CHAR_MATCH_FACTOR;
      curPos = nextPos;
    }
    else
      result -= 1;
  })

  return result;
}