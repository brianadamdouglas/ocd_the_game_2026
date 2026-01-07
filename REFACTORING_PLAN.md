# Refactoring Plan: Very Long Methods in Main_Controller.js

## Overview

This document outlines a step-by-step approach to refactor the very long methods in `Main_Controller.js` to improve maintainability, testability, and adherence to the Single Responsibility Principle.

---

## 1. Method: `checkForHit()` (~35 lines)

### Current Issues
- Handles multiple responsibilities: finish line detection, collision detection, obstacle handling, movement control
- Difficult to test individual behaviors
- Complex conditional logic

### Refactoring Strategy

#### Extract Methods:
1. ✅ **`checkFinishLine()`** - Handle finish line detection - **COMPLETED**
2. ✅ **`handleObstacleCollisions()`** - Process obstacle hits - **COMPLETED**
3. **`updateMovementState()`** - Update `_canMoveForward` state (Not needed - already handled in handleObstacleCollisions)

#### Proposed Structure:
```javascript
checkForHit(){
    if(this._gameOver) return;
    
    this.movementProgress();
    
    if(this.checkFinishLine()){
        this.gameOver();
        return;
    }
    
    const hitObstacle = this.getHits();
    if(hitObstacle[0]){
        this.handleObstacleCollisions(hitObstacle);
    } else {
        this._canMoveForward = true;
    }
    
    this._lastObstacles = hitObstacle[1];
}

checkFinishLine(){
    const rectToCheck = this.getPlayerTransformRect();
    return rectToCheck.bottom < 150 && 
           rectToCheck.left > 850 && 
           rectToCheck.right < 1020;
}

handleObstacleCollisions(hitObstacle){
    const hits = hitObstacle[2];
    const previousMoves = [];
    
    for(let i = 0; i < hits.length; i++){
        const isObstacle = hits[i][0]._classReference.getViewDIV().hasClass("obstacle");
        if(isObstacle){
            this._canMoveForward = false;
            previousMoves.push(this.resetPosition(hits[i], hitObstacle[3], previousMoves));
            clearInterval(this._touchWalkInterval);
            this._player.stopWalk();
        }
    }
}
```

**Benefits:**
- Each method has a single, clear responsibility
- Easier to test individual behaviors
- More readable main method

---

## 2. Method: `getHits()` (~45 lines)

### Current Issues
- Handles collision detection for multiple body parts
- Contains finish line collision logic
- Complex nested conditionals

### Refactoring Strategy

#### Extract Methods:
1. ✅ **`checkPlayerBodyCollision()`** - Check head/torso collisions - **COMPLETED**
2. ✅ **`checkFinishLineCollision()`** - Handle finish line collision - **COMPLETED**
3. ✅ **`buildHitResult()`** - Construct return value - **COMPLETED**

#### Proposed Structure:
```javascript
getHits(){
    if(this._gameOver){
        return ([false, []]);
    }
    
    const mergedQuadrants = this.returnPossibleTargets();
    const hits = [];
    let lastPlayerSegment = '';
    
    for(let i = 0; i < mergedQuadrants.length; i++){
        const sprite = this._stageSpriteArray[mergedQuadrants[i]];
        const spriteName = sprite._name;
        const spriteSelector = '#' + spriteName;
        
        const collisionResult = this.checkPlayerBodyCollision(spriteSelector, sprite);
        
        if(collisionResult.hit){
            if(this.checkFinishLineCollision(spriteName)){
                return ([true, mergedQuadrants, [], 'finish']);
            }
            
            hits.push([sprite, collisionResult.segment]);
            lastPlayerSegment = collisionResult.segment;
        }
    }
    
    return this.buildHitResult(hits, mergedQuadrants, lastPlayerSegment);
}

checkPlayerBodyCollision(spriteSelector, sprite){
    let hit = false;
    let playerSegment = '';
    
    if($('#playerHead').objectHitTest({"object":$(spriteSelector), "transparency":false}) && 
       sprite._classReference.getViewVisibility()){
        playerSegment = 'head';
        hit = true;
    }
    
    if($('#playerTorso').objectHitTest({"object":$(spriteSelector), "transparency":false}) && 
       sprite._classReference.getViewVisibility()){
        playerSegment = 'torso';
        hit = true;
    }
    
    return {hit, segment: playerSegment};
}

checkFinishLineCollision(spriteName){
    return spriteName === "finishText" && !this._gameOver;
}

buildHitResult(hits, mergedQuadrants, lastPlayerSegment){
    if(hits.length > 0){
        return ([true, mergedQuadrants, hits, lastPlayerSegment]);
    } else {
        return ([false, mergedQuadrants]);
    }
}
```

