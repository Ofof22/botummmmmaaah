const {
  SlashCommandBuilder,
  ContextMenuCommandBuilder,
  ApplicationCommandType,
} = require("discord.js");
const { loadImage, loadImageFromDir } = require("../../util");
const canvas = require("canvas");
const gradients = [
  ["#00cdac", "#02aab0"],
  ["#6a82fb", "#fc5c7d"],
  ["#ffb88c", "#de6262"],
  ["#f45c43", "#eb3349"],
  ["#B5AC49", "#3CA55C"],
];
module.exports = {
  slashData: new SlashCommandBuilder()
    .setName("create-avatar")
    .setDescription("Creates avatar with minecraft username")
    .addStringOption((string) =>
      string
        .setName("minecraft_username")
        .setDescription("Minecraft Username")
        .setRequired(true)
        .setMaxLength(16)
        .setMinLength(3)
    ),
  contextData: new ContextMenuCommandBuilder()
    .setName("Create Avatar")
    .setType(ApplicationCommandType.Message),
  cooldown: 10000,
  cooldownName: "createAvatar",
  /**
   * @param {import("discord.js").CommandInteraction} interaction
   */
  async slashRun(interaction) {
    const username = interaction.options.getString("minecraft_username");
    const cnvs = canvas.createCanvas(300, 300);
    const ctx = cnvs.getContext("2d");
    let gradient = 0;
    ctx.scale(16, 16);
    ctx.imageSmoothingEnabled = false;

    await createAvatar(`https://minotar.net/skin/${username}`, ctx, gradient);

    interaction
      .reply({
        ephemeral: true,
        files: [
          new discord.AttachmentBuilder(cnvs.toBuffer("image/png"), {
            name: "image.png",
          }),
        ],
        components: [
          new discord.ActionRowBuilder().addComponents(
            new discord.ButtonBuilder()
              .setDisabled(gradient <= 0)
              .setStyle(discord.ButtonStyle.Primary)
              .setLabel(config.emojis.previous)
              .setCustomId("previous"),
            new discord.ButtonBuilder()
              .setDisabled(gradient >= 4)
              .setLabel(config.emojis.next)
              .setStyle(discord.ButtonStyle.Secondary)
              .setCustomId("next")
          ),
        ],
      })
      .then(async (msg) => {
        msg
          .createMessageComponentCollector({
            componentType: discord.ComponentType.Button,
            max: 60000,
          })
          .on("collect", async (i) => {
            if (i.user.id === interaction.user.id) {
              if (i.customId === "next") {
                gradient = gradient + 1;
                await createAvatar(
                  `https://minotar.net/skin/${username}`,
                  ctx,
                  gradient
                );
                interaction
                  .editReply({
                    files: [
                      new discord.AttachmentBuilder(
                        cnvs.toBuffer("image/png"),
                        {
                          name: "image.png",
                        }
                      ),
                    ],
                    components: [
                      new discord.ActionRowBuilder().addComponents(
                        new discord.ButtonBuilder()
                          .setDisabled(gradient <= 0)
                          .setStyle(discord.ButtonStyle.Primary)
                          .setLabel(config.emojis.previous)
                          .setCustomId("previous"),
                        new discord.ButtonBuilder()
                          .setDisabled(gradient >= 4)
                          .setLabel(config.emojis.next)
                          .setStyle(discord.ButtonStyle.Secondary)
                          .setCustomId("next")
                      ),
                    ],
                  })
                  .catch((err) => {
                    interaction.deferReply({
                      ephemeral: true,
                      files: [
                        new discord.AttachmentBuilder(
                          cnvs.toBuffer("image/png"),
                          {
                            name: "image.png",
                          }
                        ),
                      ],
                      components: [
                        new discord.ActionRowBuilder().addComponents(
                          new discord.ButtonBuilder()
                            .setDisabled(gradient <= 0)
                            .setStyle(discord.ButtonStyle.Primary)
                            .setLabel(config.emojis.previous)
                            .setCustomId("previous"),
                          new discord.ButtonBuilder()
                            .setDisabled(gradient >= 4)
                            .setLabel(config.emojis.next)
                            .setStyle(discord.ButtonStyle.Secondary)
                            .setCustomId("next")
                        ),
                      ],
                    });
                  });
              } else if (i.customId === "previous") {
                gradient = gradient - 1;
                await createAvatar(
                  `https://minotar.net/skin/${username}`,
                  ctx,
                  gradient
                );
                interaction
                  .editReply({
                    files: [
                      new discord.AttachmentBuilder(
                        cnvs.toBuffer("image/png"),
                        {
                          name: "image.png",
                        }
                      ),
                    ],
                    components: [
                      new discord.ActionRowBuilder().addComponents(
                        new discord.ButtonBuilder()
                          .setDisabled(gradient <= 0)
                          .setStyle(discord.ButtonStyle.Primary)
                          .setLabel(config.emojis.previous)
                          .setCustomId("previous"),
                        new discord.ButtonBuilder()
                          .setDisabled(gradient >= 4)
                          .setLabel(config.emojis.next)
                          .setStyle(discord.ButtonStyle.Secondary)
                          .setCustomId("next")
                      ),
                    ],
                  })
                  .catch((err) => {
                    interaction.deferReply({
                      ephemeral: true,
                      files: [
                        new discord.AttachmentBuilder(
                          cnvs.toBuffer("image/png"),
                          {
                            name: "image.png",
                          }
                        ),
                      ],
                      components: [
                        new discord.ActionRowBuilder().addComponents(
                          new discord.ButtonBuilder()
                            .setDisabled(gradient <= 0)
                            .setStyle(discord.ButtonStyle.Primary)
                            .setLabel(config.emojis.previous)
                            .setCustomId("previous"),
                          new discord.ButtonBuilder()
                            .setDisabled(gradient >= 4)
                            .setLabel(config.emojis.next)
                            .setStyle(discord.ButtonStyle.Secondary)
                            .setCustomId("next")
                        ),
                      ],
                    });
                  });
              }
            } else {
              i.reply({
                content: `These buttons aren't for you!`,
                ephemeral: true,
              });
            }
          });
      });
  },
  /**
   * @param {import("discord.js").ContextMenuCommandInteraction} interaction
   */
  async contextRun(interaction) {
    const image = interaction.targetMessage.attachments.map(
      (attachment) => attachment.url
    )[0];

    const cnvs = canvas.createCanvas(300, 300);
    const ctx = cnvs.getContext("2d");
    let gradient = 0;
    ctx.scale(16, 16);
    ctx.imageSmoothingEnabled = false;

    await createAvatar(image, ctx, gradient);

    interaction
      .reply({
        ephemeral: true,
        files: [
          new discord.AttachmentBuilder(cnvs.toBuffer("image/png"), {
            name: "image.png",
          }),
        ],
        components: [
          new discord.ActionRowBuilder().addComponents(
            new discord.ButtonBuilder()
              .setDisabled(gradient <= 0)
              .setStyle(discord.ButtonStyle.Primary)
              .setLabel(config.emojis.previous)
              .setCustomId("previous"),
            new discord.ButtonBuilder()
              .setDisabled(gradient >= 4)
              .setLabel(config.emojis.next)
              .setStyle(discord.ButtonStyle.Secondary)
              .setCustomId("next")
          ),
        ],
      })
      .then(async (msg) => {
        msg
          .createMessageComponentCollector({
            componentType: discord.ComponentType.Button,
            max: 60000,
          })
          .on("collect", async (i) => {
            if (i.user.id === interaction.user.id) {
              if (i.customId === "next") {
                gradient = gradient + 1;
                await createAvatar(image, ctx, gradient);
                interaction
                  .editReply({
                    files: [
                      new discord.AttachmentBuilder(
                        cnvs.toBuffer("image/png"),
                        {
                          name: "image.png",
                        }
                      ),
                    ],
                    components: [
                      new discord.ActionRowBuilder().addComponents(
                        new discord.ButtonBuilder()
                          .setDisabled(gradient <= 0)
                          .setStyle(discord.ButtonStyle.Primary)
                          .setLabel(config.emojis.previous)
                          .setCustomId("previous"),
                        new discord.ButtonBuilder()
                          .setDisabled(gradient >= 4)
                          .setLabel(config.emojis.next)
                          .setStyle(discord.ButtonStyle.Secondary)
                          .setCustomId("next")
                      ),
                    ],
                  })
                  .catch((err) => {
                    interaction.deferReply({
                      ephemeral: true,
                      files: [
                        new discord.AttachmentBuilder(
                          cnvs.toBuffer("image/png"),
                          {
                            name: "image.png",
                          }
                        ),
                      ],
                      components: [
                        new discord.ActionRowBuilder().addComponents(
                          new discord.ButtonBuilder()
                            .setDisabled(gradient <= 0)
                            .setStyle(discord.ButtonStyle.Primary)
                            .setLabel(config.emojis.previous)
                            .setCustomId("previous"),
                          new discord.ButtonBuilder()
                            .setDisabled(gradient >= 4)
                            .setLabel(config.emojis.next)
                            .setStyle(discord.ButtonStyle.Secondary)
                            .setCustomId("next")
                        ),
                      ],
                    });
                  });
              } else if (i.customId === "previous") {
                gradient = gradient - 1;
                await createAvatar(image, ctx, gradient);
                interaction
                  .editReply({
                    files: [
                      new discord.AttachmentBuilder(
                        cnvs.toBuffer("image/png"),
                        {
                          name: "image.png",
                        }
                      ),
                    ],
                    components: [
                      new discord.ActionRowBuilder().addComponents(
                        new discord.ButtonBuilder()
                          .setDisabled(gradient <= 0)
                          .setStyle(discord.ButtonStyle.Primary)
                          .setLabel(config.emojis.previous)
                          .setCustomId("previous"),
                        new discord.ButtonBuilder()
                          .setDisabled(gradient >= 4)
                          .setLabel(config.emojis.next)
                          .setStyle(discord.ButtonStyle.Secondary)
                          .setCustomId("next")
                      ),
                    ],
                  })
                  .catch((err) => {
                    interaction.deferReply({
                      ephemeral: true,
                      files: [
                        new discord.AttachmentBuilder(
                          cnvs.toBuffer("image/png"),
                          {
                            name: "image.png",
                          }
                        ),
                      ],
                      components: [
                        new discord.ActionRowBuilder().addComponents(
                          new discord.ButtonBuilder()
                            .setDisabled(gradient <= 0)
                            .setStyle(discord.ButtonStyle.Primary)
                            .setLabel(config.emojis.previous)
                            .setCustomId("previous"),
                          new discord.ButtonBuilder()
                            .setDisabled(gradient >= 4)
                            .setLabel(config.emojis.next)
                            .setStyle(discord.ButtonStyle.Secondary)
                            .setCustomId("next")
                        ),
                      ],
                    });
                  });
              }
            } else {
              i.reply({
                content: `These buttons aren't for you!`,
                ephemeral: true,
              });
            }
          });
      });
  },
};
async function createAvatar(skin, ctx, gradientNumber) {
  try {
    const skinImage = await loadImage(skin);
    const shading = await loadImageFromDir("20x20pshading.png");
    const backdrop = await loadImageFromDir("backdropshading.png");

    ctx.clearRect(0, 0, 300, 300);
    changeGradient(ctx, gradientNumber);
    ctx.drawImage(backdrop, 0, 0, 20, 20);

    if (skinImage.height === 32) {
      ctx.drawImage(skinImage, 8, 9, 7, 7, 8, 4, 7, 7); // Head (bottom layer)
      ctx.drawImage(skinImage, 5, 9, 3, 7, 5, 4, 3, 7); // Head Side (bottom layer)
      ctx.drawImage(skinImage, 44, 20, 3, 7, 12, 13, 3, 7); // Arm Right Side (bottom layer)
      ctx.drawImage(skinImage, 21, 20, 6, 1, 7, 11, 6, 1); // Chest Neck Small Line (bottom layer)
      ctx.drawImage(skinImage, 20, 21, 8, 8, 6, 12, 8, 8); // Chest Other (Bottom layer)
      ctx.drawImage(skinImage, 44, 20, 3, 7, 5, 13, 3, 7); // Arm Left Side (bottom layer)
      ctx.drawImage(skinImage, 40, 9, 7, 7, 8, 4, 7, 7); // Head (top layer)
      ctx.drawImage(skinImage, 33, 9, 3, 7, 5, 4, 3, 7); // Head Side (top layer)
    } else {
      // * BOTTOM LAYER
      ctx.drawImage(skinImage, 8, 9, 7, 7, 8, 4, 7, 7); // Head (bottom layer)
      ctx.drawImage(skinImage, 5, 9, 3, 7, 5, 4, 3, 7); // Head Side (bottom layer)
      ctx.drawImage(skinImage, 36, 52, 3, 7, 12, 13, 3, 7); // Arm Right Side (bottom layer)
      ctx.drawImage(skinImage, 21, 20, 6, 1, 7, 11, 6, 1); // Chest Neck Small Line (bottom layer)
      ctx.drawImage(skinImage, 20, 21, 8, 8, 6, 12, 8, 8); // Chest Other (Bottom layer)
      ctx.drawImage(skinImage, 44, 20, 3, 7, 5, 13, 3, 7); // Arm Left Side (bottom layer)

      // * TOP LAYER
      ctx.drawImage(skinImage, 40, 9, 7, 7, 8, 4, 7, 7); // Head (top layer)
      ctx.drawImage(skinImage, 33, 9, 3, 7, 5, 4, 3, 7); // Head Side (top layer)
      ctx.drawImage(skinImage, 52, 52, 3, 7, 12, 13, 3, 7); // Arm Right Side (top layer)
      ctx.drawImage(skinImage, 52, 36, 3, 7, 5, 13, 3, 7); // Arm Left Side (top layer)
      ctx.drawImage(skinImage, 20, 37, 8, 8, 6, 12, 8, 8); // Chest Other (top layer)
      ctx.drawImage(skinImage, 21, 36, 6, 1, 7, 11, 6, 1); // Chest Neck Small Line (top layer)
    }

    ctx.drawImage(shading, 0, 0, 20, 20);
  } catch (e) {
    const failed = await loadImageFromDir("notFound.png");
    const shading = await loadImageFromDir("20x20pshading.png");
    const backdrop = await loadImageFromDir("backdropshading.png");

    ctx.clearRect(0, 0, 300, 300);
    ctx.drawImage(backdrop, 0, 0, 20, 20);
    ctx.resetTransform();
    ctx.drawImage(failed, 0, 0, 300, 300);
    ctx.scale(16, 16);
    ctx.drawImage(shading, 0, 0, 20, 20);
  }
}
async function changeGradient(ctx, num) {
  try {
    const gradient = ctx.createLinearGradient(0, 15, 0, 0);
    let interval = 1;
    gradients[num].forEach((colour) => {
      gradient.addColorStop(interval, colour);
      interval -= 1 / (gradients[1].length - 1);
    });
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 20, 20);
  } catch (e) {
    console.warn(e);
  }
}
