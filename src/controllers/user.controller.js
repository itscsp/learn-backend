import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefereshTokens = async(userId) => {
  try{
    const user = User.findById(userId)

    const accessToken = user.generateAccessToken()
    const refereshToken =  user.generateRefreshToken()

    user.refereshToken = refereshToken
    await user.save({validateBeforeSave: false})

    return {accessToken, refereshToken}

  } catch (error) {
    throw new ApiError(500, "Something went wrong while generation referesh and access token")
  }
}

const registerUser = asyncHandler(async (req, res) => {
  // Step 1: get user details from user
  // Step 2: validate user inputs - not empty
  // Step 3: Check if user already exists : email | username
  // Step 4: Check for images, avathar
  // Step 5: upload them to cloudinary, avathar
  // Step 6: create user object - create entry in db
  // Step 7: remove password and response token field from response
  // Step 8: check user creation
  // Step 9: return response

  /** Step 1 */
  const { username, email, fullName, password } = req.body;

  // console.log("Request body data: ", req.body);

  /** Step 2 */

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All field required");
  }

  if (!email.includes("@")) {
    throw new ApiError(400, "Enter valid email address");
  }

  /** Step 3 */
  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    throw new ApiError(400, "User with email or username already exists");
  }

  /** Step 4 */
  // console.log("Request body data: ", req.files);

  const avatarLocalPath = req.files?.avatar[0].path;
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath;

  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
    console.log("Cover Image Path:", coverImageLocalPath);
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar filed is required");
  }

  /** Step 5 */
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar is required");
  }

  /** step 6 */

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  /** Step 7 */
  const createUserData = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  /** Step 8 */

  if (!createUserData) {
    throw new ApiError(500, "Something went wrong creating user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createUserData, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  // Step 1: Get data from req body
  // Step 2: Validate username or email
  // Step 3: findn the user
  // Step 4: password check
  // Step 5: Generate access and refresh token
  // Step 6: Send Cookie

  const {email,username,password} = req.body

  if(!username || !email) {
    throw new ApiError(400, "username or email is required")
  }

  const user = await User.findOne({
    $or: [{username}, {email}]
  })

  if(!user){
    throw new ApiError(404, "User does not exists")
  }

  const isPasswordValid = await user.isPasswordCorrect(password)

  if(!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials")
  }

  const {accessToken, refereshToken} = await generateAccessAndRefereshTokens(user._id)

  const loggedInUser = await User.findById(user._if).select("-password -refreshToken")

  const options = {
    httpOnly: true,
    secure:true
  }

  return res.status(200)
  .cookie("accessToken", accessToken, options)
  .cookie("refereshToken", refereshToken, options)
  .json(
    new ApiResponse(
      200,
      {
        user: loggedInUser, accessToken, refereshToken
      },
      
        "User logged in Successfully"
      
    )
  )
})

const logoutUser = asyncHandler(async(req, res, next) => {
  await User.findByIdAndUpdate(
    req.user._id, 
    {
      $set: {
        refereshToken:undefined
      }
    },
    {
      new:true
    }
  ) 

  const options = {
    httpOnly: true,
    secure:true
  }

  return res.status(200).clearCookie("accessToken").clearCookie("refreshToken").json(new ApiResponse(200, {}, "User logged Out"))
  

})

export { registerUser, loginUser, logoutUser };
