exports.run = (bot, message, suffix, help) => {
    var spotify = require("../../modules/spotify.js");
    var utility = require("../../modules/utility.js");

    if (help) {
        var embed = utility.createEmbed("Clone");
        embed.setDescription("More details for the **clone** command.");
        embed.addField("Command usage", `${bot.config.discord.trigger}clone <url>`);
        embed.addField("Description", "Easily clone spotify playlists to your own account.");
        return message.edit({ embed: embed });
    }

    if (!suffix)
        return utility.parameters("clone", message);

    var playlistId = suffix.split("/")[4].split("?")[0];

    if (!playlistId)
        return utility.error("Invalid playlist", message);

    spotify.clonePlaylist(playlistId, function(successful) {
        if (!successful)
            return utility.error("Failed to clone playlist", message);

        utility.success("Successfully cloned playlist", message);
    });
}