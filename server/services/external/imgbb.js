import axios from 'axios'
import FormData from 'form-data'
import { imgbbApiKey } from '../../index.js';

/**
 * @param {string} imgStr Expected a base64 encoded string or a URL
 */
export const uploadToImgbbServer = (imgStr) => {
  if(!imgbbApiKey)
    throw "No API key provided for 3rd-party service."

  const form = new FormData();
  form.append("image", imgStr);

  return axios.post(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, form, {
    headers: 
      form.getHeaders(),
  });
}