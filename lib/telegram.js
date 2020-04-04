const TelegramBot = require('node-telegram-bot-api');
const config = require('config');

const {
  token,
  chatId,
} = config.telegram;

const bot = new TelegramBot(token, { polling: true });

const sendMessage = (message) => {
  bot.sendMessage(chatId, message, { parse_mode: 'Markdown'});
};

module.exports = {
  sendMessage,
};
