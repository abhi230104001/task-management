const http = require('http');
const jwt = require('jsonwebtoken');

const token = jwt.sign({ id: '60d0fe4f5311236168a109ca' }, 'supersecretkey12345');

const data = JSON.stringify({
  title: 'Test',
  description: 'Test',
  status: 'todo',
  priority: 'low'
});

const req = http.request({
  hostname: '127.0.0.1',
  port: 5000,
  path: '/api/tasks',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length,
    'Authorization': 'Bearer ' + token
  }
}, res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => console.log('Response:', res.statusCode, body));
});

req.on('error', console.error);
req.write(data);
req.end();
