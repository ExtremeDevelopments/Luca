const {readdirSync, readdir} = require('fs');
const ascii = require("ascii-table");

let table = new ascii("Luca - Client Status");
module.exports = (client) => {
    readdirSync('./commands').forEach(dir=>{
        const commands = readdirSync(`./commands/${dir}/`).filter(file=>file.endsWith('.js'));
        for(let file of commands){
            let pull = require(`../commands/${dir}/${file}`);
            if(pull.name){
                client.commands.set(pull.name, pull);
                table.addRow("✅ ONLINE", file, "✔️ Command Loaded") //❌
            } else {
                table.addRow("⚠️ OFFLINE", file, `❌ Error loading`)
                continue;
            } if(pull.aliases && Array.isArray(pull.aliases)) pull.aliases.forEach(aliases => client.aliases.set(aliases, pull.name));

        }
    })
    console.log(table.toString());
}