import Message from "../models/message_model.js";
import User from "../models/user_model.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({_id: { $ne:loggedInUserId }}).select("-password"); //$ne => not equall

        res.status(200).json(filteredUsers )
    } catch (error) {
        console.error("Error in getUserForSidebar: ", error.message);
        res.status(500).json({ error: "internal server error "});
    }  
};


export const getMessages = async(req, res) => {
    try {
       const { id:userToChatId } = req.params
       const myId = req.user._id

       const messages = await Message.find({
        $or: [
            {senderId:myId, receiverId:userToChatId},
            {senderId:userToChatId, receiverId:myId}
        ]
       })

       res.status(200).json(messages)
    } catch (error) {
        console.error("Error in getMessages controller: ", error.message);
        res.status(500).json({ error: "internal server error "});
    }
}


export const sendMessages = async(req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params; 
        const senderId = req.user._id;

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

        // todo: realtime functionality goes here => socket.io

        res.status(201).json(newMessage)
    } catch (error) {
        console.error("Error in sendMessage controller: ", error.message);
        res.status(500).json({ error: "internal server error "});
    }
};
  