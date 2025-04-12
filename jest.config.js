/** @type {import('jest').Config} */

// profe

module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  extensionsToTreatAsEsm: ['.ts'],
};

// CHATGPT config with setUptests

// export default {
//   preset: 'ts-jest',
//   testEnvironment: 'node',
//   setupFilesAfterEnv: ['<rootDir>/src/tests/setupTest.ts'],
// };


// cambiamos a .ts

// jest.config.cjs

/*
module.exports = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  // Trata los archivos .ts como módulos ESM:
  extensionsToTreatAsEsm: ['.ts'],
  // Configura la transformación de TypeScript con ts-jest en modo ESM
  transform: {
    '^.+\\.ts$': ['ts-jest', { useESM: true }],
  },
  // Archivo de configuración global para los tests.
  setupFilesAfterEnv: ['<rootDir>/src/utils/tests/setup.test.ts'],
  // Para resolver rutas relativas con extensión .js en imports (soluciona algunos problemas de path)
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
};

*/
