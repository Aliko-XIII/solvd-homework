const express = require('express');
const port = 3000;
const app = express();

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.get('/users/:userId', (req, res) => {
    res.send('id:' + req.params.userId);
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})


