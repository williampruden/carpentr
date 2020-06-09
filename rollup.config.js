import babel from 'rollup-plugin-babel'
import { uglify } from 'rollup-plugin-uglify'
import analyze from 'rollup-plugin-analyzer'
import filesize from 'rollup-plugin-filesize'

const config = {
  input: 'src/index.js',
  external: ['react'],
  output: {
    format: 'umd',
    name: 'carpentr',
    globals: {
      react: 'React',
      'prop-types': 'PropTypes'
    }
  },
  plugins: [
    babel({ exclude: ['node_modules/**', 'test'] }),
    uglify(),
    analyze(),
    filesize()
  ]
}

export default config
