const rgxRule = {
    //done
    title: {
        type: "title",
        rgx: /^#{1,6} +$/,
        html: '<h>'
    },
    // 一个paragraph至少需要两个及以上个linebreak
    paragraph: {
        type: "paragraph",
        rgx: /^((\r\n){2,}|(\n){2,}|(\r){2,})$/,
        html: '<p>'
    },
    //done
    linebreak: {
        type: 'linebreak',
        rgx: /^(\r\n|\n|\r)$/,
        html: '<none>'
    },
    //done
    newline: {
        type: 'newline',
        rgx: /^ {2,}((\r\n)|(\n)|(\r))$/,
        html: '<br>'
    },
    //done
    bold: {
        type: 'bold',
        rgx: /^(\*\*|__)$/,
        html: '<strong>'
    },
    //done
    italic: {
        type: 'italic',
        rgx: /^(\*|_)$/,
        html: '<em>'
    },
    //done
    blockquote: {
        type: 'blockquote',
        rgx: /^>+ +$/,
        html: '<blockquote>'
    },
    //done
    orderlist: {
        type: 'orderlist',
        rgx: /^[0-9]\. +$/,
        html: '<ol>'
    },
    //done
    unorderlist: {
        type: 'unorderlist',
        rgx: /^[-\*\+] +$/,
        html: '<ul>'
    },
    //done
    sublist: {
        type: 'sublist',
        rgx: /^( {4}|\t)$/,
        html: '<any>'
    },
    //done
    horizontal: {
        type: 'horizontal',
        rgx: /^[\*-_]{3,}((\r\n)|(\n)|(\r))$/,
        html: '<hr>'
    },
    //done
    code: {
        type: 'code',
        rgx: /$`^/,
        html: '<code>'
    },
    //done
    codeblock: {
        type: 'codeblock',
        rgx: /^```$/,
        html: '<pre>'
    },
    link: {
        type: 'link',
        rgx: /^([a-zA-Z]+:)?(\/\/|\\\\)?([\w-]+(\.[\w-]+)+)?((\.|\.\.)?((\\|\/)[^\?\*\\\/\<\>\:"\|\n\r]+)+)(\\|\/)?([^\?\*\\\/\<\>\:"\|\n\r]+(\.[a-zA-Z])?)?(\?([\w-]+=.+)(&[\w-]+=.+)*)?(#.+)?$/,
        rgxP: /a/,
        html: '<none>'
    },
    email: {
        type: 'email',
        rgx: /^[a-z\d]+(\.[a-z\d]+)*@([\da-z](-[\da-z])?)+(\.{1,2}[a-z]+)+$/,
        html: '<none>'
    },
    //done
    escape: {
        type: 'escape',
        rgx: /^\\[\\`\*_\{\}\[\]\(\)#\+-\.!\|]$/,
        html: '<none>'
    },
    //done
    imgtag: {
        type: 'imgtag',
        rgx: /^\!$/,
        html: '<img>'
    },
    //done
    tipbegin: {
        type: 'tipbegin',
        rgx: /^\[$/,
        html: '<none>'
    },
    //done
    tipend: {
        type: 'tipend',
        rgx: /^\]$/,
        html: '<none>'
    },
    //done
    linkbegin: {
        type: 'linkbegin',
        rgx: /^\($/,
        html: '<none>'
    },
    //done
    linkend: {
        type: 'linkend',
        rgx: /^\)$/,
        html: '<none>'
    },
    //done
    urlbegin: {
        type: 'urlbegin',
        rgx: /^<$/,
        html: '<none>'
    },
    //done
    urlend: {
        type: 'urlend',
        rgx: /^>$/,
        html: '<none>'
    }
}

//isEnd=false时默认belongto="child"
//isEnd=true时默认belongto="none"
//required默认为true
const grammarRule = {

    article: {
        funcName: "article",
        nodeStruct: {
            nodeName: "article",
            attributes: {
                class: "md-article"
            },
            children: []
        },
        grammarStruct: [
            "and",//操作
            [
                "loop",
                [
                    "or",
                    { isEnd: false, type: "h"},
                    { isEnd: false, type: "p" },
                    { isEnd: false, type: "list" },
                    { isEnd: false, type: "blockcode" },
                    { isEnd: false, type: "blockquote" },
                    { isEnd: false, type: "figture" },
                    { isEnd: false, type: "horizontal" },
                    { isEnd: false, type: "html" },
                    { isEnd: true, type: "linebreak" }
                ]
            ],
            { isEnd: true, type: "endfile" }
        ]
    },
    h: {
        funcName: 'h',
        nodeStruct: {
            nodeName: "h$",//上下文匹配
            attributes: {
                class: "md-h$",
                nodeValue: ""
            }
        },
        grammarStruct: [
            "and",
            [
                "or",
                {isEnd:true,type:"h1",$:"1"},
                {isEnd:true,type:"h2",$:"2"},
                {isEnd:true,type:"h3",$:"3"},
                {isEnd:true,type:"h4",$:"4"},
                {isEnd:true,type:"h5",$:"5"},
                {isEnd:true,type:"h6",$:"6"}
            ],
            {isEnd:true,type:"text",belongto:"nodeValue"},
            {isEnd:true,type:"linebreak"}
        ]

    },
    p:{
        funcName : 'p',
        nodeStruct : {
            nodeName:'p',
            attributes:{
               class:'md-p',
               nodeValue:null 
            },
            child:null
        },
        grammarStruct : [
            "and",
            [
                "loop",
                [
                    "and",
                    [
                        "loop",
                        {isEnd:false,type:"pitem"}
                    ],
                    {isEnd:true,type:"linebreak"}
                ]
            ],
            {isEnd:true,type:"linebreak"}
        ]
    },
    pitem : {
        funcName : 'pitem',
        nodeStruct : this.p.nodeStruct,
        grammarStruct : [
            "or",
            {isEnd:false,type:"content"},
            {isEnd:false,type:"inlinecode"},
            {isEnd:false,type:"link"}
        ]
    },
    content : {
        funcName : 'content',
        nodeStruct : this.pitem.nodeStruct,
        grammarStruct : [
            "or",
            {isEnd:true,type:"text"}, //???
            {isEnd:false,type:"bold"},
            {isEnd:false,type:"italic"},
            {isEnd:false,type:"bolditalic"}
        ]
    },
    bold : {
        funcName : 'bold',
        nodeStruct : {
            nodeName:"strong",
            attributes:{
                class:'md-strong',
                nodeValue : null
            },
            child:null
        },
        grammarStruct : [
            "and",
            {isEnd:true,type:"  strong"},
            {isEnd:true,type:"text"},
            {isEnd:true,type:"strong"}
        ]
    },
    italic : {
        funcName : 'italic',
        nodeStruct : {
            nodeName:'em',
            attributes:{
                class:'md-em',
                nodeValue:null
            },
            child:null
        },
        grammarStruct : [
            "and",
            {isEnd:true,type:"em"},
            {isEnd:true,type:"text"},
            {isEnd:true,type:"em"}
        ]
    },
    bolditalic : {
        funcName : 'bolditalic',
        nodeStruct : {
            nodeName:'strong',
            attributes:{

            },
            child : {
                nodeName:'em',
                attributes:{

                },
                child:null
            }
        },
        grammarStruct : [
            "and",
            {isEnd:true,type:"emstrong"},
            {isEnd:true,type:"text"},
            {isEnd:true,type:"emstrong"}
        ]
    },
    inlinecode : {
        funcName : 'inlinecode',
        nodeStruct : {
            nodeName:"code",
            attributes:{

            },
            child : null
        },
        grammarStruct : [
            "and",
            {isEnd:true,type:"code"},
            {isEnd:true,type:"text"},
            {isEnd:true,type:"code"}
        ]
    },
    link : {
        funcName : 'link',
        nodeStruct : this.pitem.nodeStruct,
        grammarStruct : [
            "or",
            {isEnd:false,type:"tiplink"},
            {isEnd:false,type:"nottiplink"}
        ]
    },
    tiplink : {
        funcName : 'tiplink',
        nodeStruct : {

        },
        grammarStruct : [
            "and",
            {isEnd:true,type:"tipbegin"},
            {isEnd:false,type:"content",required:false},
            {isEnd:true,type:"tipend"},
            {isEnd:true,type:"linkbegin"},
            {isEnd:true,type:"text"},
            {isEnd:true,type:"linkend"}
        ]
    },
    nottiplink : {
        funcName : 'nottiplink',
        nodeStruct : {

        },
        grammarStruct : [
            "and",
            {isEnd:true,type:"urlbegin"},
            {isEnd:true,type:"text"},
            {isEnd:true,type:"urlend"}
        ]
    },
    list : {
        funcName : 'list',
        nodeStruct : {

        },
        grammarStruct : [
            "and",
            [
                "loop",
                [
                    "or",
                    {isEnd:false,type:"ulistitem"},
                    {isEnd:false,type:"olistitem"},
                    {isEnd:false,type:"slist"},
                ]
            ],
            {isEnd:true,type:'linebreak'}
        ]
    },
    ulistitem : {
        funcName : 'ulistitem',
        nodeStruct : {

        },
        grammarStruct : [
            "and",
            {isEnd:true,type:"ul"},
            {isEnd:false,type:"content"},
            {isEnd:true,type:"linebreak"}
        ]
    },
    olistitem : {
        funcName : 'olistitem',
        nodeStruct : {

        },
        grammarStruct : [
            "and",
            {isEnd:true,type:"ol"},
            {isEnd:false,type:"content"},
            {isEnd:true,type:"linebreak"}
        ]
    },
    slist : {
        funcName : 'slist',
        nodeStruct : {

        },
        grammarStruct : [
            "and",
            [
                "loop",
                {isEnd:false,type:"slistitem"}
            ],
            {isEnd:true,type:"linebreak"}
        ]
    },
    slistitem : {
        funcName : 'slistitem',
        nodeStruct : {

        },
        grammarStruct : [
            "and",
            {isEnd:true,type:'sublist'},
            [
                "or",
                {isEnd:false,type:"ulistitem"},
                {isEnd:false,type:"olistitem"},
                {isEnd:false,type:"blockquote"},
                {isEnd:false,type:"blockcode"},
                {isEnd:false,type:"figure"},
                {isEnd:false,type:"p"}
            ]
        ]
    },
    blockcode : {
        funcName : 'blockcode',
        nodeStruct : {

        },
        grammarStruct : [

        ]
    },
    blockquote : {
        funcName : 'blockquote',
        nodeStruct : {

        },
        grammarStruct : [
            "and",
            [
                "loop",
                {isEnd:false,type:"bqitem"}
            ],
            {isEnd:true,type:"linebreak"}
        ]
    },
    bqitem : {
        funcName : 'bqitem',
        nodeStruct : {

        },
        grammarStruct : [
            "and",
            {isEnd:true,type:"bqtag"},
            [
                "or",
                {isEnd:false,type:"pitem"},
                {isEnd:false,type:"list"}
            ],
            {isEnd:true,type:"linebreak"}
        ]
    },
    figure : {
        funcName : 'figure',
        nodeStruct : {
            nodeName : 'figure',
            attributes:{
                class:'md-figure',
            },
            children:[
                {
                    nodeName:"img",
                    attributes:{
                        class:"md-img"
                    }
                },
                {
                    nodeName:'figcaption',
                    attributes:{
                        class:'md-figcaption'
                    }
                }
            ]
        },
        grammarStruct : [
            "and",
            {isEnd:true,type:"imgtag"},
            {isEnd:true,type:"tipbegin"},
            {isEnd:false,type:"content",required:false},
            {isEnd:true,type:"tipend"},
            {isEnd:true,type:"linkbegin"},
            {isEnd:true,type:"text"},
            {isEnd:true,type:"linkend"},
            {isEnd:true,type:"linebreak"}
        ]
    },
    horizontal : {
        funcName : 'horizontal',
        nodeStruct : {
            nodeName:"hr",
            attributes:{
                class:'md-hr',
            }
        },
        grammarStruct : [
            "and",
            [
                "or",
                {isEnd:true,type:"hr"},
                {isEnd:true,type:"emstrong"}
            ],
            {isEnd:true,type:"linebreak"}
        ]
    },
    html : {
        funcName : 'html',
        nodeStruct : {

        },
        grammarStruct : [

        ]
    }
}

function test(obj, str) {
    console.log(obj.type, obj.rgx.test(str), str)
}
// 
test(rule.title, "")
test(rule.title, "# ")
test(rule.title, "% ")
test(rule.title, "######### ")
//
test(rule.paragraph, "\r\n")
test(rule.paragraph, "\n")
test(rule.paragraph, "\n\r")
test(rule.paragraph, "\r")
test(rule.paragraph, "\r\n\r\n")
//
test(rule.line, " \r\n")
test(rule.line, "  \r\n")
test(rule.line, "   \n")
test(rule.line, "   \n\r")
//
test(rule.bold, "**")
test(rule.bold, "__")
test(rule.bold, "___")
test(rule.bold, "***")
//
test(rule.blockquote, "> ")
test(rule.blockquote, ">> ")
test(rule.blockquote, ">>>")
test(rule.blockquote, ">>>   ")
//
test(rule.orderlist, "1. ")
test(rule.orderlist, "1.   ")
test(rule.orderlist, "#.   ")
test(rule.orderlist, "0.")
//
test(rule.unorderlist, "# ")
test(rule.unorderlist, "- ")
test(rule.unorderlist, "+ ")
test(rule.unorderlist, "2 ")
test(rule.unorderlist, "*    ")
//
test(rule.sublist, "    ")
test(rule.sublist, "     ")
test(rule.sublist, "    ")
//
test(rule.horizontal, "***\r\n")
test(rule.horizontal, "---\r\n")
test(rule.horizontal, "___\r\n")
test(rule.horizontal, "__\r\n")
test(rule.horizontal, "*****\n")
test(rule.horizontal, "*****\n\r")
//
test(rule.escape, "\\\\")
//
test(rule.link, "https://www.jb51.net/tools/sdfdf12122")
test(rule.link, "/tools/")
test(rule.link, "/assets/images/tux.png")
test(rule.link, "https://blog.csdn.net/AngelLover2017/article/details/104614774")
test(rule.link, "https://img-blog.csdnimg.cn/20200321181137847.jpg?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0FuZ2VsTG92ZXIyMDE3,size_16,color_FFFFFF,t_70#pic_center")
test(rule.link, "https://www.markdownguide.org/basic-syntax/#code")
test(rule.link, "D:\\毕业设计\\论文相关文档\\软件学院关于开展2020届本科毕业设计（论文）工作的通知\\2020届毕业设计论文附件模板\\2020（届毕业）设计论文附件模板")
test(rule.link, "D:\\毕业设计\\论文相关文档\\软件学院关于开展2020届本科毕业设计（论文）工作的通知\\2020届毕业设计论文附件模板\\2020（届毕业）设计论文附件模板\\")
test(rule.link, "\\毕业设计\\论文相关文档\\软件学院关于开展2020届本科毕业设计（论文）工作的通知\\2020届毕业设计（论文）附件模板\\2020届毕业设计（论文）附件模板")
test(rule.link, "\\毕业设计\\论文相关文档\\软件学院关于开展2020届本科毕业设计（论文）工作的通知\\2020届毕业设计（论文）附件模板\\2020届毕业设计（论文）附件模板\\")
test(rule.link, "\\毕业设计\\论文相关\r文档\\软件学院关于开展2020届本科毕业设计（论文）工作的通知\\2020届毕业设计（论文）附件模板\\2020届毕业设计（论文）附件模板\\")


