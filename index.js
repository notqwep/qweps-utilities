const { Client, GatewayIntentBits, Partials } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const readline = require('readline');
const { join } = require('path');

// Client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
    ],
    partials: [Partials.Channel, Partials.Message],
});

// Configuration
const prefix = 'q.';
const token = 'MTQyMDIxNTEyNDUyNTk3NzY2MA.Gk4Xv5.S34zzSSFrqbuOEDwhbTX-Su3R--hYmzBsIBbu4';
const textChannelId = '1423485691593097238';
const guildId = '1423485690431406243';
const voiceChannelId = '1423485691593097239';

// Bot Ready
client.once('ready', async () => {
    console.log(`Welcome, ${client.user.tag}`);

    // Terminal Input
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout});
    rl.on('line', (input) => {
        const channel = client.channels.cache.get(textChannelId);
        if (channel) channel.send(input);
    });

    // Join Voice Channel
    const guild = client.guilds.cache.get(guildId);
    const voiceChannel = guild.channels.cache.get(voiceChannelId);
    if (voiceChannel) {
        joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: guild.id,
            adapterCreator: guild.voiceAdapterCreator,
        });
        console.log('Joined voice channel.')
    }
});

// Command Handler
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    // q.bean
    if (command === 'bean') {
        if (message.mentions.users.size < 1)
            return message.reply('You must mention a user to bean.');

        const target = message.mentions.users.first();
        await message.delete();

        // Confirmation message
        await message.channel.send(`Beaned ${target.user} (${target.id}). | Case ID \`69420\``);

        // Wait for the beaned user's next message
        const filter = m => m.author.id === target.id;
        const collector = message.channel.createMessageCollector({ filter, max: 1 });

        collector.on('collect', m => {
            m.react('🫘').catch(console.error);
        });
    }

    // q.ping
    if (command === 'ping') {
        const sent = await message.channel.send('Pinging...');
        const latency = sent.createdTimestamp - message.createdTimestamp;
        sent.edit(`**Pong!** Latency: \`${latency}ms\``);
    }

    // q.purge
    if (command === 'purge') {
        const deleteCount = parseInt(args[0]);
        if (isNaN(deleteCount) || deleteCount < 1 || deleteCount > 100)
            return message.reply('You cannot delete more than 100 messages at once. Please specify a number between 1 and 100.');

        await message.delete(); // Delete the command itself
        await message.channel.bulkDelete(deleteCount, true)
            .catch(err => console.error('Error deleting messages:', err));
    }

    // q.say
    if (command === 'say') {
        const text = args.join(' '); // Combines all arguments into one string
        if (!text) return; // Ignores the command if the user didn't type anything

        try {
            await message.delete(); // Deletes the q.say command message
            await message.channel.send(text); // If the user types something on the <text> argument, the bot will send the message
        } catch (error) {
            console.error('Cannot execute q.say command:', error);
        }
        return;
    }

    // q.the
    if (command === 'the') {
        await message.delete();
        message.channel.send('the');
    }

    // q.watermelon
    if (command === 'watermelon') {
        await message.delete().catch(console.error); // Deletes the command itself

        // Get the mentioned user
        const target = message.mentions.members.first();
        if (!target) return message.channel.send('You must mention a user to watermelon.');

        try {
            // Change the user's nickname to "watermelon"
            await target.setNickname('watermelon');
            message.channel.send(`Watermeloned ${target.user} (${target.id}). | Case ID \`69420\``);

            // Wait for the watermeloned user's next message
            const filter = (m) => m.author.id === target.id;
            const collector = message.channel.createMessageCollector({ filter, max: 1 });

            collector.on('collect', async (msg) => {
                await msg.react('🍉');
            });
        } catch (error) {
            console.error('Cannot execute q.watermelon:', error);
            message.channel.send(`Failed to watermelon ${target.user}.`);
        }
    }
});

// Bot Login
client.login(token);

// Keep-alive server (Render & UptimeRobot)
try {
    const express = require("express");
    const app = express();
    app.get("/", (req, res) => res.send("Bot is online."));
    app.listen(3000, () => console.log("Keep-alive server running."));
} catch (error) {
    console.log("Failed to start keep-alive server: an error has occurred or you do not have Express installed. If you haven't installed Express yet, please run 'npm install express' in your bot's folder.");
}
