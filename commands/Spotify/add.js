exports.run = (bot, message, suffix, help) => {
    var spotify = require("../../modules/spotify.js");
    var utility = require("../../modules/utility.js");

    if (help) {
        var embed = utility.createEmbed("Add");
        embed.setDescription("More details for the **add** command.");
        embed.addField("Command usage", `${bot.config.discord.trigger}add <song> <playlist name>`);
        embed.addField("Description", "Easily add a song to the given playlist.");
        return message.edit({ embed: embed });
    }

    if (!suffix)
        return utility.parameters("add", message);

    suffix = suffix.split(" ");

    var songId = suffix[0].split("/")[4].split("?")[0];

    if (!songId)
        return utility.error("Invalid song", message);

    if (!suffix[1])
        return utility.error("Invalid playlist name", message);

    spotify.getPlaylists(function(playlists) {
        if (!playlists)
            return utility.error("Failed to get playlist", message);

        for (var i = 0; i < playlists.length; i++) {
            if (playlists[i].name.toLowerCase() == suffix[1].toLowerCase()) {
                spotify.addSongToPlaylist(playlists[i].uri.split(":")[2], ["spotify:track:" + songId], function(successful) {
                    if (!successful)
                        return utility.error("Failed to add song to playlist", message);

                    utility.success("Successfully added song to playlist", message);
                });
            }
        }
    });
}