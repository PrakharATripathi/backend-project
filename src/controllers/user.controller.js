import { ApiError } from "../utils/apierror.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/apiresponce.js";

const registerUser = asyncHandler(async (req, res) => {
    // res.status(300).json({
    //     message:"ok"
    // })
    // get user details from frontend
    // validation - not emty
    // chaeck if user already exists : username,email
    // cheak for images , cheak for avtar 
    // uplpload them to clodinary , avtar
    // create user object - create entry in db
    // remove password and refresh  token field from response 
    // cheak for user creation 
    // return response  this is all steps 

    const { fullName, email, username, password } = req.body;
    // console.log(fullName, email, username);
    // if(fullName === ""){
    //     throw new ApiError(400,"full name required")
    // }

    if ([fullName, email, username, password].some((value) => value?.trim() === "")) {
        throw new ApiError(400, "All fields are required")
    };

    const exitedUser = await User.findOne({
        $or: [{ email }, { username }]
    });

    if (exitedUser) {
        throw new ApiError(409, "User with emial or username alredy exists")
       
    };
    const avatarLocalPath = req.files?.avatar[0]?.path;

    let coverImageLocalPath;

    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files?.coverImage[0]?.path;
    };

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avtar file is required")
    };
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!avatar) {
        throw new ApiError(400, "Avtar file is required");
    };

    const user = await User.create({
        fullName: fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        password: password,
        email,
        username: username.toLowerCase(),
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "somethin went wrong")
    };

    return res.status(201).json(
        new ApiResponse(200, createdUser, "user register Successfully")
    );

});



// const registerUser = (req,res) =>{
//     res.status(200).json({
//         message:"ok thik hai sab "
//     })
// }

export { registerUser };
