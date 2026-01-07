// Mock objects for testing

// Mock jQuery - will be set up in individual test files as needed
// This is a factory function to create jQuery mocks
export const createMockJQuery = () => {
  const mockElement = {
    objectHitTest: jest.fn(() => false),
    hasClass: jest.fn(() => false),
    css: jest.fn(() => ''),
    addClass: jest.fn(),
    removeClass: jest.fn(),
    show: jest.fn(),
    hide: jest.fn(),
    position: jest.fn(() => ({ top: 0, left: 0 })),
    append: jest.fn(),
    html: jest.fn(),
    animate: jest.fn(),
    fadeOut: jest.fn(),
    fadeIn: jest.fn()
  };
  
  const mockJQuery = jest.fn((selector) => {
    if (selector === '#playerHead' || selector === '#playerTorso') {
      return mockElement;
    }
    return mockElement;
  });
  
  return mockJQuery;
};

// Mock Player
export const createMockPlayer = () => ({
  stopWalk: jest.fn(),
  startInteract: jest.fn(),
  getStickyOffset: jest.fn(() => 10),
  transformPlayerToStage: jest.fn(() => ({ x: 0, y: 0 })),
  getTransformedRect: jest.fn(() => ({
    top: 100,
    right: 150,
    bottom: 200,
    left: 100
  })),
  hide: jest.fn(),
  show: jest.fn()
});

// Mock Stage
export const createMockStage = () => ({
  addTile: jest.fn(() => createMockTile()),
  getViewID: jest.fn(() => 'stage'),
  bindView: jest.fn(),
  setMainController: jest.fn(),
  hide: jest.fn(),
  show: jest.fn()
});

// Mock Tile
export const createMockTile = (name = 'sprite_tile1') => ({
  getViewID: jest.fn(() => name),
  getViewDIV: jest.fn(() => ({
    hasClass: jest.fn(() => false)
  })),
  getViewDivClass: jest.fn(() => false),
  getViewVisibility: jest.fn(() => true),
  getClass: jest.fn(() => 'Tile'),
  getThoughtType: jest.fn(() => undefined),
  hasListener: jest.fn(() => false),
  getListenerString: jest.fn(() => ''),
  setListener: jest.fn(),
  getRect: jest.fn(() => ({
    top: 0,
    right: 50,
    bottom: 50,
    left: 0
  }))
});

// Mock Sprite (for stageSpriteArray)
export const createMockSprite = (name, isObstacle = false, isVisible = true) => ({
  _name: name,
  _classReference: {
    getViewVisibility: jest.fn(() => isVisible),
    getViewDIV: jest.fn(() => ({
      hasClass: jest.fn((className) => className === 'obstacle' && isObstacle)
    })),
    getViewID: jest.fn(() => name),
    getViewDivClass: jest.fn(() => false),
    hasListener: jest.fn(() => false)
  }
});

// Mock Gameboard Model
export const createMockGameboardModel = () => ({
  getGameBoard: jest.fn(() => []),
  getGameboardClasses: jest.fn(() => ({
    tile: 'tile-class',
    door: 'door-class'
  })),
  getGameboardImageLookup: jest.fn(() => ({
    tile: ['img1.gif', 'img2.gif'],
    door: ['door.gif']
  })),
  getStageWidth: jest.fn(() => 1000),
  getStageHeight: jest.fn(() => 1000),
  getStageStartX: jest.fn(() => 0),
  getStageStartY: jest.fn(() => 0),
  getInitialLoadBytes: jest.fn(() => 163900),
  getTotalLoadBytes: jest.fn(() => 592981)
});

// Mock EventHandler
export const createMockEventHandler = () => ({
  addAListener: jest.fn(),
  removeAListener: jest.fn(),
  dispatchAnEvent: jest.fn(),
  dispatchAnEventOneTarget: jest.fn()
});

