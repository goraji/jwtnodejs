const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/curd', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => {
    console.log('connected');
}).catch((err) => {
    console.log('failed');
})