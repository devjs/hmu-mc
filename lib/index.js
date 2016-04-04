'use strict';

const plugin = require('hmu-plugin')('minecraft');
const color = plugin.c;
const https = require('https');

module.exports = function minecraft(names) {
  let json = JSON.stringify(names);
  let request = https.request({
    hostname: 'api.mojang.com',
    port: 443,
    path: '/profiles/minecraft',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-length': json.length
    }
  }, res => {
    let body = '';
    res.setEncoding('utf8');
    res.on('data', chunk => {
      body += chunk;
    });
    res.on('end', () => {
      body = body.toString().toLowerCase();
      names.forEach(name => {
        plugin.log(`${name} ${body.indexOf(name) > -1 ? color.red('unavailable') : color.green('available')}`);
      });
    });
  });
  request.on('error', e => plugin.error(e));
  request.write(json);
  request.end();
};
