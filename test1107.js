// const express = require('express');
// // const tf = require('@tensorflow/tfjs');
// const tf = require('@tensorflow/tfjs-node-gpu'); // gpu 활용하기 위해
// // 상수
// const PORT = 3000;
// const HOST = '0.0.0.0';

// // 앱
// const app = express();

// const model = tf.sequential();
// model.add(tf.layers.dense({units:1, inputShape:[1]}));
// model.compile({loss:'meanSquaredError', optimizer:'sgd'});

// const xs = tf.tensor2d([-1, 0, 1, 2, 3, 4], [6, 1]);
// const ys = tf.tensor2d([-3, -1, 1, 3, 5, 7], [6, 1]);

// model.fit(xs, ys, {epochs: 250});

// app.get('/', (req, res) => {
//     const result = model.predict(tf.tensor2d([20], [1, 1])).dataSync();
//     const arr = Array.from(result);
//     res.send(arr);
// })

// app.listen(PORT, HOST, () => {
//     console.log('Running on http://${HOST}:${PORT}');
//     });

// 두 번째 JavaScript:
const tf = require('@tensorflow/tfjs');

const model = tf.sequential();
model.add(tf.layers.dense({units:1, inputShape:[1]}));
model.compile({loss:'meanSquaredError', optimizer:'sgd'});

const xs = tf.tensor2d([[1], [2], [3], [4]], [4, 1]);
const ys = tf.tensor2d([[1], [3], [5], [7]], [4, 1]);

async function fitting() {
    model.fit(xs, ys, {epochs: 1000});
    model.predict(tf.tensor2d([[5]], [1, 1])).print();   
}

fitting();