const fs = window.require('fs');

function readData(address) {
    let data = fs.readFileSync(address, 'utf8');
    return data;
}

function writeData(address,data){
    fs.writeFileSync(address,data);
}
function parseObjTOCSS(obj,configList){
    let css = "";
    configList.forEach((ele)=>{
        let config = obj;
        let arr = ele.split(".")
        arr.forEach(args=>{
            config = typeof config[args] == 'undefined'? undefined:config[args]
        })
        let outputData = ""
        if(typeof config != 'undefined'){
            outputData = `.${arr[arr.length-1]}{`
            for( let key in config){
                outputData += `${key}:${config[key]};`
            }
            outputData += '}';
        }
        css += outputData;
    })
    return css;
}

module.exports = {
    readData,
    writeData,
    parseObjTOCSS,
};