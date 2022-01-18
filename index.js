"use_strict";

const Discord = require("discord.js");
const config = require("./config.json");
const { MessageEmbed } = require("discord.js");
const { REPL_MODE_SLOPPY } = require("repl");

const completemsg = `Merci d'avoir vérifié votre compte contre les robots ! Vous êtes maintenant un membre vérifié de Guilde Epikube !`;

const shortcode = (n) => {
  const possible = "ABCDEFGHIJKLMNPQRSTUVWXYZ0123456789";
  let text = "";
  for (var i = 0; i < n + 1; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
};

const client = new Discord.Client();

client.on("ready", () => {
  console.log(
    `[Verification] Connecté : ${client.user.username}#${client.user.discriminator} ${client.user.id}`
  );
});

client.on("guildMemberAdd", (member) => {
  member.roles.add(config.role);

  if (member.user.bot || member.guild.id !== config.guild) return;

  const bvn = member.guild.channels.cache.find(
    (channel) => channel.name === "➢『📚』vérification"
  );
  bvn
    .send(
      `👋 Bienvenue à toi ${member}, vous avez reçu un code en privé pour vérifier votre compte \n **⚠️ ATTENTION :** Vous devez activer le mode **Autoriser les messages privés venant des membres du serveur** dans vos paramètres`
    )
    .then((msg) => msg.delete({ timeout: 15000 }));

  const token = shortcode(3);
  const verif = new MessageEmbed()
    .setTitle("Vérification")
    .setDescription(
      `Bienvenue ${member} \n pour vérifier que vous n'êtes pas un robot, vous devez reécrire le code ci-dessous : \n **${token}**`
    );

  console.log("");

  console.log(
    `${member.user.username}#${member.user.discriminator} a rejoint le serveur! CODE: "${token}"`
  );
  member.send(verif).then((msg) => msg.delete({ timeout: 30000 }));
  member.user.token = token;
});

const verifymsg = "{token}";

client.on("message", (message) => {
  var server = client.guilds.cache.get(config.guild);

  if (
    message.author.bot ||
    !message.author.token ||
    message.channel.type !== `dm`
  )
    return;

  if (message.content !== verifymsg.replace("{token}", message.author.token)) {
    message.channel
      .send("Code mauvais !")
      .then((msg) => msg.delete({ timeout: 10000 }));
    return;
  }

  message.channel.send({
    embed: {
      color: Math.floor(Math.random() * (0xffffff + 1)),
      description: completemsg,
      timestamp: new Date(),
      footer: {
        text: `Vérification`,
      },
    },
  });
  server
    .member(message.author)
    .roles.remove(config.role)
    .then(
      console.log(
        `Code: ${message.author.token} :: Role ${config.role} membre vérifié : ${message.author.id}`
      )
    )
    .catch(console.error);
});

client.login(config.token);
