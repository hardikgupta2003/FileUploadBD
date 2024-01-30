const File = require("../models/File");
const cloudinary = require("cloudinary");

//localfileupload -> handler function

exports.localFileUpload = async (req, res) => {
    try {

        //fetch filefrom request
        const file = req.files.file;
        console.log("FILE AAGYI JEE -> ", file);


        //create path where file need to be stored on server
        let path = __dirname + "/files/" + Date.now() + `.${file.name.split('.')[1]}`;
        console.log("PATH-> ", path)

        //add path to the move fucntion
        file.mv(path, (err) => {
            console.log(err);
        });

        //create a successful response
        res.json({
            success: true,
            message: 'Local File Uploaded Successfully',
        });

    }
    catch (error) {
        console.log("Not able to upload the file on server")
        console.log(error);
    }
}

async function uploadFileToCloudinary(file, folder) {
    const options = { folder };
    console.log("temp file path : ", file.tempFilePath)
    return await cloudinary.uploader.upload(file.tempFilePath, options);
}
function isFileTypeSupported(type, supportedTypes) {
    return supportedTypes.includes(type);
}

//image upload handler
exports.imageUpload = async (req, res) => {
    try {
        // data fetch 
        const { name, tags, email } = req.body;
        console.log(name, tags, email);

        const file = req.files.imageFile;
        console.log(file);

        //validation
        const supportedTypes = ["jpeg", "jpg", "png"];
        console.log(file.name)


        const fileType = file.name.split('.')[1].toLowerCase();
        console.log("file type : ", fileType)
        
        if (!isFileTypeSupported(fileType, supportedTypes)) {
            return res.status(400).json({
                success: false,
                error: "Invalid Image Type"
            })
        };


        const response = await uploadFileToCloudinary(file, "hardik");
        console.log(response);

        //db entry
        const fileData = await File.create({
            name,
            imageUrl: response.secure_url,
            tags,
            email,
        })

        return res.status(500).json({
            success: true,
            imageUrl: response.secure_url,
            message: "Image uploaded successfully",
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: 'something went Wrong',
        });
    }
};
