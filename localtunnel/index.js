const localtunnel = require('localtunnel');

const data = [
  {subdomain: 'gal-frontend-2', port: 3000},
  {subdomain: 'gal-backend-2', port: 3001},
  {subdomain: 'gal-tabula-2', port: 80},
]

const open = async ({subdomain, port}) => {
  const tunnel = await localtunnel({ 
    port: port,
    subdomain: subdomain,
    local_host: 'localhost',
  });

  console.log(`Opened: ${subdomain}:${port} :: `,tunnel.url);

  tunnel.on('close', () => {
    console.log(`Closed: ${subdomain}:${port} :: `,tunnel.url);
  });
};

data.map(v => open(v));