const express = require('express');
// const tf = require('@tensorflow/tfjs');
// const tfn = require('@tensorflow/tfjs-node');
const tf = require('@tensorflow/tfjs-node-gpu');
const multer = require('multer');
const {Image, createCanvas} = require('canvas')
const app = express();
const canvas = createCanvas(28, 28);
const ctx = canvas.getContext('2d');
const upload = multer({ dest: 'uploads/' });
 
app.use(express.static('public'));
async function loadImage(filepath){
     var img = new Image();
     img.onload = () => ctx.drawImage(img, 0, 0);
     img.onerror = err => {throw err};
     img.src = filepath;
     image = tf.browser.fromPixels(canvas).mean(2)
                              .toFloat()
                              .expandDims(0)
                              .expandDims(-1)
     return new Promise(resolve => { resolve(image);});
}
async function loadModel(){
     const model = await tf.loadLayersModel('file://./jstestmodel/model.json');
     return model;
}
const model = loadModel();
 
 
async function prediction(imgFile)
{
     const model = await loadModel();
     //const result = await model.predict(imgFile).dataSync();
     const result = await model.predict(imgFile).as1D().argMax().data();
     const arr = Array.from(result);
     return new Promise(resolve => {
          resolve(arr);
     });
}
// 이미지 업로드 핸들러
app.post('/upload', upload.single('image'), (req, res) => {
     const imagePath = req.file.path;
     loadImage(imagePath).then(
          img => prediction(img).then(
               result => res.send(result)
          )
     )
});
app.get('/', (req, res) =>{
         res.sendFile("./public/index.html");
    });


app.listen(3000, () => {
console.log('Server is running on port 3000');
});