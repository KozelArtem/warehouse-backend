const TelegramBot = require('node-telegram-bot-api');
const config = require('config');

const {
  token,
  chatId,
} = config.telegram;

class Telegram {
  constructor() {
    this.bot = new TelegramBot(token, {});
  }

  send(message) {
    this.bot.sendMessage(chatId, message, { parse_mode: 'Markdown'});
  }
}

const bot = new Telegram();

module.exports = bot;
