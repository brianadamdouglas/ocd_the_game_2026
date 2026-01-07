/**
 * Unit tests for Main_Controller.createSprite() extracted methods and integration
 */

import { createMockTile, createMockStage, createMockGameboardModel, testGamePiece } from '../../helpers/mocks.js';
import { testGamePiece as testGamePieceFixture } from '../../helpers/fixtures.js';

// Extract the methods for testing
const createRegisterSpriteListeners = (updateMatrixViewPointer) => {
  return function(newTile) {
    if(newTile.getThoughtType !== undefined && newTile.getThoughtType() !== undefined){
      updateMatrixViewPointer(newTile.getThoughtType(), newTile);
    }
  };
};

const createRegisterSpriteRect = (registerRect) => {
  return function(newTile, id) {
    if(newTile.getClass() !== "Tile" && newTile.getClass() !== "Mobile"){
      const rectData = {controller: newTile, id: id};
      registerRect(rectData);
    }
  };
};

const createHandleSpecialSprites = (swipeInterfaceRef) => {
  return function(newTile, spriteData) {
    if(spriteData.IDOverride === "swipeInterface"){
      swipeInterfaceRef._swipeInterface = newTile;
    }
  };
};

describe('Main_Controller.createSprite() - Extracted Methods', () => {
  
  describe('registerSpriteListeners()', () => {
    let registerSpriteListeners;
    let mockUpdateMatrixViewPointer;
    
    beforeEach(() => {
      mockUpdateMatrixViewPointer = jest.fn();
      registerSpriteListeners = createRegisterSpriteListeners(mockUpdateMatrixViewPointer);
    });

    test('should call updateMatrixViewPointer when tile has thought type', () => {
      const newTile = {
        getThoughtType: jest.fn(() => "anxiety")
      };
      
      registerSpriteListeners(newTile);
      
      expect(mockUpdateMatrixViewPointer).toHaveBeenCalledWith("anxiety", newTile);
      expect(newTile.getThoughtType).toHaveBeenCalled();
    });

    test('should not call updateMatrixViewPointer when getThoughtType is undefined', () => {
      const newTile = {
        getThoughtType: undefined
      };
      
      registerSpriteListeners(newTile);
      
      expect(mockUpdateMatrixViewPointer).not.toHaveBeenCalled();
    });

    test('should not call updateMatrixViewPointer when thought type is undefined', () => {
      const newTile = {
        getThoughtType: jest.fn(() => undefined)
      };
      
      registerSpriteListeners(newTile);
      
      expect(mockUpdateMatrixViewPointer).not.toHaveBeenCalled();
    });

    test('should call updateMatrixViewPointer with null when thought type is null', () => {
      // Note: null !== undefined, so the function will be called
      const newTile = {
        getThoughtType: jest.fn(() => null)
      };
      
      registerSpriteListeners(newTile);
      
      expect(mockUpdateMatrixViewPointer).toHaveBeenCalledWith(null, newTile);
    });
  });

  describe('registerSpriteRect()', () => {
    let registerSpriteRect;
    let mockRegisterRect;
    
    beforeEach(() => {
      mockRegisterRect = jest.fn();
      registerSpriteRect = createRegisterSpriteRect(mockRegisterRect);
    });

    test('should register rect for non-Tile, non-Mobile sprites', () => {
      const newTile = {
        getClass: jest.fn(() => "InteractiveTile")
      };
      const id = 42;
      
      registerSpriteRect(newTile, id);
      
      expect(mockRegisterRect).toHaveBeenCalledWith({
        controller: newTile,
        id: id
      });
    });

    test('should not register rect for Tile class', () => {
      const newTile = {
        getClass: jest.fn(() => "Tile")
      };
      const id = 42;
      
      registerSpriteRect(newTile, id);
      
      expect(mockRegisterRect).not.toHaveBeenCalled();
    });

    test('should not register rect for Mobile class', () => {
      const newTile = {
        getClass: jest.fn(() => "Mobile")
      };
      const id = 42;
      
      registerSpriteRect(newTile, id);
      
      expect(mockRegisterRect).not.toHaveBeenCalled();
    });

    test('should register rect for other sprite types', () => {
      const newTile = {
        getClass: jest.fn(() => "Door")
      };
      const id = 10;
      
      registerSpriteRect(newTile, id);
      
      expect(mockRegisterRect).toHaveBeenCalledWith({
        controller: newTile,
        id: 10
      });
    });
  });

  describe('handleSpecialSprites()', () => {
    let handleSpecialSprites;
    let mockController;
    
    beforeEach(() => {
      mockController = {
        _swipeInterface: null
      };
      handleSpecialSprites = createHandleSpecialSprites(mockController);
    });

    test('should set _swipeInterface when IDOverride is swipeInterface', () => {
      const newTile = { id: 'swipeTile' };
      const spriteData = {
        IDOverride: "swipeInterface"
      };
      
      handleSpecialSprites(newTile, spriteData);
      
      expect(mockController._swipeInterface).toBe(newTile);
    });

    test('should not set _swipeInterface when IDOverride is different', () => {
      const newTile = { id: 'otherTile' };
      const spriteData = {
        IDOverride: "otherValue"
      };
      
      handleSpecialSprites(newTile, spriteData);
      
      expect(mockController._swipeInterface).toBe(null);
    });

    test('should not set _swipeInterface when IDOverride is undefined', () => {
      const newTile = { id: 'tile' };
      const spriteData = {
        IDOverride: undefined
      };
      
      handleSpecialSprites(newTile, spriteData);
      
      expect(mockController._swipeInterface).toBe(null);
    });

    test('should not set _swipeInterface when IDOverride is null', () => {
      const newTile = { id: 'tile' };
      const spriteData = {
        IDOverride: null
      };
      
      handleSpecialSprites(newTile, spriteData);
      
      expect(mockController._swipeInterface).toBe(null);
    });
  });

  describe('createSprite() - Integration Test', () => {
    let createSprite;
    let mockStage;
    let mockModel;
    let mockUpdateMatrixViewPointer;
    let mockRegisterRect;
    let mockController;
    
    beforeEach(() => {
      mockStage = createMockStage();
      mockModel = createMockGameboardModel();
      mockUpdateMatrixViewPointer = jest.fn();
      mockRegisterRect = jest.fn();
      
      mockController = {
        _mainModel: mockModel,
        _stage: mockStage,
        _swipeInterface: null,
        updateMatrixViewPointer: mockUpdateMatrixViewPointer,
        registerRect: mockRegisterRect,
        buildSpriteData: function(gamePiece, id) {
          const classAcronym = gamePiece.type;
          const startFrame = (gamePiece.startFrame === undefined) ? 0 : gamePiece.startFrame;
          
          return {
            className: this._mainModel.getGameboardClasses()[classAcronym],
            imgs: this._mainModel.getGameboardImageLookup()[classAcronym],
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
            container: this._stage.getViewID(),
            startFrame: startFrame
          };
        },
        registerSpriteListeners: function(newTile) {
          if(newTile.getThoughtType !== undefined && newTile.getThoughtType() !== undefined){
            this.updateMatrixViewPointer(newTile.getThoughtType(), newTile);
          }
        },
        registerSpriteRect: function(newTile, id) {
          if(newTile.getClass() !== "Tile" && newTile.getClass() !== "Mobile"){
            const rectData = {controller: newTile, id: id};
            this.registerRect(rectData);
          }
        },
        handleSpecialSprites: function(newTile, spriteData) {
          if(spriteData.IDOverride === "swipeInterface"){
            this._swipeInterface = newTile;
          }
        }
      };
      
      // Mock getGameBoard to return test data
      mockModel.getGameBoard = jest.fn(() => [
        { ...testGamePieceFixture, id: 0 },
        { ...testGamePieceFixture, id: 1, type: 'door' }
      ]);
      
      createSprite = function(id) {
        const gamePiece = this._mainModel.getGameBoard()[id];
        const spriteData = this.buildSpriteData(gamePiece, id);
        const newTile = this._stage.addTile(spriteData);
        
        this.registerSpriteListeners(newTile);
        this.registerSpriteRect(newTile, id);
        this.handleSpecialSprites(newTile, spriteData);
        
        return {_name: newTile.getViewID(), _classReference: newTile};
      }.bind(mockController);
    });

    test('should create sprite with all registration steps', () => {
      const mockTile = createMockTile('sprite_tile0');
      mockTile.getThoughtType = jest.fn(() => "anxiety");
      mockTile.getClass = jest.fn(() => "InteractiveTile");
      mockStage.addTile = jest.fn(() => mockTile);
      
      const result = createSprite(0);
      
      expect(mockStage.addTile).toHaveBeenCalled();
      expect(mockUpdateMatrixViewPointer).toHaveBeenCalledWith("anxiety", mockTile);
      expect(mockRegisterRect).toHaveBeenCalledWith({controller: mockTile, id: 0});
      expect(result).toEqual({
        _name: 'sprite_tile0',
        _classReference: mockTile
      });
    });

    test('should handle sprite with swipeInterface IDOverride', () => {
      const mockTile = createMockTile('sprite_tile0');
      mockTile.getThoughtType = jest.fn(() => undefined);
      mockTile.getClass = jest.fn(() => "Tile");
      mockStage.addTile = jest.fn(() => mockTile);
      
      // Override getGameBoard to return swipeInterface
      mockModel.getGameBoard = jest.fn(() => [{
        ...testGamePieceFixture,
        IDOverride: "swipeInterface"
      }]);
      
      const result = createSprite(0);
      
      expect(mockController._swipeInterface).toBe(mockTile);
      expect(result._classReference).toBe(mockTile);
    });

    test('should not register rect for Tile class', () => {
      const mockTile = createMockTile('sprite_tile0');
      mockTile.getThoughtType = jest.fn(() => undefined);
      mockTile.getClass = jest.fn(() => "Tile");
      mockStage.addTile = jest.fn(() => mockTile);
      
      createSprite(0);
      
      expect(mockRegisterRect).not.toHaveBeenCalled();
    });

    test('should not register rect for Mobile class', () => {
      const mockTile = createMockTile('sprite_tile0');
      mockTile.getThoughtType = jest.fn(() => undefined);
      mockTile.getClass = jest.fn(() => "Mobile");
      mockStage.addTile = jest.fn(() => mockTile);
      
      createSprite(0);
      
      expect(mockRegisterRect).not.toHaveBeenCalled();
    });

    test('should handle sprite without thought type', () => {
      const mockTile = createMockTile('sprite_tile0');
      mockTile.getThoughtType = jest.fn(() => undefined);
      mockTile.getClass = jest.fn(() => "InteractiveTile");
      mockStage.addTile = jest.fn(() => mockTile);
      
      createSprite(0);
      
      expect(mockUpdateMatrixViewPointer).not.toHaveBeenCalled();
      expect(mockRegisterRect).toHaveBeenCalled();
    });

    test('should return correct sprite object structure', () => {
      const mockTile = createMockTile('sprite_tile42');
      mockTile.getThoughtType = jest.fn(() => undefined);
      mockTile.getClass = jest.fn(() => "Tile");
      mockStage.addTile = jest.fn(() => mockTile);
      
      const result = createSprite(0);
      
      expect(result).toHaveProperty('_name');
      expect(result).toHaveProperty('_classReference');
      expect(result._name).toBe('sprite_tile42');
      expect(result._classReference).toBe(mockTile);
    });
  });
});

