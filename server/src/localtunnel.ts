const localtunnel = require('localtunnel');

export const tunnel = localtunnel({ 
  port: 3001,
  local_host: 'localhost',
});
