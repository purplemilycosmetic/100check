const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors()); // 啟用 CORS，支持前端請求

// 設置資料庫
const db = new sqlite3.Database('users.db', (err) => {
  if (err) {
    console.error('資料庫連線失敗:', err.message);
  } else {
    // 創建 users 表格
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )`);
    console.log('資料庫連線成功');
  }
});

// 註冊 API
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;

  // 基本驗證
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
    // 檢查電子郵件是否已存在
    db.get('SELECT email FROM users WHERE email = ?', [email], async (err, row) => {
      if (err) {
        return res.status(500).json({ message: '伺服器錯誤' });
      }
      if (row) {
        return res.status(400).json({ message: '此電子郵件已被註冊' });
      }

      // 加密密碼
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // 插入新用戶
      db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword], (err) => {
        if (err) {
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

// 測試用 API：查詢所有用戶（僅限開發環境）
app.get('/api/users', (req, res) => {
  db.all('SELECT email FROM users', [], (err, rows) => {
    if (err) {
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