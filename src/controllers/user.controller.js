import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadONCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

//Generating Access and Refresh Token
const generateAccessAndRefreshTokens = async(userId) => 
{
    try {
      const user = await User.findById(userId)
      const accessToken = user.generateAccessToken()
      const refreshToken = user.generateRefreshToken()
      
      user.refreshToken = refreshToken
      await user.save({ validateBeforeSave: false })

      return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access tokens")
    }
}


//Creating User Registration
const registerUser = asyncHandler(async (req, res) => {
    // Take the user details(username, email, email, password, avatar, fullName) from frontend - DONE (email only)
    // If email, username, password, fullname is not given , give a message(validation) - DONE (ALL)
    // check if the user is already registered. - DONE(usernamr and email)
    // avatar and coverImage upload on cloudinary and check if avatar is uploaded or not by the user - Done uploading code in cloudinary and chcking for avatar
    // create user object- create entry in db (as we are using mongodb, and nosql data, we generally send data through objects) - DONE
    // remove password, refresh token field from response to the user - DONE  
    // Check for user creation - DONE
    // return res- DONE

    /* NOTES:
    1. If the data from the user is coming through forms or json, we can get the data using req.body 
    2. We can also get data from url.
    */

    //Taking Input from the user 
    const {fullName, username, email, password} = req.body
    // console.log("email: ", email);
    // console.log("password: ", password);
    


    /*Validation Process

        if(fullname === ""){
        throw new ApiError(400, "Fullname is required")
        }

        NOTE: Only "fullName" is checked, but if we check multiple cases, the code will be so big.
                Instead we can use .map or .some method like in the below code. Here:
                .some :- The some() method executes the callback function once for each array element. 
                         The some() method returns true (and stops) if the function returns true for 
                         one of the array elements.
                .trim() :- Returns a string expression after it removes leading and trailing whitespace 
                           or custom characters.

    */
    
    if(
        [fullName, username, email, password].some((field) => {field?.trim() == ""})
    ){
        throw new ApiError(400, "All fields are required")
    }

    //Checking if User is already registered 
    const existedUser = await User.findOne({
        $or: [{ username }, { email }] 
    })
    if(existedUser){
        throw new ApiError(409, "User with username or email already exist")
    }

    //Avatar or coverImage upload and checking for avatar only
    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath = req.files.coverImage[0].path
    }

    if(!avatarLocalPath){
        throw new  ApiError(400, "Avatar is required")
    }

    const avatar = await uploadONCloudinary(avatarLocalPath)
    const coverImage = await uploadONCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new  ApiError(400, "Avatar is required")
    }

    //Creating User Object
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    //Validation of creating the User Object and then removing password and refreshToken
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken" 
    )

    //Checking User creation
    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the User")
    }

    //Returing Response
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Registered successfully")
    )


})

//User Log In
const loginUser = asyncHandler(async (req, res) =>{
    // req body -> data
    // username or email
    //find the user
    //password check
    //access and referesh token
    //send cookie

    const {email, username, password} = req.body
    console.log(email);

    if (!username && !email) {
        throw new ApiError(400, "username or email is required")
    }
    
    // Here is an alternative of above code 
    // if (!(username || email)) {
    //     throw new ApiError(400, "username or email is required")
        
    // }

    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

   const isPasswordValid = await user.isPasswordCorrect(password)

   if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials")
    }

   const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )

})

//User Log out
const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                    refreshToken: undefined
                }
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
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, "User logged out successfully"))


})


export { 
    registerUser,
    loginUser,
    logoutUser
 }