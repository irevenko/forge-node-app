/* eslint-disable prettier/prettier */
const tsConf = {
  compilerOptions: {
    target: 'es6',
    module: 'commonjs',
    outDir: 'out',
  },
  include: ['src/**/*.ts'],
  exclude: ['node_modules', '__tests__'],
  'ts-node': {
    compilerOptions: {
      module: 'commonjs',
    },
  },
};

export default tsConf;
