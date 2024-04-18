const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const mysql = require('mysql2/promise');
const { format } = require('date-fns');
require('dotenv').config(); 

const app = express();
const port = process.env.PORT || 3001;
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
    let { startTime, endTime } = req.query;

    if (!startTime || !endTime) {
      return res.status(400).json({ error: 'Parâmetros incompletos' });
    }

    startTime = new Date(startTime);
    endTime = new Date(endTime);

    const connection = await connectToDatabase();
    const query = `
      SELECT * FROM rooms 
      WHERE id NOT IN (
        SELECT room_id FROM reservations 
        WHERE
          (start_time < ? AND end_time > ?) 
          OR (start_time < ? AND end_time > ?) 
          OR (start_time >= ? AND end_time <= ?)
      )
    `;

    const [availableRooms] = await connection.query(query, [endTime, startTime, endTime, startTime, startTime, endTime]);
    res.json(availableRooms);
  } catch (error) {
    console.error('Erro ao buscar salas disponíveis:', error);
    res.status(500).json({ error: 'Erro ao buscar salas disponíveis' });
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
    
    const formattedDate = format(new Date(date), 'yyyy-MM-dd');
    const formattedStartTime = format(new Date(start_time), 'HH:mm:ss');
    const formattedEndTime = format(new Date(end_time), 'HH:mm:ss');

    const connection = await connectToDatabase();
    await connection.execute('INSERT INTO reservations (user_id, room_id, date, start_time, end_time, status) VALUES (?, ?, ?, ?, ?, ?)', [user_id, room_id, formattedDate, formattedStartTime, formattedEndTime, 'pending']);
    res.status(201).send('Reserva criada com sucesso');
    connection.end();
  } catch (error) {
    console.error('Erro ao fazer a reserva:', error);
    res.status(500).send('Erro ao fazer a reserva');
  }
});

app.put('/api/reservations/:id', verifyToken, async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(401).send('Acesso não autorizado');
    }
    const { id } = req.params;
    const { status } = req.body;
    if (!id || !status) {
      return res.status(400).send('Dados incompletos');
    }
    const connection = await connectToDatabase();
    await connection.execute('UPDATE reservations SET status = ? WHERE id = ?', [status, id]);
    res.status(200).send('Status da reserva atualizado com sucesso');
    connection.end();
  } catch (error) {
    console.error('Erro ao atualizar o status da reserva:', error);
    res.status(500).send('Erro ao atualizar o status da reserva');
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
