const express = require('express');
const app = express();
var path = require('path');
const port = 3000;
app.use("/Public",express.static(__dirname + '/Public'))

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))