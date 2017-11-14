import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import sourceMaps from 'rollup-plugin-sourcemaps'
import typescript from 'rollup-plugin-typescript2'
const pkg = require('./package.json')

const INDEX_FILE = 'index'

export default {
  exports: "named",
  input: `compiled/${INDEX_FILE}.js`,
  output: [
	  { file: pkg.main, name: INDEX_FILE, format: 'umd', sourcemap: true },
	  { file: pkg.module, format: 'es', sourcemap: true }
  ],
  external: [],
  plugins: [
    typescript(),
    commonjs(),
    resolve(),
    sourceMaps()
  ]
}