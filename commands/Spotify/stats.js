exports.run = (bot, message, suffix, help) => {
    var spotify = require("../../modules/spotify.js");
    var utility = require("../../modules/utility.js");

    if (help) {
        var embed = utility.createEmbed("Stats");
        embed.setDescription("More details for the **stats** command.");
        embed.addField("Command usage", "This command takes no parameters.");
        embed.addField("Description", "Get your most listened to artists, albums, etc.");
        return message.edit({ embed: embed });
    }

    var embed = utility.createEmbed("Spotify Stats", true);

    spotify.get("https://api.spotify.com/v1/me/top/artists?limit=3&time_range=long_term", function(body) {
        if (!body)
            return utility.error("Failed to get information", message);

        for (var i = 0; i < body.items.length; i++)
            embed.addField(`Top artist (All time) #${parseInt(i + 1)}`, body.items[i].name, true);

        spotify.get("https://api.spotify.com/v1/me/top/artists?limit=3&time_range=medium_term", function(body) {
            if (!body)
                return utility.error("Failed to get information", message);

            for (var i = 0; i < body.items.length; i++)
                embed.addField(`Top artist (6 Months) #${parseInt(i + 1)}`, body.items[i].name, true);

            spotify.get("https://api.spotify.com/v1/me/top/artists?limit=3&time_range=short_term", function(body) {
                if (!body)
                    return utility.error("Failed to get information", message);

                for (var i = 0; i < body.items.length; i++)
                    embed.addField(`Top artist (4 Weeks) #${parseInt(i + 1)}`, body.items[i].name, true);

                spotify.get("https://api.spotify.com/v1/me/top/tracks?limit=3&time_range=long_term", function(body) {
                    if (!body)
                        return utility.error("Failed to get information", message);

                    for (var i = 0; i < body.items.length; i++)
                        embed.addField(`Top song (All time) #${parseInt(i + 1)}`, body.items[i].name, true);

                    spotify.get("https://api.spotify.com/v1/me/top/tracks?limit=3&time_range=medium_term", function(body) {
                        if (!body)
                            return utility.error("Failed to get information", message);

                        for (var i = 0; i < body.items.length; i++)
                            embed.addField(`Top song (6 Months) #${parseInt(i + 1)}`, body.items[i].name, true);

                        spotify.get("https://api.spotify.com/v1/me/top/tracks?limit=3&time_range=short_term", function(body) {
                            if (!body)
                                return utility.error("Failed to get information", message);

                            for (var i = 0; i < body.items.length; i++)
                                embed.addField(`Top song (4 Weeks) #${parseInt(i + 1)}`, body.items[i].name, true);

                            message.edit({ embed: embed });
                        });
                    });
                });
            });
        });
    });
}