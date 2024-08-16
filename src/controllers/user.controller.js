import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

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
    throw new ApiError(409, "User with email or username already exists");
  }

  /** Step 4 */

  const avatarLocalPath = req.files?.avatar[0].path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

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
    coverImage: coverImage.url || "",
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

export { registerUser };
