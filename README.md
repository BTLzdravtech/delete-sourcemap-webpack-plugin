# delete-sourcemap-webpack-plugin-stzhang

与[sentry.io](https://sentry.io/)`javascript sdk`配套使用。在向[sentry.io](https://sentry.io/)上传`source-map`文件之后，再删除`source-map`文件与源文件内对`source-map`文件的引用注释指令。而不是，直接从`webpack`配置关闭`source-map`生成。

## 安装

```npm i -D delete-sourcemap-webpack-plugin-stzhang```

## 使用

```javascript
// webpack.config.js
const DeleteSourceMapWebpackPlugin = require('delete-sourcemap-webpack-plugin-stzhang')

module.exports = {
    // ...
    plugins: [
        new DeleteSourceMapWebpackPlugin()
    ],
    // ...
}
```

## 解决缺陷

### 支持去掉`css`文件的`source-map`

### 当遇到内联`source-map`时，不再报`fs.unlink()`的删除文件失败错误

### 调用`webpack 4`的`Plugin API`来接入插件
