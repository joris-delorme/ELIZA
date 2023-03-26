const { Client, IntentsBitField } = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

client.on('ready', () => {
    console.log('The bot is online!');
});

const configuration = new Configuration({
    apiKey: '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',
});

const openai = new OpenAIApi(configuration);

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (message.content.startsWith('!')) return;

    let conversationLog = [{ role: 'system', content: 'You are a friendly chatbot.' }];

    try {
        await message.channel.sendTyping();

        let prevMessages = await message.channel.messages.fetch({ limit: 15 });
        prevMessages.reverse();

        prevMessages.forEach((msg) => {
            if (message.content.startsWith('!')) return;
            if (msg.author.id !== client.user.id && message.author.bot) return;
            if (msg.author.id !== message.author.id) return;

            conversationLog.push({
                role: 'user',
                content: msg.content,
            });
        });

        const result = await openai
            .createChatCompletion({
                model: 'gpt-3.5-turbo',
                messages: conversationLog,
                max_tokens: 100, // limit token usage
            })
            .catch((error) => {
                console.log(`OPENAI ERR: ${error.message}`);
            });

        message.reply(result.data.choices[0].message);
    } catch (error) {
        console.log(`ERR: ${error.message}`);
    }
});

client.login('MTA4NzY5Njg1OTk0ODEzMDM5NA.GPu1zf.AUEbwmHqyfndgfpJO-PdUY_CereAts0FHwcCZY'); // Votre jeton de bot Discord
