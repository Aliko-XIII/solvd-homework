const { Patient } = require('./models/Patient');

Patient.getPatients().then(res => console.log(res));
