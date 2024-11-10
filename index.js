require('dotenv').config();
const { Bot, GrammyError, HttpError, Keyboard, InlineKeyboard } = require('grammy');
const { hydrate } = require('@grammyjs/hydrate');

const bot = new Bot (process.env.BOT_API_KEY);
bot.use(hydrate());


bot.api.setMyCommands([
    {
        command: 'start',
        description: 'Start the bot.',
    },
    {
        command: 'menu',
        description: 'Menu the bot.',
    },
]);

bot.command('start', async (ctx) => {
    await ctx.reply(
        'Привет! Я - Бот 🤖ТГ канал <a href="https://t.me">url</a>',  {
            parse_mode: 'HTML'
        }
    );
    await ctx.react('❤‍🔥')
});


// bot.command('mood', async (ctx) => {
//     // const moodKeyboard = new Keyboard()
//     //     .text('Хорошо')
//     //     .row()
//     //     .text('Нормально')
//     //     .row()
//     //     .text('Плохо')
//     //     .resized();
//
//     const moodLabels = ['Хорошо', "Нормально", 'Плохо'];
//     const rows = moodLabels.map((label) => [Keyboard.text(label)]); const moodKeyboard2 = Keyboard.from(rows).resized();
//     await ctx.reply('kak dela', {
//         reply_markup: moodKeyboard2,
//     })
// })

// bot.command('share', async (ctx) => {
//     const  ShareKeyboard = new Keyboard().requestContact('geo')
//
//     await ctx.reply('info', {
//         reply_markup: ShareKeyboard
//     })
//
// })

// bot.command('inline', async (ctx) => {
//     const inlineKeyboard = new InlineKeyboard().text('1','button-1')
//
//     await ctx.reply('info', {
//         reply_markup: inlineKeyboard
//     })
// })

// bot.callbackQuery('button-1', async (ctx) => {
//     await ctx.answerCallbackQuery('11');
//     await ctx.reply('1', {})
// })

// bot.on('callback_query:data', async (ctx) => {
//     await ctx.answerCallbackQuery('11');
//     await ctx.reply('1', {})
// })
//
// bot.hears('Хорошо', async (ctx) => {
//     await ctx.reply('класс', {
//         reply_markup: {remove_keyboard: true},
//     })
// })

const menuKeyboard = new InlineKeyboard()
    .text('Статус заказа','order-status')
    .text('подержка','support');
const backKeyboard = new InlineKeyboard()
    .text('Назад','back');

bot.command('menu', async (ctx) => {
    await ctx.reply('Выберите пункт меню',{
        reply_markup: menuKeyboard,
    });
});

bot.callbackQuery('order-status', async (ctx) => {
    await ctx.callbackQuery.message.editText('Статус заказа: 123', {
        reply_markup: backKeyboard,
    });
    await ctx.answerCallbackQuery();
});

bot.callbackQuery('support', async (ctx) => {
    await ctx.callbackQuery.message.editText('Напишите ваш запрос', {
        reply_markup: backKeyboard,
    });
    await ctx.answerCallbackQuery();
});

bot.callbackQuery('back', async (ctx) => {
    await ctx.callbackQuery.message.editText('Выберите пункт меню', {
        reply_markup: menuKeyboard,
    });
    await ctx.answerCallbackQuery();
});

bot.catch(async (err) => {
    console.error(`Error while hanling update ${ctx.update.update_id}:`);
    const e =err.error;

    if (e instanceof GrammyError) {
        console.error("Error in request:", e.description);
    } else if (e instanceof HttpError) {
        console.error("Could not ontact Telegram", e.statusCode);
    } else {
        console.error("uncnow error", e);
    }
})

bot.start();