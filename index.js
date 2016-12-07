var parseCss = require('./lib/parseCss');

var fs = require('fs');

var css = fs.readFileSync('./example/demo.css', 'utf-8');


function transform(source) {
    var style = parseCss(source.replace(/\r?\n|\r/g, ""));

    console.log(style);
    console.log(typeof style)
}

transform(css);

