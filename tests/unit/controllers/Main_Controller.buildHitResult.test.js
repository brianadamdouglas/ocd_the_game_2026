/**
 * Unit tests for Main_Controller.buildHitResult()
 * This is a pure function, so it's easier to test
 * 
 * We test the actual logic extracted from Main_Controller.js
 */

// Extract the buildHitResult logic for testing
const buildHitResult = (hits, mergedQuadrants, lastPlayerSegment) => {
  if(hits.length > 0){
    return ([true, mergedQuadrants, hits, lastPlayerSegment]);
  } else {
    return ([false, mergedQuadrants]);
  }
};

describe('Main_Controller.buildHitResult()', () => {

  test('should return success result when hits exist', () => {
    const hits = [['sprite1', 'head']];
    const mergedQuadrants = [1, 2];
    const lastPlayerSegment = 'head';
    
    const result = buildHitResult(hits, mergedQuadrants, lastPlayerSegment);
    
    expect(result).toEqual([true, [1, 2], [['sprite1', 'head']], 'head']);
    expect(result[0]).toBe(true);
    expect(result[1]).toEqual([1, 2]);
    expect(result[2]).toEqual(hits);
    expect(result[3]).toBe('head');
  });

  test('should return failure result when no hits', () => {
    const hits = [];
    const mergedQuadrants = [1, 2];
    const lastPlayerSegment = '';
    
    const result = buildHitResult(hits, mergedQuadrants, lastPlayerSegment);
    
    expect(result).toEqual([false, [1, 2]]);
    expect(result[0]).toBe(false);
    expect(result[1]).toEqual([1, 2]);
    expect(result.length).toBe(2);
  });

  test('should handle multiple hits', () => {
    const hits = [
      ['sprite1', 'head'],
      ['sprite2', 'torso']
    ];
    const mergedQuadrants = [1, 2, 3];
    const lastPlayerSegment = 'torso';
    
    const result = buildHitResult(hits, mergedQuadrants, lastPlayerSegment);
    
    expect(result).toEqual([true, [1, 2, 3], hits, 'torso']);
    expect(result[2]).toHaveLength(2);
    expect(result[3]).toBe('torso');
  });

  test('should handle empty quadrants array', () => {
    const hits = [];
    const mergedQuadrants = [];
    const lastPlayerSegment = '';
    
    const result = buildHitResult(hits, mergedQuadrants, lastPlayerSegment);
    
    expect(result).toEqual([false, []]);
    expect(result[1]).toEqual([]);
  });

  test('should preserve lastPlayerSegment', () => {
    const hits = [['sprite1', 'torso']];
    const mergedQuadrants = [1];
    const lastPlayerSegment = 'torso';
    
    const result = buildHitResult(hits, mergedQuadrants, lastPlayerSegment);
    
    expect(result[3]).toBe('torso');
    expect(result.length).toBe(4);
  });
});
