import Message from "../models/message_model.js";
import User from "../models/user_model.js";
import cloudinary from "../lib/cloudinary.js"
import { getReceiverSocketId } from "../lib/socket.js";
import { io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({_id: { $ne:loggedInUserId }}).select("-password"); //$ne => not equal

        res.status(200).json(filteredUsers )
    } catch (error) {
        console.error("Error in getUserForSidebar: ", error.message);
        res.status(500).json({ error: "internal server error "});
    }  
};


export const getMessages = async(req, res) => {
    try {
       const { id:userToChatId } = req.params //id is the same as the one in the routes
       const myId = req.user._id //currently authenticated user ie the person sending the message

       const messages = await Message.find({
        $or: [
            {senderId:myId, receiverId:userToChatId},
            {senderId:userToChatId, receiverId:myId}
        ]
       })
       //here find all messages between sender and receiver
       //$or helps to choose either the first or the second. The above is objects in an Array

       res.status(200).json(messages)
       
    } catch (error) {
        console.error("Error in getMessages controller: ", error.message);
        res.status(500).json({ error: "internal server error "});
    }
};


export const sendMessages = async(req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params; 
        const senderId = req.user._id;

        // check if user is passing an image or not
        let imageUrl;
        if(image) {
            // Upload base64 image to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });

        await newMessage.save();

        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage)
    } catch (error) {
        console.error("Error in sendMessage controller: ", error.message);
        res.status(500).json({ error: "internal server error "});
    }
};
  