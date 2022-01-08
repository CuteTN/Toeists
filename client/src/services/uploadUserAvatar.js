import { deleteFile, uploadFile } from "./api/file"
import { updateUser } from "./api/user";

export const uploadUserAvatar = async (userId, oldAvatarUrl, newImage) => {
  try {
    const newAvatarUrl = newImage? (await uploadFile("image", newImage)).data.url : "";
    await deleteFile(oldAvatarUrl);
    return updateUser(userId, { avatarUrl: newAvatarUrl });
  }
  catch { }
}