// Test data fixtures

export const testGamePiece = {
  type: 'tile',
  x: 100,
  y: 200,
  w: 50,
  h: 50,
  startFrame: 0,
  listener: 'door1',
  listener1: 'switch1',
  listener2: 'switch2',
  thoughtType: 'anxiety',
  objectType: 'interactive',
  state: true,
  stickyHoldingOffset: { '0': [0, 0] },
  IDOverride: undefined,
  dropTargetFunction: undefined,
  moveObject: undefined
};

export const testPlayerRect = {
  top: 100,
  right: 150,
  bottom: 200,
  left: 100
};

export const testFinishLineRect = {
  top: 100,
  right: 1020,
  bottom: 150,
  left: 850
};

export const testFinishLineRectAbove = {
  top: 120,
  right: 1020,
  bottom: 160,
  left: 850
};

export const testFinishLineRectLeft = {
  top: 100,
  right: 900,
  bottom: 150,
  left: 800
};

export const testFinishLineRectRight = {
  top: 100,
  right: 1130,
  bottom: 150,
  left: 1030
};

