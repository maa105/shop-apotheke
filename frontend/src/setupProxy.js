
const proxy = require('http-proxy-middleware').createProxyMiddleware;

const gitHubToken = ''; // create access token and paste it here (https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line)
module.exports = function(app) {
  app.use(
    '/search',
    proxy({
      target: 'https://api.github.com',
      changeOrigin: true,
      secure: false,
      logLevel: 'debug',
      onProxyReq: (proxyReq, req, res) => {
        if(gitHubToken) {
          proxyReq.setHeader('Authorization', 'token ' + gitHubToken);
        }
      }
    }),
  );
};