**Benefits:**
- Clear separation of collision detection logic
- Easier to test individual collision types
- More maintainable code structure

---

## 3. Method: `checkForInteraction()` (~70 lines)

### ✅ COMPLETED

**Refactored from ~85 lines to ~25 lines**

### Current Issues
- Very long method with complex nested logic
- Handles multiple interaction types (interactive, door, listener)
- Complex direction calculation based on rotation
- Difficult to understand the flow

### Refactoring Strategy

#### Extract Methods:
1. ✅ **`calculateInteractionDirection()`** - Determine interaction direction based on rotation - **COMPLETED**
2. ✅ **`isWithinInteractionRange()`** - Check if object is within interaction distance - **COMPLETED**
3. ✅ **`canInteractWithObject()`** - Check if object is interactable - **COMPLETED**
4. ✅ **`buildInteractionResult()`** - Create interaction result object - **COMPLETED**
5. ✅ **`getSpriteToCheck()`** - Helper to get sprite reference - **COMPLETED**

#### Proposed Structure:
```javascript
checkForInteraction(target){
    let predictedObjectArray;
    if(target === undefined){
        predictedObjectArray = this._lastObstacles;
    } else {
        predictedObjectArray = [target];
    }
    
    const playerOnStage = this._player.transformPlayerToStage(
        $('#stage').position(), 
        this._stageRotation, 
        this._mainModel.getStageWidth(), 
        this._mainModel.getStageHeight()
    );
    const playerRect = this._player.getTransformedRect(playerOnStage, this._stageRotation, this._quadSize);
    const results = [];
    
    for(let i = 0; i < predictedObjectArray.length; i++){
        const spriteToCheck = this.getSpriteToCheck(predictedObjectArray[i], target);
        const targetRect = spriteToCheck.getRect();
        
        if(this.isWithinInteractionRange(targetRect, playerRect)){
            const direction = this.calculateInteractionDirection(targetRect, playerRect);
            
            if(this.canInteractWithObject(spriteToCheck, predictedObjectArray[i], target)){
                const result = this.buildInteractionResult(spriteToCheck, predictedObjectArray[i], target, direction);
                results.push(result);
            }
        }
    }
    
    return results;
}

getSpriteToCheck(predictedObjectIndex, target){
    if(target === undefined){
        return this._stageSpriteArray[predictedObjectIndex]._classReference;
    } else {
        return target;
    }
}

isWithinInteractionRange(targetRect, playerRect){
    const catchableDistance = 20;
    const tolerance = 5;
    
    switch(this._stageRotation){
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
}

calculateInteractionDirection(targetRect, playerRect){
    switch(this._stageRotation){
        case 0: return "UP";
        case 90: return "LEFT";
        case 180: return "DOWN";
        case 270: return "RIGHT";
        default: return null;
    }
}

canInteractWithObject(spriteToCheck, predictedObjectIndex, target){
    let isInteractive;
    if(target === undefined){
        isInteractive = $('#' + this._stageSpriteArray[predictedObjectIndex]._name).hasClass("interactive");
    } else {
        isInteractive = target.getViewDIV().hasClass("interactive");
    }
    
    const isDoor = spriteToCheck.getViewDivClass && spriteToCheck.getViewDivClass("door");
    const hasListener = spriteToCheck.hasListener && spriteToCheck.hasListener();
    
    return isInteractive || isDoor || hasListener;
}

buildInteractionResult(spriteToCheck, predictedObjectIndex, target, direction){
    if(target === undefined){
        return {
            sprite: spriteToCheck, 
            interactedObject: this._stageSpriteArray[predictedObjectIndex], 
            direction: direction
        };
    } else {
        return {
            sprite: spriteToCheck, 
            interactedObject: target, 
            direction: direction
        };
    }
}
```

