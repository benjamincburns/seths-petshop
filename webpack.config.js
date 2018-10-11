const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/js/app.js',
  output: {
    filename: 'app.packed.js',
    path: path.resolve(__dirname, 'src/js')
  },
  devtool: 'source-map',
  node: {
    fs: "empty"
  },
  devServer: {
    contentBase: path.join(__dirname, 'src')
  }
};
