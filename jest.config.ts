module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'tsx', 'js'],
    testPathIgnorePatterns: ['/node_modules/', '/dist/'], // Ignorar arquivos de build
    coverageDirectory: 'coverage', // Diretório para os relatórios de cobertura
    collectCoverage: true, // Habilitar a coleta de cobertura
    collectCoverageFrom: [
        'src/**/*.{ts,tsx}', // Arquivos para os quais queremos a cobertura
        '!src/**/*.d.ts', // Ignorar definições de tipos
    ],
};