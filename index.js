const http = require('http');

const hostname = '127.0.0.1';
const port = 3005;
const handlers = {
    '/sum': sum,
    '/mult': mult
};

const server = http.createServer((req, res) => {
    parseBodyJson(req,(err,payload) =>{
        const handler = getHandler(req.url);

        handler(req,res,payload,(err,result) =>{
            if(err){
                res.statusCode = err.code;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(err));
                return;
            }
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(result));
        });
    });
});

server.listen(port,hostname,() => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
function getHandler(url) {
    return handlers[url] || notFound;
}
function sum(req,res,payload,cb) {
    const result = { c: payload.a + payload.b };
    cb(null, result);
}
function mult(req,res,payload,cb) {
    const result = { c: payload.a * payload.b };
    cb(null, result);
}
function notFound(req,res,payload,cb) {
    cb({code: 404, message:'Not Found'});
}
function parseBodyJson(req, cd) {
    let body = [];
    req.on('data',function (chunk) {
       body.push(chunk);
    }).on('end',function () {
        body = Buffer.concat(body).toString();
        let params = JSON.parse(body);
        cd(null,params);
    });
}