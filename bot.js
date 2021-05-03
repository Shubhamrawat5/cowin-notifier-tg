const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
require("dotenv").config();

const token = process.env.BOT_TOKEN; //tg bot token here
const kryptonChatId = 649341653;
const channelChatId = "@chamolicowid18notifier";
const bot = new TelegramBot(token, { polling: false });

bot.sendMessage(kryptonChatId, "Bot starting!");
bot.sendMessage(channelChatId, "Bot starting!");

const getData = async (url) => {
  console.log("GETTING DATA!");
  let date = Date().slice(8, 10) + "-05-2021"; //03-05-2021
  url = url + date;
  const { data } = await axios.get(url);
  //   console.log(data);

  const centers = data.centers;

  bot.sendMessage(kryptonChatId, "==========START==========");
  //    wait of 1 sec
  await new Promise(function (resolve) {
    setTimeout(resolve, 2000);
  });

  //   FOR EVERY CENTER
  centers.forEach(async (center, index) => {
    // let message = `center: ${index}/${centers.length}\n`;
    const name = center.name;
    const block_name = center.block_name;
    const pincode = center.pincode;
    const district_name = center.district_name;
    const sessions = center.sessions;

    // FOR EVERY SESSION
    sessions.forEach((session) => {
      const min_age_limit = session.min_age_limit;
      const date = session.date;
      const available_capacity = sessions.available_capacity;
      const vaccine = sessions.vaccine;
      const slots = sessions.slots;

      let message = `Hospital: ${name}\n`;
      message = message + `Block: ${block_name}\n`;
      message = message + `Pincode: ${pincode}\n`;
      message = message + `District: ${district_name}\n`;
      message = message + `Date: ${date}\n`;
      message = message + `Available Capacity: ${available_capacity}\n`;
      message = message + `Vaccine: ${vaccine}\n`;
      message = message + `Min-age: ${min_age_limit}\n`;

      if (min_age_limit === 18) {
        bot.sendMessage(channelChatId, "SLOT AVAILABLE FOR 18 AGE !!!!!!");
        bot.sendMessage(channelChatId, message);
      } else {
        bot.sendMessage(kryptonChatId, message);
      }
    });
  });

  //    wait of 1 sec
  await new Promise(function (resolve) {
    setTimeout(resolve, 2000);
  });

  bot.sendMessage(kryptonChatId, "===========END===========");
};

let chamoliUrl =
  "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=699&date=";
let pauriUrl =
  "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=246001&date=";

getData(chamoliUrl);
getData(pauriUrl);
setInterval(() => getData(chamoliUrl), 3600000); //1 hour gap
setInterval(() => getData(pauriUrl), 3600000); //1 hour gap
