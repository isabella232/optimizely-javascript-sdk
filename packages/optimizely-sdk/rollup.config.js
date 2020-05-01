import path from 'path';
import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import visualizer from 'rollup-plugin-visualizer';

export default [
  {
    input: 'lib/index.browser.js',
    output: {
      file: 'dist/optimizely.module.development.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      commonjs(),
      resolve({ browser: true }),
      visualizer({ filename: 'stats.development.html', sourcemap: true }),
    ]
  },
  {
    input: 'lib/index.browser.js',
    output: {
      file: 'dist/optimizely.module.production.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      alias({ entries: [
        { find: './project_config_schema',
          replacement: path.resolve(__dirname, 'ext/project_config_schema.json') },
        { find: path.resolve(__dirname, 'lib/utils/config_validator/index.js'),
          replacement: path.resolve(__dirname, 'ext/config_validator.js') },
        { find: /.*\/enums$/,
          replacement: path.resolve(__dirname, 'ext/enums.js') }
      ]}),
      commonjs(),
      resolve({ browser: true }),
      visualizer({ filename: 'stats.production.html', sourcemap: true }),
    ]
  }
]
