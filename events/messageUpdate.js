module.exports = (bot, oldMessage, newMessage) => {
    const { readdirSync, existsSync } = require("fs");
    const utility = require("../modules/utility.js");
    
    if (oldMessage.author.id !== bot.user.id)
    	return;

    if (newMessage.content.startsWith(bot.config.discord.trigger)) {
        var content = newMessage.content.replace(/  /g, " ");

        while (content.includes("  "))
            content = content.replace(/  /g, " ");

        const categories = readdirSync(`${__dirname}/../commands/`);
        const command = content.split(" ")[0].substring(bot.config.discord.trigger.length).toLowerCase();
        const suffix = content.substring(command.length + bot.config.discord.trigger.length + 1);

        if (command == "help") {
            if (suffix) {
                categories.forEach(category => {
                    try {
                        var path = `${__dirname}/../commands/${category}/${suffix}.js`;

                        if (existsSync(path)) {
                            require(path).run(bot, newMessage, suffix, true);
                            delete require.cache[require.resolve(path)];
                        }
                    } catch (error) {
                        console.log(error.stack);
                    }
                });
            } else {
                var commands = [];

                categories.forEach(category => {
                    commands.push(readdirSync(`./commands/${category}/`).join(", ").replace(/.js/g, ""));
                });

                utility.sendHelp(categories, commands, newMessage);
            }
        } else {
            categories.forEach(category => {
                try {
                    var path = `${__dirname}/../commands/${category}/${command}.js`;

                    if (existsSync(path)) {
                        require(path).run(bot, newMessage, suffix, false);
                        delete require.cache[require.resolve(path)];
                    }
                } catch (error) {
                    console.log(error.stack);
                }
            });
        }
    }
}