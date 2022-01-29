const {MDParser} = require('./mdparser');

const mdp = new MDParser();

mdp.setData(`>> blockquote1`);
let t = mdp.lexicalAnalysis().optimizeToken().syntaxAnalysis();
console.log(t,t.vnode.children,t.vnode.children[0].children);
mdp.clear();

