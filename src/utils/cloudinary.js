import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";




// Cloudniary Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: CLOUDINARY_API_KEY, 
    api_secret: CLOUDINARY_API_SECRET 
});


const uploadONCloudinary = async (loacalFilePath) => {
    
    try{

        if(!loacalFilePath) return null
        
        //Uploading the file On Cloudinary
        const response = await cloudinary.uploader.upload(loacalFilePath, {
            resource_type: "auto"
        })
        
        //file has been uploaded succesfully
        console.log("File has uploaded successfully on cloedinary", response.url);
        return response;
        
    }
    catch(error)
    {
        fs.unlinkSync(loacalFilePath) //Remove the locally saved temporay file as the upload operation got failed.
        return null;
    }
}
    
     