**Benefits:**
- Each extracted method has a single, clear purpose
- Easier to test interaction logic in isolation
- More maintainable and readable
- Direction calculation is now explicit and testable

**Status:** ✅ All methods extracted and refactored. Method reduced from ~85 lines to ~25 lines.

---

## 4. Method: `createSprite()` (~50 lines)

### ✅ COMPLETED

**Refactored from ~17 lines to ~10 lines**

### Current Issues
- Large data object construction
- Multiple conditional checks
- Mixed concerns (data preparation, sprite creation, registration)

### Refactoring Strategy

#### Extract Methods:
1. ✅ **`buildSpriteData()`** - Construct sprite data object - **COMPLETED**
2. ✅ **`registerSpriteListeners()`** - Handle listener registration - **COMPLETED**
3. ✅ **`registerSpriteRect()`** - Handle rect registration - **COMPLETED**
4. ✅ **`handleSpecialSprites()`** - Handle special sprite cases - **COMPLETED**

#### Proposed Structure:
```javascript
createSprite(id){
    const gamePiece = this._mainModel.getGameBoard()[id];
    const spriteData = this.buildSpriteData(gamePiece, id);
    const newTile = this._stage.addTile(spriteData);
    
    this.registerSpriteListeners(newTile);
    this.registerSpriteRect(newTile, id);
    this.handleSpecialSprites(newTile, spriteData);
    
    return {
        _name: newTile.getViewID(), 
        _classReference: newTile
    };
}

buildSpriteData(gamePiece, id){
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
}

registerSpriteListeners(newTile){
    if(newTile.getThoughtType !== undefined && newTile.getThoughtType() !== undefined){
        this.updateMatrixViewPointer(newTile.getThoughtType(), newTile);
    }
}

registerSpriteRect(newTile, id){
    if(newTile.getClass() !== "Tile" && newTile.getClass() !== "Mobile"){
        const rectData = {controller: newTile, id: id};
        this.registerRect(rectData);
    }
}

handleSpecialSprites(newTile, spriteData){
    if(spriteData.IDOverride === "swipeInterface"){
        this._swipeInterface = newTile;
    }
}
```

**Benefits:**
- Clear separation of data preparation and registration
- Easier to test individual registration steps
- More maintainable sprite creation process

**Status:** ✅ All methods extracted and refactored. Method reduced from ~17 lines to ~10 lines.

---

## 5. Method: `interactWithStationaryItem()` (~30 lines)

### Current Issues
- Handles multiple interaction types
- Complex conditional logic for different object types

### Refactoring Strategy

#### Extract Methods:
1. **`processInteractionResults()`** - Handle interaction results
2. **`triggerThoughtForInteraction()`** - Handle thought triggering

