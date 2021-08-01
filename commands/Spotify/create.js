exports.run = (bot, message, suffix, help) => {
    var spotify = require("../../modules/spotify.js");
    var utility = require("../../modules/utility.js");

    if (help) {
        var embed = utility.createEmbed("Create");
        embed.setDescription("More details for the **create** command.");
        embed.addField("Command usage", `${bot.config.discord.trigger}create <email> <username> <password>`);
        embed.addField("Description", "Create an old Spotify account with a actual username instead of a random string.");
        return message.edit({ embed: embed });
    }

    if (!suffix)
        return utility.parameters("create", message);

    suffix = suffix.split(" ");

    if (suffix.length < 2)
        return utility.parameters("create", message);

    spotify.create(suffix[0], suffix[1], suffix[2], function(successful, response) {
        if (!successful)
            return utility.error(response, message);

        utility.success(response, message);
    });
}