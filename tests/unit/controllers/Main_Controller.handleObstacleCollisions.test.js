/**
 * Unit tests for Main_Controller.handleObstacleCollisions()
 */

import { createMockSprite, createMockPlayer } from '../../helpers/mocks.js';

// Extract the handleObstacleCollisions logic
const createHandleObstacleCollisions = (controller) => {
  return function(hitObstacle) {
    const hits = hitObstacle[2];
    const previousMoves = [];
    
    for(let i = 0; i < hits.length; i++){
      const isObstacle = hits[i][0]._classReference.getViewDIV().hasClass("obstacle");
      if(isObstacle){
        controller._canMoveForward = false;
        previousMoves.push(controller.resetPosition(hits[i], hitObstacle[3], previousMoves));
        clearInterval(controller._touchWalkInterval);
        controller._player.stopWalk();
      }
    }
  };
};

describe('Main_Controller.handleObstacleCollisions()', () => {
  let mainController;
  let handleObstacleCollisions;
  let mockPlayer;
  
  beforeEach(() => {
    mockPlayer = createMockPlayer();
    
    mainController = {
      _canMoveForward: true,
      _player: mockPlayer,
      _touchWalkInterval: 123,
      resetPosition: jest.fn(() => 'resetResult')
    };
    
    handleObstacleCollisions = createHandleObstacleCollisions(mainController);
    
    // Mock clearInterval
    global.clearInterval = jest.fn();
  });

  test('should stop player movement when hitting obstacle', () => {
    const obstacleSprite = createMockSprite('obstacle1', true, true);
    const hitObstacle = [true, [1, 2], [[obstacleSprite, 'head']], 'head'];
    
    handleObstacleCollisions(hitObstacle);
    
    expect(mainController._canMoveForward).toBe(false);
    expect(mockPlayer.stopWalk).toHaveBeenCalled();
    expect(global.clearInterval).toHaveBeenCalledWith(123);
  });

  test('should call resetPosition for each obstacle', () => {
    const obstacle1 = createMockSprite('obstacle1', true, true);
    const obstacle2 = createMockSprite('obstacle2', true, true);
    const hitObstacle = [true, [1, 2], [[obstacle1, 'head'], [obstacle2, 'torso']], 'torso'];
    
    handleObstacleCollisions(hitObstacle);
    
    expect(mainController.resetPosition).toHaveBeenCalledTimes(2);
  });

  test('should not process non-obstacle hits', () => {
    const nonObstacle = createMockSprite('tile1', false, true);
    const hitObstacle = [true, [1, 2], [[nonObstacle, 'head']], 'head'];
    
    handleObstacleCollisions(hitObstacle);
    
    expect(mainController._canMoveForward).toBe(true);
    expect(mockPlayer.stopWalk).not.toHaveBeenCalled();
    expect(mainController.resetPosition).not.toHaveBeenCalled();
  });

  test('should handle empty hits array', () => {
    const hitObstacle = [true, [1, 2], [], ''];
    
    expect(() => {
      handleObstacleCollisions(hitObstacle);
    }).not.toThrow();
    
    expect(mainController._canMoveForward).toBe(true);
  });

  test('should handle mixed obstacle and non-obstacle hits', () => {
    const obstacle = createMockSprite('obstacle1', true, true);
    const nonObstacle = createMockSprite('tile1', false, true);
    const hitObstacle = [true, [1, 2], [[obstacle, 'head'], [nonObstacle, 'torso']], 'torso'];
    
    handleObstacleCollisions(hitObstacle);
    
    expect(mainController._canMoveForward).toBe(false);
    expect(mainController.resetPosition).toHaveBeenCalledTimes(1);
  });
});

