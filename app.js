// cPanel Phusion Passenger Startup File
process.env.NODE_ENV = 'production';
require('./dist/server.cjs');
