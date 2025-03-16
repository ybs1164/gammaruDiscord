const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const { token, guildID, messageID } = require('./config.json');

const planningEmoji = '📃';
const artEmoji = '🎨';
const programmingEmoji = '💻';
const musicEmoji = '🎵';

function getEmojiToRole(guild, emojiName) {
    switch (emojiName) {
        case planningEmoji:
            return guild.roles.cache.find(r => r.name === "기획");
        case artEmoji:
            return guild.roles.cache.find(r => r.name === "아트");
        case programmingEmoji:
            return guild.roles.cache.find(r => r.name === "프로그래밍");
        case musicEmoji:
            return guild.roles.cache.find(r => r.name === "사운드");
        default:
            return null;
    }
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
    partials: [Partials.Channel, Partials.Reaction, Partials.Message]
});

client.commands = new Collection();

client.on('ready', async () => {
    console.log('Bot is ready');
    const guild = await client.guilds.fetch(guildID);

    await guild.members.fetch();

    for (let member in guild.members.cache) {
        const role = guild.roles.cache.find(r => r.name === "준회원(신입회원)");
        const role2 = guild.roles.cache.find(r => r.name === "정회원");

        if (!member.roles.cache.some(r => r == role)
         && !member.roles.cache.some(r => r == role2)
         && !member.user.bot) {
            try {
                member.roles.add(role);
                console.log(`Role ${role.name} added to ${member.user.username}`);
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (error) {
                console.error('Something went wrong when adding the role: ', error);
            }
        }
    }
});

client.on('messageReactionRemove', async (msg, user) => {
    if (user.bot) return;

    if (msg.message.id === messageID) {
        const guild = msg.message.guild;
        const member = await guild.members.fetch(user.id);
        let role = getEmojiToRole(guild, msg.emoji.name);

        if (member && role) {
            try {
                member.roles.remove(role);
                console.log(`Role ${role.name} removed to ${member.user.username}`);
            } catch (error) {
                console.error('Something went wrong when adding the role: ', error);
            }
        }
    }
});

client.on('messageReactionAdd', async (msg, user) => {
    if (user.bot) return;

    if (msg.message.id === messageID) {
        const guild = msg.message.guild;
        const member = await guild.members.fetch(user.id);
        let role = getEmojiToRole(guild, msg.emoji.name);

        if (member && role) {
            try {
                member.roles.add(role);
                console.log(`Role ${role.name} added to ${member.user.username}`);
            } catch (error) {
                console.error('Something went wrong when adding the role: ', error);
            }
        }
    }
});

client.login(token);