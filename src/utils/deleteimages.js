// // ri8a1an0kxvrqq3q3pp5
// import { v2 as cloudinary } from 'cloudinary';
// const deleteFileCloud = asyncHandler(async (req, res) => {
//     const { id } = req.body;
//     try {
//         cloudinary.uploader
//             .destroy(id)
//             .then(result => console.log(result));
//     } catch (error) {
//         console.log(error)
//     }

//     return res
//         .status(200)
//         .json(new ApiResponse(200, " ", "photo delete ho gya"))
// });