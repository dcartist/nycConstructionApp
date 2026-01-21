// jest.setup.js
// Global setup for all tests

beforeAll(() => {
  process.env.NODE_ENV = 'test';
});

afterAll(async () => {
  // Cleanup any open handles
  await new Promise(resolve => setTimeout(resolve, 500));
});
