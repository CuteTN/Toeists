import { BACKEND_URL } from "../../constants/config";
import { apiService } from "./index";

/**
 * @param {"image"|"audio"} fileType 
 * @param {File} file 
 */
export const uploadFile = (fileType, file) => {
  const form = new FormData();
  form.append("file", file);
  return apiService.post(`/api/files/${fileType}`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
}

/**
 * @param {string} url 
 */
export const deleteFile = async (url) => {
  if (url?.startsWith(BACKEND_URL))
    await apiService.delete(url?.replace(BACKEND_URL, ""));
}