var parseCss = require('./lib/parseCss');
var fs = require('fs');

var firstPack = true;

module.exports = function(source) {

    //create transtorm file
    if(firstPack) {
        var tpls = [
            fs.readFileSync(__dirname + '/lib/smartStyleSheet/tools.js', 'utf-8'),
            fs.readFileSync(__dirname + '/lib/smartStyleSheet/mediaQuery.js', 'utf-8'),
            fs.readFileSync(__dirname + '/lib/smartStyleSheet/SmartStyleSheet.js', 'utf-8')
        ];
        this.emitFile('SmartStyleSheet.js', tpls.join('\n'));
        firstPack = false;
    }

    //create style
    var style = parseCss(source.replace(/\r?\n|\r/g, ""));
    var content = [
        'import SmartStyleSheet from "./SmartStyleSheet.js"',
        'module.exports = SmartStyleSheet.create(' + style + ')',
        ''
    ].join(';\n\n');
    this.emitFile('index.js', content);
    
    return '';
};


