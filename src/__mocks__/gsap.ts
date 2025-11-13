/**
 * GSAP Mock for Jest Tests
 */

const gsapMock = {
  set: jest.fn(),
  to: jest.fn(() => ({
    kill: jest.fn(),
  })),
  from: jest.fn(() => ({
    kill: jest.fn(),
  })),
  fromTo: jest.fn(() => ({
    kill: jest.fn(),
  })),
  registerPlugin: jest.fn(),
  killTweensOf: jest.fn(),
};

export default gsapMock;

