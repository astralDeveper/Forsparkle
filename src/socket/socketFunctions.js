const Conversation = require("../models/Conversation.js");
const Online = require("../models/Online.js");

const setUserOnline = async (data) => {
  try {
    let userExists = await Online.findOne({ user: data?.userId });

    if (userExists) {
      userExists.socketId = data?.socketId;
      userExists.isOnline = true;
      await userExists.save();
      return;
    }

    await Online.create({
      user: data?.userId,
      socketId: data?.socketId,
      isOnline: true,
    });
  } catch (error) {
    throw new Error("");
  }
};

const setUserOffline = async (data) => {
  try {
    await Online.findOneAndDelete({ socketId: data?.socketId });
  } catch (error) {
    throw new Error("");
  }
};

const insertChat = async (data) => {
  try {

    let chats = await Conversation.find({
      participants: data?.from
    });

    console.log(chats)

    if (chats?.length) {
      chats.forEach(async (item) => {
        console.log(item)
        if (!item?.participants?.includes(data?.to?.toString())) {
          console.log("deleting conv")
          await Conversation.findByIdAndDelete(item._id);
        }
      })
    }

    let chat = await Conversation.findOne({
      participants: { $all: [data?.from, data?.to] }
    });

    if (chat) {
      chat.messages.push({
        sender: data?.from,
        content: data?.content,
      });
      await chat.save();
      return;
    }

    await Conversation.create({
      participants: [data?.from, data?.to],
      messages: [
        {
          sender: data?.from,
          content: data?.content,
        },
      ],
    });

    return



  } catch (error) {
    throw new Error("");
  }
}

const getOnlineReceipt = async (data) => {
  console.log(data)
  try {
    let user = await Online.findOne({ user: data?.userId });
    if (user) {
      return user
    }
    return null;
  } catch (error) {
    throw new Error("");
  }
}


module.exports = {
  setUserOnline,
  setUserOffline,
  insertChat,
  getOnlineReceipt,
}