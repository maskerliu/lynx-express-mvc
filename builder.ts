'use strict'

import chalk from 'chalk'
import { deleteSync } from 'del'
import webpack from 'webpack'
import Config from './webpack.config.js'

const Run_Mode_PROD = 'production'
const doneLog = chalk.bgGreen.white(' DONE ') + ' '

process.env.NODE_ENV = Run_Mode_PROD
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'

function run() {
  deleteSync(['dist/lib-umd/*', '!.gitkeep'])
  pack(new Config())
}

function pack(config: Config): Promise<string> {
  return new Promise((resolve, reject) => {
    config.mode = Run_Mode_PROD
    config.init()
    webpack(config, (err, stats) => {
      if (err) {
        reject(err.stack || err)
      } else if (stats?.hasErrors()) {
        let err = ''
        stats.toString({ chunks: false, colors: true })
          .split(/\r?\n/)
          .forEach(line => { err += `    ${line}\n` })
        reject(err)
      } else {
        resolve(stats!.toString({ chunks: false, colors: true }))
      }
    })
  })
}

run()