#### Proposed Structure:
```javascript
interactWithStationaryItem(target){
    this._player.stopWalk();
    this._player.startInteract();
    
    let results;
    if(target === undefined){
        results = this.checkForInteraction();
    } else {
        results = this.checkForInteraction(target);
    }
    
    if(results.length > 0){
        this.processInteractionResults(results, target);
    }
}

processInteractionResults(results, target){
    for(let i = 0; i < results.length; i++){
        this.interactionResponse(results[i].sprite, results[i].direction);
        const interactedObject = (target === undefined) ? 
            results[i].interactedObject._classReference : target;
        
        if(this.getRandomInt(0, 4) !== 1){
            this.triggerThoughtForInteraction(interactedObject);
        }
    }
}

triggerThoughtForInteraction(interactedObject){
    let intensity;
    if(interactedObject.getThoughtType() === "frontDoor"){
        intensity = 2;
    } else {
        intensity = 1;
    }
    
    const thoughtType = interactedObject.getThoughtType();
    const objectType = interactedObject.getObjectType();
    this._MIND.addThought(
        interactedObject.getViewID(),
        thoughtType,
        objectType,
        intensity,
        this.getPlayerLocation()
    );
}
```

**Benefits:**
- Clearer flow for interaction processing
- Easier to test interaction logic
- Better separation of concerns

---

## Implementation Strategy

### Phase 1: Low-Risk Refactoring (Week 1)
1. ✅ **COMPLETED** - Extract `checkFinishLine()` from `checkForHit()`
2. ✅ **COMPLETED** - Extract `handleObstacleCollisions()` from `checkForHit()`
3. ✅ **COMPLETED** - Extract `buildHitResult()` from `getHits()`
4. ✅ **COMPLETED** - Extract `buildSpriteData()` from `createSprite()`

**Risk Level:** Low - These are pure data transformation methods

**Phase 1 Status:** ✅ **COMPLETE** - All low-risk refactorings done!

### Phase 2: Medium-Risk Refactoring (Week 2)
1. ✅ **COMPLETED** - Extract collision detection methods from `getHits()` (`checkPlayerBodyCollision()`, `checkFinishLineCollision()`)
2. ✅ **COMPLETED** - Extract interaction range checking from `checkForInteraction()` (`isWithinInteractionRange()`, `calculateInteractionDirection()`, `canInteractWithObject()`, `buildInteractionResult()`, `getSpriteToCheck()`)
3. ✅ **COMPLETED** - Extract sprite registration methods from `createSprite()` (`registerSpriteListeners()`, `registerSpriteRect()`, `handleSpecialSprites()`)

**Phase 2 Status:** ✅ **COMPLETE** - All medium-risk refactorings done!

**Risk Level:** Medium - Requires careful testing of game mechanics

### Phase 3: High-Risk Refactoring (Week 3)
1. ✅ **COMPLETED** - Refactor `checkForInteraction()` direction calculation (completed as part of Phase 2)
2. Refactor `handleObstacleCollisions()` from `checkForHit()` (Note: This was already completed in Phase 1)
3. Complete refactoring of `interactWithStationaryItem()`

**Risk Level:** High - Core game logic, requires extensive testing

---

## Testing Strategy

### Test Framework Setup

**Recommended Framework:** Jest (or Mocha + Chai)

**Setup Steps:**
1. Install Jest: `npm install --save-dev jest @babel/core @babel/preset-env`
2. Create `jest.config.js`:
   ```javascript
   module.exports = {
     testEnvironment: 'jsdom',
     setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
     testMatch: ['**/tests/**/*.test.js'],
     collectCoverageFrom: [
       'dev/js_MVC/**/*.js',
       '!dev/js_MVC/vendors/**',
       '!dev/js_MVC/**/*.test.js'
     ],
     coverageThreshold: {
       global: {
         branches: 70,
         functions: 70,
         lines: 70,
         statements: 70
       }
     }
   };
   ```
3. Create `tests/setup.js` for global test setup (mocks, DOM setup)
4. Create `tests/` directory structure:
   ```
   tests/
   ├── unit/
   │   ├── controllers/
   │   │   └── Main_Controller.test.js
   │   ├── core/
   │   └── models/
   ├── integration/
   └── helpers/
   │   ├── mocks.js
   │   └── fixtures.js
   ```

### Unit Tests - Extracted Methods

#### 1. `checkFinishLine()` Tests

