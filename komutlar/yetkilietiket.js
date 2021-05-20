const Discord = require('discord.js');
const db = require('quick.db');

exports.run = async (client, message, args) => {
 let kaytlog = message.mentions.channels.first()
if (!kaytlog) return message.channel.send('Lütfen Kayıt Log Kanalını Etiketlermisin?')
   
  db.set(`kaytlog_${message.guild.id}`, kaytlog.id)
  message.channel.send(`<a:Developing_ok:840282828058394634> | Kayıt Log Kanalı Başarıyla **${kaytlog}** Olarak Ayarlandı!`)
 };

exports.conf = {
 enabled: true,
 guildOnly: false,
 aliases: [],
 permLevel: 3,
};

exports.help = {
 name: 'etiket',
};