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

const genrateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.genrateAccessToken();
        const refreshToken = user.genrateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "something went wrong to genrate access and refresh token")
    }
}
const loginUser = asyncHandler(async (req, res) => {
    //  email and password fields  req body -> data
    // username or email 
    // find the user 
    // password cheak 
    // access token refrece token 
    // send cookies  and response 

    const { email, password, username } = req.body

    if (!username || !email) {
        throw new ApiError(400, "username or password is required");
    }

    // const user = await User.findOne({email})
    const user = await User.findOne({ $or: [{ username }, { email }] })

    if (!user) {
        throw new ApiError(404, "User does not exists")
    }

    const isPasswordVaild = await user.isPasswordCorrect(password);

    if (!isPasswordVaild) {
        throw new ApiError(404, "User does not exists");
    };

    const { accessToken, refreshToken } = await genrateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refereshToken", refreshToken, options)
        .json(new ApiResponse(
            200, {
            user: loggedInUser, accessToken,
            registerUser
        },
            "User logged In Successfully"
        )
        )
})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: { refreshToken: undefined }
        },
        {
            new: true
        }
    )
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"User logged Out"))
})

// const registerUser = (req,res) =>{
//     res.status(200).json({
//         message:"ok thik hai sab "
//     })
// }

export { registerUser, loginUser, logoutUser };
