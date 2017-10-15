const articles = require('./articles.json');
exports.isValid = function (req, res, data, cb) {
    switch(req.url){
        case '/api/articles/read': return hasID(data.id); break;
        case '/api/articles/create': return data.title&&data.text&&data.data&&data.author&&isProperty(data); break;
        case '/api/articles/update': return isProperty(data); break;
        case '/api/articles/delete': return hasID(data.id); break;
        case '/api/comments/create': return hasID(data.articleId)&&data.text&&data.date&&data.author&&isPropertyComments(data); break;
        case '/api/comments/delete': return hasIDComments(data.id); break;
    }
};

function isProperty(data) {
    let valid = true;
    let property = Object.getOwnPropertyNames(data);
    for(let i = 0; i < property.length; i++){
        if(property[i] !== 'id' && property[i] !== 'title' && property[i] !== 'text' && property[i] !== 'data' && property[i] !== 'author' && property[i] !== 'comments')
            valid = false;
    }
    return valid;
}
function isPropertyComments(data) {
    let valid = true;
    let property = Object.getOwnPropertyNames(data);
    for(let i = 0; i < property.length; i++){
        if(property[i] !== 'text' && property[i] !== 'date' && property[i] !== 'author'&& property[i] !== 'articleId' )
            valid = false;
    }
    return valid;
}
function hasID(id) {
    let valid = false;
    for(let i = 0; i < articles.length; i++)
        if(articles[i].id === id) valid = true;
    return valid;
}
function hasIDComments(id) {
    let valid = false;
    for (let i = 0; i < articles.length; i++) {
        let countComments = articles[i].comments.length;
        for (let k = 0; k < countComments; k++)
            if (articles[i].comments[k].id === id)
                valid = true;
    }
    return valid;
}