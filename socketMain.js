const {Image, createCanvas} = require('canvas')
// const tf = require('@tensorflow/tfjs');
const tf = require('@tensorflow/tfjs-node-gpu');
var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

const canvas = createCanvas(640, 640);
const ctx = canvas.getContext('2d');
var fs = require('fs');

// localhost:3000으로 서버에 접속하면 클라이언트로 web.html을 전송한다
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/web.html');
});

var model = null;

loadModel().then( () => {
    server.listen(3000, function() {
        console.log('Socket IO server listening on port 3000');
      });
});

async function loadModel(){
  //  const yolov5n_weight = "https://raw.githubusercontent.com/da22so/tfjs_models/main/yolov5n_web_model/model.json"
  //  model = await tfn.loadGraphModel(yolov5n_weight);
  model = await tf.loadGraphModel('file://./yolomodel/model.json');
  return new Promise(resolve => {
    resolve(model);
});
  
}



async function prediction(imgdata)
{   
    
    var img = new Image();
    img.onload = () => ctx.drawImage(img, 0, 0, 640, 640);
    img.onerror = err => {throw err};
    img.src = imgdata;
    // image = tf.browser.fromPixels(canvas)
    //                     .div(255.0)
    //                     .expandDims(0);
    
    const input = tf.tidy(() => {
        return tf.image.resizeBilinear(tf.browser.fromPixels(canvas), [640, 640])
            .div(255.0).expandDims(0);
        });

    const [boxes, scores, classes, valid_detections] = await model.executeAsync(input);
    const boxes_data = Array.from(boxes.dataSync());
    const scores_data = Array.from(scores.dataSync());
    const classes_data = Array.from(classes.dataSync());
    const valid_detections_data = Array.from(valid_detections.dataSync())[0];
    //sleep(10);
    tf.dispose([boxes, scores, classes, valid_detections]);
    return new Promise(resolve => {
        resolve([boxes_data, scores_data, classes_data, valid_detections_data]);
    });
}


io.on('connection', function(socket) {
     socket.on("upload", (file, callback) => {
        prediction(file.Data).then(
                  result => socket.emit("isfinish", result)
              )
     });
});

function sleep(ms) {
    const wakeUpTime = Date.now() + ms;
    while (Date.now() < wakeUpTime) {}
  }