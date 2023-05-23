import { Image } from "../models/image.js";
import { uploadToImgbbServer } from "./external/imgbb.js";

/**
 * @param {string} uploaderId 
 * @param {string} imgStr Expected a base64 encoded string or a URL
 */
export const uploadToImgbbAndSaveDb = async (uploaderId, imgStr) => {
  var serviceResponse = await uploadToImgbbServer(imgStr);
    
  const image = new Image({
    uploaderId,
    url: serviceResponse.data.data.url,
    deleteUrl: serviceResponse.data.data.delete_url,
  });

  const existingImg = await Image.findOne({ url: image.url });
  if(existingImg)
    return existingImg;

  await image.save?.();
  return image;
}