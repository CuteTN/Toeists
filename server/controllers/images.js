import { Image } from "../models/image.js";
import { uploadToImgbbServer } from "../services/imgbb.js";

export const uploadToImgbbAndSaveDb = async (uploaderId, imgB64) => {
  var serviceResponse = await uploadToImgbbServer(imgB64);
    
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