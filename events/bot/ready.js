client.on(discord.Events.ClientReady, async () => {
  console.log(`Connected to ${client.user.username}`);
  const activities = [
    "minecraftpfp.com",
    "V0.0.5 - BETA",
    `${client.ws.ping}ms`,
  ];
  client.user.setActivity(
    activities[Math.floor(Math.random() * activities.length)],
    { type: "PLAYING" }
  );
  setInterval(() => {
    client.user.setActivity(
      activities[Math.floor(Math.random() * activities.length)],
      { type: "PLAYING" }
    );
  }, 60000);

  const rest = new discord.REST({ version: "10" }).setToken(config.token);
  (async () => {
    try {
      await rest
        .put(discord.Routes.applicationCommands(client.user.id), {
          body: [
            ...commands.map((value, key) => value.slashData.toJSON()),
            ...commands.map((value, key) => value.contextData),
          ],
        })
        .then(() => console.log(`Başarıyla (/) komutları yenilendi`));
    } catch (error) {
      console.error(error);
    }
  })();
});
