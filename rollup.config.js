import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import sourceMaps from 'rollup-plugin-sourcemaps'
import typescript from 'rollup-plugin-typescript'
const pkg = require('./package.json')

const INDEX_FILE = 'index'

export default {
  exports: "named",
  entry: `compiled/${INDEX_FILE}.js`,
  targets: [
	  { dest: pkg.main, moduleName: INDEX_FILE, format: 'umd' },
	  { dest: pkg.module, format: 'es' }
  ],
  sourceMap: true,
  external: [],
  plugins: [
    typescript(),
    commonjs(),
    resolve(),
    sourceMaps()
  ]
}