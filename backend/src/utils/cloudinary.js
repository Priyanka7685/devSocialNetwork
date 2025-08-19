import { v2 as cloudinary } from 'cloudinary';
import dotenv from "dotenv"
import streamifier from "streamifier";

dotenv.config()

// Configuration of cloudinary
cloudinary.config({ 
    cloud_name:  process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret:  process.env.CLOUDINARY_API_SECRET
});


// const uploadOnCloudinary = async (localFilePath) => {
//     try {
//         if(!localFilePath) return null
//         const response = await cloudinary.uploader.upload(
//             localFilePath, {
//                 resource_type: "auto"
//             }
//         )
//         console.log("File uploaded on cloudinary. File src: " + response.url);

//         // once the file is uploaded, we would like to delete it from our server
//         fs.unlinkSync(localFilePath)
//         return response
        
//     } catch (error) {
//         fs.unlinkSync(localFilePath)
//         return null
//     }
// }

// const deleteFromCloudinary = async (publicId) => {
//     try {
//      const result = await cloudinary.uploader.destroy(publicId) 
//      console.log("Deleted from cloudinary. Public Id");
     
//     } catch (error) {
//         console.log("Error deleting from cloudinary", error);
//         return null
        
//     }
// }


/**
 * Upload file buffer directly to Cloudinary
 */
const uploadOnCloudinary = (fileBuffer, folder = "devsocialnetwork") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "auto" },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          reject(error);
        } else {
          console.log("File uploaded to Cloudinary:", result.secure_url);
          resolve(result);
        }
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

/**
 * Delete file from Cloudinary
 */
const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log("Deleted from Cloudinary:", publicId);
    return result;
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    return null;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary }
