var ReactNativePropRegistry = require('ReactNativePropRegistry');
var StyleSheetValidation = require('StyleSheetValidation');

/**
 * check whether is box-shadow
 */
function isBoxShadow(obj, key) {
    if(key === 'shadowOffset') {
        if(Object.keys(obj).length === 2 && 'width' in obj && 'height' in obj) {
            return true;
        }
    }
    return false;
}

/**
 * filter meida query
 */
function filterMediaQuery(styles = {}) {
    for (var key in styles) {
        let mqStr = key.replace('@media', '');

        if(isMediaQuery(key)) {
            if(matchQuery(mqStr, MATCH_OBJECT)) {
                extend(true, styles, styles[key]);
            }
            delete styles[key];
        }
    }
    return styles;
}

/**
 * register react native style
 */
function rnStyleSheetRegister(styles = {}) {
    const result = {};
    for (var key in styles) {
        let styleObj = styles[key];
        let styleObjKeys = Object.keys(styleObj);
        if(isPlainObject(styleObj[styleObjKeys[0]]) && !isBoxShadow(styleObj[styleObjKeys[0]], styleObjKeys[0])) {
            result[key] = rnStyleSheetRegister(styleObj);
        } else {
            StyleSheetValidation.validateStyle(key, styles);
            result[key] = ReactNativePropRegistry.register(styleObj);
        }
    }
    return result;
}

/**
 * create the react native style sheet
 * @params styles
 * @return react native styles
 */
export default class SmartStyleSheet {
    static create(styles = {}) {
        //filter matched css
        styles = filterMediaQuery(styles);
        //set html font size
        SmartStyleSheet.setHtmlFontSize(styles.html && styles.html.fontSize);
        //calculate unit
        styles = deepCalc(styles);

        return rnStyleSheetRegister(styles);
    }
    static setHtmlFontSize(fontSize) {
        if(/rem/.test(fontSize)) {
            throw new Error('The font size unit of html must be px vw, vh, or pt.');
        } else if(fontSize) {
            fontSize = calc(fontSize);
        }
        //clear rem cache
        if((fontSize || fontSize === 0) && fontSize !== htmlFontSize) {
            cache.rem = {};
        }
        htmlFontSize = fontSize || htmlFontSize || 16;
    }
}