// express 모듈 호출
const express = require('express');

// 경로 재정의를 위한 path 모듈 호출
const path = require('path');

// 라우팅 모듈화
const router = express.Router();

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public_1107/about.html'));
});

// export
module.exports = router;