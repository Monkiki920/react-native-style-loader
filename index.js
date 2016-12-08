var parseCss = require('./lib/parseCss');
var fs = require('fs');

var firstPack = true;

module.exports = function(source) {

    //create style
    var style = parseCss(source.replace(/\r?\n|\r/g, ""));
    var content = [
        'var transform = require("./transform.js")',
        'var style = ' + style,
        'style = transform(style)',
        'module.exports = style',
        ''
    ].join(';\n');
    this.emitFile('index.js', content);

    //create transtorm file
    if(firstPack) {
        var transformTpl = fs.readFileSync(__dirname + '/lib/transform.tpl', 'utf-8');
        this.emitFile('transform.js', transformTpl);
        firstPack = false;
    }

    return '';
};


