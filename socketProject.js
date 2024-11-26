const express = require('express');
const tf = require('@tensorflow/tfjs-node-gpu');
const multer = require('multer');
const { Image, createCanvas } = require('canvas');
const app = express();
const canvas = createCanvas(28, 28);
const ctx = canvas.getContext('2d');
const upload = multer({ dest: 'uploads/' });
const fs = require('fs');

// 서버 객체를 초기화합니다.
const server = require('http').createServer(app);
// io를 초기화합니다.
const io = require('socket.io')(server);

app.use(express.static('public'));

// 이미지 로드 및 전처리
async function loadImage(filepath) {
    var img = new Image();
    img.onload = () => ctx.drawImage(img, 0, 0);
    img.onerror = err => { throw err };
    img.src = filepath;
    const image = tf.browser.fromPixels(canvas).mean(2)
        .toFloat()
        .expandDims(0)
        .expandDims(-1)
    return new Promise(resolve => {
        resolve(image);
    });
}

// 모델 로드
async function loadModel() {
    const model = await tf.loadLayersModel('file://./jstestmodel/model.json');
    return model;
}

// 예측 함수
async function prediction(imgFile) {
    const model = await loadModel();
    
    // 비동기적으로 지연 추가
    await sleep(1000);  // 1초 대기
    
    const result = await model.predict(imgFile).as1D().argMax().data();
    const arr = Array.from(result);
    return new Promise(resolve => {
        resolve(arr);
    });
}

// 비동기 sleep 함수 구현
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Socket.IO로 파일 업로드 처리
io.on('connection', function (socket) {
    socket.on("upload", (file, callback) => {
        console.log(file);
        // 파일을 디스크에 저장
        fs.writeFile(__dirname + "/uploads/" + file.Name, file.Data, (err) => {
            if (err) {
                console.log("파일 저장 오류:", err);
                socket.emit("isfinish", { error: "파일 저장에 실패했습니다" });
                return;
            }
            const filepath = __dirname + "/uploads/" + file.Name;
            loadImage(filepath).then(
                imgData => prediction(imgData).then(
                    result => socket.emit("isfinish", result)  // 예측 결과 반환
                )
            );
        });
    });
});

// 이미지 업로드 핸들러
app.post('/upload', upload.single('image'), (req, res) => {
    const imagePath = req.file.path;
    loadImage(imagePath).then(
        img => prediction(img).then(
            result => {// 예측 결과를 클라이언트로 JSON 형태로 반환
                res.json(result);
            }
        )
    )
});

app.get('/', (req, res) => {
    res.sendFile("./public/index.html");
});

// 서버 시작 전에 서버 객체를 초기화한 후 실행
server.listen(3000, () => {
    console.log('Server is running on port 3000');
});