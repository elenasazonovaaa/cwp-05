const http = require('http');
const fs = require('fs');
let articles = require('./articles.json');
const articlesJS = require('./articles.js');
const commentsJS = require('./comments.js');
const hostname = '127.0.0.1';
const port = 3005;
const handlers = {
    '/api/articles/readall': readAll,
    '/api/articles/read': read,
    '/api/articles/create': create,
    '/api/articles/update': update,
    '/api/articles/delete': deleteArticle,
    '/api/comments/create': createComments,
    '/api/comments/delete': deleteComments
};
let LOG={};
const server = http.createServer((req, res) => {
    parseBodyJson(req,(err,payload) =>{
        const handler = getHandler(req.url);

        Logging(req.url,payload);

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
function create (req,res,payload,cb) {
    payload.id = Date.now();
    payload.comments = [];
    articles.push(payload);
    updateArticles();
    cb(null, payload);
}
function update(req,res,payload,cb) {
    for(let i = 0; i < articles.length; i++){
        if(articles[i].id === payload.id)
            Object.assign(articles[i],payload);
    }
    updateArticles();
    cb(null,{"message": "Article is update"});
}
function deleteArticle(req,res,payload,cb){
    for(let i = 0; i< articles.length; i++){
        if(articles[i].id === payload.id) articles.splice(articles.findIndex(x => x.id === payload.id), 1);
    }
    updateArticles();
    cb(null,{"message":"Article is delete"});
}

function createComments(req,res,payload,cb) {
    for(let i =  0 ; i < articles.length; i++){
        if(articles[i].id === payload.articleId){
            payload.id = Date.now();
            articles[i].comments.push(payload);
        }
    }
    updateArticles();
    cb(null,payload);
}
function deleteComments(req,res,payload,cb) {
    for(let i =  0 ; i < articles.length; i++){
        let countComments = articles[i].comments.length;
        for(let k = 0; k < countComments; k++){
            if(articles[i].comments[k].id === payload.id)
                articles[i].comments.splice(articles[i].comments.findIndex(x => x.id === payload.id), 1);
        }
    }
    updateArticles();
    cb(null,{"message":"Comment is delete"});
}
function updateArticles() {
    fs.writeFile('articles.json',JSON.stringify(articles,null,'\t'), function (err) {
        if(err) console.log(err);
    });
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

function Logging(url, body) {
    LOG.date = new Date().toLocaleString();
    LOG.url = url;
    LOG.body = body;
    fs.readFile('LOG.json',function (err,data){
        let json = JSON.parse(data);
        json.push(LOG);
        fs.writeFile('LOG.json',JSON.stringify(json, null,'\t')+'\n',(err)=>{if(err) console.log('Err in create LOG');});
    });
}