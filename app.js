var bodyParser = require('body-parser');
var express = require('express');
var TelegramBot = require('node-telegram-bot-api');

const TOKEN = '7106833924:AAHUplflybYnlTaizULr4HDmQtRbEy5k6pY';

var bot = new TelegramBot(TOKEN, { polling: true });
var app = express();

app.use(bodyParser.json());

// Обработка команды /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    console.log(msg)
    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Open Web App', web_app: { url: 'https://farmgame-rclc.onrender.com' } }]
            ]
        }
    };
    bot.sendMessage(chatId, 'Please choose an option:', options);
});

// Обработка данных, полученных из веб-приложения
bot.on('message', (msg) => {
    console.log(msg)
    if (msg.web_app_data) {
        const data = msg.web_app_data.data;
        bot.sendMessage(msg.chat.id, `You selected option: ${data}`);
    }
});

// Обработка данных из веб-приложения
app.post('/webapp-data', (req, res) => {
    const chatId = req.body.chat_id;
    const tgData = req.body.tg_data;

    // Отправка данных пользователю в чат
    bot.sendMessage(chatId, `Telegram WebApp Data: ${JSON.stringify(tgData, null, 2)}`);
    
    res.sendStatus(200);
});

const _DEBUG = false;

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
