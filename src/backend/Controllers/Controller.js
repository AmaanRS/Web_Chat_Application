const userModel = require("../Models/User");
const conversationModel = require("../Models/Conversation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { pub, sub } = require("../../socket/SocketLogic");

const login = async (req, res) => {
  try {
    //Get the data from the request
    let { email, password } = req.body;

    //If email and password exist
    if (email && password) {
      //Try to get the email from the database
      let doesEmailExist = await userModel.findOne({ email: email });

      //If the database does not returns the data of the user
      if (!doesEmailExist) {
        return res.json({
          message: "Either email or password entered is wrong",
          success: false,
        });
      }

      //Check the user input password against the password from the database
      let matchPassword = await bcrypt.compare(
        password,
        doesEmailExist.password
      );

      //If the passwords do not match
      if (!matchPassword) {
        return res.json({
          message: "Either email or password entered is wrong",
          success: false,
        });
      }

      // I will be creating the jwt token in the backend at set the token using frontend

      //Create a jwt token
      let token = jwt.sign({ email: email }, process.env.JWT_SECRET);

      //Create a cookie using a token and add it to the response object
      // res.cookie("token",token,{maxAge:60*60*60,httpOnly:true,sameSite: 'None'})

      //Send the message to the frontend that the user is now logged in
      return res.json({
        message: "You have been logged in successfully",
        success: true,
        token: token,
      });
    }
    //If either email or password does not exist
    else {
      return res.json({
        message: "Either email or password is missing",
        success: false,
      });
    }
  } catch (e) {
    console.log("There is some error in login controller");

    //Logging the error
    console.log(e.message);

    //Send the message to the frontend that the user is not logged in
    return res.json({
      message: "There is some problem in logging in",
      success: false,
    });
  }
};

const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (email && password) {
      const hashedPassword = await bcrypt.hash(password, 8);

      const isUserCreated = await userModel.create({
        username: username,
        email: email,
        password: hashedPassword,
      });

      if (!isUserCreated) {
        return res.json({ message: "User not created", success: false });
      }
      return res.json({
        message: "Your account has been created now you can login",
        success: true,
      });
    } else {
      return res.json({
        message: "Enter both email and password",
        success: false,
      });
    }
  } catch (e) {
    //Logging the error
    console.log(e.message);

    if (e.code == 11000) {
      return res.json({
        message: "This email is already registered",
        success: false,
      });
    }

    //Send the message to the frontend that the user's account is not created
    return res.json({
      message: "There is some problem in signning up",
      success: false,
    });
  }
};

const mainPage = async (req, res) => {
  //The user is not authenticated
  if (!req.middlewareRes.success) {
    return res.json({
      message: req.middlewareRes.message,
      success: req.middlewareRes.success,
    });
  }
  //The user is authenticated and you can do the operations
  return res.json({ message: "The user is authenticated", success: true });
};

const getUserData = async (req, res) => {
  try {
    //User is not authenticated
    if (!req.middlewareRes.success) {
      return res.json({
        message: req.middlewareRes.message,
        success: req.middlewareRes.success,
      });
    }

    //Get the payload from the token
    const { decodedToken } = req.middlewareRes;

    //If the token does not exist or the payload in the token does not exist
    if (!decodedToken || !decodedToken.email) {
      return res.json({ message: "Cannot get users data", success: false });
    }

    //Get the user from the database
    const userData = await userModel.findOne({ email: decodedToken.email });

    //If the user does not exist
    if (!userData) {
      return res.json({ message: "Cannot get users data", success: false });
    }

    const friends = (await userData.populate("friends", "email _id")).friends;

    if (!friends) {
      return res.json({ message: "Cannot get users data", success: false });
    }

    return res.json({
      message: "User's data fetched successfully",
      success: true,
      email: userData.email,
      friends: friends,
    });
  } catch (error) {
    console.log(error);
    return res.json({ message: "Cannot get users data", success: false });
  }
};

const getAllUsersEmail = async (req, res) => {
  try {
    //User is not authenticated
    if (!req.middlewareRes.success) {
      return res.json({
        message: req.middlewareRes.message,
        success: req.middlewareRes.success,
      });
    }

    const { decodedToken } = req.middlewareRes;

    //Return an array of email objects
    const allUserEmails = await userModel.find(
      {
        email: { $ne: decodedToken.email },
      },
      { email: 1, _id: 0 }
    );

    if (!allUserEmails) {
      return res.json({ message: "Could not fetch all Users", success: false });
    }

    let listOfEmails = [];

    //Gets the array of emails
    allUserEmails.map((emailObj) => {
      listOfEmails.push(emailObj.email);
    });

    return res.json({
      message: "Fetched all emails successfully",
      success: true,
      listOfEmails: listOfEmails,
    });
  } catch (error) {
    console.log(error);
    return res.json({ message: "Cannot get  all users data", success: false });
  }
};

