const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('message')
		.setDescription('Message a user')
		.addUserOption(option =>
			option.setName('user')
				.setDescription('The user to message')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('message')
				.setDescription('Message to send')
				.setRequired(true)),

	async execute(interaction) {
		const user = interaction.options.getUser('user');
		const text = interaction.options.getString('message');

		try {
			await user.send(text);

			await interaction.reply({
				content: 'Message delivered.',
				ephemeral: true
			});
		} catch {
			await interaction.reply({
				content: `**Your message was not delivered.** The user has either turned off direct messages from this server, changed their privacy settings, or has blocked me.`,
				ephemeral: true
			});
		}
	}
};