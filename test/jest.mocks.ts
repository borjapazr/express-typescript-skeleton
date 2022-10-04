// Mock to avoid open handlers
jest.mock('@tsed/swagger', () => ({
  __esModule: true,
  default: 'mockedDefaultExport',
  namedExport: jest.fn()
}));
