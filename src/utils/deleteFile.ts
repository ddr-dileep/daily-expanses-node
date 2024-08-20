import fs from "fs";

// delete the file after upload is complete or an error is thrown
export const deleteFile = (url: any) => {
  fs.unlink(url, (err: any) => {
    if (err) {
      console.error("Error deleting file:", err);
    } else {
      console.log("File deleted successfully");
    }
  });
};
