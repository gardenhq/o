const cwd = process.cwd();
var ncp = require('ncp').ncp;

const path = require("path");
const fs = require("fs");
const readline = require('readline');
const node_modules = path.resolve("../../../node_modules");
const shallowUglifyEs = path.resolve(node_modules + "/uglify-es");
const deepUglifyEs = path.resolve("./node_modules/uglify-es");


const warn = (src, dest) => {
    console.warn("n");
    console.warn("");
    console.warn(`== Unless uglify-es is installed in ${dest},`);
    console.warn(`== you won't be able to bundle/minify using a node_modules install`);
    console.warn(`== (maybe try using https://unpkg.com/@garden/o?)`);
    console.warn("");
    console.warn("");
}
const copy = (src, dest) => {
    try {
        console.info(`== Copying:`);
        console.info(`== src: ${src}`);
        console.info(`== dest: ${dest}`);
        ncp(
            src,
            dest,
            function(err)
            {
                if (err) {
                    return console.error(err);
                }
                console.log('== Finished installing a shallow uglify-es');
                process.exit(0);
            }
        );
    } catch(e) {
        console.error("== Problem copying uglify-es, unable to install a shallow uglify-es!");
        throw e;
    }
}
if(
    fs.existsSync(node_modules) && fs.existsSync(deepUglifyEs)
    && !fs.existsSync(shallowUglifyEs)
) {
    console.info("## o uglify-es shallow installer");
    console.info("");
    console.info("== It looks like you have uglify-js installed.");
    console.info("== Therefore uglify-es won't shallow install due to it's uglifyjs executable.");
    console.info(`== o currently expects uglify-es to be shallow installed in ./node_modules`);
    console.info(`== This script will copy uglify-es for you or you can say no (or wait 20 secs)`);
    console.info(`== and read/run the script yourself.`);
    console.info("");
    console.info(`== node ${ __filename }`)
    console.info("");
    console.info(`== Of course, you could also just run:`);
    console.info("");
    console.info(`== cp -R ${ deepUglifyEs } ${shallowUglifyEs} `)
    console.info("");
    console.info(`== or install uglify-es or replace uglify-js with uglify-es:`);
    console.info("");
    console.info(`== npm install --save-dev uglify-es`)
    console.info("");
    console.info(`== About to copy:`);
    console.info(`== src: ${ deepUglifyEs}`);
    console.info(`== dest: ${ shallowUglifyEs }.`);
    console.info(``)
    const user = readline.createInterface(
        {
            input: process.stdin,
            output: process.stdout
        }
    );
    const pause = setTimeout(
        () => {
            warn(deepUglifyEs, shallowUglifyEs);
            user.close();
        },
        20000
    );
    user.question(
        `== Is this ok? (Y/n): `,
        function(answer)
        {
            clearInterval(pause);
            switch(answer.toLowerCase()) {
                case "y":
                case "":
                case "yes":
                    copy(deepUglifyEs, shallowUglifyEs);
                    break;
                default:
                    warn(deepUglifyEs, shallowUglifyEs);
            }
        }
    );
}
