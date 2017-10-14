const fs = require('fs');
let articles = require('./articles.json');


class Articles {

    readAll(req, res, data, cb) {
        cb(null, articles);
    };

    read(req, res, data, cb) {
        let result = articles.find(x => x.id === data.id);
        cb(null, result);
    };

    create(req, res, data, cb) {
        data.id = Date.now();
        data.comments = [];
        articles.push(data);
        updateArticles();
        cb(null, data);
    };

    update(req, res, data, cb) {
        for (let i = 0; i < articles.length; i++) {
            if (articles[i].id === data.id)
                Object.assign(articles[i], data);
        }
        updateArticles();
        cb(null, {"message": "Article is update"});
    };

    deleteArticle(req, res, data, cb) {
        for (let i = 0; i < articles.length; i++) {
            if (articles[i].id === data.id) articles.splice(articles.findIndex(x => x.id === data.id), 1);
        }
        updateArticles();
        cb(null, {"message": "Article is delete"});
    };
}

function updateArticles() {
    fs.writeFile('articles.json', JSON.stringify(articles, null, '\t'), function (err) {
        if (err) console.log(err);
    });
}

exports.Articles = Articles;
