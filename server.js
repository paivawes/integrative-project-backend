const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config(); 

const app = express();
const port = process.env.PORT;
const secretKey = process.env.JWT_SECRET_KEY;

app.use(bodyParser.json());
app.use(cors());

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

async function connectToDatabase() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log('Conexão bem sucedida ao banco de dados');
    return connection;
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
    throw error;
  }
}

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Token de autorização não fornecido' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token de autorização inválido' });
    }
    req.user = decoded;
    next();
  });
};

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const connection = await connectToDatabase();
    const [rows] = await connection.execute('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
    if (rows.length > 0) {
      const user = rows[0];
      const token = jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: '1h' });
      res.json({ token });
    } else {
      res.status(401).send('Nome de usuário ou senha inválidos');
    }
    connection.end();
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).send('Erro ao fazer login');
  }
});

app.get('/api/rooms', verifyToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).send('Usuário não autenticado');
    }
    const connection = await connectToDatabase();
    const [rows] = await connection.execute('SELECT * FROM rooms');
    res.json(rows);
    connection.end();
  } catch (error) {
    console.error('Erro ao buscar salas:', error);
    res.status(500).send('Erro ao buscar salas');
  }
});

app.post('/api/reservations', verifyToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).send('Usuário não autenticado');
    }
    const { room_id, date, start_time, end_time } = req.body;
    const user_id = req.user.id;
    if (!room_id || !date || !start_time || !end_time) {
      return res.status(400).send('Dados de reserva incompletos');
    }
    const connection = await connectToDatabase();
    await connection.execute('INSERT INTO reservations (user_id, room_id, date, start_time, end_time) VALUES (?, ?, ?, ?, ?)', [user_id, room_id, date, start_time, end_time]);
    res.status(201).send('Reserva criada com sucesso');
    connection.end();
  } catch (error) {
    console.error('Erro ao fazer a reserva:', error);
    res.status(500).send('Erro ao fazer a reserva');
  }
});

app.get('/api/reservations', verifyToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).send('Usuário não autenticado');
    }
    const user_id = req.user.id;
    const connection = await connectToDatabase();
    const [rows] = await connection.execute('SELECT * FROM reservations WHERE user_id = ?', [user_id]);
    res.json(rows);
    connection.end();
  } catch (error) {
    console.error('Erro ao buscar reservas:', error);
    res.status(500).send('Erro ao buscar reservas');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
