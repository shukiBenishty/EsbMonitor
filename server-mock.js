// @flow
var Kafka = require('no-kafka');
const io = require('socket.io')();
const uuidv4 = require('uuid/v4');
import _ from 'lodash';

// mock correlation Ids
var guids = _.range(100).map( () => {
  return uuidv4();
})

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateEventId() {
  let min = Math.ceil(1);
  let max = Math.floor(1000);
  return getRandomInt(min, max);
}
function generateStatus() {
  let statuses = ['INFO', 'WARNING', 'ERROR'];
  let index = getRandomInt(0, statuses.length-1);
  return statuses[index];
}
// end mocking

io.on('connection', (client) => {
  client.on('subscribeToEsbEvents', (filter) => {
    console.log('React client is subscribing to Esb event with filter: ', filter);

    setInterval(() => {
      const index = getRandomInt(0, 99);

      client.emit('esbEvent', {
                              storyId: guids[index],
                              time:  new Date(),
                              eventId: generateEventId(),
                              status: generateStatus()
                            });
    }, 1000);
  });
});


const port = 8000;
io.listen(port);
console.log('\x1b[36m%s\x1b[0m', 'Kafka Consumer created. Listening on port ' + port + ' for React clients');
