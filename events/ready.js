module.exports = (bot, message) => {
    const { refreshToken } = require("../modules/spotify.js");

    console.log("[+] Logged in as: %s", bot.user.tag);
    console.log("[?] Bot trigger: %s", bot.config.discord.trigger);
    console.log("[?] Servers: %d\r\n", bot.guilds.cache.size);

    refreshToken(function() {});

    setInterval(() => {
        refreshToken(function(successful) {
            if (!successful)
                console.log("[Spotify] Failed to get access token");
        });
    }, 1000 * 60 * 5);
}