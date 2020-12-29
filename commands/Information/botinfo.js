const Discord = require('discord.js');
const pkg = require(__basedir + '/package.json');
const { mem, cpu, os } = require('node-os-utils');
const { stripIndent } = require('common-tags');
const parseMs = require('parse-ms');

module.exports = {
    name: 'botinfo',
    aliases: ['bi'],
    run: async (client, message) => {
      const embed = new MessageEmbed()
      .setTitle('Fetching Information (Please Wait)')
      .setColor('#a8e3e7');

    const uptime = Object.entries(parseMs(client.uptime)).filter(([key, value]) => key !== "milliseconds" && value > 0).map(([key, value]) => `${value} ${key[0].toUpperCase()}${value === 1 ? key.slice(1, -1) : key.slice(1)}`).join(', ');
    const { totalMemMb, usedMemMb } = await mem.info();
    const prefix = message.client.db.settings.selectPrefix.pluck().get(message.guild.id);
    const msg = await message.channel.send(embed);
    const timestamp = message.editedTimestamp || message.createdTimestamp;   

    const team = stripIndent`
  Main Developers
  • Extreme#1000
  • DevNoah#0001
  • Voltrex Master#0001`;
  
    const mainInfo = stripIndent`
    WS Ping ----- ${Math.round(client.ws.ping)}ms
    Uptime ------ ${uptime}
    Version ----- ${pkg.version}
    Library ----- Discord.js v${Discord.version}
    Enviorment -- Node.js ${process.version}
    -
    Servers ----- ${client.guilds.cache.size.toLocaleString()}
    Users ------- ${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString()}
    Shards ------ ${client.shard.count.toLocaleString()}
    Channels ---- ${client.channels.cache.size.toLocaleString()}
    Commands ---- ${client.commands.size.toLocaleString()}
    Aliases ----- ${client.aliases.size.toLocaleString()}
  `;

    const additionalInfo = stripIndent`
    Platform -- ${(await os.oos())}
    CPU ------- ${cpu.model()}
    `;

  const memoryUsage = Object.entries(process.memoryUsage()).map(([key, value]) => `${`${key[0].toUpperCase()}${key.slice(1)}`.padEnd(19, '-')} ${value / 1024 / 1024}MB`).join('\n');

    embed
    .setAuthor(message.author.tag, message.author.displayAvatarURL({
       dynamic: true,
       size: 1024,
       format: 'png'
    }))
    .setTitle(`${client.user.username}'s information`)
    .addField('Bot information', `\`\`\`css\n${mainInfo}\n\`\`\``, false)
    .addField(`${client.user.username}'s team`, `\`\`\`css\n${team}\n\`\`\``, false)
    .addField('System statistics', `\`\`\`css\n${additionalInfo}\n\`\`\``, false)
    .addField('Memory usage', `\`\`\`css\n${memoryUsage}\n\`\`\``, false)
    .setFooter(`${client.user.username} - ${pkg.version}`)
    .setTimestamp()
    .setColor('#a8e3e7');
    
    return msg.edit(embed);
  }
};
