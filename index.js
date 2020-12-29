const { Client, Collection } = require('discord.js'),
client = new Client(),
fs = require('fs');
const { token } = require('./config.json');

client.commands = new Collection();
client.aliases = new Collection();
client.categories = fs.readdirSync('./commands');
require(`./handlers/command`)(client);

client.on('message', async message => require('./events/guild/message.js')(client, message));
client.on('error', console.error);
client.login(token);
