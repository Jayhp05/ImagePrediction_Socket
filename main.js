const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.get('/user', (req, res) => { // 웹에 요청 주소 예시 => http://127.0.0.1:3000/user?name=Jay&id=aisw
    const resJson={};
    if (req.query.name &&
        req.query.id)
    {
        resJson.success=true;
        resJson.message='success';

    }
    else{
        resJson.success=false;
        resJson.message='invalid';
    }
    res.json(resJson)
})

app.post('/', (req, res) => {
    res.send('Post Method')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})