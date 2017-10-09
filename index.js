const http = require('http');
const fs = require('fs');
let articles = require('./articles.json');
const hostname = '127.0.0.1';
const port = 3005;
const handlers = {
    '/sum': sum,
    '/mult': mult,
    '/api/articles/readall': readAll,
    '/api/articles/read': read
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

function readAll(req,res,payload,cb) {
    cb(null, articles);
}
function read(req,res,payload,cb) {
    let result = articles.find(x=> x.id === payload.id);
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
        if( body.length !== 0) {
            let params = JSON.parse(body);
            cd(null,params);
        }
        else {
            let params = null;
            cd(null,params);
        }
    });
}