import { Router } from 'express';
import { registerUser,loginUser,logoutUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetails, updateUserAvatar, getUserChannelProfile, getWatchHistory } from '../controllers/user.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
import {verfiyJwt} from "../middlewares/auth.middleware.js"

const router = Router();

router.route("/register").post(
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount: 1 }
    ]),
    registerUser
)

router.route("/login").post(loginUser)

// sercure
router.route("/logout").post(verfiyJwt, logoutUser);
router.route("/refreshtoken").post(refreshAccessToken);
router.route("/changePassword").post(verfiyJwt,changeCurrentPassword);
router.route("/currentUSer").get(verfiyJwt,getCurrentUser);
router.route("/update").patch(verfiyJwt,updateAccountDetails);
router.route("/avatar").patch(verfiyJwt,upload.single("avatat"),updateUserAvatar);
router.route("/cover-image").patch(verfiyJwt,upload.single("coverImage"),updateUserAvatar);
router.route("/c/:username").get(verfiyJwt,getUserChannelProfile);
router.route("/history").get(verfiyJwt,getWatchHistory);

export default router;