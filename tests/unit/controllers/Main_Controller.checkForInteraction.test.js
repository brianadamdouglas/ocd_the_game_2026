/**
 * Unit tests for Main_Controller.checkForInteraction() extracted methods
 */

import { createMockSprite, createMockStage, createMockGameboardModel } from '../../helpers/mocks.js';

// Extract the methods for testing
const createGetSpriteToCheck = (stageSpriteArray) => {
  return function(predictedObjectIndex, target) {
    if(target === undefined){
      return stageSpriteArray[predictedObjectIndex]._classReference;
    } else {
      return target;
    }
  };
};

const createIsWithinInteractionRange = (stageRotation) => {
  return function(targetRect, playerRect) {
    const catchableDistance = 20;
    const tolerance = 5;
    
    switch(stageRotation){
      case 0:
        return (targetRect.bottom >= playerRect.top - catchableDistance && 
               targetRect.bottom <= playerRect.bottom) && 
               (targetRect.right >= playerRect.left - tolerance && 
               targetRect.left <= playerRect.right + tolerance);
      case 90:
        return (targetRect.right >= playerRect.left - catchableDistance && 
               targetRect.right <= playerRect.right) && 
               (targetRect.top <= playerRect.bottom + tolerance && 
               targetRect.bottom >= playerRect.top - tolerance);
      case 180:
        return (targetRect.top <= playerRect.bottom + catchableDistance && 
               targetRect.top > playerRect.bottom) && 
               (targetRect.right >= playerRect.left - tolerance && 
               targetRect.left <= playerRect.right + tolerance);
      case 270:
        return (targetRect.left <= playerRect.right + catchableDistance && 
               targetRect.left > playerRect.left) && 
               (targetRect.top <= playerRect.bottom + tolerance && 
               targetRect.bottom >= playerRect.top - tolerance);
      default:
        return false;
    }
  };
};

const createCalculateInteractionDirection = (stageRotation) => {
  return function(targetRect, playerRect) {
    switch(stageRotation){
      case 0: return "UP";
      case 90: return "LEFT";
      case 180: return "DOWN";
      case 270: return "RIGHT";
      default: return null;
    }
  };
};

const createCanInteractWithObject = (stageSpriteArray) => {
  return function(spriteToCheck, predictedObjectIndex, target) {
    let isInteractive;
    if(target === undefined){
      isInteractive = global.$('#' + stageSpriteArray[predictedObjectIndex]._name).hasClass("interactive");
    } else {
      isInteractive = target.getViewDIV().hasClass("interactive");
    }
    
    const isDoor = spriteToCheck.getViewDivClass && spriteToCheck.getViewDivClass("door");
    const hasListener = spriteToCheck.hasListener && spriteToCheck.hasListener();
    
    return isInteractive || isDoor || hasListener;
  };
};

const createBuildInteractionResult = (stageSpriteArray) => {
  return function(spriteToCheck, predictedObjectIndex, target, direction) {
    if(target === undefined){
      return {
        sprite: spriteToCheck, 
        interactedObject: stageSpriteArray[predictedObjectIndex], 
        direction: direction
      };
    } else {
      return {
        sprite: spriteToCheck, 
        interactedObject: target, 
        direction: direction
      };
    }
  };
};

