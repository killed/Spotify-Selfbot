"use strict";

// Libraries
const { MessageEmbed } = require("discord.js");

// Includes
var index = require("../index.js");

module.exports.createEmbed = function(title, avatar = true) {
    var embed = new MessageEmbed();

    if (avatar)
        embed.setThumbnail(index.bot.user.avatarURL);

    embed.setTimestamp();
    embed.setColor(0x6f4aec);
    embed.setTitle(`${index.bot.user.username} - ${title}`);
    embed.setFooter(index.bot.user.username, index.bot.user.avatarURL);

    return embed;
}

module.exports.error = function(error, message) {
    var embed = this.createEmbed("Error on command", false);
    embed.setDescription(`:x: | ${error}`);
    message.edit("", { embed: embed });
}

module.exports.success = function(success, message) {
    var embed = this.createEmbed("Command completed", false);
    embed.setDescription(`:white_check_mark: | ${success}`);
    message.edit("", { embed: embed });
}

module.exports.parameters = function(command, message) {
    this.error(`Missing parameter(s), use \`${index.bot.config.discord.trigger}help ${command}\`.`, message);
}

module.exports.sendHelp = function(categories, commands, message) {
    var embed = this.createEmbed("Help");
    var commandsCount = 0;

    for (var i in categories) {
        commandsCount += commands[i].split(", ").length;
        
        embed.addField(`${categories[i]} commands (${commands[i].split(", ").length})`, commands[i]);
    }

    embed.setDescription(`Below is a list of all my commands (${commandsCount} total), to see more about a command or how to use it simply issue \`${index.bot.config.discord.trigger}help <command name>\` and you'll see its usage.`);
    message.edit({ embed: embed });
}