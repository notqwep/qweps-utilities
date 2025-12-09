const fs = require('fs');
const path = require('path');

module.exports = (client) => {
	client.slashCommands = new Map();

	const slashFolder = path.join(__dirname, '..', 'slash');
	const files = fs.readdirSync(slashFolder).filter(f => f.endsWith('.js'));

	for (const file of files) {
		const cmd = require(path.join(slashFolder, file));
		client.slashCommands.set(cmd.data.name, cmd);
	}

	client.on('interactionCreate', async interaction => {
		if (!interaction.isChatInputCommand()) return;
		const cmd = client.slashCommands.get(interaction.commandName);
		if (!cmd) return;
		await cmd.execute(interaction);
	});
};