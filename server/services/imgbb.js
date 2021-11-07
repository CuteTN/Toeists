import axios from 'axios'
import FormData from 'form-data'
import { imgbbApiKey } from '../index.js';

/**
 * @param {string} imgB64 base64 image
 */
export const uploadToImgbbServer = (imgB64) => {
  if(!imgbbApiKey)
    throw "No API key provided for 3rd-party service."

  const form = new FormData();
  form.append("image", imgB64);

  return axios.post(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, form, {
    headers: 
      form.getHeaders(),
  });
}