**File:** `tests/unit/controllers/Main_Controller.checkFinishLine.test.js`

**Test Cases:**
- [ ] **Should return true when player is in finish area**
  - Player rect: `{bottom: 140, left: 900, right: 1000, top: 100}`
  - Expected: `true`
  
- [ ] **Should return false when player is above finish line**
  - Player rect: `{bottom: 160, left: 900, right: 1000, top: 120}`
  - Expected: `false`
  
- [ ] **Should return false when player is left of finish line**
  - Player rect: `{bottom: 140, left: 800, right: 900, top: 100}`
  - Expected: `false`
  
- [ ] **Should return false when player is right of finish line**
  - Player rect: `{bottom: 140, left: 1030, right: 1130, top: 100}`
  - Expected: `false`
  
- [ ] **Should return true when player is exactly on finish line boundary**
  - Player rect: `{bottom: 150, left: 850, right: 1020, top: 100}`
  - Expected: `true`
  
- [ ] **Should handle edge cases (boundary values)**
  - Test with `bottom: 149.9` (just above)
  - Test with `bottom: 150.1` (just below)
  - Test with `left: 849.9` (just left)
  - Test with `left: 850.1` (just right)

**Mock Requirements:**
- Mock `getPlayerTransformRect()` to return test rects

---

#### 2. `handleObstacleCollisions()` Tests

**File:** `tests/unit/controllers/Main_Controller.handleObstacleCollisions.test.js`

**Test Cases:**
- [ ] **Should stop player movement when hitting obstacle**
  - Mock obstacle in hits array
  - Verify `_canMoveForward` set to `false`
  - Verify `_player.stopWalk()` called
  - Verify `clearInterval()` called with `_touchWalkInterval`
  
- [ ] **Should call resetPosition for each obstacle**
  - Multiple obstacles in hits array
  - Verify `resetPosition()` called for each
  
- [ ] **Should not process non-obstacle hits**
  - Hits array with non-obstacle items
  - Verify obstacles are filtered correctly
  
- [ ] **Should handle empty hits array**
  - Empty hits array
  - Should not throw error
  
- [ ] **Should handle null/undefined hits**
  - `hitObstacle[2]` is null/undefined
  - Should not throw error

**Mock Requirements:**
- Mock `_player` object with `stopWalk()` method
- Mock `_touchWalkInterval`
- Mock `resetPosition()` method
- Mock sprite objects with `_classReference.getViewDIV().hasClass()`

---

#### 3. `buildHitResult()` Tests

**File:** `tests/unit/controllers/Main_Controller.buildHitResult.test.js`

**Test Cases:**
- [ ] **Should return success result when hits exist**
  - Input: `hits: [[sprite1, 'head']], mergedQuadrants: [1,2], lastPlayerSegment: 'head'`
  - Expected: `[true, [1,2], [[sprite1, 'head']], 'head']`
  
- [ ] **Should return failure result when no hits**
  - Input: `hits: [], mergedQuadrants: [1,2], lastPlayerSegment: ''`
  - Expected: `[false, [1,2]]`
  
- [ ] **Should handle multiple hits**
  - Input: Multiple hits with different segments
  - Expected: All hits included in result
  
- [ ] **Should handle empty quadrants array**
  - Input: `mergedQuadrants: []`
  - Expected: Result includes empty array
  
- [ ] **Should preserve lastPlayerSegment**
  - Input: `lastPlayerSegment: 'torso'`
  - Expected: Result includes 'torso' in correct position

**Mock Requirements:**
- None (pure function)

---

#### 4. `checkPlayerBodyCollision()` Tests

**File:** `tests/unit/controllers/Main_Controller.checkPlayerBodyCollision.test.js`

**Test Cases:**
- [ ] **Should detect head collision**
  - Mock `$('#playerHead').objectHitTest()` returns true
  - Mock sprite visibility is true
  - Expected: `{hit: true, segment: 'head'}`
  
