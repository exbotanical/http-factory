import { babel } from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import rollupJson from '@rollup/plugin-json';
import { terser } from 'rollup-plugin-terser';

import babelrc from './build/babel.config'; // must import, as base babelrc is needed by jest

import pkg from './package.json';

export default [
  {
    /* CommonJS */
    input: 'lib/index.js',
    output: {
      file: pkg.main,
      format: 'cjs',
      exports: 'default'
    },
    plugins: [
      nodeResolve(),
      rollupJson(), // axios workaround
      commonjs(), // ensure dependencies are commonjs *prior* to transpilation
      babel({
        exclude: 'node_modules/**',
        babelrc: false, // override browserslistrc
        presets: [
          [
            '@babel/env',
            {
              modules: false,
              useBuiltIns: 'usage',
              targets: 'maintained node versions'
            }
          ]
        ],
        comments: false
      })
    ]
  },
  {
    /* UMD */
    input: 'lib/index.js',
    output: {
      file: pkg.browser,
      format: 'umd',
      name: 'HttpClient'
    },
    plugins: [
      nodeResolve({ browser: true }),
      rollupJson(),
      commonjs(),
      babel({
        exclude: 'node_modules/**',
        babelrc: false,
        ...babelrc,
        babelHelpers: 'runtime'
      })
    ]
  },
  {
    /* Minified UMD */
    input: 'lib/index.js',
    output: {
      file: pkg.browser.replace(/\.js$/, '.js'),
      format: 'umd',
      name: 'HttpClient'
    },
    plugins: [
      nodeResolve({ browser: true }),
      rollupJson(),
      commonjs(),
      babel({
        exclude: 'node_modules/**',
        babelrc: false,
        ...babelrc,
        babelHelpers: 'runtime'
      }),
      terser()
    ]
  },
  {
    /* ESM */
    input: 'lib/index.js',
    output: {
      file: pkg.module,
      format: 'es'
    },
    plugins: [
      nodeResolve(),
      rollupJson(),
      commonjs(),
      babel({
        exclude: 'node_modules/**',
        babelrc: false,
        ...babelrc,
        babelHelpers: 'runtime'
      })
    ]
  }
];
