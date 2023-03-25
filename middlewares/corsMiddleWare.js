exports.addCorsHeaders = (req, res, next) => {
    const allowedOrigins = ['http://localhost:3000', 'https://shopyetu.netlify.app'];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      return res.sendStatus(200);
    }
    next();
  }
  