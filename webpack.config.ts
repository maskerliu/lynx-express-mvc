import path from 'path'
import webpack, { Configuration } from 'webpack'
import pkg from './package.json'

const { NoEmitOnErrorsPlugin } = webpack

class MainConfig {

  devtool: Configuration['devtool'] = false
  target: Configuration['target'] = 'node'
  entry: Configuration['entry'] = { index: path.join(__dirname, './src/index.ts') }
  externals: Configuration['externals'] = [...Object.keys(pkg.dependencies)]


  module: Configuration['module'] = {
    rules: [
      {
        test: /.ts$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['@babel/env', '@babel/typescript'],
        },
      },
    ],
  }

  node: Configuration['node'] = {}

  output: Configuration['output'] = {
    filename: '[name].js',
    library: { type: 'commonjs2' },
    path: path.join(__dirname, './dist/lib-umd')
  }

  plugins: Configuration['plugins'] = [
    new NoEmitOnErrorsPlugin(),

  ]

  resolve: Configuration['resolve'] = {
    alias: {

    },
    extensions: ['.js', '.ts', '.json', '.node']
  }
}

export default new MainConfig()