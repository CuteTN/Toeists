import React from 'react';

/** @link https://stackoverflow.com/questions/18936915/dynamically-set-property-of-nested-object */
/**
 * @param {object} obj 
 * @param {(string|number)[]} pathList 
 * @param {any} value 
 */
function setPath(obj, pathList, value) {
  let len = pathList.length;
  if (!len) return;

  let schema = obj;
  for (let i = 0; i < len - 1; i++) {
    let elem = pathList[i];
    if (!schema[elem]) schema[elem] = {}
    schema = schema[elem];
  }

  const oldValue = schema[pathList[len - 1]];
  if(typeof value === "function") console.error("There's a FUNCTION")
  schema[pathList[len - 1]] = typeof value === "function" ? value(oldValue) : value
  return { ...obj };
}


/**
 * 
 * @template T
 * @param {T} init 
 * @returns {[T, React.Dispatch<T>, DispatchField]}
 */
export const usePatch = (init) => {
  const [state, setState] = React.useState(init);

  /** @type {DispatchField} */
  const setField = (pathList, value) => {
    if (pathList.length)
      setState(prev => setPath(prev, pathList, value))
    else
      setState(value);
  }

  return [state, setState, setField]
}

/** 
 * @typedef {(pathList: (string|number)[], any) => void} DispatchField
 */