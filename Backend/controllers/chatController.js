const factory = require('../controllers/handlerFactory');
const Chat = require('../models/chatModel');
const catchAsync = require('../utils/catchAsync');

exports.getDetailChat = factory.getOne();
exports.updateChat = factory.updateOne(Chat);
exports.deleteChat = factory.deleteOne(Chat);
exports.getAllChat = factory.getAll(Chat);

exports.getCurrentChat = catchAsync(async (req, res, next) => {
  const chats = await Chat.findOne({
    participants: {
      $all: [req.user.id, '63b9a199b3610ba178b14557'],
    },
  });
  if (chats !== null) {
    res.status(201).json({
      status: 'success',
      length: chats.length,
      data: chats,
    });
  } else {
    res.status(201).json({
      status: 'success',
      length: 0,
      data: {},
    });
  }
});

exports.createChat = catchAsync(async (req, res, next) => {
  const chats = await Chat.findOne({
    participants: {
      $all: [req.user.id, '63b9a199b3610ba178b14557'],
    },
  });
  if (chats !== null) {
    res.status(201).json({
      status: 'success',
      length: chats.length,
      data: chats,
    });
  } else {
    const newChat = new Chat({
      participants: [req.user.id, '63b9a199b3610ba178b14557'],
      participantType: ['User', 'Admin'],
      messages: [
        {
          body: 'Bạn có muốn ADMIN hỗ trợ gì không?',
          contentType: 'text',
          senderId: '63b9a199b3610ba178b14557',
          senderEmail: 'admin@gmail.com',
          senderFullName: 'Lê Thành Đạt',
        },
      ],
    });

    await newChat.save();
    res.status(201).json({
      status: 'success',
      result: newChat.length,
      data: newChat,
    });
  }
});
exports.sendChat = catchAsync(async (req, res, next) => {
  const id = req.params.chatId;
  let doc = await Chat.findById(id);

  // Lấy ra thuộc tính messages
  const messages = doc.messages;
  // Thêm message mới vào mảng messages
  messages.push(req.body);
  // Lưu lại dữ liệu vào CSDL
  await doc.save();
  res.status(200).json({
    message: 'Send message successfully!',
    data: doc,
    statusCode: 201,
  });
});