const File = require("../models/File");
const cloudinary = require("cloudinary");

//localfileupload -> handler function

exports.localFileUpload = async (req, res) => {
    try {

        //fetch filefrom request
        const file = req.files.file;
        console.log("FILE AAGYI JEE -> ",file);


        //create path where file need to be stored on server
        let path = __dirname + "/files/" + Date.now() + `.${file.name.split('.')[1]}`;
        console.log("PATH-> ", path)

        //add path to the move fucntion
        file.mv(path , (err) => {
            console.log(err);
        });

        //create a successful response
        res.json({
            success:true,
            message:'Local File Uploaded Successfully',
        });

    }
    catch(error) {
        console.log("Not able to upload the file on server")
        console.log(error);
    }
}

async function uploadFileToCloudinary(file,folder){
    const options = {folder};
    return await cloudinary.uploader.upload(file.tempFilePath);
    
}

//image upload handler
exports.imageUpload=async (req,res,next)=>{
    try{
        // data fetch 
        const {name,tags,email}=req.body;
        console.log(name,tags,email);

        const file = req.files.imageFile;
        console.log(file);

        //validation
        const supportedTypes =  ['image/jpeg','image/jpg','image/png'];
        if(!supportedTypes.includes(file.mimetype)){
            return res.status(400).send('Invalid image type');
        }

        const fileType=file.name.split('.')[1].toLowerCase();
        if(fileType!=='jpg' && fileType !== 'png'){
           throw new Error('Only jpg and png images are allowed');
       }
       const response = await uploadFileToCloudinary(file,"hardik")

       return res.status(400).json({
        success:true,
        message:"Image uploaded successfully",
       })

       //save image in database
    //    let base64Data=await getBase64(file.path);
    //    await ImageModel.addImageToDB(name,base64Data,tags,email);

    //    //delete local file after saving it into db
    //    fs.unlinkSync(file.path);

    //    next()
   }catch(err){
      console.log(err);
      res.status(500).json({message: err.toString()});
   }
};

// function getBase64(imgPath, callback) {
//     fs.readFile(imgPath, {encoding: 'base64'}, function(err, data) {
//         if (!err) {
//             callback(null, data);
//         } else {
//             callback(err);
//         }
//     });
// }

module.exports={uploadImage};

        
