const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const cors = require('cors');
const app = express();

// 中間件
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' })); // 允許前端跨域請求

// 初始化資料庫
const db = new sqlite3.Database('users.db', (err) => {
  if (err) {
    console.error('資料庫連線失敗:', err.message);
    process.exit(1); // 若資料庫連線失敗，終止程式
  } else {
    console.log('資料庫連線成功');
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )`, (err) => {
      if (err) {
        console.error('創建表格失敗:', err.message);
      } else {
        console.log('users 表格已準備好');
      }
    });
  }
});

// 註冊 API
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
        console.error('查詢錯誤:', err.message);
        return res.status(500).json({ message: '伺服器錯誤' });
      }
      if (row) {
        return res.status(400).json({ message: '此電子郵件已被註冊' });
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword], (err) => {
        if (err) {
          console.error('插入錯誤:', err.message);
          return res.status(500).json({ message: '註冊失敗' });
        }
        console.log(`用戶 ${email} 註冊成功`);
        res.status(201).json({ message: '註冊成功' });
      });
    });
  } catch (error) {
    console.error('註冊錯誤:', error.message);
    res.status(500).json({ message: '伺服器錯誤' });
  }
});

// 登入 API
app.post('/api/login', (req, res) => {
  console.log('收到登入請求:', req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: '電子郵件和密碼為必填欄位' });
  }

  db.get('SELECT id, email, password FROM users WHERE email = ?', [email], (err, row) => {
    if (err) {
      console.error('查詢錯誤:', err.message);
      return res.status(500).json({ message: '伺服器錯誤' });
    }
    if (!row) {
      return res.status(400).json({ message: '用戶不存在' });
    }

    bcrypt.compare(password, row.password, (err, result) => {
      if (err) {
        console.error('密碼比較錯誤:', err.message);
        return res.status(500).json({ message: '伺服器錯誤' });
      }
      if (!result) {
        return res.status(400).json({ message: '密碼錯誤' });
      }

      console.log(`用戶 ${email} 登入成功`);
      res.status(200).json({ message: '登入成功', userId: row.id });
    });
  });
});

// 查詢所有用戶（開發用）
app.get('/api/users', (req, res) => {
  db.all('SELECT id, email FROM users', [], (err, rows) => {
    if (err) {
      console.error('查詢錯誤:', err.message);
      return res.status(500).json({ message: '伺服器錯誤' });
    }
    res.json(rows);
  });
});

// 啟動伺服器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`伺服器運行在 http://localhost:${PORT}`);
});