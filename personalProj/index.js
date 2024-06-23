const express = require('express');
const userRoutes = require('./routes/userRoutes');

const port = 3000;
const app = express();

app.use(userRoutes);
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Hello, it is hospital app');
});

app.use('/users', userRoutes);


app.listen(port, () => {
    console.log(`Hospital app listening on port ${port}`)
})


