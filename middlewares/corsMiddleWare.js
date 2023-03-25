exports.addCorsHeaders = (req, res, next) => {
    const allowedOrigins = ['http://localhost:3000', 'https://shopyetu.netlify.app'];
    const origin = req.headers.origin;
    console.log(req.method);
     
    if (allowedOrigins.includes(origin)) {
        console.log(origin);

      res.setHeader('Access-Control-Allow-Origin', origin);
    }
    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      return res.sendStatus(200);
    }
    next();
  }
  