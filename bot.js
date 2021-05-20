const discord = require('discord.js');
const fs = require('fs');
const http = require('http');
const db = require('quick.db');
const moment = require('moment')
const express = require('express');
const ayarlar = require('./ayarlar.js');
const app = express();
app.get("/", (request, response) => {
response.sendStatus(200);
});
app.listen(process.env.PORT);


//READY.JS

const Discord = require('discord.js');
const client = new Discord.Client();
client.on('ready', async () => {
   client.appInfo = await client.fetchApplication();
  setInterval( async () => {
    client.appInfo = await client.fetchApplication();
  }, 600);
  
 client.user.setActivity(`Developing ❤ Ege`, { type:'WATCHING' })
  
  console.log("Bot Aktif Oç!")
});

const log = message => {
  console.log(` ${message}`);
};
require('./util/eventLoader.js')(client);

//READY.JS SON

//KOMUT ALGILAYICI

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./komutlar/', (err, files) => {
    if (err) console.error(err);
    log(`${files.length} komut yüklenecek.`);
    files.forEach(f => {
        let props = require(`./komutlar/${f}`);
        log(`Yüklenen komut: ${props.help.name}.`);
        client.commands.set(props.help.name, props);
        props.conf.aliases.forEach(alias => {
            client.aliases.set(alias, props.help.name);
        });
    });
});




client.reload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./komutlar/${command}`)];
            let cmd = require(`./komutlar/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
           reject(e);
        }
    });
};

client.load = command => {
    return new Promise((resolve, reject) => {
        try {
            let cmd = require(`./komutlar/${command}`);
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};




client.unload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./komutlar/${command}`)];
            let cmd = require(`./komutlar/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

//KOMUT ALGILAYICI SON

client.elevation = message => {
    if (!message.guild) {
        return;
    }
    let permlvl = 0;
    if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
    if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
    if (message.author.id === ayarlar.sahip) permlvl = 4;
    return permlvl;
};
client.login(process.env.TOKEN)


//-----------------------KOMUTLAR-----------------------\\
//HG MESAJI

client.on("guildMemberAdd", member => {
  const moment = require("moment");
  const kanal = ayarlar.giriskanal;
  let user = client.users.cache.get(member.id);
  require("moment-duration-format");
  const tarih = new Date().getTime() - user.createdAt.getTime();
  let rol = ayarlar.kayıtsızrol;
  member.roles.add(rol); //splashen

  var kontrol;
if (tarih < 1296000000) kontrol = "__**Bu Kullanıcı Şüpheli**__ <a:onemli_developing:840294832106635295>";
if (tarih > 1296000000) kontrol = "__**Bu Kullanıcı Güvenli**__ <a:Developing_onay:840296510976950282>";
  moment.locale("tr");
  let kanal1 = client.channels.cache.get(kanal);
  let giris = new Discord.MessageEmbed()
    .setTitle(`\`Sunucuya Yeni Bir Üye Katıldı!\``)
    .setDescription(
      `
✣ \<a:girisss:840297840165257216>** __Hoşgeldin! ${member}__ **

✣ **__Seninle Birlikte ${member.guild.memberCount} Kişiyiz.__ **

✣ <a:Developing_isaret:840271634476171294> \`{ ${ayarlar.tag} }\`** __Tagımızı alarak ekibimize katılabilirsin.__ <a:Developing_isaret:840271634476171294> **

✣ ** <@&${ayarlar.KayitYetkilisi}> __seninle ilgilenicektir.__ <a:KalpGif:840281883006074901>**

✣ <a:Developing_yldz:839861931895423006>** __Hesabın Oluşturulma Tarihi:__**<a:Developing_yldz:839861931895423006> \n • \` ${moment(
        member.user.createdAt
      ).format("YYYY DD MMMM dddd (hh:mm:ss)")} \`

✣ ${kontrol}

✣ ** <a:ykleme:840296459090001980> __ses teyit odasında kaydınızı yaptırabilirsiniz.__ <a:ykleme:840296459090001980> **

`
    ) //splashen
    .setThumbnail(
      member.user.avatarURL() ||
        ""
    )
    .setImage(
      ""
    )
    .setTimestamp();
  kanal1.send(giris);
});

//HG MESAJI SON7

//etiket//
client.on("guildMemberAdd", async message => {
  let yetkilihgmesajı = db.fetch(`kaytlog_${message.guild.id}`)
  client.channels.cache.get(yetkilihgmesajı).send(`<@&841288436623343637>`);
});
//etiket son//

//OTOROL OTOİSİM

client.on("guildMemberAdd", member => {
  var rol = ayarlar.kayıtsızrol
   member.roles.add(rol)
   member.setNickname("İsim | Yaş")   
   })

//OTOROL OTOİSİM SON


//BOTU SESTE TUTMA

client.on("ready", async () => {
  console.log("Bot Başarıyla Ses Kanalına Bağlandı")
  let botVoiceChannel = client.channels.cache.get("844464094061133824");
  if (botVoiceChannel) botVoiceChannel.join().catch(err => console.error("Bot ses kanalına bağlanırken bir hata oluştu!"));
});

//BOTU SESTE TUTMA