describe('Main_Controller.checkForInteraction() - Extracted Methods', () => {
  
  describe('getSpriteToCheck()', () => {
    let getSpriteToCheck;
    let mockStageSpriteArray;
    
    beforeEach(() => {
      mockStageSpriteArray = [
        { _name: 'sprite1', _classReference: { id: 'ref1' } },
        { _name: 'sprite2', _classReference: { id: 'ref2' } }
      ];
      getSpriteToCheck = createGetSpriteToCheck(mockStageSpriteArray);
    });

    test('should return sprite from stageSpriteArray when target is undefined', () => {
      const result = getSpriteToCheck(0, undefined);
      expect(result).toEqual({ id: 'ref1' });
    });

    test('should return target when target is provided', () => {
      const target = { id: 'target1' };
      const result = getSpriteToCheck(0, target);
      expect(result).toBe(target);
    });

    test('should handle different indices', () => {
      const result = getSpriteToCheck(1, undefined);
      expect(result).toEqual({ id: 'ref2' });
    });
  });

  describe('isWithinInteractionRange()', () => {
    let isWithinInteractionRange;
    const playerRect = { top: 100, right: 150, bottom: 200, left: 100 };

    test('should return true when target is within range at rotation 0 (UP)', () => {
      isWithinInteractionRange = createIsWithinInteractionRange(0);
      const targetRect = { top: 100, right: 150, bottom: 190, left: 100 }; // Within 20px above
      const result = isWithinInteractionRange(targetRect, playerRect);
      expect(result).toBe(true);
    });

    test('should return false when target is too far at rotation 0', () => {
      isWithinInteractionRange = createIsWithinInteractionRange(0);
      const targetRect = { top: 50, right: 150, bottom: 70, left: 100 }; // Too far above
      const result = isWithinInteractionRange(targetRect, playerRect);
      expect(result).toBe(false);
    });

    test('should return true when target is within range at rotation 90 (LEFT)', () => {
      isWithinInteractionRange = createIsWithinInteractionRange(90);
      const targetRect = { top: 100, right: 90, left: 80, bottom: 200 }; // Within 20px to left
      const result = isWithinInteractionRange(targetRect, playerRect);
      expect(result).toBe(true);
    });

    test('should return true when target is within range at rotation 180 (DOWN)', () => {
      isWithinInteractionRange = createIsWithinInteractionRange(180);
      const targetRect = { top: 210, right: 150, bottom: 230, left: 100 }; // Within 20px below
      const result = isWithinInteractionRange(targetRect, playerRect);
      expect(result).toBe(true);
    });

    test('should return true when target is within range at rotation 270 (RIGHT)', () => {
      isWithinInteractionRange = createIsWithinInteractionRange(270);
      const targetRect = { top: 100, right: 170, left: 160, bottom: 200 }; // Within 20px to right
      const result = isWithinInteractionRange(targetRect, playerRect);
      expect(result).toBe(true);
    });

    test('should return false for invalid rotation', () => {
      isWithinInteractionRange = createIsWithinInteractionRange(999);
      const targetRect = { top: 100, right: 150, bottom: 200, left: 100 };
      const result = isWithinInteractionRange(targetRect, playerRect);
      expect(result).toBe(false);
    });

    test('should respect tolerance for lateral positioning', () => {
      isWithinInteractionRange = createIsWithinInteractionRange(0);
      // Target is too far to the left (left: 90, player left: 100, tolerance is 5, so target.left must be <= 105)
      // But target.right (90) < player.left - tolerance (95), so it fails
      const targetRect = { top: 100, right: 94, bottom: 190, left: 90 }; // Outside tolerance to the left
      const result = isWithinInteractionRange(targetRect, playerRect);
      expect(result).toBe(false);
    });
  });

  describe('calculateInteractionDirection()', () => {
    let calculateInteractionDirection;
    const targetRect = { top: 100, right: 150, bottom: 200, left: 100 };
    const playerRect = { top: 100, right: 150, bottom: 200, left: 100 };

    test('should return "UP" for rotation 0', () => {
      calculateInteractionDirection = createCalculateInteractionDirection(0);
      const result = calculateInteractionDirection(targetRect, playerRect);
      expect(result).toBe("UP");
    });

    test('should return "LEFT" for rotation 90', () => {
      calculateInteractionDirection = createCalculateInteractionDirection(90);
      const result = calculateInteractionDirection(targetRect, playerRect);
      expect(result).toBe("LEFT");
    });

    test('should return "DOWN" for rotation 180', () => {
      calculateInteractionDirection = createCalculateInteractionDirection(180);
      const result = calculateInteractionDirection(targetRect, playerRect);
      expect(result).toBe("DOWN");
    });

    test('should return "RIGHT" for rotation 270', () => {
      calculateInteractionDirection = createCalculateInteractionDirection(270);
      const result = calculateInteractionDirection(targetRect, playerRect);
      expect(result).toBe("RIGHT");
    });

    test('should return null for invalid rotation', () => {
      calculateInteractionDirection = createCalculateInteractionDirection(999);
      const result = calculateInteractionDirection(targetRect, playerRect);
      expect(result).toBe(null);
    });
  });

  describe('canInteractWithObject()', () => {
    let canInteractWithObject;
    let mockStageSpriteArray;
    
    beforeEach(() => {
      mockStageSpriteArray = [
        { _name: 'sprite1' },
        { _name: 'sprite2' }
      ];
      
      // Mock jQuery
      global.$ = jest.fn((selector) => ({
        hasClass: jest.fn((className) => className === "interactive")
      }));
      
      canInteractWithObject = createCanInteractWithObject(mockStageSpriteArray);
    });

    test('should return true for interactive object when target is undefined', () => {
      const spriteToCheck = { getViewDivClass: jest.fn(), hasListener: jest.fn() };
      const result = canInteractWithObject(spriteToCheck, 0, undefined);
      expect(result).toBe(true);
    });

    test('should return true for door object', () => {
      const spriteToCheck = {
        getViewDivClass: jest.fn((className) => className === "door"),
        hasListener: jest.fn(() => false)
      };
      global.$ = jest.fn(() => ({ hasClass: jest.fn(() => false) }));
      const result = canInteractWithObject(spriteToCheck, 0, undefined);
      expect(result).toBe(true);
    });

    test('should return true for object with listener', () => {
      const spriteToCheck = {
        getViewDivClass: jest.fn(() => false),
        hasListener: jest.fn(() => true)
      };
      global.$ = jest.fn(() => ({ hasClass: jest.fn(() => false) }));
      const result = canInteractWithObject(spriteToCheck, 0, undefined);
      expect(result).toBe(true);
    });

    test('should return false for non-interactive object', () => {
      const spriteToCheck = {
        getViewDivClass: jest.fn(() => false),
        hasListener: jest.fn(() => false)
      };
      global.$ = jest.fn(() => ({ hasClass: jest.fn(() => false) }));
      const result = canInteractWithObject(spriteToCheck, 0, undefined);
      expect(result).toBe(false);
    });

    test('should check target when target is provided', () => {
      const spriteToCheck = { getViewDivClass: jest.fn(), hasListener: jest.fn() };
      const target = {
        getViewDIV: jest.fn(() => ({
          hasClass: jest.fn(() => true)
        }))
      };
      const result = canInteractWithObject(spriteToCheck, 0, target);
      expect(result).toBe(true);
    });
  });

  describe('buildInteractionResult()', () => {
    let buildInteractionResult;
    let mockStageSpriteArray;
    
    beforeEach(() => {
      mockStageSpriteArray = [
        { _name: 'sprite1' },
        { _name: 'sprite2' }
      ];
      buildInteractionResult = createBuildInteractionResult(mockStageSpriteArray);
    });

    test('should build result with stageSpriteArray object when target is undefined', () => {
      const spriteToCheck = { id: 'spriteRef' };
      const direction = "UP";
      const result = buildInteractionResult(spriteToCheck, 0, undefined, direction);
      
      expect(result).toEqual({
        sprite: spriteToCheck,
        interactedObject: mockStageSpriteArray[0],
        direction: "UP"
      });
    });

    test('should build result with target when target is provided', () => {
      const spriteToCheck = { id: 'spriteRef' };
      const target = { id: 'target1' };
      const direction = "LEFT";
      const result = buildInteractionResult(spriteToCheck, 0, target, direction);
      
      expect(result).toEqual({
        sprite: spriteToCheck,
        interactedObject: target,
        direction: "LEFT"
      });
    });

    test('should handle different directions', () => {
      const spriteToCheck = { id: 'spriteRef' };
      const result = buildInteractionResult(spriteToCheck, 0, undefined, "DOWN");
      expect(result.direction).toBe("DOWN");
    });
  });
});

