const express = require('express');
const app = express();

const indexRouter = require('./routes_1107');
const userRouter = require('./routes_1107/user');
const pageRouter = require('./routes_1107/page');

app.set('port', 3000);

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/page', pageRouter);

app.listen(app.get('port'), () => {
    console.log('start express server');
});

