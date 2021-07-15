const localtunnel = require('localtunnel');

let url = '';
export const tunnelUrl = () => url;

export const tunnel = localtunnel({ 
  port: 3001,
  local_host: 'localhost',
});

(async() => {
  url = (await tunnel).url;
})()