- [ ] **Should detect torso collision**
  - Mock `$('#playerTorso').objectHitTest()` returns true
  - Mock sprite visibility is true
  - Expected: `{hit: true, segment: 'torso'}`
  
- [ ] **Should prioritize torso over head when both collide**
  - Both head and torso hit tests return true
  - Expected: `{hit: true, segment: 'torso'}` (torso takes precedence)
  
- [ ] **Should return no hit when sprite is not visible**
  - Hit test returns true but sprite visibility is false
  - Expected: `{hit: false, segment: ''}`
  
- [ ] **Should return no hit when no collision**
  - Both hit tests return false
  - Expected: `{hit: false, segment: ''}`
  
- [ ] **Should handle null/undefined sprite**
  - Sprite is null or undefined
  - Should not throw error

**Mock Requirements:**
- Mock jQuery `$()` and `objectHitTest()` method
- Mock sprite object with `_classReference.getViewVisibility()`

---

#### 5. `checkFinishLineCollision()` Tests

**File:** `tests/unit/controllers/Main_Controller.checkFinishLineCollision.test.js`

**Test Cases:**
- [ ] **Should return true for finishText sprite**
  - Input: `spriteName: "finishText"`, `_gameOver: false`
  - Expected: `true`
  
- [ ] **Should return false for non-finishText sprite**
  - Input: `spriteName: "door1"`, `_gameOver: false`
  - Expected: `false`
  
- [ ] **Should return false when game is over**
  - Input: `spriteName: "finishText"`, `_gameOver: true`
  - Expected: `false`
  
- [ ] **Should handle empty string sprite name**
  - Input: `spriteName: ""`
  - Expected: `false`
  
- [ ] **Should handle null/undefined sprite name**
  - Input: `spriteName: null` or `undefined`
  - Should not throw error

**Mock Requirements:**
- Mock `_gameOver` property

---

#### 6. `buildSpriteData()` Tests

**File:** `tests/unit/controllers/Main_Controller.buildSpriteData.test.js`

**Test Cases:**
- [ ] **Should build complete sprite data object**
  - Input: Complete gamePiece object with all properties
  - Expected: All properties mapped correctly
  
- [ ] **Should use default startFrame when undefined**
  - Input: `gamePiece.startFrame: undefined`
  - Expected: `startFrame: 0` in result
  
- [ ] **Should use provided startFrame**
  - Input: `gamePiece.startFrame: 2`
  - Expected: `startFrame: 2` in result
  
- [ ] **Should generate correct sprite ID**
  - Input: `id: 42`
  - Expected: `id: 'sprite_tile42'` in result
  
- [ ] **Should map all listener properties**
  - Input: `gamePiece.listener: "door1", listener1: "switch1", listener2: "switch2"`
  - Expected: All listener properties mapped correctly
  
- [ ] **Should handle missing optional properties**
  - Input: gamePiece with only required properties
  - Should not throw error
  
- [ ] **Should use stage container ID**
  - Mock `_stage.getViewID()` returns "stage123"
  - Expected: `container: "stage123"` in result

**Mock Requirements:**
- Mock `_mainModel.getGameboardClasses()`
- Mock `_mainModel.getGameboardImageLookup()`
- Mock `_stage.getViewID()`

---

### Integration Tests

#### 1. `checkForHit()` Integration Tests

**File:** `tests/integration/Main_Controller.checkForHit.integration.test.js`

**Test Cases:**
- [ ] **Should complete full collision flow**
  - Mock all dependencies
  - Call `checkForHit()`
  - Verify finish line check called
  - Verify `getHits()` called
  - Verify obstacle handling called when hits exist
  
- [ ] **Should not process when game is over**
  - Set `_gameOver: true`
  - Call `checkForHit()`
  - Verify early return (no further processing)
  
