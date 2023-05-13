import { Logger } from 'pino';

// Mock to avoid open handlers
jest.mock('@tsed/swagger', () => ({
  __esModule: true,
  default: 'mockedDefaultExport',
  namedExport: jest.fn()
}));

// Mock pino-http and pino
const mockLogger: Partial<Logger> = {
  child: jest.fn().mockReturnThis(),
  fatal: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
  trace: jest.fn()
};

jest.mock('pino-http', () => {
  return jest.fn().mockImplementation(() => (): any => {
    return {
      logger: mockLogger
    };
  });
});

const mockPino = jest.fn((): Logger => mockLogger as Logger) as any;
mockPino.transport = jest.fn();
mockPino.destination = jest.fn();
jest.mock('pino', () => mockPino);
