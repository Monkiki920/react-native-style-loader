import {
    StyleSheet,
    PixelRatio
} from 'react-native';
import Dimensions from 'Dimensions';

const { width, height } = Dimensions.get('window');
const onePxVal = 1 / PixelRatio.get();

/**
 * cache the calculated result
 */
const cache = {
    px: {},
    vw: {},
    vh: {}
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
        return cache.px[px] = px * onePxVal;
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
 * transform param to layout size
 * @params value
 * @return layout size
 */
function calc(value) {
    let val, execRes;
    execRes = /(\d+)([a-z]*)/.exec(value);
    if(execRes && (val = execRes[1])) {
        switch(execRes[2]) {
            case 'px':
                val = calcPx(val);
                break;
            case 'vw':
                val = calcVw(val);
                break;
            case 'vh':
                val = calcVh(val);
                break;
        }
    } else {
        val = value;
    }
    return val;
}

/**
 * format styles
 * @params styles
 * @return formated styles
 */
function formatStyles(styles = {}) {
    Object.keys(styles).forEach(function (key) {
        if(typeof styles[key] === 'object') {
            return transform(styles[key]);
        } else if(typeof styles[key] === 'string') {
            styles[key] = calc(styles[key]);
        }
    });
    return styles;
}

/**
 * create the react native style sheet
 * @params styles
 * @return react native styles
 */
export default function transform(styles) {
    styles = formatStyles(styles);
    return StyleSheet.create(styles);
}





