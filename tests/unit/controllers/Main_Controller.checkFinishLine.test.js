/**
 * Unit tests for Main_Controller.checkFinishLine()
 * 
 * Tests the finish line detection logic
 */

// Extract the checkFinishLine logic for testing
const checkFinishLine = (getPlayerTransformRect) => {
  const rectToCheck = getPlayerTransformRect();
  return rectToCheck.bottom < 150 && 
         rectToCheck.left > 850 && 
         rectToCheck.right < 1020;
};

describe('Main_Controller.checkFinishLine()', () => {
  let mockGetPlayerTransformRect;
  
  beforeEach(() => {
    mockGetPlayerTransformRect = jest.fn();
  });

  test('should return true when player is in finish area', () => {
    const playerRect = { bottom: 140, left: 900, right: 1000, top: 100 };
    mockGetPlayerTransformRect.mockReturnValue(playerRect);
    
    const result = checkFinishLine(mockGetPlayerTransformRect);
    
    expect(result).toBe(true);
    expect(mockGetPlayerTransformRect).toHaveBeenCalled();
  });

  test('should return false when player is above finish line', () => {
    const playerRect = { bottom: 160, left: 900, right: 1000, top: 120 };
    mockGetPlayerTransformRect.mockReturnValue(playerRect);
    
    const result = checkFinishLine(mockGetPlayerTransformRect);
    
    expect(result).toBe(false);
  });

  test('should return false when player is left of finish line', () => {
    const playerRect = { bottom: 140, left: 800, right: 900, top: 100 };
    mockGetPlayerTransformRect.mockReturnValue(playerRect);
    
    const result = checkFinishLine(mockGetPlayerTransformRect);
    
    expect(result).toBe(false);
  });

  test('should return false when player is right of finish line', () => {
    const playerRect = { bottom: 140, left: 1030, right: 1130, top: 100 };
    mockGetPlayerTransformRect.mockReturnValue(playerRect);
    
    const result = checkFinishLine(mockGetPlayerTransformRect);
    
    expect(result).toBe(false);
  });

  test('should return false when player is exactly on finish line boundary (bottom = 150)', () => {
    // bottom < 150 means bottom must be strictly less than 150
    const playerRect = { bottom: 150, left: 850, right: 1020, top: 100 };
    mockGetPlayerTransformRect.mockReturnValue(playerRect);
    
    const result = checkFinishLine(mockGetPlayerTransformRect);
    
    expect(result).toBe(false); // 150 is not < 150
  });

  test('should handle edge cases - just above boundary (should return true)', () => {
    // bottom: 149.9 is < 150, so should return true
    const playerRect = { bottom: 149.9, left: 900, right: 1000, top: 100 };
    mockGetPlayerTransformRect.mockReturnValue(playerRect);
    
    const result = checkFinishLine(mockGetPlayerTransformRect);
    
    expect(result).toBe(true); // 149.9 < 150
  });

  test('should handle edge cases - just below boundary (should return false)', () => {
    // bottom: 150.1 is not < 150, so should return false
    const playerRect = { bottom: 150.1, left: 900, right: 1000, top: 100 };
    mockGetPlayerTransformRect.mockReturnValue(playerRect);
    
    const result = checkFinishLine(mockGetPlayerTransformRect);
    
    expect(result).toBe(false); // 150.1 is not < 150
  });

  test('should handle edge cases - just left of boundary', () => {
    const playerRect = { bottom: 140, left: 849.9, right: 950, top: 100 };
    mockGetPlayerTransformRect.mockReturnValue(playerRect);
    
    const result = checkFinishLine(mockGetPlayerTransformRect);
    
    expect(result).toBe(false);
  });

  test('should handle edge cases - just right of boundary', () => {
    const playerRect = { bottom: 140, left: 850.1, right: 950, top: 100 };
    mockGetPlayerTransformRect.mockReturnValue(playerRect);
    
    const result = checkFinishLine(mockGetPlayerTransformRect);
    
    expect(result).toBe(true);
  });
});
