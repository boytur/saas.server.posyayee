const cron = require('node-cron');
const decreaseStoreRemaining = require('./cronjobs/decreaseStoreRemaining');

cron.schedule('0 0 * * *', () => {
    decreaseStoreRemaining();
}, {
    timezone: 'Asia/Bangkok'
});
