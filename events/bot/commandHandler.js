const cooldowns = require("../../index")
client.on(discord.Events.InteractionCreate, async (interaction) => {
  try {
    if (!interaction.isChatInputCommand()) return;
    const command = commands.get(interaction.commandName);

    if (!command) return;
    if (!interaction.member) client.users.cache.get(interaction.user.id);
    if (command.cooldown) {
      if (
        cooldowns.get(
          `${interaction.user.id}:${
            command.cooldownName ?? interaction.commandName
          }`
        )
      ) {
        const embed = new discord.EmbedBuilder().setDescription(
          `\`${
            command.cooldownName ?? interaction.commandName
          }\` adlı komutta \`${
            (command.cooldown / 1000).toFixed(0)
          }s\` gecikme var. Senim daha \`${
            (cooldowns.get(
              `${interaction.user.id}:${
                command.cooldownName ?? interaction.commandName
              }`
            ) / 1000).toFixed(0)
          }s\` beklemen lazım`
        );
        return interaction.reply({ embeds: [embed], ephemeral: true });
      } else {
        var cooldown = command.cooldown;
        cooldowns.set(
          `${interaction.user.id}:${
            command.cooldownName ?? interaction.commandName
          }`,
          cooldown
        );

        var interval = setInterval(function () {
          cooldowns.set(
            `${interaction.user.id}:${
              command.cooldownName ?? interaction.commandName
            }`,
            cooldown
          );
          cooldown -= 100;
        }, 100);

        setTimeout(function () {
          clearInterval(interval);
          cooldowns.delete(
            `${interaction.user.id}:${
              command.cooldownName ?? interaction.commandName
            }`
          );
        }, command.cooldown);
      }
    }

    command.slashRun(interaction);
  } catch (error) {
    interaction.reply({
      content: `Bir hata oluştu,sonra tekrar dene`,
      ephemeral: true,
    });
    console.warn(error);
  }
});
