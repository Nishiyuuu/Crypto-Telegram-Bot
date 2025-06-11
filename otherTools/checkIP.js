const https = require('https');

https.get('https://ifconfig.me/ip', (res) => {
  res.setEncoding('utf8');
  res.on('data', (data) => {
    console.log('Твій публічний IP:', data.trim());
  });
});
