const express = require('express');

const userRoutes = require('./routes/userRoutes');
const patientRoutes = require('./routes/patientRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const symptomRoutes = require('./routes/symptomRoutes');
const organRoutes = require('./routes/organRoutes');
const specializationRoutes = require('./routes/specializationRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');

const port = 3000;
const app = express();

app.use(express.json());


app.get('/', (req, res) => {
    res.send('Hello, it is hospital app');
});

app.use('/users', userRoutes);
app.use('/patients', patientRoutes);
app.use('/doctors', doctorRoutes);
app.use('/symptoms', symptomRoutes);
app.use('/organs', organRoutes);
app.use('/specializations', specializationRoutes);
app.use('/appointments', appointmentRoutes);


app.listen(port, () => {
    console.log(`Hospital app listening on port ${port        // if (typeof locationOrgan !== 'object') {
        //     throw new Error('Organ should be object');
        // }
}`)
})


