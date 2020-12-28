const Discord = require('discord.js')
const pkg = require(__basedir + '/package.json');
const { mem, cpu, os } = require('node-os-utils');
const moment = require('moment');
const { oneLine, stripIndent } = require('common-tags');
const { Shard } = require('discord.js');

module.exports = {
    name: "botinfo",
    aliases: ["bi"],
    run: async(client, message) => {

    const embed = new MessageEmbed()
      .setTitle('Fetching Information (Please Wait)')
      .setColor('#a8e3e7');

    const d = moment.duration(message.client.uptime);
    const days = (d.days() == 1) ? `${d.days()} day` : `${d.days()} days`;
    const hours = (d.hours() == 1) ? `${d.hours()} hour` : `${d.hours()} hours`;
    const { totalMemMb, usedMemMb } = await mem.info();
    const prefix = message.client.db.settings.selectPrefix.pluck().get(message.guild.id);
    const msg = await message.channel.send(embed);
    const timestamp = (message.editedTimestamp) ? message.editedTimestamp : message.createdTimestamp;   

    const details = stripIndent`
  Main Developers
  • Extreme#1000
  • DevNoah#0001`;
  
    const info2 = stripIndent`
    WS Ping ----- ${Math.round(message.client.ws.ping)}ms
    Uptime ------ ${days} and ${hours}
    Version ----- ${pkg.version}
    Library ----- Discord.js v12.4.1
    Enviorment -- Node.js v14.4.0
    -
    Servers ----- ${message.client.guilds.cache.size}
    Users ------- ${message.client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString()}
    Shards ------ ${message.client.shard.count}
    Channels ---- ${message.client.channels.cache.size}
    Commands ---- ${message.client.commands.size}
    Aliases ----- ${message.client.aliases.size}
  `;

    const stats1 = stripIndent`
    Platform -- ${await os.oos()}
    CPU ------- ${cpu.model()}
    `;

  const stats2 = stripIndent`
Rss --------------- ${(process.memoryUsage().rss / (1024 * 1024)).toFixed()}MB
HeapTotal --------- ${(process.memoryUsage().heapTotal / (1024 * 1024)).toFixed()}MB
HeapUsed ---------- ${(process.memoryUsage().heapUsed / (1024 * 1024)).toFixed()}MB
External ---------- ${(process.memoryUsage().external / (1024 * 1024)).toFixed()}MB
  `;
    embed
    .setAuthor(`${message.member.user.tag}`, `${message.author.displayAvatarURL({ dynamic: true })}`)
    .setTitle(`Sailboat's Information `)
        .addField('Bot Information', `\`\`\`css\n${info2}\`\`\``, true)
        .addField('Sailboat\'s Team', `\`\`\`css\n${details}\`\`\``, true)
        .addField('System Statistics', `\`\`\`css\n${stats1}\`\`\``, false)
        .addField('Memory Usage', `\`\`\`css\n${stats2}\`\`\``, false)
        .setFooter(`Sailboat - ${pkg.version}`)
      .setTimestamp()
      .setColor('#a8e3e7')
      msg.edit(embed);
  }
}
    