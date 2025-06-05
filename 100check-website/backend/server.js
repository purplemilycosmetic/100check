const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

const db = new sqlite3.Database('users.db', (err) => {
  if (err) {
    console.error('資料庫連線失敗:', err.message);
  } else {
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )`);
    console.log('資料庫連線成功');
  }
});

app.post('/api/register', async (req, res) => {
  console.log('收到註冊請求:', req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: '電子郵件和密碼為必填欄位' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: '請輸入有效的電子郵件格式' });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: '密碼必須至少 8 個字符' });
  }

  try {
    db.get('SELECT email FROM users WHERE email = ?', [email], async (err, row) => {
      if (err) {
        console.error('查詢錯誤:', err);
        return res.status(500).json({ message: '伺服器錯誤' });
      }
      if (row) {
        return res.status(400).json({ message: '此電子郵件已被註冊' });
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword], (err) => {
        if (err) {
          console.error('插入錯誤:', err);
          return res.status(500).json({ message: '註冊失敗' });
        }
        res.status(201).json({ message: '註冊成功' });
      });
    });
  } catch (error) {
    console.error('註冊錯誤:', error);
    res.status(500).json({ message: '伺服器錯誤' });
  }
});

app.get('/api/users', (req, res) => {
  db.all('SELECT email FROM users', [], (err, rows) => {
    if (err) {
      console.error('查詢錯誤:', err);
      return res.status(500).json({ message: '伺服器錯誤' });
    }
    res.json(rows);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`伺服器運行在 http://localhost:${PORT}`);
});