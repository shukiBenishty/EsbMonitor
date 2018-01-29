# EsbMonitor

## How to build

This project depends on the <a href="https://github.com/Tel-Aviv/EsbGQLServer">GraphQL Server for TLV ESB</a>, i.e. it's the GraphQL client; so before you run this project, download, build and run its counterpart. Next, ajust the address of GraphQL server in <code>Environment.js</code>.

When you are done with GraphQL Server,
1. git pull, <code>$ npm i</code> (under Windows, try <code>$ npm i --no-optional</code>) to install all dependencies
2. <code>$ yarn relay</code> to compile graphql templates
2. <code>$ yarn start</code> - to run server side for subscription to Kafka events and emitting sockets or <code>$ yarn start-mock</code> to create mock events without Kafka client
3. Adjust server address in <code>client.jsx</code>
4. Point Web Server for Chrome or IIS to file system folder to host <code>index.html</code>
5. <code>$ yarn build</code> - to create <code>bundle.js</code> referenced in <code>index.html</code>
