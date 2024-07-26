//Module imports
const express = require('express');
require('dotenv').config();

//Routes imports
const userRoutes = require('./routes/userRoutes');
const patientRoutes = require('./routes/patientRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const symptomRoutes = require('./routes/symptomRoutes');
const organRoutes = require('./routes/organRoutes');
const specializationRoutes = require('./routes/specializationRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const authorizationRoutes = require('./routes/authorizationRoutes')

//Additional functions
const {validateToken } = require('./controllers/authorizationController');

//App setup 
const app = express();
app.use(express.json());

//CORS handler
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

//Authorization routes
app.use('/api/authorization', authorizationRoutes);

//Access token validation middleware
app.use(validateToken);

//Test route
app.get('/', (req, res) => {
  res.send('Hello, it is hospital app');
});

// API routes
app.use('/api/users', userRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/symptoms', symptomRoutes);
app.use('/api/organs', organRoutes);
app.use('/api/specializations', specializationRoutes);
app.use('/api/appointments', appointmentRoutes);


//Server listening port
app.listen(process.env.PORT, () => {
  console.log(`Hospital app listening on port ${process.env.PORT}`);
})


