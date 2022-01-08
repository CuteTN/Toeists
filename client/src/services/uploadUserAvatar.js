import { deleteFile, uploadFile } from "./api/file"
import { updateUser } from "./api/user";

export const uploadUserAvatar = async (userId, oldAvatarUrl, newImage) => {
  try {
    await deleteFile(oldAvatarUrl);
    const newAvatarUrl = (await uploadFile("image", newImage)).data.url;
    return updateUser(userId, { avatarUrl: newAvatarUrl });
  }
  catch { }
}