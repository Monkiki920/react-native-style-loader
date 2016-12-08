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

        styles = formatStyles(styles);

        for (var key in styles) {
            let styleObj = styles[key];
            let styleObjKeys = Object.keys(styleObj);

            if(Object.prototype.toString.call(styleObj[styleObjKeys[0]]) === '[object Object]') {
                result[key] = SmartStyleSheet.create(styleObj);
            } else {
                StyleSheetValidation.validateStyle(key, styles);
                result[key] = ReactNativePropRegistry.register(styleObj);
            }
        }
        return result;
    }
}