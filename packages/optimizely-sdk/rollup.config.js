import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'

export default {
  input: 'lib/index.browser.js',
  output: {
    file: 'dist/optimizely.github.js',
    format: 'es'
  },
  plugins: [
    resolve({
      browser: true
    }),
    commonjs()
  ]
}
