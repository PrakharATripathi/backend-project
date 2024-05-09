import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.ClOUD_NAME,
    api_key: process.env.CLOUDE_API_KEY,
    api_secret: process.env.CLODINARY_API_SECRET
});

const uploadOnCloudinary = async (localfilePath) => {
    try {
        if (!localfilePath) return null;
        //    upload the file on cloudinary 
        const response = await cloudinary.uploader.upload(localfilePath, {
            resource_type: "auto"
        })
        // file has been uploaded successfully
        console.log("file is uploaded on cloudinary", response.url)
        return response;
    } catch (error) {
        fs.unlinkSync(localfilePath) //remove the locally the  temory file as the upload opreation got failed 
        return null;
        console.log(error)
    }
}

export { uploadOnCloudinary }

/* cloudinary.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
    { public_id: "olympic_flag" },
    function (error, result) { console.log(result); });
    */
