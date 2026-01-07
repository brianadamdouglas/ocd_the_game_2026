// Global test setup
// This file runs before each test file

// Mock DOM elements
global.document = {
  createElement: jest.fn(() => ({
    id: '',
    className: '',
    style: {},
    appendChild: jest.fn(),
    addEventListener: jest.fn()
  }))
};

global.window = {
  URL: {
    createObjectURL: jest.fn(() => 'blob:mock-url')
  }
};

