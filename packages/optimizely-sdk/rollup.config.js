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
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve'
import { terser } from  'rollup-plugin-terser'
import { dependencies as packageDeps } from './package.json';

function getExternals() {
  return ['https', 'http', 'url'].concat(Object.keys(packageDeps || {}));
}

function getPlugins() {
  const plugins = [
    resolve(),
    commonjs(),
    terser(),
  ];
  return plugins;
}

function getConfigForPlatform(platform) {
  return {
    plugins: getPlugins(),
    external: getExternals(),
    input: 'lib/index.' + platform + '.js',
    output: {
      exports: 'named',
      format: 'cjs',
      file: 'dist/optimizely.' + platform + '.min.js',
    }
  };
}

export default [
  getConfigForPlatform('node'),
  getConfigForPlatform('browser'),
  getConfigForPlatform('react_native'),
]
