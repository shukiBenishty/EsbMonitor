

var kafka = require('kafka-node');

var Consumer = kafka.Consumer;
var HighLevelConsumer = kafka.HighLevelConsumer;
var Client = kafka.Client;
var Offset = kafka.Offset;

var topics = [
    {
      topic: 'anovi',
      partition:0,
      time: -1
    },
    {
      topic: 'anovi',
      partition:1,
      time: -1
    }
];
var options = {
  autoCommit: true,
  fetchMaxWaitMs: 1000,
  fetchMaxBytes: 1024 * 1024,
  fromOffset: false };

var client = new Client();//'10.1.70.101:9092');

//var consumer = new Consumer(client, topics, options);
var consumer = new Consumer(client, topics, options);
//var offset = new Offset(client);

consumer.on('error', function (err) {
    console.log("Kafka Error: Consumer - " + err);
});

consumer.on('message', function (message) {
    console.log(message);
});

/*
* If consumer get `offsetOutOfRange` event, fetch data from the smallest(oldest) offset
*/
consumer.on('offsetOutOfRange', function (topic) {
  console.log(topic);

  topic.maxNum = 1;
  offset.fetch([topic], function (err, offsets) {
    if (err) {
      return console.error(err);
    }
    var min = Math.min(offsets[topic.topic][topic.partition]);
    consumer.setOffset(topic.topic, topic.partition, min);
  });
});

process.on('SIGINT', function() {
  console.log('Exiting');
  consumer.close(true, function() {
    process.exit();
  });
});
