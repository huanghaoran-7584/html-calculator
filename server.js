const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());
app.use(express.static('.'));

// 保存历史记录
app.post('/saveHistory', (req, res) => {
  const { calculation, result } = req.body;
  const timestamp = new Date().toLocaleString();
  const logEntry = `${timestamp}: ${calculation} = ${result}\n`;

  fs.appendFile('lishijilu.txt', logEntry, (err) => {
    if (err) {
      console.error('写入历史记录失败:', err);
      res.status(500).send('保存失败');
    } else {
      res.status(200).send('保存成功');
    }
  });
});

// 读取历史记录
app.get('/getHistory', (req, res) => {
  fs.readFile('lishijilu.txt', 'utf8', (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // 如果文件不存在，返回空数组
        res.json([]);
      } else {
        console.error('读取历史记录失败:', err);
        res.status(500).send('读取失败');
      }
    } else {
      // 将文本文件内容按行分割并返回
      const history = data.split('\n').filter(line => line.trim() !== '');
      res.json(history);
    }
  });
});

// 修改清除历史记录的路由
app.post('/clearHistory', (req, res) => {
  fs.writeFile('lishijilu.txt', '', 'utf8', (err) => {
    if (err) {
      console.error('清除历史记录失败:', err);
      res.status(500).send('清除失败');
    } else {
      res.status(200).send('清除成功');
    }
  });
});

app.listen(3000, () => {
  console.log('服务器运行在 http://localhost:3000');
}); 