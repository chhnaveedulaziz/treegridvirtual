const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const port = process.env.PORT || 3000;

io.on('connection', socket => {
    console.log('New client connected');

    socket.on('addChild', (tree) => {
        io.sockets.emit('addChild', tree);
    });

    socket.on('addRow', (tree) => {
        io.sockets.emit('addRow', tree);
    });

    socket.on('editRow', (tree) => {
        io.sockets.emit('editRow', tree);
    });

    socket.on('deleteRow', (tree) => {
        io.sockets.emit('deleteRow', tree);
    });

    socket.on('updateColumns', (tree) => {
        io.sockets.emit('updateColumns', tree);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const routes = require('./app/project/routes')(io);

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header('Access-Control-Allow-Methods', 'GET,PATCH,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.json({limit: "100mb"}));
app.use(cors())

app.use('/api/treeGridData', routes);

server.listen(port, () => {
    console.log('Server started on port ' + port);
});

module.exports = app;