const addFriendBothWays = async (req, res) => {
  let session;
  try {
    //User is not authenticated
    if (!req.middlewareRes.success) {
      return res.json({
        message: req.middlewareRes.message,
        success: req.middlewareRes.success,
      });
    }

    const { friendEmail } = req.body;
    //Email id of user
    const { decodedToken } = req.middlewareRes;

    //If the token does not exist or the payload in the token does not exist
    if (!decodedToken || !decodedToken.email) {
      return res.json({ message: "Cannot get users data", success: false });
    }

    //Cannot make friend of yourself
    if (friendEmail === decodedToken.email) {
      console.log("Inside");
      return res.json({
        message: "Cannot become friends with yourself",
        success: false,
      });
    }

    //Though I have written the session code I have no way to find whether it works or not
    //Session management is required to make the transaction atomic
    session = await mongoose.startSession();
    session.startTransaction();

    const User1 = await userModel.findOne({ email: decodedToken.email });
    const User2 = await userModel.findOne({ email: friendEmail });

    if (!User1 || !User2) {
      return res.json({ message: "Could not add Friend", success: false });
    }

    //Get the array of friends of User1
    let friends1 = (await User1.populate("friends", "email")).friends;

    //If User1 is already a friend of User2 return false
    let isAlreadyFriends = false;

    for (const obj of friends1) {
      if (obj.email === friendEmail) {
        isAlreadyFriends = true;
        break;
      }
    }

    if (isAlreadyFriends) {
      return res.json({
        message: "You are already Friends with the user",
        success: false,
      });
    }

    //Add User2 to friends array field of User1
    const updatedUser1 = await userModel.findByIdAndUpdate(
      User1._id,
      {
        $push: {
          friends: User2._id,
        },
      },
      { new: true }
    );

    //Add User1 to friends array field of User2
    const updatedUser2 = await userModel.findByIdAndUpdate(
      User2._id,
      {
        $push: {
          friends: User1._id,
        },
      },
      { new: true }
    );

    await session.commitTransaction();
    session.endSession();

    return res.json({
      message: "Friend added successfully",
      success: true,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.log(error);
    return res.json({ message: "Could not add as friends", success: false });
  }
};

const getUserConversation = async (req, res) => {
  try {
    //User is not authenticated
    if (!req.middlewareRes.success) {
      return res.json({
        message: req.middlewareRes.message,
        success: req.middlewareRes.success,
      });
    }

    //Email id of user
    const { decodedToken } = req.middlewareRes;

    const { friendEmail } = req.body;

    if (!friendEmail) {
      return res.json({ message: "Provide a friendEmail", success: false });
    }

    const friendId = (await userModel.findOne({ email: friendEmail }))._id;

    const userId = (await userModel.findOne({ email: decodedToken.email }))._id;

    if (!userId || !friendId) {
      return res.json({
        message: "Could not get both the friend and user id from the database",
        success: false,
      });
    }

    //Conversation storage format "conv:Friend1Email_Friend2Email"
    //The stored data in Redis is in a list

    let doesConvExist;

    //Check if the conversation exists in redis for both combination of key
    doesConvExist = await pub.lrange(
      `conv:${decodedToken.email}_${friendEmail}`,
      0,
      -1
    );

    if (!doesConvExist) {
      doesConvExist = await pub.lrange(
        `conv:${friendEmail}_${decodedToken.email}`,
        0,
        -1
      );
    }

    //If now the conversation exists in Redis ie either of the key combination exists and the length of the conversation array is not zero
    if (doesConvExist && doesConvExist.length !== 0) {
      //Return the data from Redis
      return res.json({
        message: "Got the Conversation successfully from Redis",
        success: true,
        conversation: doesConvExist,
      });
    }

    let userConversation = await conversationModel
      .find({
        $and: [
          { $or: [{ Friend1: userId }, { Friend1: friendId }] },
          { $or: [{ Friend2: userId }, { Friend2: friendId }] },
        ],
      })
      .lean();

    if (!userConversation && !userConversation.ContentField) {
      return res.json({
        message: "Unable to find Conversation",
        success: false,
      });
    }

    let conversationKey;

    if (userConversation[0].Friend1.equals(userId)) {
      conversationKey = `conv:${decodedToken.email}_${friendEmail}`;
    } else {
      conversationKey = `conv:${friendEmail}_${decodedToken.email}`;
    }

    let conversation = [];

    for (const e of userConversation[0]?.ContentField || []) {
      if (e.sender == userId.toString()) {
        e.sender = "Self";
        e.receiver = "Friend";
      } else {
        e.sender = "Friend";
        e.receiver = "Self";
      }
      // Since the conversation does not exist in Redis add it
      // Push every new object at the end of list in Redis
      await pub.rpush(conversationKey, JSON.stringify(e));
      conversation.push(e);
    }

    //Return the data
    return res.json({
      message: "Got the Conversation successfully from database",
      success: true,
      conversation: conversation,
    });
  } catch (error) {
    console.log(error);
    return res.json({ message: "Could not add as friends", success: false });
  }
};

const sendMessage = async (req, res) => {
  try {
    //User is not authenticated
    if (!req.middlewareRes.success) {
      return res.json({
        message: req.middlewareRes.message,
        success: req.middlewareRes.success,
      });
    }

    //Email id of user
    const { decodedToken } = req.middlewareRes;

    const { friendEmail, message } = req.body;

    if (!friendEmail) {
      return res.json({ message: "Provide a friendEmail", success: false });
    }

    const friendId = (await userModel.findOne({ email: friendEmail }))._id;

    const userId = (await userModel.findOne({ email: decodedToken.email }))._id;

    if (!userId || !friendId) {
      return res.json({
        message: "Could not get both the friend and user id from the database",
        success: false,
      });
    }

    const response = await conversationModel.updateOne(
      {
        $or: [
          { Friend1: userId, Friend2: friendId },
          { Friend2: userId, Friend1: friendId },
        ],
      },
      {
        $push: {
          ContentField: {
            sender: userId,
            receiver: friendId,
            message: message,
          },
        },
      }
    );

    if (!response) {
      return res.json({
        message: "Could not add the message to the conversation",
        success: false,
      });
    }

    return res.json({ message: "Message added successfully", success: true });
  } catch (error) {
    console.log(error);
    return res.json({ message: "Could not add as friends", success: false });
  }
};

module.exports = {
  login,
  signup,
  mainPage,
  getUserData,
  getAllUsersEmail,
  addFriendBothWays,
  getUserConversation,
  sendMessage,
};
