const fs = require('fs');
let articles = require('./articles.json');
const validator = require('./validator.js');


class Articles {

    readAll(req, res, data, cb) {
        cb(null, articles);
    };

    read(req, res, data, cb) {
        if(validator.isValid(req,res,data,cb)){
            let result = articles.find(x => x.id === data.id);
            cb(null, result);
        }
        else cb(null,{"code": 400,"message":"Request invalid"});
    };

    create(req, res, data, cb) {
        if(validator.isValid(req,res,data,cb)){
            data.id = Date.now();
            data.comments = [];
            articles.push(data);
            updateArticles();
            cb(null, data);
        }
        else cb(null,{"code": 400,"message":"Request invalid"});
    };

    update(req, res, data, cb) {
        if(validator.isValid(req,res,data,cb)){
            for (let i = 0; i < articles.length; i++) {
                if (articles[i].id === data.id)
                    Object.assign(articles[i], data);
            }
            updateArticles();
            cb(null, {"message": "Article is update"});
        }
        else cb(null,{"code": 400,"message":"Request invalid"});
    };

    deleteArticle(req, res, data, cb) {
        if(validator.isValid(req,res,data,cb)){
            for (let i = 0; i < articles.length; i++) {
                if (articles[i].id === data.id) articles.splice(articles.findIndex(x => x.id === data.id), 1);
            }
            updateArticles();
            cb(null, {"message": "Article is delete"});
        }
        else cb(null,{"code": 400,"message":"Request invalid"});
    };
}

function updateArticles() {
    fs.writeFile('articles.json', JSON.stringify(articles, null, '\t'), function (err) {
        if (err) console.log(err);
    });
}

exports.Articles = Articles;
