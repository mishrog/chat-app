import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const sendMessage = async(req,res)=>{
    try {
        const {message} = req.body;
        const {id: ReceiverId} = req.params; // same as const id = req.params.id => this is basic javascript restructuring
        const senderId = req.user._id;  // as we have added this user in protectRoute

        let conversation = await Conversation.findOne({
            participants: {$all: [senderId,ReceiverId]}
        }) // finding a conversation between these two users

        if(!conversation) { // if no convo till now
            conversation = await Conversation.create({
                participants: [senderId,ReceiverId],
            })
        }

        const newMessage = new Message({
            senderId,
            ReceiverId,
            message
        })

        if(newMessage){
            conversation.messages.push(newMessage._id);
        }

        // SOCKET IO FUNCTIONALITY WILL GO HERE

        // await conversation.save(); 1s
        // await newMessage.save(); need to wait 1s to run

        // this will run in parallel, thus is more optimized
        await Promise.all([conversation.save(),newMessage.save()]); // will run in exact same time
        res.status(201).json(newMessage);

    } catch (error) {
        console.log("Error in sendMessage controller: ", error.message);
        res.status(500).json({error : "Internal Server Error"});
    }
}

export const getMessage = async(req,res) =>{
    try {

        const {id: userToChatId}= req.params // user we are chatting with
        // msg between us and him
        const senderId = req.user._id;

        const conversation = await Conversation.findOne({
            participants: {$all : [senderId,userToChatId]}
        }).populate("messages"); // instead of returning id of  array of message => it will return those array of objects
        // NOT REFERENCES    BUT ACTUAL MESSAGES 

        if(!conversation) return res.status(200).json({});

        const messages = conversation.messages;

        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessage controller: ", error.message);
        res.status(500).json({error : "Internal Server Error"});
    }
}