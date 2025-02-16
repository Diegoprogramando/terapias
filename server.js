const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Conectar a MongoDB
mongoose.connect('mongodb://localhost:27017/terapias_holisticas').then(() => {
  console.log('Conectado a MongoDB');
}).catch((error) => {
  console.error('Error al conectar a MongoDB:', error);
});

// Definir el esquema y modelo de usuario
const userSchema = new mongoose.Schema({
  nombre: String,
  telefono: String,
  correo: String,
  tema: String,
  mensaje: String
});

const User = mongoose.model('User', userSchema);

// Definir el esquema y modelo de turno
const turnoSchema = new mongoose.Schema({
  fecha: String,
  hora: String,
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const Turno = mongoose.model('Turno', turnoSchema);

// Ruta para manejar el envío de mensajes y la reserva de turnos
app.post('/enviar-mensaje', async (req, res) => {
  const { nombre, telefono, correo, tema, mensaje, fecha, hora } = req.body;

  if (!nombre || !telefono || !correo || !tema || !mensaje || !fecha || !hora) {
    return res.json({ error: 'Por favor, completa todos los campos.' });
  }

  const currentDate = new Date().toISOString().split('T')[0];
  const currentTime = new Date().toTimeString().slice(0, 5);

  if (fecha < currentDate || (fecha === currentDate && hora <= currentTime)) {
    return res.json({ error: 'Por favor, selecciona una fecha y una hora válidas.' });
  }

  try {
    const newUser = new User({ nombre, telefono, correo, tema, mensaje });
    await newUser.save();

    const newTurno = new Turno({ fecha, hora, usuario: newUser._id });
    await newTurno.save();

    res.json({ message: 'Mensaje enviado y turno reservado correctamente' });
  } catch (error) {
    console.error('Error al guardar el turno:', error);
    res.status(500).json({ error: 'Error al guardar el turno' });
  }
});

// Ruta para obtener todos los mensajes
app.get('/mensajes', async (req, res) => {
  const usuarios = await User.find();
  res.json(usuarios);
});

// Ruta para obtener todos los turnos
app.get('/turnos', async (req, res) => {
  const turnos = await Turno.find().populate('usuario');
  res.json(turnos);
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
