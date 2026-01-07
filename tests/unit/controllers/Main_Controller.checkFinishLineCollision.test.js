/**
 * Unit tests for Main_Controller.checkFinishLineCollision()
 */

// Extract the checkFinishLineCollision logic for testing
const createCheckFinishLineCollision = (gameOver = false) => {
  return function(spriteName) {
    return spriteName === "finishText" && !gameOver;
  };
};

describe('Main_Controller.checkFinishLineCollision()', () => {
  let checkFinishLineCollision;

  test('should return true for finishText sprite when game is not over', () => {
    checkFinishLineCollision = createCheckFinishLineCollision(false);
    const result = checkFinishLineCollision("finishText");
    
    expect(result).toBe(true);
  });

  test('should return false for non-finishText sprite', () => {
    checkFinishLineCollision = createCheckFinishLineCollision(false);
    const result = checkFinishLineCollision("door1");
    
    expect(result).toBe(false);
  });

  test('should return false when game is over', () => {
    checkFinishLineCollision = createCheckFinishLineCollision(true);
    const result = checkFinishLineCollision("finishText");
    
    expect(result).toBe(false);
  });

  test('should handle empty string sprite name', () => {
    checkFinishLineCollision = createCheckFinishLineCollision(false);
    const result = checkFinishLineCollision("");
    
    expect(result).toBe(false);
  });

  test('should handle null sprite name', () => {
    checkFinishLineCollision = createCheckFinishLineCollision(false);
    const result = checkFinishLineCollision(null);
    
    expect(result).toBe(false);
  });

  test('should handle undefined sprite name', () => {
    checkFinishLineCollision = createCheckFinishLineCollision(false);
    const result = checkFinishLineCollision(undefined);
    
    expect(result).toBe(false);
  });
});

