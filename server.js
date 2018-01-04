var io = require('socket.io')();

var Kafka = require('no-kafka');
var consumer = new Kafka.SimpleConsumer({
  connectionString: '10.1.70.101:9092',
  asyncCompression: true
});

io.on('connection', (client) => {
  client.on('subscribeToEsbevents', data => {
    console.log('Client subscribed');
  })
});


function callSockets(io, message) {
  io.sockets.emit('esbevents', message);
}

var topics = [
    {
      topic: 'anovi',
      partition:0,
      time: new Date()
    }
];

var dataHandler = function (messageSet, topic, partition) {
    messageSet.forEach(function (m) {

        const message = m.message.value.toString('utf8');

        console.log(topic, partition, m.offset);//, m.message.value.toString('utf8'));
        callSockets(io, message);
    });
};

consumer.init().then(function () {
    // Subscribe partitons 0 and 1 in a topic:
    return consumer.subscribe('anovi', [0, 1],
                              dataHandler);

    // consumer.fetchOffset(topics).then(function (result) {
    //     console.log(result);
    // });
});

const port = 8000;
io.listen(port);
console.log('\x1b[36m%s\x1b[0m', 'Kafka Consumer created. Listening on port ' + port + ' for React clients');
