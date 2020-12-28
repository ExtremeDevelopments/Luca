const humanizeDuration = require('humanize-duration')
const shortEnglishHumanizer = humanizeDuration.humanizer({
    language: 'shortEn',
    languages: {
        shortEn: {
            y: () => 'y',
            mo: () => 'm',
            w: () => 'w',
            d: () => 'd',
            h: () => 'h',
            m: () => 'm',
            s: () => 's',
            ms: () => 'ms',
        },
    },
});

const Timeout = new Map();
const { MessageEmbed, Discord } = require('discord.js');
const { prefix } = require('../../config.json');
const ms = require('ms')


module.exports = async(client, message) => {
    if(message.channel.type === "dm") return;

    if(!message.content.toLowerCase().startsWith(prefix)) return;

    if(!message.member) message.member = await message.guild.fetchMember(message);
    if(!message.guild) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    if(cmd.length === 0) return;

    let command = client.commands.get(cmd) || client.commands.find(a => a.aliases && a.aliases.includes(cmd));
    if(!command) return;

    if (!command.timeout) return command.run(client, message, args);

    const key = message.author.id + command.name;
    const found = Timeout.get(key);
    const timeout = command.timeout;

    if (found) {
        const timePassed = Date.now() - found;
        const timeLeft = timeout - timePassed;
        const embed = new MessageEmbed()
            .setAuthor('Cooldown Alert', message.author.displayAvatarURL())
            .setColor('#7289DA')
            .setDescription(`Woah there! You are currently on **Command Cooldown**\nYou can only use this command every **${ms(command.timeout)}** \nPlease wait **${humanizeDuration(timeLeft, { maxDecimalPoints: 1 })}**`)
            .setFooter(client.user.username, client.user.displayAvatarURL())
        message.channel.send(embed)
    } else {
        command.run(client, message, args);
        Timeout.set(key, Date.now());

        setTimeout(() => {
            Timeout.delete(key);
        }, command.timeout);
    }

}