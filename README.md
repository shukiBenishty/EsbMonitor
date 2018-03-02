# EsbMonitor

## How to build

1. This project depends on the <a href="https://github.com/Tel-Aviv/EsbGQLServer">GraphQL Server for TLV ESB</a>, i.e. it's the GraphQL client; so before you run this project, download, build and run its counterpart. Optionally, you may ajust the address of GraphQL server in <code>Environment.js</code>.

2. Some capabilities of this project won't work without direct on connection to Elastic host. Please, adjust Elastic host address in <code>elastic/connection.js</code> file.

When you are done with GraphQL Server and Elastic,
1. git pull, <code>$ npm i</code> (under Windows, try <code>$ npm i --no-optional</code>) to install all dependencies
2. <code>$ yarn relay</code> to compile graphql templates
3. Point Web Server for Chrome or IIS to file system folder to host <code>index.html</code>
4. <code>$ yarn build</code> - to create <code>bundle.js</code> referenced in <code>index.html</code>
