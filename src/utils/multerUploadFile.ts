import upload from "../config/multerConfig";

export const uploadProfileImage = upload.single("profileImage");