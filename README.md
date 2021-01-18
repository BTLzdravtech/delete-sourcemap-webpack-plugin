```javascript
// webpack.config.js
const DeleteSourceMapWebpackPlugin = require('delete-sourcemap-webpack-plugin')

module.exports = {
     // ...
     plugins: [
         new DeleteSourceMapWebpackPlugin()
     ],
     // ...
}
```
