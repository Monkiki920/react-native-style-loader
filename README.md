# react-native-style-loader ![NPM version](https://img.shields.io/npm/v/react-native-style-loader.svg?style=flat)
此loader的灵感来自于gulp-react-native-stylesheet-css, 万分感谢该作者.

react-native-style-loader 致力于将reanct native中的css从js中分离出来, 其具有以下几个功能

> 分离react native中的css

> 支持css中的px, vw, vh, rem, pt 单位

> 支持媒体查询 @media query

> 支持react native stylesheet 的嵌套

> 引入less loader后, 还可以支持变量定义等功能

> 支持margin, padding, box-shadow等的简写

> class和id的驼峰化

> 支持calc eg: cacl(~'100vh - 49pt')

## Installation
```bash
$ npm install react-native-style-loader --save-dev
```

## Usage
within the webpack config:
```js
// use less:
//webpack.config.js
// 启动命令 webpack --config webpack.config.js -w

//webpack 1
module.exports = {
    entry: './src/less/index.less',
    output: {
        path: './src/styles',
        filename: 'tmp.js'
    },
    module: {
        loaders: [{
            test: /\.less$/,
            loader: "react-native-style-loader!less"
        }]
    }
};

//webpack 2
var path = require('path');

module.exports = {
    entry: './src/less/index.less',
    output: {
        filename: 'tmp.js',
        path: path.resolve(__dirname, './src/styles')
    },
    module: {
        rules: [{
            test: /\.less$/,
            use: [
                {
                    loader: 'react-native-style-loader'
                },
                {
                    loader: 'less-loader'
                }
            ]
        }]
    }
};

```
然后你就可以在js 中这样引入了
```js
import styles from './src/styles';


```

## Properties supported

react native中支持的css属性皆全部支持

### 单位
##### px 所支持的做小线宽, 如: border: 1px solid #ccc;
##### pt 和ios中的pt, andorid中的dp一个道理
##### vw 和css中的vw含义一样, 如 50vw 表示屏幕宽度的50%
##### vh 和css中的vh含义一样, 如 50vh 表示屏幕高度的50%
##### rem 和css中的rem含义一样, 你可以像下面这样设置rem的基准
```css
html {
    font-size: 20pt;
}
```

### 媒体查询
```css
@media (min-width: 350px) and (max-width: 500px) {
    html {
        font-size: 100pt;
    }
}
```

### 嵌套的css
引入less后,你可以像下面这样书写css
```
.container {
    .box1 {
        width: 50pt;
        height: 20pt;
        background: orange;
    }
    .box2 {
        width: 50rem;
        height: 20pt;
        background: green;
    }
    .m-box {
        width: 50rem;
        height: 20pt;
        background: green;
    }
}
```

最后将生成如下的style sheet
```
{
   container: {
        box1: {
            width: 50;
            height: 20;
            backgroundColor: orange;
        }
        box1: {
            width: 50;
            height: 20;
            backgroundColor: green;
        }
        "m-box": {
            width: 50;
            height: 20;
            backgroundColor: green;
        }
        mBox: {
            width: 50;
            height: 20;
            backgroundColor: green;
        }
   }
}
```
注意, 不支持这样的嵌套
```
.container {
    .box1 {
        width: 50pt;
        height: 20pt;
        background: orange;
    }
    font-size: 12px;
}
```

### 额外支持的特殊属性

Property | Example Values | Notes
---------|----------------|------
margin | 2px<br />2px 4px<br />3px 1px 5px<br />1px 3px 2px 6px |
padding | 2px<br />2px 4px<br />3px 1px 5px<br />1px 3px 2px 6px |
box-shadow | none<br />0 2px 4px rgba(52, 21, 23, 0.32) | Inset shadows and spread values are not supported.
flex | 1<br />1 30px<br />1 2 10% | __Only the first value will be output__ and the rest will be ignored, as React Native does not support flex-basis or flex-shrink.
transform | perspective(90)<br />rotate(10deg)<br />rotateX(5deg)<br />rotateY(10deg)<br />rotateZ(15deg)<br />rotate3d(5deg, 10deg, 15deg)<br />scale(1.2)<br />scaleX(1.5)<br />scaleY(0.5)<br />scale2d(1.5, 0.5) or scale3d(1.5, 0.5)<br />translateX(5px)<br />translateY(10px)<br />translate2d(5px, 10px) or translate3d(5px, 10px) | You may chain multiple transformations together with a space delimiter, like in CSS3 (see example above).
