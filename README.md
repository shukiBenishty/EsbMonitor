# EsbMonitor

## How to build
1. After git pull, <code>npm i</code> to install all dependencies
2. <code>npm start</code> - to run server side for subscription to Kafka events and emitting sockets or <code>npm run start-mock</code> to create mock events without Kafka client
3. Adjust server address in <code>client.jsx</code>
4. Point Web Server for Chrome or IIS to file system folder to host <code>index.html</code>
5. <code>npm build</code> - to create <code>bundle.js</code> referenced in <code>index.html</code>
