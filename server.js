const express = require('express');
const http = require('http');
const app = express();
require('dotenv').config();
const socketIo = require('socket.io');
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const server = http.createServer(app);
const io = socketIo(server);
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

const authentications = require('./controllers/authentications/Index');
const payments = require('./controllers/payments/Index');
const sequelize = require('./connections/connect');
const Package = require('./models/Package');
const Store = require('./models/Store');
const Categories = require('./models/Categories');
const Product = require('./models/Product');
const UserCredit = require('./models/UserCredit');
const UserCreditOrder = require('./models/UserCreditOrder');
const UserCreditDetail = require('./models/UserCreditDetail');
const SoldHistories = require('./models/SoldHistories');
const Bill = require('./models/Bill');
const BillDetail = require('./models/BillDetail');
const Otp = require('./models/Otp');

const corsOptions = {
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://192.168.1.34:5173', 'http://127.0.0.1:5173'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
};

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // maximum call 1 IP
    standardHeaders: true,
    legacyHeaders: false,
    handler: function (req, res) {
        res.status(429).json({
            success: false,
            message: 'Too many requests, please try again later.'
        });
    }
});

app.use(morgan('dev'));
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(limiter);

//default routes
app.get('/', async (req, res) => {
    return res.status(200).json({
        success: true,
        message: "welcome to server posyee v2",
        repository: "https://github.com/boytur/client-posyayee-v2",
    });
});

app.use(payments);
app.use(bodyParser.json());
app.use(authentications);

io.on('connection', (socket) => {
    console.log('A user connected'.socket.id);
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(port, () => {
    console.log(`POSYAYEE-V2 app listening on port ${port}`);
});

/** VERY DANGEROUS */
const syceDb = async () => {
    sequelize.sync({ alter: true, force: true })
        .then(() => {
            console.log('Sequelize models synchronized with database schema');
        })
        .catch((error) => {
            console.error('Error synchronizing Sequelize models:', error);
        });
}
//syceDb();