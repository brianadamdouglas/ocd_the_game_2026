/**
 * Unit tests for Main_Controller.checkPlayerBodyCollision()
 */

import { createMockSprite } from '../../helpers/mocks.js';

// Extract the checkPlayerBodyCollision logic
const createCheckPlayerBodyCollision = () => {
  return function(spriteSelector, sprite) {
    let hit = false;
    let playerSegment = '';
    
    const headHit = global.$('#playerHead').objectHitTest({"object": global.$(spriteSelector), "transparency": false});
    const torsoHit = global.$('#playerTorso').objectHitTest({"object": global.$(spriteSelector), "transparency": false});
    const isVisible = sprite._classReference.getViewVisibility();
    
    if(headHit && isVisible){
      playerSegment = 'head';
      hit = true;
    }
    
    if(torsoHit && isVisible){
      playerSegment = 'torso';
      hit = true;
    }
    
    return {hit, segment: playerSegment};
  };
};

describe('Main_Controller.checkPlayerBodyCollision()', () => {
  let checkPlayerBodyCollision;
  let headElement;
  let torsoElement;
  
  beforeEach(() => {
    // Create mock jQuery elements
    headElement = { objectHitTest: jest.fn(() => false) };
    torsoElement = { objectHitTest: jest.fn(() => false) };
    const spriteElement = {};
    
    global.$ = jest.fn((selector) => {
      if (selector === '#playerHead') return headElement;
      if (selector === '#playerTorso') return torsoElement;
      return spriteElement;
    });
    
    checkPlayerBodyCollision = createCheckPlayerBodyCollision();
  });

  test('should detect head collision', () => {
    const sprite = createMockSprite('sprite1', false, true);
    const spriteSelector = '#sprite1';
    
    headElement.objectHitTest.mockReturnValue(true);
    torsoElement.objectHitTest.mockReturnValue(false);
    
    const result = checkPlayerBodyCollision(spriteSelector, sprite);
    
    expect(result.hit).toBe(true);
    expect(result.segment).toBe('head');
  });

  test('should detect torso collision', () => {
    const sprite = createMockSprite('sprite1', false, true);
    const spriteSelector = '#sprite1';
    
    headElement.objectHitTest.mockReturnValue(false);
    torsoElement.objectHitTest.mockReturnValue(true);
    
    const result = checkPlayerBodyCollision(spriteSelector, sprite);
    
    expect(result.hit).toBe(true);
    expect(result.segment).toBe('torso');
  });

  test('should prioritize torso over head when both collide', () => {
    const sprite = createMockSprite('sprite1', false, true);
    const spriteSelector = '#sprite1';
    
    headElement.objectHitTest.mockReturnValue(true);
    torsoElement.objectHitTest.mockReturnValue(true);
    
    const result = checkPlayerBodyCollision(spriteSelector, sprite);
    
    expect(result.hit).toBe(true);
    expect(result.segment).toBe('torso'); // Torso takes precedence
  });

  test('should return no hit when sprite is not visible', () => {
    const sprite = createMockSprite('sprite1', false, false); // Not visible
    const spriteSelector = '#sprite1';
    
    headElement.objectHitTest.mockReturnValue(true);
    torsoElement.objectHitTest.mockReturnValue(true);
    
    const result = checkPlayerBodyCollision(spriteSelector, sprite);
    
    expect(result.hit).toBe(false);
    expect(result.segment).toBe('');
  });

  test('should return no hit when no collision', () => {
    const sprite = createMockSprite('sprite1', false, true);
    const spriteSelector = '#sprite1';
    
    headElement.objectHitTest.mockReturnValue(false);
    torsoElement.objectHitTest.mockReturnValue(false);
    
    const result = checkPlayerBodyCollision(spriteSelector, sprite);
    
    expect(result.hit).toBe(false);
    expect(result.segment).toBe('');
  });
});

