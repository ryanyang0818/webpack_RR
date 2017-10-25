# webpack note by ryan

### step1->package.json
```javascript
{
  "name": "webpack-example",
  "version": "1.0.0",
  "description": "A simple webpack example.",
  "main": "bundle.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [
    "webpack"
  ],
  "author": "ryan",
  "license": "MIT",
  "devDependencies": {
    "css-loader":  "latest",
    "file-loader": "latest",
    "node-sass":   "latest",
    "sass-loader": "latest",
    "style-loader": "latest",
    "webpack": "latest",
    "webpack-dev-server": "latest"
  }
}

```

### step2->npm install
```shell
npm install
```

### step3->webpack.config.js
```javascript
const path = require('path');
const webpack = require('webpack');
module.exports = [
{
  entry: {
    app: ['./entry.js'],
  },
  output: {
    path: __dirname,
    filename: './bundle.js'
  },  
  module: {
    loaders: [
      {test: /\.css$/,  loader: 'style-loader!css-loader'},
      {test: /\.scss$/, loader: 'style-loader!css-loader!sass-loader'}
    ]
  },
  plugins: [
    new webpack.BannerPlugin('註釋內'),
    // new webpack.optimize.UglifyJsPlugin()
  ]
}
]
```

### step4->建立entry.js

### step5->執行webpack
顯示顏色、進度
```javasscript
webpack --colors --progress
```

### step6->建立server，
顯示顏色、進度
```javasscript
webpack-dev-server
```


