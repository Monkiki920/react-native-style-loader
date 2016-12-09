var ReactNativePropRegistry = require('ReactNativePropRegistry');
var StyleSheetValidation = require('StyleSheetValidation');

/**
 * create the react native style sheet
 * @params styles
 * @return react native styles
 */
export default class SmartStyleSheet {
    static create(styles = {}) {
        const result = {};
        //filter matched css
        styles = SmartStyleSheet.filterMediaQuery(styles);
        //calculate unit
        styles = formatStyles(styles);
        for (var key in styles) {
            let styleObj = styles[key];
            let styleObjKeys = Object.keys(styleObj);

            if(isPlainObject(styleObj[styleObjKeys[0]])) {
                result[key] = SmartStyleSheet.create(styleObj);
            } else {
                StyleSheetValidation.validateStyle(key, styles);
                result[key] = ReactNativePropRegistry.register(styleObj);
            }
        }
        return result;
    }
    static filterMediaQuery(styles = {}) {
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
}