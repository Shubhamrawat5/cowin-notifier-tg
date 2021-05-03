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
  let date = Date().slice(8, 10) + "-05-2021";
  url = url + date;
  const { data } = await axios.get(url);
  //   console.log(data);

  const centers = data.centers;

  await bot.sendMessage(kryptonChatId, "==========START==========");

  centers.forEach(async (center, index) => {
    let message = `center: ${index}/${centers.length}\n`;
    const name = center.name;
    const block_name = center.block_name;
    const pincode = center.pincode;
    const district_name = center.district_name;
    const sessions = center.sessions[0];
    const min_age_limit = sessions.min_age_limit;
    const date = sessions.date;
    const available_capacity = sessions.available_capacity;
    const vaccine = sessions.vaccine;
    const slots = sessions.slots;

    message = message + `Hospital: ${name}\n`;
    message = message + `Block: ${block_name}\n`;
    message = message + `Pincode: ${pincode}\n`;
    message = message + `District: ${district_name}\n`;
    message = message + `Date: ${date}\n`;
    message = message + `Available Capacity: ${available_capacity}\n`;
    message = message + `Vaccine: ${vaccine}\n`;
    message = message + `Min-age: ${min_age_limit}\n`;
    console.log("MIN_AGE_LIMIT: " + min_age_limit);

    if (min_age_limit === 18) {
      //SLOT FOUND! POST IN CHANNEL
      await bot.sendMessage(channelChatId, message);
    } else {
      //NO SLOT! INFORM MYSELF
      await bot.sendMessage(kryptonChatId, message);
    }
  });
  await bot.sendMessage(kryptonChatId, "===========END===========");
};

let url =
  "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=699&date=";

getData(url);
setInterval(() => getData(url), 1800000); //30 min gap
