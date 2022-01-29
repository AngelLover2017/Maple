// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

const {readData,writeData,parseObjTOCSS} = require('./src/libs/util')
const path = require('path')
let inputData = readData(path.join(__dirname,"./system.config.json"))
writeData(path.join(__dirname,"./dist/css/system.css"),parseObjTOCSS(JSON.parse(inputData),[
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
    "article.md-list",
    "article.md-li",
    "article.md-subli",
    "article.md-pre",
    "article.md-blockcode",
    "article.md-blockquote",
    "article.md-figure",
    "article.md-img",
    "article.md-figcaption",
    "article.md-hr"
]))


// inputData = readData(path.join(__dirname,"./user.config.json"))
// writeData(path.join(__dirname,"./dist/css/user.css"),parseObjTOCSS(JSON.parse(inputData)))