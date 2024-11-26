const express = require('express');
// const tf = require('@tensorflow/tfjs');
// const tfn = require('@tensorflow/tfjs-node');
const tf = require('@tensorflow/tfjs-node-gpu');
const PORT = 3000;
const HOST = '0.0.0.0';
const app = express();
async function loadModel(){
    const model = await tf.loadLayersModel('file://./jstestmodel/model.json');
    return new Promise(resolve => {
        console.log("loadmodel")
        resolve(model);
    });
}
async function prediction(model)
{
    console.log("predict");
    const result = await model.predict(tf.tensor2d([5], [1,1])).dataSync();
    const arr = Array.from(result);
    return new Promise(resolve => {
        resolve(arr);
    });
}
app.get('/', (req, res) => {
    loadModel().then(model =>
        prediction(model).then(
            result => res.send(result)));
});

app.listen(PORT, HOST, () => {
console.log('Running on http://${HOST}:${PORT}');
});