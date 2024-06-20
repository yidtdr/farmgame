var express = require('express');
var bodyParser = require('body-parser');
var TelegramBot = require('node-telegram-bot-api');
var app = express();

const TOKEN = 'YOUR_TELEGRAM_BOT_TOKEN'; // Замените на ваш токен
const _DEBUG = false;

// Создаем бота
var bot = new TelegramBot(TOKEN, { polling: true });

// Middleware для парсинга JSON тел запросов
app.use(bodyParser.json());

if (_DEBUG) {
    app.get('/', function(req, res) {
        res.sendFile(__dirname + '/client/debug.html');
    });
} else {
    app.get('/', function(req, res) {
        res.sendFile(__dirname + '/client/index.html');
    });
}

app.use('/client', express.static(__dirname + '/client'));

// Обработка команды /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Open Web App', web_app: { url: 'https://yourdomain.com' } }]
            ]
        }
    };
    bot.sendMessage(chatId, 'Please choose an option:', options);
});

// Обработка данных, полученных из веб-приложения
bot.on('message', (msg) => {
    if (msg.web_app_data) {
        const data = msg.web_app_data.data;
        bot.sendMessage(msg.chat.id, `You selected option: ${data}`);
    }
});

// Обработка ошибок для маршрутов
app.use((req, res, next) => {
    res.status(404).send('Sorry, that route doesn\'t exist.');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

var server = app.listen(8082, function() {
    var port = server.address().port;
    console.log('Server running at port %s', port);
});
