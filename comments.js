const fs = require('fs');
let articles = require('./articles.json');

class Comments {
    createComments(req, res, data, cb) {
        for (let i = 0; i < articles.length; i++) {
            if (articles[i].id === data.articleId) {
                data.id = Date.now();
                articles[i].comments.push(data);
            }
        }
        updateArticles();
        cb(null, data);
    };

    deleteComments(req, res, data, cb) {
        for (let i = 0; i < articles.length; i++) {
            let countComments = articles[i].comments.length;
            for (let k = 0; k < countComments; k++) {
                if (articles[i].comments[k].id === data.id)
                    articles[i].comments.splice(articles[i].comments.findIndex(x => x.id === data.id), 1);
            }
        }
        updateArticles();
        cb(null, {"message": "Comment is delete"});
    };
}

function updateArticles() {
    fs.writeFile('articles.json', JSON.stringify(articles, null, '\t'), function (err) {
        if (err) console.log(err);
    });
}

exports.Comments = Comments;