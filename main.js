const express = require("express");
const app = express();

const { Client, Collection, Intents } = require('discord.js');
const fs = require('fs');
const db = require('pro.db');
const data = require("./config.json"); // Getting normal data from config.json

// The client
let client = new Client({ 
    partials: ["MESSAGE", "CHANNEL", "REACTION"], 
    intents: [ 
        Intents.FLAGS.GUILDS, 
        Intents.FLAGS.GUILD_MEMBERS, 
        Intents.FLAGS.GUILD_BANS, 
        Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, 
        Intents.FLAGS.GUILD_INTEGRATIONS, 
        Intents.FLAGS.GUILD_WEBHOOKS, 
        Intents.FLAGS.GUILD_INVITES, 
        Intents.FLAGS.GUILD_VOICE_STATES, 
        Intents.FLAGS.GUILD_PRESENCES, 
        Intents.FLAGS.GUILD_MESSAGES, 
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS, 
        Intents.FLAGS.GUILD_MESSAGE_TYPING, 
        Intents.FLAGS.DIRECT_MESSAGES, 
        Intents.FLAGS.DIRECT_MESSAGE_REACTIONS, 
        Intents.FLAGS.DIRECT_MESSAGE_TYPING 
    ] 
});

module.exports = client;

// When the bot is ready
client.on('ready', async () => {
    const fetchs = await db.fetchAll();

    for (let i in fetchs) {
        if (i.startsWith("buying_")) {
            db.delete(i);
        }
    }

    // Register commands here
    const commandData = [
        {
            name: 'come',
            description: 'Asks a user to come to the channel',
            options: [
                {
                    name: 'user',
                    description: 'The user you want to ask to come to the channel',
                    type: 6,
                    required: true
                }
            ]
        }
    ];

    const guildId = '1143976452593832077'; // Replace with your guild ID
    const guild = client.guilds.cache.get(guildId);
    if (guild) {
        await guild.commands.set(commandData);
        console.log('Slash commands registered.');
    }
});

// Command execution
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'come') {
        // Check if the user has permission to manage messages
        if (!interaction.member.permissions.has('MANAGE_MESSAGES')) {
            return interaction.reply("You're missing the required permission to use this command.");
        }

        // Get the user mentioned in the command
        const user = interaction.options.getMember('user');
        if (!user) {
            return interaction.reply({ content: '**Usage: /come @user**', ephemeral: true });
        }

        // Send a DM to the user
        try {
            await user.send(`**Please come to <#${interaction.channel.id}> for ${interaction.member}**`);
            return interaction.reply({ content: `**? Done. Sent to ${user}.**`, ephemeral: true });
        } catch (error) {
            return interaction.reply({ content: `**? Can't send a message to ${user}. They might have DMs disabled.**`, ephemeral: true });
        }
    }
});
client.on('messageCreate', message => {
	const channelid = ["1301020590508871761"]
	if(channelid.includes(message.channel.id) && !message.author.bot){
	  const args = message.content.split(" ").join( )
	  const args2 = args.replace("k", "000").replace("K", "000").replace("m", "000000").replace("M", "000000").replace("b", "000000000000").replace("B", "000000000000")
	  const tax  = Math.floor(args2 * (20) / (19) + (1))
	  const tax2  = Math.floor(args2 * (20) / (19) +(1) - (args2))
	  const tax3  = Math.floor(tax2 * (20) / (20))
	  if(!args.endsWith("k") && !args.endsWith("K") && !args.endsWith("m") && !args.endsWith("M") && !args.endsWith("b") && !args.endsWith("B") && isNaN(args)) return message.delete()
	message.reply(` **
	>  Number without tax : ${args2}
	> Tax number : ${tax3}
	>  Number with tax : ${tax}
	**`)
	}
	})
// Commands && SlashCommands && Events Handling and Initializing The Whole Project
client.config = data;
client.commands = new Collection();
client.aliases = new Collection();
client.events = new Collection();
client.slashCommands = new Collection();
client.queue = new Map();

// Require command and event handlers
require(`./source/handlers/cmdHandler/command.js`)(client);
require(`./source/handlers/slashHandler/slash.js`)(client);
require(`./source/handlers/eventHandler/events.js`)(client);

// Handling errors
process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});
process.on('typeError', error => {
    console.error('Unhandled type rejection:', error);
});

// Log in the client
client.login("token");
