const express = require('express')
const app = express()
require('dotenv').config();
const port = process.env.PORT || 3000
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan')
const cookieParser = require('cookie-parser');
const Package = require('./models/Package');
const Store = require('./models/Store');
const User = require('./models/User');
const Categories = require('./models/Categories');
const Product = require('./models/Product');
const Bill = require('./models/Bill');
const BillDetail = require('./models/BillDetail');
const SoldHistories = require('./models/SoldHistories');
const UserCredit = require('./models/UserCredit');
const UserCreditOrder = require('./models/UserCreditOrder');
const UserCreditDetail = require('./models/UserCreditDetail');

app.use(morgan('dev'));
app.use(bodyParser.json());

const corsOptions = {
    origin: ['*'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser())

//default routes
app.get('/', async (req, res) => {
    return res.status(200).json({
        success: true,
        message: "welcome to server posyee v2",
        repository: "https://github.com/boytur/client-posyayee-v2",
    });
});

app.listen(port, () => {
    console.log(`POSYAYEE-V2 app listening on port ${port}`)
});