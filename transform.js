

const { width, height } = { width: 375, height: 1134 };
const onePxVal = 1 / 2;

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

function transform(styles) {
    Object.keys(styles).forEach(function (key) {
        if(typeof styles[key] === 'object') {
            return transform(styles[key]);
        } else if(typeof styles[key] === 'string') {
            styles[key] = calc(styles[key]);
        }
    });
    return styles;
}

var styles = {
    "box": {
        "fontSize": 10,
        "width": 50,
        "height": "1px",
        "paddingTop": "5vw",
        "paddingBottom": "5pt",
        "paddingRight": "5pt",
        "paddingLeft": "5vh",
        "borderWidth": 1,
        "borderStyle": "solid",
        "borderColor": "#ccc",
        "textAlign": "center",
        "inline": {
            "fontSize": 10,
            "width": 50,
            "height": "1px",
            "paddingTop": "5vw",
            "borderStyle": "solid",
            "borderColor": "#ccc",
        }
    }
};

var res = transform(styles);
console.log(res);



