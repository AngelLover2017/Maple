const md5 = window.require('md5-node')
class MDParser {
    /*
    * input 输入的字符串
    */
    constructor(input) {
        /*
         * data 输入的字符序列
         * tokens 输出的token流
         * tnode 抽象语法树 
        */
        this.data = input ? input + '\r\n' : "";
        this.tokens = [];
        this.vnode = {};
        this.newVnode = {};
        this.dom = {};
        this.option = {};
        this.firstIDGenerator = 0;
        this.firstCallVnode = true;
    }
    clear(){
        this.data = "";
        this.tokens = [];
        this.vnode = {};
        this.newVnode = {};
        this.dom = {};
        this.option = {};
        this.firstIDGenerator = 0;
        this.firstCallVnode = true;
    }
    setData(input) {
        this.data = input + '\r\n';
    }
    getTokens() {
        return this.tokens;
    }
    getVnode() {
        return this.vnode;
    }
    getNewVnode() {
        return this.newVnode;
    }
    getOption() {
        return this.option;
    }
    getFirstCallVnode() {
        return this.firstCallVnode;
    }
    getDOM() {
        return this.dom;
    }
    /*
     * lexicalAnalysis 词法分析过程
    */
    lexicalAnalysis() {
        let tokens = [];
        let token = [];
        //提交正确识别的token
        const emitToken = (type, token) => {
            tokens.push({
                type,
                token
            })
        }
        let init = function (obj, attrs) {
            for (let i = 0; i < attrs.length; i++) {
                obj[attrs[i]] = function () { };
            }
        }
        /* */
        let allFunc = {}
        init(allFunc, [
            'start',
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'toh1', 'toh2', 'toh3', 'toh4', 'toh5', 'toh6',
            'em1', 'em2', 'em3', 'strong1', 'strong2', 'strong3', 'emstrong1', 'emstrong2', 'emstrong3',
            'hr1', 'hr2', 'hr3',
            'ul', 'toul',
            'ol', 'toorderlist1', 'toorderlist2',
            'sublist', 'tosublist1', 'tosublist2', 'tosublist3',
            'toblockquote', 'bqtag',
            'code', 'tocodeblock', 'codeblock',
            'linebreak1', 'linebreak2',
            'tobr1', 'tobr2', 'br1', 'br2',
            'toescape', 'escape',
            'urlbegin', 'urlend', 'imgtag', 'tipbegin', 'tipend', 'linkbegin', 'linkend'
        ]);
        /**
         * 
         * @param {Array<string  | RegExp>} testchar 当前状态下一个要匹配字符或正则表示的集合
         * @param {Array<string>} nextMatch 当前状态下一个可能达到状态的集合，需与testchar集合一一对应
         * @param {boolean} isEndStatus 当前状态是否是终结状态
         * @param {string} otherStatus 匹配失败，当前字符应交给那个状态函数
         * @param {string} tokenLabel Token类型名称
         */
        let factory = function (otherStatus) {
            //生成模板函数
            return function (isEndStatus) {
                return function (testchar) {
                    return function (nextMatch) {
                        return function (tokenLabel) {
                            //生成真实的函数
                            return function (char, tag) {
                                if (!(tag === 'none')) token.push(char);

                                for (let [index, fname] of nextMatch.entries()) {
                                    let isString = typeof testchar[index] === 'string'
                                    let isRgx = testchar[index] instanceof RegExp
                                    if (isString && testchar[index] === char) {
                                        return allFunc[fname];
                                    }
                                    if (isRgx && testchar[index].test(char)) {
                                        return allFunc[fname];
                                    }
                                    //对于下一个匹配为none的状态表示不匹配任何字符就进入下一个状态
                                    if (testchar[index] === 'none') {
                                        return allFunc[fname](char, 'none');
                                    }

                                }
                                // 没有匹配到状态，若为闭状态则生成对应token，若为开放状态则默认为 文本 token，然后丢给开始重新判断
                                token.pop();
                                if (token.length > 0) {
                                    if (isEndStatus) {
                                        //后退1格
                                        emitToken(tokenLabel, token.join(''));
                                    } else {
                                        emitToken('text', token.join(''));
                                    }
                                }
                                token = [];
                                return allFunc[otherStatus](char, "");
                            }
                        }
                    }
                }
            }


        }

        /* predefined */
        allFunc.text = function (char, tag) {
            tag = 'text'
            emitToken(tag, char);
            return allFunc.start;
        }
        let toStartTrueTemplate = factory("start")(true);
        let toStartFalseTemplate = factory("start")(false);
        let endStatusTemplate = toStartTrueTemplate([])([]);
        /* title */
        allFunc.h6 = endStatusTemplate("h6");
        allFunc.h5 = endStatusTemplate("h5");
        allFunc.h4 = endStatusTemplate("h4");
        allFunc.h3 = endStatusTemplate("h3");
        allFunc.h2 = endStatusTemplate("h2");
        allFunc.h1 = endStatusTemplate("h1");
        let hTemplate = toStartTrueTemplate(['#', ' ']);
        allFunc.toh6 = toStartFalseTemplate([' '])(["h6"])("");
        allFunc.toh5 = hTemplate(["toh6", "h5"])("");
        allFunc.toh4 = hTemplate(["toh5", "h4"])("");
        allFunc.toh3 = hTemplate(["toh4", "h3"])("");
        allFunc.toh2 = hTemplate(["toh3", "h2"])("");
        allFunc.toh1 = hTemplate(["toh2", "h1"])("");
        /* bold italic */
        let starT = toStartTrueTemplate(['*'])
        let underT = toStartTrueTemplate(['_'])
        let rmT = toStartTrueTemplate(['-'])
        allFunc.em1 = toStartTrueTemplate([' ', '*'])(['ul', 'strong1'])("em");
        allFunc.em3 = underT(['strong3'])("em")
        allFunc.strong1 = starT(['emstrong1'])("strong")
        allFunc.strong3 = underT(['emstrong3'])("strong")
        allFunc.emstrong1 = starT(['hr1'])("emstrong")
        allFunc.emstrong3 = underT(['hr3'])('emstrong')
        allFunc.hr1 = starT(['hr1'])("hr")
        allFunc.hr2 = rmT(['hr2'])("hr");
        allFunc.tohr21 = toStartFalseTemplate([' ', '-'])(["ul", "tohr22"])("");
        allFunc.tohr22 = rmT(['tohr23'])("");
        allFunc.tohr23 = rmT(['hr2'])("")
        allFunc.hr3 = underT(['hr3'])('hr')
        allFunc.toul = toStartFalseTemplate([' '])(['ul'])("")
        allFunc.ul = endStatusTemplate("ul")
        /* linebreak */
        allFunc.linebreak1 = toStartTrueTemplate(['\n'])(['linebreak2'])("linebreak")
        allFunc.linebreak2 = endStatusTemplate("linebreak")
        /* br sublist */
        allFunc.tobr1 = toStartFalseTemplate([' '])(['tobr2'])("")
        allFunc.tobr2 = toStartFalseTemplate([' ', '\r', '\n'])(['tosublist', 'br1', 'br2'])("")
        allFunc.br1 = toStartTrueTemplate(['\n'])(['br2'])("br")
        allFunc.br2 = endStatusTemplate("br")
        allFunc.tosublist = toStartFalseTemplate([' '])(['sublist'])("")
        allFunc.sublist = endStatusTemplate("sublist")
        /* code codeblock */
        allFunc.code = toStartTrueTemplate(['`'])(['tocodeblock'])('code');
        allFunc.tocodeblock = toStartFalseTemplate(['`'])(['codeblock'])("");
        allFunc.codeblock = endStatusTemplate('codeblock');
        /* escape */
        allFunc.toescape = toStartFalseTemplate([/^[\\`*_{}[\]()<>#+-.!|]$/])(['escape'])("")
        allFunc.escape = endStatusTemplate('escape');
        /* ol */
        allFunc.toorderlist1 = toStartFalseTemplate(['.'])(['toorderlist2'])("")
        allFunc.toorderlist2 = toStartFalseTemplate([' '])(['ol'])("")
        allFunc.ol = toStartTrueTemplate([' '])(['ol'])("ol")
        /* urlbegin urlend imgtag tipbegin tipend linkbegin linkend */
        allFunc.urlbegin = endStatusTemplate('urlbegin')
        allFunc.urlend = toStartTrueTemplate([' ', '>'])(['bqtag', 'toblockquote'])('urlend')
        allFunc.imgtag = endStatusTemplate('imgtag')
        allFunc.tipbegin = endStatusTemplate('tipbegin')
        allFunc.tipend = endStatusTemplate('tipend')
        allFunc.linkbegin = endStatusTemplate('linkbegin')
        allFunc.linkend = endStatusTemplate('linkend')
        /* bqtag */
        allFunc.toblockquote = toStartFalseTemplate(['>', ' '])(['toblockquote', 'bqtag'])("")
        allFunc.bqtag = toStartTrueTemplate([' '])(['bqtag'])('bqtag');
        /* start */
        allFunc.start = factory("text")(false)([
            '#', '_', '*', '-', '+', '\r', '\n', ' ', '\t', '`', '\\', /^[0-9]$/, '!', '[', ']', '(', ')', '<', '>'
        ])([
            "toh1", "em3", "em1", "tohr21", "toul", "linebreak1", "linebreak2", "tobr1", "sublist", "code", "toescape", "toorderlist1", "imgtag", "tipbegin", "tipend", "linkbegin", "linkend", "urlbegin", "urlend"
        ])("");

        //主控程序
        let state = allFunc.start;
        let input = this.data.split('');
        for (let char of input) {
            state = state(char, "");
        }
        this.tokens = tokens;
        return this;
    }
    /**
     * Token流序列优化处理
     */
    optimizeToken() {
        let tokens = []
        this.tokens.push(...[
            { type: 'linebreak', token: '\r\n' },
            { type: 'linebreak', token: '\r\n' },
            { type: 'endfile', token: '' }
        ])
        for (let i = 0; i < this.tokens.length;) {
            let item = this.tokens[i];
            let content = ""
            let isText = false
            while (item.type === 'text') {
                isText = true
                content = content + item.token;
                // console.log("in:", item)
                i++;
                item = this.tokens[i];
            }
            // console.log("out:", isText)
            !isText ? tokens.push(item)
                : tokens.push({
                    type: "text",
                    token: content
                });
            i = isText ? i : ++i;
        }
        this.tokens = tokens;
        return this;
    }
    /* 
     * syntaxAnalysis 语法分析过程,构建Vnode
     * 递归下降分析
    */
    syntaxAnalysis() {
        let tokens = this.tokens;
        this.firstIDGenerator++;
        let secondIDGenerator = 0;
        let index = 0;
        const idGenerator = () => {
            secondIDGenerator++;
            return md5('' + this.firstIDGenerator + secondIDGenerator);
        }
        const match = (tokenExpected) => {
            //匹配到预期token，指针向前移动一位
            let val = tokens[index];
            if (val.type == tokenExpected) {
                index += 1;
                return val.token;
            } else {
                console.log('[error:tokenUnExpected ' + tokenExpected + ']:what expected is ' + tokens[index].type);
                // context.children.push(val.token);
                return false;
            }
        }
        //
        const changeTo = (oldindex, newType) => {
            if (tokens[oldindex].type != 'linebreak' && tokens[oldindex].type != 'endfile') {
                let newToken = tokens[oldindex].token;
                tokens[oldindex] = {
                    type: newType,
                    token: newToken
                }
            }
        }
        const changeAllTo = (start, curIndex, newType) => {
            for (let i = start; i < curIndex; i++) {
                changeTo(i, newType);
            }
            index = start;
        }
        /* article 文章 */
        const article = () => {
            let article = {
                nodeName: "article",
                attributes: {
                    id: idGenerator(),
                    class: "md-article"
                },
                children: []
            };
            //未到文件结尾
            while (tokens[index].type != 'endfile') {
                let typeFirst = tokens[index].type;
                let typeSecond = tokens[++index].type;
                index--;
                let context = article.children;
                if (["h1", "h2", "h3", "h4", "h5", "h6"].includes(typeFirst)) {
                    let res = h();
                    typeof res == 'undefined' ? '' : context.push(res);
                }
                else if (["text", "em", "strong", "code", "tipbegin", "urlbegin"].includes(typeFirst)) {
                    let res = p();
                    typeof res == 'undefined' ? '' : context.push(res);
                }
                else if (["ul", "ol", "sublist"].includes(typeFirst)) {
                    let res = list();
                    typeof res == 'undefined' ? '' : context.push(res);
                }
                else if (["codeblock"].includes(typeFirst)) {
                    let res = blockcode();
                    typeof res == 'undefined' ? '' : context.push(res);
                }
                else if (["bqtag"].includes(typeFirst)) {
                    let res = blockquote();
                    typeof res == 'undefined' ? '' : context.push(res);
                }
                else if (["imgtag"].includes(typeFirst)) {
                    let res = figure();
                    typeof res == 'undefined' ? '' : context.push(res);
                }
                else if (["hr"].includes(typeFirst)) {
                    let res = horizontal();
                    typeof res == 'undefined' ? '' : context.push(res);
                }
                else if (typeFirst === 'emstrong') {
                    if (["text", "strong", "em", "emstrong", "tipend"].includes(typeSecond)) {
                        let res = p();
                        typeof res == 'undefined' ? '' : context.push(res);
                    }
                    if (["linebreak"].includes(typeSecond)) {
                        let res = horizontal();
                        typeof res == 'undefined' ? '' : context.push(res);
                    }

                }
                else if (typeFirst === 'linebreak') {
                    match('linebreak');
                    continue;
                }
                //否则都搞成text
                else changeTo(index, 'text');
            }
            match('endfile');
            return article;
        }
        /* h */
        const h = function () {
            let h = {
                nodeName: "h$",//上下文匹配
                attributes: {
                    id: idGenerator(),
                    class: "md-h$"
                },
                children: []
            };
            let start = index;
            let typeFirst = tokens[index].type;
            if (["h1", "h2", "h3", "h4", "h5", "h6"].includes(typeFirst)) {
                //
                h.nodeName = typeFirst;
                h.attributes.class = "md-" + typeFirst;
                match(typeFirst);
            } else {
                changeAllTo(start, index, 'text');
                return;
            }
            while (tokens[index].type != 'linebreak' && tokens[index].type != 'endfile') {
                if (tokens[index].type === 'text') {
                    h.children.push(tokens[index].token);
                    match('text');
                }
                else changeTo(index, 'text');
            }
            if (tokens[index].type === 'linebreak')
                match('linebreak');
            else {
                changeAllTo(start, index, 'text');
                return;
            }
            return h;
        }
        /* p */
        const p = function () {
            let p = {
                nodeName: 'p',
                attributes: {
                    id: idGenerator(),
                    class: 'md-p'
                },
                children: []
            };
            let typeFirst = tokens[index].type;
            while (typeFirst != 'linebreak' && typeFirst != 'endfile') {
                while (typeFirst != 'linebreak' && typeFirst != 'endfile') {
                    if (["text", "strong", "em", "emstrong", "code", "tipbegin", "urlbegin"].includes(typeFirst))
                        pitem(p);
                    else changeTo(index, 'text');
                    typeFirst = tokens[index].type;
                }
                match('linebreak');
                typeFirst = tokens[index].type;
            }
            match('linebreak');
            return p;
        }
        /* pitem */
        const pitem = function (context) {
            let start = index;
            let typeFirst = tokens[index].type;
            if (["text", "em", "strong", "emstrong"].includes(typeFirst))
                content(context);
            else if (["code"].includes(typeFirst)) {
                let res = inlinecode();
                typeof res == 'undefined' ? '' : context.children.push(res);
            }
            else if (["tipbegin", "urlbegin"].includes(typeFirst))
                link(context);
            else {
                changeAllTo(start, index, 'text');
                return;
            }
        }
        /* content */
        const content = function (context) {
            let start = index;
            let typeFirst = tokens[index].type;
            if (typeFirst === 'text') {
                context.children.push(tokens[index].token);
                match('text');
            }
            else if (typeFirst === 'strong') {
                let res = bold();
                typeof res == "undefined" ? '' : context.children.push(res);
            }
            else if (typeFirst === 'em') {
                let res = italic()
                typeof res == "undefined" ? '' : context.children.push(res);
            }
            else if (typeFirst === 'emstrong') {
                let res = bolditalic()
                typeof res == "undefined" ? '' : context.children.push(res);
            }
            else {
                changeAllTo(start, index, 'text');
                return;
            }
        }
        /* bold */
        const bold = function () {
            let strong = {
                nodeName: 'strong',
                attributes: {
                    id: idGenerator(),
                    class: 'md-strong'
                },
                children: []
            };
            let start = index;
            if (tokens[index].type === 'strong')
                match('strong');
            else {
                changeAllTo(start, index, 'text');
                return;
            }

            while (!['strong', 'linebreak', 'endfile'].includes(tokens[index].type)) {
                if (tokens[index].type === 'text') {
                    strong.children.push(tokens[index].token);
                    match('text');
                }
                else changeTo(index, 'text');
            }
            if (tokens[index].type === 'strong')
                match('strong');
            else {
                changeAllTo(start, index, 'text');
                return;
            }
            return strong;
        }
        /* italic */
        const italic = function () {
            let em = {
                nodeName: 'em',
                attributes: {
                    id: idGenerator(),
                    class: 'md-em'
                },
                children: []
            };
            let start = index;
            if (tokens[index].type === 'em')
                match('em');
            else {
                changeAllTo(start, index, 'text');
                return;
            }

            while (!['em', 'linebreak', 'endfile'].includes(tokens[index].type)) {
                if (tokens[index].type === 'text') {
                    em.children.push(tokens[index].token);
                    match('text');
                }
                else changeTo(index, 'text');
            }
            if (tokens[index].type === 'em')
                match('em');
            else {
                changeAllTo(start, index, 'text');
                return;
            }
            return em;
        }
        /* bolditalic */
        const bolditalic = function () {
            let emstrong = {
                nodeName: 'strong',
                attributes: {
                    id: idGenerator(),
                    class: 'md-strong'
                },
                children: [
                    {
                        nodeName: 'em',
                        attributes: {
                            id : idGenerator(),
                            class: 'md-em'
                        },
                        children: []
                    }
                ]
            };
            let start = index;
            if (tokens[index].type === 'emstrong')
                match('emstrong');
            else {
                changeAllTo(start, index, 'text');
                return;
            }

            while (!['emstrong', 'linebreak', 'endfile'].includes(tokens[index].type)) {
                if (tokens[index].type === 'text') {
                    emstrong.children[0].children.push(tokens[index].token);
                    match('text');
                }
                else changeTo(index, 'text');
            }
            if (tokens[index].type === 'emstrong')
                match('emstrong');
            else {
                changeAllTo(start, index, 'text');
                return;
            }

            return emstrong;
        }
        /* inlinecode */
        const inlinecode = function () {
            let code = {
                nodeName: 'code',
                attributes: {
                    id: idGenerator(),
                    class: 'md-code'
                },
                children: []
            };
            let start = index;
            if (tokens[index].type === 'code')
                match('code');
            else {
                changeAllTo(start, index, 'text');
                return;
            }

            while (!['code', 'endfile', 'linebreak'].includes(tokens[index].type)) {
                if (tokens[index].type === 'text') {
                    code.children.push(tokens[index].token);
                    match('text');
                }
                else changeTo(index, 'text');
            }

            if (tokens[index].type === 'code')
                match('code');
            else {
                changeAllTo(start, index, 'text');
                return;
            }

            return code;
        }
        /* link */
        const link = function (context) {
            let start = index;
            let typeFirst = tokens[index].type;
            if (typeFirst === 'tipbegin') {
                let res = tiplink();
                typeof res == 'undefined' ? '' : context.children.push(res);
            }
            else if (typeFirst === 'urlbegin') {
                let res = notiplink();
                typeof res == 'undefined' ? '' : context.children.push(res);
            }
            else {
                changeAllTo(start, index, 'text');
                return;
            }
        }
        /* tiplink */
        const tiplink = function () {
            let a = {
                nodeName: 'a',
                attributes: {
                    id: idGenerator(),
                    class: 'md-a',
                    target: "_blank",
                    href: ""
                },
                children: []
            };
            let start = index;
            if (tokens[index].type === 'tipbegin')
                match('tipbegin');
            else {
                changeAllTo(start, index, 'text');
                return;
            }

            while (!['tipend', 'linebreak', 'endfile'].includes(tokens[index].type)) {
                if (["text", "em", "strong", "emstrong"].includes(tokens[index].type))
                    content(a);
                else changeTo(index, 'text');
            }
            if (tokens[index].type === 'tipend')
                match('tipend');
            else {
                changeAllTo(start, index, 'text');
                return;
            }
            if (tokens[index].type === 'linkbegin')
                match('linkbegin');
            else {
                changeAllTo(start, index, 'text');
                return;
            }

            while (!['linkend', 'linebreak', 'endfile'].includes(tokens[index].type)) {
                if (tokens[index].type === 'text') {
                    a.attributes.href = tokens[index].token;
                    match('text');
                }
                else changeTo(index, 'text');
            }
            if (tokens[index].type === 'linkend')
                match('linkend');
            else {
                changeAllTo(start, index, 'text');
                return;
            }

            return a;
        }
        /* notiplink */
        const notiplink = function () {
            let a = {
                nodeName: 'a',
                attributes: {
                    id: idGenerator(),
                    class: 'md-a',
                    target: "_blank",
                    href: ""
                },
                children: []
            };
            let start = index;
            if (tokens[index].type === 'urlbegin')
                match('urlbegin');
            else {
                changeAllTo(start, index, 'text');
                return;
            }

            while (!['urlend', 'linebreak', 'endfile'].includes(tokens[index].type)) {
                if (tokens[index].type === 'text') {
                    a.attributes.href = tokens[index].token;
                    a.children.push(tokens[index].token);
                    match('text');
                }
                else changeTo(index, 'text');
            }
            if (tokens[index].type === 'urlend')
                match('urlend');
            else {
                changeAllTo(start, index, 'text');
                return;
            }

            return a;
        }
        /* list */
        const list = function () {
            let list = {
                nodeName: '$l',
                attributes: {
                    id: idGenerator(),
                    class: 'md-list'
                },
                children: []
            }
            let start = index;
            while (tokens[index].type != 'linebreak' && tokens[index].type != 'endfile') {
                if (tokens[index].type === 'ul') {
                    list.nodeName = "ul";
                    let res = ulistitem();
                    typeof res == 'undefined' ? '' : list.children.push(res);
                }
                else if (tokens[index].type === 'ol') {
                    list.nodeName = "ol";
                    let res = olistitem();
                    typeof res == 'undefined' ? '' : list.children.push(res);
                }
                else if (tokens[index].type === 'sublist') {
                    let res = slist();
                    typeof res == 'undefined' ? '' : list.children.push(res);
                }
                else {
                    changeAllTo(start, index, 'text');
                    return;
                }
            }
            if (tokens[index].type === 'linebreak')
                match("linebreak");
            else {
                changeAllTo(start, index, 'text');
                return;
            }
            return list;
        }
        /* ulistitem */
        const ulistitem = function () {
            let li = {
                nodeName: 'li',
                attributes: {
                    id: idGenerator(),
                    class: 'md-li'
                },
                children: []
            };
            let start = index;
            if (tokens[index].type === 'ul')
                match('ul');
            else {
                changeAllTo(start, index, 'text');
                return;
            }
            while (tokens[index].type != 'linebreak' && tokens[index].type != 'endfile') {
                if (["text", "em", "strong", "emstrong"].includes(tokens[index].type))
                    content(li);
                else changeTo(index, 'text');
            }
            if (tokens[index].type === 'linebreak')
                match("linebreak");
            else {
                changeAllTo(start, index, 'text');
                return;
            }
            return li;
        }
        /* olistitem */
        const olistitem = function () {
            let li = {
                nodeName: 'li',
                attributes: {
                    id: idGenerator(),
                    class: 'md-li'
                },
                children: []
            };
            let start = index;
            if (tokens[index].type === 'ol')
                match('ol');
            else {
                changeAllTo(start, index, 'text');
                return;
            }
            while (tokens[index].type != 'linebreak' && tokens[index].type != 'endfile') {
                if (["text", "em", "strong", "emstrong"].includes())
                    content(li);
                else changeTo(index, 'text');
            }
            if (tokens[index].type === 'linebreak')
                match("linebreak");
            else {
                changeAllTo(start, index, 'text');
                return;
            }
            return li;
        }
        /* slist */
        const slist = function () {
            let li = {
                nodeName: 'li',
                attributes: {
                    id: idGenerator(),
                    class: 'md-subli'
                },
                children: []
            }
            let start = index;
            while (tokens[index].type != 'linebreak' && tokens[index].type != 'endfile') {
                if (tokens[index].type === 'sublist')
                    slistitem(li);
                else {
                    changeAllTo(start, index, 'text');
                    return;
                }
            }
            if (tokens[index].type === 'linebreak')
                match("linebreak");
            else {
                changeAllTo(start, index, 'text');
                return;
            }
            return li;
        }
        /* slistitem */
        const slistitem = function (context) {
            let start = index;
            if (tokens[index].type === 'sublist')
                match('sublist');
            else {
                changeAllTo(start, index, 'text');
                return;
            }
            if (tokens[index].type === 'ul') {
                let res = ulistitem();
                typeof res == 'undefined' ? '' : context.children.push(res);
            }
            else if (tokens[index].type === 'ol') {
                let res = olistitem();
                typeof res == 'undefined' ? '' : context.children.push(res);
            }
            else if (tokens[index].type === 'bqtag') {
                let res = blockquote();
                typeof res == 'undefined' ? '' : context.children.push(res);
            }
            else if (tokens[index].type === 'codeblock') {
                let res = blockcode()
                typeof res == 'undefined' ? '' : context.children.push(res);
            }
            else if (tokens[index].type === 'imgtag') {
                let res = figure()
                typeof res == 'undefined' ? '' : context.children.push(res);
            }
            else if (["text", "em", "strong", "emstrong", "code", "tipbegin", "urlbegin"].includes(tokens[index].type)) {
                let res = p();
                typeof res == 'undefined' ? '' : context.children.push(res);
            }
            else {
                changeAllTo(start, index, 'text');
                return;
            }
        }
        /* blockcode */
        const blockcode = function () {
            let pre = {
                nodeName: 'pre',
                attributes: {
                    id: idGenerator(),
                    class: 'md-pre'
                },
                children: [
                    {
                        nodeName: 'code',
                        attributes: {
                            id : idGenerator(),
                            class: 'md-blockcode'
                        },
                        children: []
                    }
                ]
            }
            let start = index;
            if (tokens[index].type === 'codeblock')
                match("codeblock");
            else {
                changeAllTo(start, index, 'text');
                return;
            }
            while (tokens[index].type != 'linebreak' && tokens[index].type != 'endfile') {
                //这里匹配代码块的语言名称，这里先留下
                if (tokens[index].type === 'text')
                    match("text");
                else changeTo(index, 'text');
            }
            if (tokens[index].type === 'linebreak')
                match("linebreak");
            else {
                changeAllTo(start, index, 'text');
                return;
            }

            let codeText = "";
            while (tokens[index].type != 'codeblock' && tokens[index].type != 'endfile') {
                //将匹配到的都转化为text放入块中
                codeText += tokens[index].token;
                index++;
            }
            pre.children[0].children.push(codeText);
            if (tokens[index].type === 'codeblock')
                match("codeblock");
            else {
                changeAllTo(start, index, 'text');
                return;
            }
            if (tokens[index].type === 'linebreak')
                match("linebreak");
            else {
                changeAllTo(start, index, 'text');
                return;
            }
            return pre;
        }
        /* blockquote */
        const blockquote = function () {
            let blockquote = {
                nodeName: 'blockquote',
                attributes: {
                    id: idGenerator(),
                    class: 'md-blockquote'
                },
                children: []
            }
            let start = index;
            while (tokens[index].type != 'linebreak' && tokens[index].type != 'endfile') {
                if (tokens[index].type === 'bqtag')
                    bqitem(blockquote);
                else {
                    changeAllTo(start, index, 'text');
                    return;
                }
            }
            //
            if (tokens[index].type === 'linebreak')
                match('linebreak');
            else {
                changeAllTo(start, index, 'text');
                return;
            }
            return blockquote;
        }
        /* bqitem */
        const bqitem = function (context) {
            let start = index;
            if (tokens[index].type === 'bqtag')
                match('bqtag');
            else {
                changeAllTo(start, index, 'text');
                return;
            }
            while (tokens[index].type != 'linebreak' && tokens[index].type != 'endfile') {
                if (["ul", "ol", "sublist"].includes(tokens[index].type))
                    list(context);
                else if (["text", "strong", "em", "emstrong", "code", "tipbegin", "urlbegin"].includes(tokens[index].type))
                    pitem(context);
                else changeTo(index, 'text');
            }
            if (tokens[index].type === 'linebreak')
                match('linebreak');
            else {
                changeAllTo(start, index, 'text');
                return;
            }
            return;
        }
        /* figure */
        const figure = function () {
            let figure = {
                nodeName: 'figure',
                attributes: {
                    id: idGenerator(),
                    class: 'md-figure'
                },
                children: [
                    {
                        nodeName: 'img',
                        attributes: {
                            id : idGenerator(),
                            class: 'md-img',
                            width : '100%',
                            height : 'auto',
                            src: ""
                        },
                        children: []
                    },
                    {
                        nodeName: 'figcaption',
                        attributes: {
                            id : idGenerator(),
                            class: 'md-figcaption'
                        },
                        children: []
                    }
                ]
            };
            let start = index;
            if (tokens[index].type === 'imgtag')
                match('imgtag');
            else {
                changeAllTo(start, index, 'text');
                return;
            }
            if (tokens[index].type === 'tipbegin')
                match('tipbegin');
            else {
                changeAllTo(start, index, 'text');
                return;
            }
            while (!['tipend', 'endfile', 'linebreak'].includes(tokens[index].type)) {
                if (["text", "em", "strong", "emstrong"].includes(tokens[index].type))
                    content(figure.children[1]);
                else changeTo(index, 'text');
            }
            if (tokens[index].type === 'tipend')
                match('tipend');
            else {
                changeAllTo(start, index, 'text');
                return;
            }
            if (tokens[index].type === 'linkbegin')
                match("linkbegin");
            else {
                changeAllTo(start, index, 'text');
                return;
            }
            while (!['linkend', 'endfile', 'linebreak'].includes(tokens[index].type)) {
                if (tokens[index].type === 'text') {
                    figure.children[0].attributes.src = tokens[index].token;
                    match("text");
                }
                else changeTo(index, 'text');
            }
            if (tokens[index].type === 'linkend')
                match("linkend");
            else {
                changeAllTo(start, index, 'text');
                return;
            }
            if (tokens[index].type === 'linebreak')
                match("linebreak");
            else {
                changeAllTo(start, index, 'text');
                return;
            }
            return figure;
        }
        /* horizontal */
        const horizontal = function () {
            let hr = {
                nodeName: 'hr',
                attributes: {
                    id: idGenerator(),
                    class: 'md-hr'
                },
                children: []
            };
            let start = index;
            if (tokens[index].type === 'hr')
                match("hr");
            else if (tokens[index].type === 'emstrong')
                match("emstrong");
            else {
                changeAllTo(start, index, 'text');
                return;
            }
            if (tokens[index].type === 'linebreak')
                match('linebreak');
            else {
                changeAllTo(start, index, 'text');
                return;
            }
            return hr;
        }
        //主控程序:执行递归下降分析
        if (this.firstCallVnode) {
            this.vnode = article();
            this.firstCallVnode = false;
        }
        else
            this.newVnode = article();
        return this;
    }
    createDOM(treeNode) {
        let domNode;
        if (typeof treeNode === 'string') {
            domNode = document.createTextNode(treeNode);
        } else {
            domNode = document.createElement(treeNode.nodeName);
        }
        if (typeof treeNode.attributes != 'undefined') {
            for (let ele in treeNode.attributes) {
                let attr = document.createAttribute(ele);
                attr.value = treeNode.attributes[ele];
                domNode.setAttributeNode(attr);
            }
        }
        // console.log(domNode);
        return domNode;
    }
    /**
    * 前序遍历语法分析树，构建DOM结构
    */
    generateDOM(vnode) {
        //定义数据结构
        let track = [];
        let domtrack = [];
        //初始化
        let treeNode = vnode;
        let DOM = this.createDOM(treeNode)
        track.push(treeNode);
        domtrack.push(DOM);
        while (track.length > 0) {
            //去栈顶元素
            let topNode = track.pop();
            let parentDOM = domtrack.pop();
            let iscontinue = typeof topNode === 'string' ? true : (topNode.children.length === 0);
            if (iscontinue) continue;
            for (let val of topNode.children.values()) {
                let childDOM = this.createDOM(val)
                parentDOM.appendChild(childDOM)
                track.push(val)
                domtrack.push(childDOM)
            }
        }
        return DOM;
    }
    firstBuild() {
        this.dom = this.generateDOM(this.vnode);
        return this;
    }
    diffBuild() {
        this.diff(this.getVnode(), this.getNewVnode()).updateDOM();
        return this;
    }
    /**
     * diff
     * @param {oldTree} T1 
     * @param {newTree} T2 
     */
    diff(T1, T2) {
        console.log("T1-diff",T1);
        let option = {
            delete: [],
            insert: [],
            replace: []
        }
        let T1_level = []
        let T2_level = []

        T1_level.push(T1)
        T2_level.push(T2)

        while (T1_level.length != 0 || T2_level.length != 0) {
            //对T1,T2同时层次遍历，然后同级进行diff差异比较
            let T1_pnode = T1_level.pop()
            let T2_pnode = T2_level.pop()
            //
            let T1_children = T1_pnode.children ? T1_pnode.children : [];
            let T2_children = T2_pnode.children ? T2_pnode.children : [];
            //同级Mapping算法
            let M_T1_to_T2 = new Map()
            let M_T2_to_T1 = new Map()
            for (let [i, T2node] of T2_children.entries()) {
                for (let [j, T1node] of T1_children.entries()) {
                    let flag = false
                    if (typeof T2node === 'string' || typeof T1node === 'string') {
                        if (T2node === T1node) flag = true;
                    }
                    else if (T2node.nodeName === T1node.nodeName) flag = true;
                    if (flag) {
                        if (M_T2_to_T1.has(i)) break;
                        else if (M_T1_to_T2.has(j)) continue;
                        else {
                            //没有匹配则直接匹配
                            M_T2_to_T1.set(i, j)
                            M_T1_to_T2.set(j, i)
                            //id
                            typeof T2_children[i] === 'string' ? "" :
                                T2_children[i].attributes.id = T1_children[j].attributes.id;
                        }
                    }
                }
            }
            console.log(M_T1_to_T2 ,M_T2_to_T1)
            /* 遍历Map，生成该级编辑脚本
             * 对于T1_children，未匹配的要做删除操作
             * 对于T2_children，未匹配的要做创建与插入操作
             * 对于已经匹配到的，但是节点属性不同的，要替换属性
             */
            for (let [index, item] of T1_children.entries()) {
                if (!M_T1_to_T2.has(index)) {
                    // 顺便构建新的虚拟DOM
                    T1_pnode.children.splice(index,1);
                    //生成操作脚本
                    option.delete.push({
                        optName: 'delete',
                        type: item.attributes ? "ele" : 'text',
                        args: item.attributes ? [item.attributes.id] : [T1_pnode.attributes.id, index]
                    })
                }
            }
            for (let [index, item] of T2_children.entries()) {
                if (M_T2_to_T1.has(index)) {
                    let T2node = item
                    let T1node = T1_children[M_T2_to_T1.get(index)]
                    let flag = typeof T1node === 'string' || typeof T2node === 'string';
                    if (!flag) {
                        let isSameLength = Object.keys(T1node.attributes).length == Object.keys(T2node.attributes).length ? true : false;
                        let hasDiffEle = false;
                        if (isSameLength) {
                            for (let key in T1node.attributes) {
                                if (T1node.attributes[key] != T2node.attributes[key]) {
                                    hasDiffEle = true;
                                    break;
                                }
                            }
                        }
                        if (!isSameLength || hasDiffEle){
                            // 顺便重构虚拟DOM
                            T1node.attributes = T2node.attributes;
                            //生成操作脚本
                            option.replace.push({
                                optName: 'replace',
                                type: 'attr',
                                args: [T1node.attributes.id, T1node.attributes, T2node.attributes] //把T1中的删掉，T2中的添加
                            })
                        }
                    }
                } else {
                    //顺便重构虚拟DOM
                    T1_pnode.children.splice(index,0,item);
                    //先生成自己的id，然后再插入T1
                    option.insert.push({
                        optName: 'insert',
                        type: item.attributes ? "ele" : 'text',
                        args: [T1_pnode.attributes.id, index, item]
                    })
                    // index < T1_children.length ?
                    //     console.log("insetBefore:" + (item.attributes ? item.attributes.id : item)) : console.log("appendChild:" + (item ? item.attributes.id : item));
                    // insertBefore(newNode,id):appendChild();
                }
            }
            //确定下一次迭代入队节点,只有匹配节点可以进入下次迭代
            for (let [i, j] of M_T1_to_T2.entries()) {
                T1_level.push(T1_children[i])
                T2_level.push(T2_children[j])
            }
        }
        this.option = option
        console.log("option-diff",option)
        console.log("T1-diff",T1)
        this.vnode = T1
        return this;
    }

    updateDOM() {
        console.log(this.getOption())
        for (let item of this.option.replace.values()) {
            let obj = document.getElementById(item.args[0])
            //添加属性：obj.setAttribute('attr_name','attr_value');
            //删除属性：obj.removeAttribute('attr_name');
            for (let key in item.args[1]) {
                if(key != 'id')
                    obj.removeAttribute(key)
            }
            for (let key in item.args[2]) {
                if(key != 'id')
                    obj.setAttribute(key, item.args[2][key])
            }
        }
        for (let item of this.option.delete.values()) {
            //删除节点：
            let obj = document.getElementById(item.args[0])
            if (item.type === 'ele') {
                obj.parentNode.removeChild(obj)
            }
            if (item.type === 'text') {
                let child = obj.childNodes[item.args[1]]
                console.log(obj)
                console.log(obj.childNodes)
                console.log(obj.innerHTML)
                console.log(obj.innerText)
                console.log(obj.children)
                console.log(child)
                obj.removeChild(child)
            }
        }
        for (let item of this.option.insert.values()) {
            // node.insertBefore(newnode,existingnode)
            console.log(this.getDOM())
            let obj = document.getElementById(item.args[0])
            console.log(item)
            console.log(obj)
            let refChildDOM = obj.childNodes[item.args[1]]
            let newchildDOM = this.generateDOM(item.args[2])
            console.log(obj)
            console.log(refChildDOM)
            console.log(newchildDOM)
            obj.insertBefore(newchildDOM, refChildDOM)
        }
        return this;
    }
}
module.exports = {
    MDParser
};