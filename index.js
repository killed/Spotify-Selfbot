"use strict";

// Libraries
const { Client } = require("discord.js");
const { readdir, readdirSync } = require("fs");

// Variables
var bot = new Client({ sync: false, fetchAllMembers: false });
const config = require("./data/config.json");

readdir("./commands/", (error, files) => {
    if (error)
        return console.log(error);

    var totalCommands = 0;

    files.forEach(file => {
        totalCommands += readdirSync(`./commands/${file}`).length;
    });

    console.log("[+] Loading a total of %d commands (%d categories)", totalCommands, files.length);
});

readdir("./events/", (error, files) => {
    if (error)
        return console.log(error);

    console.log("[+] Loading a total of %d events\r\n", files.length);

    files.forEach(file => {
        const eventName = file.split(".")[0];
        const event = require(`./events/${file}`);

        bot.on(eventName, event.bind(null, bot));
        delete require.cache[require.resolve(`./events/${file}`)];
    });
}); 

bot.login(config.discord.token);
bot.config = config;

module.exports.bot = bot;