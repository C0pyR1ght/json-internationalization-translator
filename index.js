const fs = require('fs');
const readline = require("readline");
const translate = require('translate');
require('dotenv').config();

translate.engine = 'yandex';
translate.key = process.env.TRANSLATE_KEY;

const rl = readline.createInterface({input: process.stdin, output: process.stdout});

let inputpath = process.env.DEFAULT_FILE;
const promises = [];
rl.question("File to translate: ", function(inputfile) {
    if (inputfile) {
        inputpath = inputfile;
    }
    console.log(`translate ${inputfile}`);
    rl.close();
});

rl.on("close", function() {
    let rawdata = fs.readFileSync(inputpath);
    let jsonObject = JSON.parse(rawdata);

    Object.keys(jsonObject).forEach(key => {
        promises.push(new Promise(async resolve => {
            console.log(key);
            const translatedKey = await translate(key, 'de');
            jsonObject[key] = translatedKey;
            resolve(translatedKey);
        }).then((value)=>{
            console.log(value);
        }))
    });

    Promise.all(promises).then(r => {
        console.log("done");
        fs.writeFileSync(inputpath + ".new", JSON.stringify(jsonObject, null, 4));
        process.exit(1);
    });

});


