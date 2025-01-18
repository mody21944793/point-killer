const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');
const WebSocket = require('ws');

// الاتصال بقاعدة البيانات
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // ضع كلمة المرور هنا إذا كانت موجودة
    database: 'your_database_name' // اسم قاعدة البيانات
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to database');
});

app.use(bodyParser.json());

// إنشاء خادم Express
const server = app.listen(3000, '0.0.0.0', () => {
    console.log('Server started on port 3000');
});

// إنشاء خادم WebSocket
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('Client connected');

    // إرسال رسالة ترحيبية عند الاتصال
    ws.send(JSON.stringify({ type: 'notification', message: 'مرحبًا بك في الدردشة!' }));

    // استقبال الرسائل من العميل
    ws.on('message', (message) => {
        console.log('Received:', message.toString());

        // إرسال الرسالة لجميع العملاء المتصلين
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type: 'message', data: message.toString() }));
            }
        });
    });

    // إغلاق الاتصال
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// API لتسجيل الدخول
app.post('/api/login', (req, res) => {
    const { usernameOrEmail, password } = req.body;
    const sql = 'SELECT * FROM users WHERE (username = ? OR email = ?) AND password = ?';
    db.query(sql, [usernameOrEmail, usernameOrEmail, password], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ success: false, message: 'حدث خطأ أثناء تسجيل الدخول.' });
        }
        if (result.length > 0) {
            res.json({ success: true, user: result[0] });
        } else {
            res.json({ success: false, message: 'اليوزر نيم/الإيميل أو كلمة السر غير صحيحة!' });
        }
    });
});

// API للتسجيل
app.post('/api/register', (req, res) => {
    const { firstName, lastName, username, email, password, recoveryPassword } = req.body;
    const sql = 'INSERT INTO users (firstName, lastName, username, email, password, recoveryPassword, points) VALUES (?, ?, ?, ?, ?, ?, 0)';
    db.query(sql, [firstName, lastName, username, email, password, recoveryPassword], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ success: false, message: 'اليوزر نيم أو الإيميل موجود بالفعل!' });
        } else {
            res.json({ success: true });
        }
    });
});

// API لجلب جميع المستخدمين
app.get('/api/users', (req, res) => {
    const sql = 'SELECT * FROM users';
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ success: false, message: 'حدث خطأ أثناء جلب البيانات.' });
        }
        res.json(result);
    });
});

// API لحذف مستخدم
app.delete('/api/users/:username', (req, res) => {
    const { username } = req.params;
    const sql = 'DELETE FROM users WHERE username = ?';
    db.query(sql, [username], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ success: false, message: 'حدث خطأ أثناء حذف المستخدم.' });
        }
        res.json({ success: true });
    });
});

// API لإعادة تعيين كلمة السر
app.post('/api/users/:username/reset-password', (req, res) => {
    const { username } = req.params;
    const { newPassword } = req.body;
    const sql = 'UPDATE users SET password = ? WHERE username = ?';
    db.query(sql, [newPassword, username], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ success: false, message: 'حدث خطأ أثناء إعادة تعيين كلمة السر.' });
        }
        res.json({ success: true });
    });
});

// API لإرسال نقاط
app.post('/api/users/:username/send-points', (req, res) => {
    const { username } = req.params;
    const { points } = req.body;
    const sql = 'UPDATE users SET points = points + ? WHERE username = ?';
    db.query(sql, [points, username], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ success: false, message: 'حدث خطأ أثناء إرسال النقاط.' });
        }
        res.json({ success: true });
    });
});

// API لإرسال الرسائل
app.post('/api/send-message', (req, res) => {
    const { message, userId } = req.body;

    if (!message || !userId) {
        return res.status(400).json({ success: false, message: 'البيانات المطلوبة غير مكتملة!' });
    }

    const sql = 'INSERT INTO messages (user_id, message) VALUES (?, ?)';
    db.query(sql, [userId, message], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ success: false, message: 'حدث خطأ أثناء إرسال الرسالة.' });
        }
        res.json({ success: true });
    });
});

// API لاسترجاع الرسائل
app.get('/api/messages', (req, res) => {
    const sql = 'SELECT messages.*, users.username FROM messages JOIN users ON messages.user_id = users.id ORDER BY timestamp DESC';
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ success: false, message: 'حدث خطأ أثناء جلب الرسائل.' });
        }
        res.json(result);
    });
});