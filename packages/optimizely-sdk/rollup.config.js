import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import { terser } from "rollup-plugin-terser";
import visualizer from 'rollup-plugin-visualizer';

export default {
  input: 'lib/index.browser.js',
  output: {
    file: 'dist/optimizely.module.js',
    format: 'es'
  },
  plugins: [
    resolve({ browser: true }),
    commonjs(),
    terser(),
    visualizer()
  ]
}
