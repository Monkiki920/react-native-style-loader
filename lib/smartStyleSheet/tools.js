import {
    StyleSheet,
    PixelRatio,
    Platform,
    Dimensions
} from 'react-native';

const { width, height } = Dimensions.get('window');
var htmlFontSize = 16;

/**
 * object to match media query
 */
const MATCH_OBJECT = {
    width,
    height,
    'device-width': width,
    'device-height': height,
    orientation: width > height ? 'landscape' : 'portrait',
    'aspect-ratio': width / height,
    type: Platform.OS
};

/**
 * cache the calculated result
 */
const cache = {
    px: {},
    vw: {},
    vh: {},
    rem: {}
};

/**
 * transform px to layout size
 * @params px
 * @return layout size
 */
function calcPx(px) {
    let cachePx = cache.px[px];
    if(cachePx || cachePx === 0) {
        return cachePx;
    } else {
        return cache.px[px] = px * StyleSheet.hairlineWidth;
    }
}

/**
 * transform vw to layout size
 * @params vw
 * @return layout size
 */
function calcVw(vw) {
    let cacheVw = cache.vw[vw];
    if(cacheVw || cacheVw === 0) {
        return cacheVw;
    } else {
        return cache.vw[vw] = vw / 100 * width;
    }
}

/**
 * transform vh to layout size
 * @params vh
 * @return layout size
 */
function calcVh(vh) {
    let cacheVh = cache.vh[vh];
    if(cacheVh || cacheVh === 0) {
        return cacheVh;
    } else {
        return cache.vh[vh] = vh / 100 * height;
    }
}

/**
 * transform vh to layout size
 * @params vh
 * @return layout size
 */
function calcRem(rem) {
    let cacheRem = cache.rem[rem];
    if(cacheRem || cacheRem === 0) {
        return cacheRem;
    } else {
        return cache.rem[rem] = rem * htmlFontSize;
    }
}

/**
 * transform param to layout size
 * @params value
 * @return layout size
 */
const operators = ['+', '-', '*', '/'];
function calc(value, key) {
    let val, unitExec, calcExec;
    unitExec = /^([\d\.]+)([a-z]*)/.exec(value);
    if(unitExec && (val = unitExec[1])) {
        val = parseFloat(val);
        switch(unitExec[2]) {
            case 'px':
                val = calcPx(val);
                break;
            case 'vw':
                val = calcVw(val);
                break;
            case 'vh':
                val = calcVh(val);
                break;
            case 'rem':
                val = calcRem(val);
                break;
            case 'deg':
                val = value;
                break;
            default:
                if(['fontWeight'].indexOf(key) !== -1) {
                    val = String(val);
                } else {
                    val = parseFloat(val);
                }
        }
    } else if((calcExec = /^calc\(([^\)]+)\)/.exec(value)) && (val = calcExec[1])) {
        let exps = [];
        let vals = val.trim().split(/\s+/);
        var o = {};

        for (let j = 0, len = vals.length; j < len; j++) {
            if((val = vals[j]) && typeof val === 'string' && operators.indexOf(val.trim()) !== -1) {
               exps.push(val);
            } else {
               o[j] = calc(val);
               exps.push('o[' + j + ']');
            }
        }
        val = new Function('o', 'return ' + exps.join(' '))(o);
    } else {
        val = value;
    }
    return val;
}

/**
 * deep calculate unit
 * @params styles
 * @return formated styles
 */
function deepCalc(styles = {}) {
    Object.keys(styles).forEach(function (key) {
        if(typeof styles[key] === 'object') {
            return deepCalc(styles[key]);
        } else if(typeof styles[key] === 'string') {
            styles[key] = calc(styles[key], key);
        }
    });
    return styles;
}

/**
 * check whether is plain object
 */
function isPlainObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]'
}

/**
 * Is string is media query
 * @param {String} str
 */
function isMediaQuery(str) {
    return typeof str === 'string' && str.indexOf('@media') === 0;
}

/**
 * object assign
 * @params deep {optional}
 * @params target {required}
 * @params src {required}
 */
function extend() {
    var options, name, src, copy, copyIsArray, clone,
        target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        deep = false;
    if (typeof target === "boolean") {
        deep = target;
        target = arguments[1] || {};
        i = 2;
    }
    if (typeof target !== "object") {
        target = {};
    }
    if (length === i) {
        target = {};
        --i;
    }

    for (; i < length; i++) {
        if ((options = arguments[i]) != null) {
            for (name in options) {
                src = target[name];
                copy = options[name];
                //prevent deep-loop
                if (target === copy) {
                    continue;
                }
                if (deep && copy && ( (copyIsArray = Array.isArray(copy)) || isPlainObject(copy))) {
                    if (copyIsArray) {
                        copyIsArray = false;
                        clone = src && Array.isArray(src) ? src : [];
                    } else {
                        clone = src && isPlainObject(src) ? src : {};
                    }
                    target[name] = extend(deep, clone, copy);

                } else if (copy !== undefined) {
                    target[name] = copy;
                }
            }
        }
    }
    return target;
}

/**
 * Create a cached version of a pure function.
 */
function cached(fn) {
    var cache = Object.create(null);
    return (function cachedFn (str) {
        const hit = cache[str];
        return hit || (cache[str] = fn(str));
    });
}

/**
 * Camelize a hyphen-delimited string
 */
var camelizeRE = /[-](\w)/g;
var camelize = cached(function (str) {
    return str.replace(camelizeRE, function(_, c) { return (c ? c.toUpperCase() : '')});
});

/**
 * Camelize the key of Object
 */
function camelizeKeys(obj) {
    var newObj = Object.create(null);
    if(obj) {
        Object.keys(obj).forEach(function(key) {
            if(isPlainObject(obj[key])) {
                newObj[key] = newObj[camelize(key)] = camelizeKeys(obj[key]);
            } else {
                newObj[key] = newObj[camelize(key)] = obj[key];
            }
        });
    }
    return newObj;
}
