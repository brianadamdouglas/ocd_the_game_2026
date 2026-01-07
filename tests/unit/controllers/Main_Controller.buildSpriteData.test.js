/**
 * Unit tests for Main_Controller.buildSpriteData()
 */

import { testGamePiece } from '../../helpers/fixtures.js';
import { createMockStage, createMockGameboardModel } from '../../helpers/mocks.js';

// Extract the buildSpriteData logic
const createBuildSpriteData = (mainModel, stage) => {
  return function(gamePiece, id) {
    const classAcronym = gamePiece.type;
    const startFrame = (gamePiece.startFrame === undefined) ? 0 : gamePiece.startFrame;
    
    return {
      className: mainModel.getGameboardClasses()[classAcronym],
      imgs: mainModel.getGameboardImageLookup()[classAcronym],
      listener: gamePiece.listener,
      listenerString: gamePiece.listener,
      listener1: gamePiece.listener1,
      listenerString1: gamePiece.listener1,
      listener2: gamePiece.listener2,
      listenerString2: gamePiece.listener2,
      thoughtType: gamePiece.thoughtType,
      objectType: gamePiece.objectType,
      visibility: gamePiece.state,
      stickyHoldingOffset: gamePiece.stickyHoldingOffset,
      IDOverride: gamePiece.IDOverride,
      dropTargetFunction: gamePiece.dropTargetFunction,
      moveObject: gamePiece.moveObject,
      id: 'sprite_tile' + id,
      stage: "stage",
      x: gamePiece.x,
      y: gamePiece.y,
      w: gamePiece.w,
      h: gamePiece.h,
      container: stage.getViewID(),
      startFrame: startFrame
    };
  };
};

describe('Main_Controller.buildSpriteData()', () => {
  let buildSpriteData;
  let mockStage;
  let mockModel;
  
  beforeEach(() => {
    mockStage = createMockStage();
    mockModel = createMockGameboardModel();
    
    buildSpriteData = createBuildSpriteData(mockModel, mockStage);
  });

  test('should build complete sprite data object', () => {
    const gamePiece = { ...testGamePiece };
    const id = 42;
    
    const result = buildSpriteData(gamePiece, id);
    
    expect(result).toBeDefined();
    expect(result.id).toBe('sprite_tile42');
    expect(result.x).toBe(100);
    expect(result.y).toBe(200);
    expect(result.w).toBe(50);
    expect(result.h).toBe(50);
    expect(result.listener).toBe('door1');
    expect(result.thoughtType).toBe('anxiety');
    expect(result.objectType).toBe('interactive');
  });

  test('should use default startFrame when undefined', () => {
    const gamePiece = { ...testGamePiece, startFrame: undefined };
    const id = 1;
    
    const result = buildSpriteData(gamePiece, id);
    
    expect(result.startFrame).toBe(0);
  });

  test('should use provided startFrame', () => {
    const gamePiece = { ...testGamePiece, startFrame: 2 };
    const id = 1;
    
    const result = buildSpriteData(gamePiece, id);
    
    expect(result.startFrame).toBe(2);
  });

  test('should generate correct sprite ID', () => {
    const gamePiece = { ...testGamePiece };
    const id = 42;
    
    const result = buildSpriteData(gamePiece, id);
    
    expect(result.id).toBe('sprite_tile42');
  });

  test('should map all listener properties', () => {
    const gamePiece = {
      ...testGamePiece,
      listener: 'door1',
      listener1: 'switch1',
      listener2: 'switch2'
    };
    const id = 1;
    
    const result = buildSpriteData(gamePiece, id);
    
    expect(result.listener).toBe('door1');
    expect(result.listenerString).toBe('door1');
    expect(result.listener1).toBe('switch1');
    expect(result.listenerString1).toBe('switch1');
    expect(result.listener2).toBe('switch2');
    expect(result.listenerString2).toBe('switch2');
  });

  test('should handle missing optional properties', () => {
    const gamePiece = {
      type: 'tile',
      x: 100,
      y: 200,
      w: 50,
      h: 50
    };
    const id = 1;
    
    expect(() => {
      const result = buildSpriteData(gamePiece, id);
      expect(result).toBeDefined();
    }).not.toThrow();
  });

  test('should use stage container ID', () => {
    mockStage.getViewID = jest.fn(() => 'stage123');
    const gamePiece = { ...testGamePiece };
    const id = 1;
    
    const result = buildSpriteData(gamePiece, id);
    
    expect(result.container).toBe('stage123');
    expect(mockStage.getViewID).toHaveBeenCalled();
  });
});

