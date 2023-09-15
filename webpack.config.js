const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      // `js` and `jsx` files are parsed using `babel`
      {
        test: /\.(js|jsx)$/, 
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
		  // `ts` and `tsx` files are parsed using `ts-loader`
      { 
        test: /\.(ts|tsx)$/, 
        loader: "ts-loader" 
      }
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],    
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/index.html', to: 'index.html' },
      ],
    }),
    // pyodide
    new CopyWebpackPlugin({
      patterns: [
        {
          from: require.resolve("pyodide/python_stdlib.zip"),
          to: "python_stdlib.zip",
        },
        {
          from: require.resolve("pyodide/pyodide.asm.js"),
          to: "pyodide.asm.js",
        },
        {
          from: require.resolve("pyodide/repodata.json"),
          to: "repodata.json",
        },
        {
          from: require.resolve("pyodide/pyodide.asm.wasm"),
          to: "pyodide.asm.wasm",
        },
      ],
    }),
  ],
};