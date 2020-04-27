import path from 'path';
import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import { terser } from "rollup-plugin-terser";
import visualizer from 'rollup-plugin-visualizer';

export default [
  {
    input: 'lib/index.browser.js',
    output: {
      file: 'dist/optimizely.module.dev.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      commonjs(),
      resolve({ browser: true }),
      visualizer({filename: 'stats-dev.html', sourcemap: true, gzipSize: true}),
    ]
  },
  {
    input: 'lib/index.browser.js',
    output: {
      file: 'dist/optimizely.module.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      alias({ entries: [
        { find: '@optimizely/js-sdk-logging',
          replacement: path.resolve(__dirname, 'ext/logging') },
        { find: './project_config_schema',
          replacement: path.resolve(__dirname, 'ext/project_config_schema.json') },
        { find: path.resolve(__dirname, 'lib/utils/config_validator/index.js'),
          replacement: path.resolve(__dirname, 'ext/config_validator.js') }
      ]}),
      commonjs(),
      resolve({ browser: true }),
      terser(),
      visualizer({sourcemap: true, gzipSize: true}),
    ]
  }
]
