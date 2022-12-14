import path from 'path'
import { fileURLToPath } from 'url'
import webpack, { Configuration } from 'webpack'
import pkg from './package.json' assert { type: 'json' }

const { NoEmitOnErrorsPlugin } = webpack

const dirname = path.dirname(fileURLToPath(import.meta.url))

export default class MainConfig {

  devtool: Configuration['devtool'] = 'eval-cheap-module-source-map'
  mode: Configuration['mode'] = 'development'
  target: Configuration['target'] = 'node'
  entry: Configuration['entry'] = { index: path.join(dirname, './src/index.ts') }
  externals: Configuration['externals'] = [...Object.keys(pkg.dependencies)]

  module: Configuration['module'] = {
    rules: [
      {
        test: /.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          transpileOnly: true
        },
      },
    ],
  }

  node: Configuration['node'] = {
    __dirname: process.env.NODE_ENV !== 'production',
    __filename: process.env.NODE_ENV !== 'production'
  }

  output: Configuration['output'] = {
    filename: '[name].cjs',
    library: { type: 'commonjs2' },
    path: path.join(dirname, './dist/lib-umd')
  }

  plugins: Configuration['plugins'] = [
    new NoEmitOnErrorsPlugin(),

  ]

  resolve: Configuration['resolve'] = {
    alias: {

    },
    extensions: ['.js', '.ts', '.json', '.node']
  }

  init() {
    if (process.env.NODE_ENV == 'production') {
      this.devtool = false
    }
  }
}
