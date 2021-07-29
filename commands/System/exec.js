exports.run = (bot, message, suffix, help) => {
	var utility = require("../../modules/utility.js");
	var execute = require("child_process").exec;

	if (help) {
		var embed = utility.createEmbed("Execute");
		embed.setDescription("More details for the **exec** command.");
		embed.addField("Command usage", `${bot.config.discord.trigger}exec <command(s)>`);
		embed.addField("Description", "Execute system commands.");
		return message.edit({ embed: embed });
	}

	if (!suffix)
		return utility.parameters("exec", message);

	execute(suffix.trim(), function(err, stdout, stderr) {
		const result = (stdout ? stdout : stderr);

		if (result.length > 1)
			message.edit(`\`\`\`\n${result}\n\`\`\``);
		else
			message.delete();
	});
};