- [ ] **Should update _lastObstacles**
  - Call `checkForHit()`
  - Verify `_lastObstacles` updated with quadrants from `getHits()`

---

#### 2. `getHits()` Integration Tests

**File:** `tests/integration/Main_Controller.getHits.integration.test.js`

**Test Cases:**
- [ ] **Should complete full hit detection flow**
  - Mock quadrants and sprites
  - Call `getHits()`
  - Verify collision checks called
  - Verify finish line check called
  - Verify result building called
  
- [ ] **Should handle finish line collision correctly**
  - Mock finishText sprite in quadrants
  - Call `getHits()`
  - Verify `gameOver()` called
  - Verify early return with finish flag

---

#### 3. `createSprite()` Integration Tests

**File:** `tests/integration/Main_Controller.createSprite.integration.test.js`

**Test Cases:**
- [ ] **Should complete full sprite creation flow**
  - Mock gamePiece and dependencies
  - Call `createSprite(id)`
  - Verify data building called
  - Verify tile creation called
  - Verify registration methods called
  - Verify return value structure

---

### Test Helpers & Mocks

**File:** `tests/helpers/mocks.js`

**Required Mocks:**
```javascript
// Mock jQuery
global.$ = jest.fn((selector) => ({
  objectHitTest: jest.fn(),
  hasClass: jest.fn(),
  css: jest.fn(),
  // ... other jQuery methods
}));

// Mock Player
const mockPlayer = {
  stopWalk: jest.fn(),
  startInteract: jest.fn(),
  getStickyOffset: jest.fn(() => 10),
  transformPlayerToStage: jest.fn(),
  getTransformedRect: jest.fn()
};

// Mock Stage
const mockStage = {
  addTile: jest.fn(),
  getViewID: jest.fn(() => 'stage'),
  bindView: jest.fn()
};

// Mock Sprite
const createMockSprite = (name, isObstacle = false, isVisible = true) => ({
  _name: name,
  _classReference: {
    getViewVisibility: jest.fn(() => isVisible),
    getViewDIV: jest.fn(() => ({
      hasClass: jest.fn((className) => className === 'obstacle' && isObstacle)
    })),
    getViewID: jest.fn(() => name)
  }
});

// Mock Gameboard Model
const mockGameboardModel = {
  getGameBoard: jest.fn(() => []),
  getGameboardClasses: jest.fn(() => ({})),
  getGameboardImageLookup: jest.fn(() => ({}))
};
```

**File:** `tests/helpers/fixtures.js`

**Test Data:**
```javascript
export const testGamePiece = {
  type: 'tile',
  x: 100,
  y: 200,
  w: 50,
  h: 50,
  startFrame: 0,
  listener: 'door1',
  thoughtType: 'anxiety',
  objectType: 'interactive'
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
```

---

### Manual Testing Checklist

- [ ] Player movement works correctly
- [ ] Collision detection works for all object types
- [ ] Interactions work (doors, objects, pickups)
- [ ] Finish line detection works
- [ ] Game restart works correctly
- [ ] No performance degradation
- [ ] No console errors
- [ ] All game states transition correctly

---

## Success Criteria

1. **Method Length:** No method longer than 30 lines
2. **Cyclomatic Complexity:** Each method has complexity < 10
3. **Test Coverage:** 80%+ coverage for refactored methods
4. **No Regressions:** All existing functionality works identically
5. **Performance:** No performance degradation (maintain < 60 FPS)

---

## Notes

- **Preserve Behavior:** All refactoring must maintain exact same game behavior
- **Incremental Approach:** Refactor one method at a time, test thoroughly
- **Documentation:** Update JSDoc comments for all new methods
- **Code Review:** Review each phase before proceeding to next

---

## Estimated Time

- **Phase 1:** 4-6 hours
- **Phase 2:** 8-12 hours
- **Phase 3:** 12-16 hours
- **Testing:** 8-10 hours
- **Total:** 32-44 hours (~1 week of focused work)

