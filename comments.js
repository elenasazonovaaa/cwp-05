const fs = require('fs');
let articles = require('./articles.json');
const validator = require('./validator.js');

class Comments {
    createComments(req, res, data, cb) {
        if(validator.isValid(req, res, data, cb)){
            for (let i = 0; i < articles.length; i++) {
                if (articles[i].id === data.articleId) {
                    data.id = Date.now();
                    articles[i].comments.push(data);
                }
            }
            updateArticles();
            cb(null, data);
        }
        else cb(null,{"code": 400,"message":"Request invalid"});
    };

    deleteComments(req, res, data, cb) {
        if(validator.isValid(req, res, data, cb)){
            for (let i = 0; i < articles.length; i++) {
                for (let j = 0; j < articles[i].comments.length; j++) {
                    if (data.id === articles[i].comments[j].id) {
                        articles[i].comments.splice(j, 1);
                    }
                }
            }
            updateArticles();
            cb(null, {"message": "Comment is delete"});
        }
        else cb(null,{"code": 400,"message":"Request invalid"});
    };
}

function updateArticles() {
    fs.writeFile('articles.json', JSON.stringify(articles, null, '\t'), function (err) {
        if (err) console.log(err);
    });
}

exports.Comments = Comments;