const fs = require('fs');

function readData(address) {
    let data = fs.readFileSync(address, 'utf8');
    return data;
}
function writeData(address,data){
    fs.writeFileSync(address,data);
}
function parseObjTOCSS(obj){
    let css = "";
    [
        "sidebar","content","editbar","footer",
        "article.md-article",
        "article.md-h1",
        "article.md-h2",
        "article.md-h3",
        "article.md-h4",
        "article.md-h5",
        "article.md-h6",
        "article.md-p",
        "article.md-strong",
        "article.md-em",
        "article.md-code",
        "article.md-a",
        "article.md-ul",
        "article.md-ol",
        "article.md-li",
        "article.md-subli",
        "article.md-pre",
        "article.md-blockcode",
        "article.md-blockquote",
        "article.md-figure",
        "article.md-img",
        "article.md-figcaption",
        "article.md-hr"
    ].forEach((ele)=>{
        let config = obj;
        ele.split(".").forEach(args=>{
            config = config[args]
        })
        let outputData = `.${ele}{`
        for( let key in config){
            outputData += `${key}:${config[key]};`
        }
        outputData += '}';
        css += outputData;
    })
    return css;
}

module.exports = {
    readData,
    writeData,
    parseObjTOCSS,
};