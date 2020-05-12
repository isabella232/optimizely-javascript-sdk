/**
 * Copyright 2020, Optimizely
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import path from 'path';
import { dependencies } from './package.json';
import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from  'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import visualize from 'rollup-plugin-visualizer';

const BUILD_ALL = process.env.BUILD_ALL ? true : false;
const BUILD_UMD_BUNDLE = process.env.BUILD_UMD_BUNDLE ? true : false;

const getCjsConfigForPlatform = (platform) => {
  return {
    plugins: [
      resolve(),
      commonjs(),
    ],
    external: ['https', 'http', 'url'].concat(Object.keys(dependencies || {})),
    input: `lib/index.${platform}.js`,
    output: {
      exports: 'named',
      format: 'cjs',
      file: `dist/optimizely.${platform}.min.js`,
      plugins: [ terser() ],
      sourcemap: true,
    }
  };
};

const esModuleConfig = {
  ... getCjsConfigForPlatform('browser'),
  plugins: [
    alias({ entries: [
      { find: /.*\/utils\/config_validator/,
        replacement: path.resolve(__dirname, 'ext/validator') },
      { find: /.*\/utils\/user_profile_service_validator/,
        replacement: path.resolve(__dirname, 'ext/validator') },
    ]}),
    resolve(),
    commonjs(),
    visualize(),
  ],
  output: [{
    exports: 'named',
    format: 'es',
    file: 'dist/optimizely.browser.es.js',
    sourcemap: true,
  },{
    exports: 'named',
    format: 'es',
    file: 'dist/optimizely.browser.es.min.js',
    plugins: [ terser() ],
    sourcemap: true,
  }]
}

const umdconfig = {
  plugins: [
    resolve({ browser: true }),
    commonjs({
      namedExports: {
        '@optimizely/js-sdk-logging': [
          'ConsoleLogHandler',
          'getLogger',
          'setLogLevel',
          'LogLevel',
          'setLogHandler',
          'setErrorHandler',
          'getErrorHandler'
        ],
        '@optimizely/js-sdk-event-processor': [
          'LogTierV1EventProcessor',
          'LocalStoragePendingEventsDispatcher'
        ]
      }
    }),
  ],
  input: 'lib/index.browser.js',
  output: [
    {
      name: 'optimizelySdk',
      format: 'umd',
      file: 'dist/optimizely.browser.umd.js',
      exports: 'named',
    },
    {
      name: 'optimizelySdk',
      format: 'umd',
      file: 'dist/optimizely.browser.umd.min.js',
      exports: 'named',
      plugins: [ terser() ],
      sourcemap: true,
    },
  ],
};

// A separate bundle for json schema validator.
const jsonSchemaValidatorConfig = {
  plugins: [
    resolve(),
    commonjs(),
  ],
  external: ['json-schema', '@optimizely/js-sdk-utils'],
  input: 'lib/utils/json_schema_validator/index.js',
  output: {
    exports: 'named',
    format: 'cjs',
    file: 'dist/optimizely.json_schema_validator.min.js',
    plugins: [ terser() ],
    sourcemap: true,
  }
};

export default [
  BUILD_ALL && getCjsConfigForPlatform('node'),
  BUILD_ALL && getCjsConfigForPlatform('browser'),
  BUILD_ALL && getCjsConfigForPlatform('react_native'),
  BUILD_ALL && esModuleConfig,
  BUILD_ALL && jsonSchemaValidatorConfig,
  (BUILD_ALL || BUILD_UMD_BUNDLE) && umdconfig,
].filter(config => config);
