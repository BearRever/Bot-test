const { Client, GatewayIntentBits, EmbedBuilder, ApplicationCommandType, UserSelectMenuBuilder, ActionRowBuilder, MessageFlags, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once('ready', async () => {
    console.log(`\x1b[1m\x1b[32mLOGGED IN AS ${client.user.tag}\x1b[0m`);

    const commands = [
        {
            name: "dm-message",
            description: "[ 💬คำสั่งฝากข้อความ ]",
            type: ApplicationCommandType.ChatInput,
        }
    ];

    await client.application.commands.set(commands);
    console.log(`\x1b[34mSUCCESSFULLY!\x1b[0m 彡 INFO :【 STATUS: \x1b[32mLOGIN BOT\x1b[0m, WORKING: \x1b[35mOKAY READY LET'S GO!\x1b[0m 】`);
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;
    if (interaction.commandName === 'dm-message') {

        const embed = new EmbedBuilder()
            .setColor(0x66FF00)
            .setTitle('เลือกผู้ใช้ที่ต้องการส่งข้อความหา')
            .setDescription(`\`\`\`ꔫ💬 หากไม่เจอให้พิมพ์ชื่อหาได้เลย\`\`\``)
            .setThumbnail(interaction.user.displayAvatarURL())
            .setImage('https://www.animatedimages.org/data/media/562/animated-line-image-0168.gif')
        const row = new ActionRowBuilder()
            .addComponents(
                new UserSelectMenuBuilder()
                    .setCustomId('select_user')
                    .setPlaceholder('เลือกผู้ใช้ที่ต้องการส่งข้อความหา')
                    .setMinValues(1)
                    .setMaxValues(1)
            );

        await interaction.reply({ embeds: [embed], components: [row], flags: MessageFlags.Ephemeral });
    }
});


client.on('interactionCreate', async (interaction) => {
    if (interaction.isUserSelectMenu() && interaction.customId === 'select_user') {
        const selectedUserId = interaction.values[0];
        const modal = new ModalBuilder()
            .setCustomId(`submituser_modals:${selectedUserId}`)
            .setTitle('ข้อความที่ส่งถึงผู้ใช้งาน')
            .addComponents(
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('message_send')
                        .setLabel('[ 💬ข้อความที่จะส่งถึง ]')
                        .setStyle(TextInputStyle.Paragraph)
                        .setPlaceholder('ป้อนข้อความที่ช่องนี่')
                        .setRequired(true)
                ),
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('link_send')
                        .setLabel('[ 🔗ลิงค์รูปภาพ ]')
                        .setStyle(TextInputStyle.Short)
                        .setPlaceholder('https://image.png')
                        .setRequired(false)
                )
            );
        await interaction.showModal(modal);
    }
});

client.on('interactionCreate', async (interaction) => {
    if (interaction.isModalSubmit() && interaction.customId.startsWith('submituser_modals:')) {
        const selectedUserId = interaction.customId.split(':')[1];
        const user = await client.users.fetch(selectedUserId);
        const message_send = interaction.fields.getTextInputValue("message_send");
        const link_send = interaction.fields.getTextInputValue("link_send");

        if (link_send && !link_send.startsWith('https://')) {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0xFF0000)
                        .setTitle('\`\`❌\`\` เอ้ะ! กรุณากรอกลิงค์ URL รูปภาพให้ถูกต้อง!!')
                        .setDescription(`\`\`\`ตัวอย่างลิงค์รูปภาพ https://image.png\`\`\``)
                ],
                flags: MessageFlags.Ephemeral
            });
        }
        
        const embeds_send = new EmbedBuilder()
            .setColor(0x5865f2)
            .setTitle(`\`\`✅\`\`ส่งข้อความสำเร็จแล้ว!`)
            .setDescription(`\`\`🐤\`\` **ผู้ส่งข้อความ** <@${interaction.user.id}>\n\`\`🌵\`\` **ผู้รับข้อความ** <@${user.id}>\n\`\`💬\`\` **ข้อความที่ส่งถึง**\`\`\`${message_send}\`\`\``)
            .setThumbnail(`${user.displayAvatarURL()}`);
        if (link_send) {
            embeds_send.setImage(link_send);
        }

        await interaction.reply({ embeds: [embeds_send], flags: MessageFlags.Ephemeral });

        try {
            const embeds_user = new EmbedBuilder()
            .setColor(0x5865f2)
            .setTitle(`\`\`💬\`\`มีคนฝากข้อความถึงคุณ!`)
            .setDescription(`\`\`💬\`\` **ข้อความที่ฝากถึง**\`\`\`${message_send}\`\`\``);
        
            if (link_send) {
                embeds_user.setImage(link_send);
            }
            
            await user.send({ embeds: [embeds_user] });
        } catch (error) {
            const embeds = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle(`\`\`❌\`\`ไม่สามารถส่งข้อความหาบุคคลนี้ได้!`)
                .setDescription(`ผู้ใช้งานที่ส่งข้อความหาเขาปิด DM จากสมาชิก\nไม่สามารถส่งข้อความจากสมาชิกเซิร์ฟเวอร์ได้!!`);
            await interaction.followUp({ embeds: [embeds], flags: MessageFlags.Ephemeral });
        }
    }
});


require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

client.once("ready", () => {
  console.log(`✅ บอทออนไลน์แล้ว! ชื่อบอท: ${client.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN);
