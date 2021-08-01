exports.run = (bot, message, suffix, help) => {
	var utility = require("../../modules/utility.js");

	if (help) {
		var embed = utility.createEmbed("Evaluate");
		embed.setDescription("More details for the **eval** command.");
		embed.addField("Command usage", `${bot.config.discord.trigger}eval <code>`);
		embed.addField("Description", "Evaluate some arbitrary Javascript code and return the output.");
		return message.edit({ embed: embed });
	}

	if (!suffix)
		return utility.parameters("exec", message);

	var embed = utility.createEmbed("Evaluate");
	embed.setDescription("Evaluate some arbitrary Javascript code and return the output.");
	embed.addField("Code input", suffix.trim());

	try {
		const before = Date.now();
		var evaled = eval(suffix.trim());
		const duration = Date.now() - before;

		if (typeof(evaled) != "string")
			evaled = require("util").inspect(evaled);

		const completed = duration == 0 ? "" : ` (Completed in ${duration}ms)`;

		if (evaled)
			embed.addField(`Output${completed}`, evaled);
		else
			message.delete();
	} catch (err) {
		embed.addField("Output", err);
	}

	message.edit({ embed: embed });
};
