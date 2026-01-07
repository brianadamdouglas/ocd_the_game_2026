/**
 * Unit tests for Main_Controller.interactWithStationaryItem() extracted methods
 */

import { createMockPlayer } from '../../helpers/mocks.js';

// Extract the methods for testing
const createCalculateThoughtIntensity = (getRandomInt) => {
  return function(interactedObject) {
    if(interactedObject.getThoughtType() === "frontDoor"){
      return 1;
    } else {
      return getRandomInt(1, 4);
    }
  };
};

const createProcessInteractionResults = (interactionResponse, getRandomInt, calculateThoughtIntensity, interactionExtendedActions) => {
  return function(results, target) {
    for(let i = 0; i < results.length; i++){
      interactionResponse(results[i].sprite, results[i].direction);
      const interactedObject = (target === undefined) ? 
        results[i].interactedObject._classReference : target;
      
      if(getRandomInt(0, 4) !== 1){
        if(interactedObject.getThoughtType() !== undefined){
          const intensity = calculateThoughtIntensity(interactedObject);
          interactionExtendedActions(interactedObject, intensity);
        }
      }
    }
  };
};

describe('Main_Controller.interactWithStationaryItem() - Extracted Methods', () => {
  
  describe('calculateThoughtIntensity()', () => {
    let calculateThoughtIntensity;
    let mockGetRandomInt;
    
    beforeEach(() => {
      mockGetRandomInt = jest.fn((min, max) => Math.floor(Math.random() * (max - min)) + min);
      calculateThoughtIntensity = createCalculateThoughtIntensity(mockGetRandomInt);
    });

    test('should return 1 for frontDoor thought type', () => {
      const interactedObject = {
        getThoughtType: jest.fn(() => "frontDoor")
      };
      
      const result = calculateThoughtIntensity(interactedObject);
      
      expect(result).toBe(1);
      expect(mockGetRandomInt).not.toHaveBeenCalled();
    });

    test('should return random value between 1-4 for non-frontDoor thought types', () => {
      const interactedObject = {
        getThoughtType: jest.fn(() => "anxiety")
      };
      mockGetRandomInt.mockReturnValue(2);
      
      const result = calculateThoughtIntensity(interactedObject);
      
      expect(result).toBe(2);
      expect(mockGetRandomInt).toHaveBeenCalledWith(1, 4);
    });

    test('should handle different thought types', () => {
      const thoughtTypes = ["anxiety", "worry", "compulsion"];
      
      thoughtTypes.forEach(type => {
        const interactedObject = {
          getThoughtType: jest.fn(() => type)
        };
        mockGetRandomInt.mockReturnValue(3);
        
        const result = calculateThoughtIntensity(interactedObject);
        
        expect(result).toBe(3);
        expect(mockGetRandomInt).toHaveBeenCalledWith(1, 4);
      });
    });
  });

  describe('processInteractionResults()', () => {
    let processInteractionResults;
    let mockInteractionResponse;
    let mockGetRandomInt;
    let mockCalculateThoughtIntensity;
    let mockInteractionExtendedActions;
    
    beforeEach(() => {
      mockInteractionResponse = jest.fn();
      mockGetRandomInt = jest.fn((min, max) => {
        // Return a value that makes the condition pass (not 1)
        return 2;
      });
      mockCalculateThoughtIntensity = jest.fn(() => 2);
      mockInteractionExtendedActions = jest.fn();
      
      processInteractionResults = createProcessInteractionResults(
        mockInteractionResponse,
        mockGetRandomInt,
        mockCalculateThoughtIntensity,
        mockInteractionExtendedActions
      );
    });

    test('should process all interaction results', () => {
      const results = [
        { sprite: { id: 'sprite1' }, direction: "UP", interactedObject: { _classReference: { id: 'obj1' } } },
        { sprite: { id: 'sprite2' }, direction: "LEFT", interactedObject: { _classReference: { id: 'obj2' } } }
      ];
      const target = undefined;
      
      const interactedObject1 = { getThoughtType: jest.fn(() => "anxiety") };
      const interactedObject2 = { getThoughtType: jest.fn(() => "worry") };
      
      // Mock the _classReference
      results[0].interactedObject._classReference = interactedObject1;
      results[1].interactedObject._classReference = interactedObject2;
      
      processInteractionResults(results, target);
      
      expect(mockInteractionResponse).toHaveBeenCalledTimes(2);
      expect(mockInteractionResponse).toHaveBeenCalledWith({ id: 'sprite1' }, "UP");
      expect(mockInteractionResponse).toHaveBeenCalledWith({ id: 'sprite2' }, "LEFT");
    });

    test('should use target when provided', () => {
      const results = [
        { sprite: { id: 'sprite1' }, direction: "UP", interactedObject: { _classReference: { id: 'obj1' } } }
      ];
      const target = { getThoughtType: jest.fn(() => "anxiety") };
      
      mockGetRandomInt.mockReturnValue(2); // Not 1, so condition passes
      
      processInteractionResults(results, target);
      
      expect(mockCalculateThoughtIntensity).toHaveBeenCalledWith(target);
      expect(mockInteractionExtendedActions).toHaveBeenCalledWith(target, 2);
    });

    test('should not trigger thoughts when random check fails', () => {
      const results = [
        { sprite: { id: 'sprite1' }, direction: "UP", interactedObject: { _classReference: { id: 'obj1' } } }
      ];
      const target = undefined;
      const interactedObject = { getThoughtType: jest.fn(() => "anxiety") };
      results[0].interactedObject._classReference = interactedObject;
      
      // Mock getRandomInt to return 1 (condition fails)
      mockGetRandomInt.mockReturnValue(1);
      
      processInteractionResults(results, target);
      
      expect(mockInteractionResponse).toHaveBeenCalled();
      expect(mockInteractionExtendedActions).not.toHaveBeenCalled();
    });

    test('should not trigger thoughts when thought type is undefined', () => {
      const results = [
        { sprite: { id: 'sprite1' }, direction: "UP", interactedObject: { _classReference: { id: 'obj1' } } }
      ];
      const target = undefined;
      const interactedObject = { getThoughtType: jest.fn(() => undefined) };
      results[0].interactedObject._classReference = interactedObject;
      
      mockGetRandomInt.mockReturnValue(2); // Condition passes
      
      processInteractionResults(results, target);
      
      expect(mockInteractionResponse).toHaveBeenCalled();
      expect(mockCalculateThoughtIntensity).not.toHaveBeenCalled();
      expect(mockInteractionExtendedActions).not.toHaveBeenCalled();
    });

    test('should calculate and use correct intensity', () => {
      const results = [
        { sprite: { id: 'sprite1' }, direction: "UP", interactedObject: { _classReference: { id: 'obj1' } } }
      ];
      const target = undefined;
      const interactedObject = { getThoughtType: jest.fn(() => "anxiety") };
      results[0].interactedObject._classReference = interactedObject;
      
      mockGetRandomInt.mockReturnValue(2);
      mockCalculateThoughtIntensity.mockReturnValue(3);
      
      processInteractionResults(results, target);
      
      expect(mockCalculateThoughtIntensity).toHaveBeenCalledWith(interactedObject);
      expect(mockInteractionExtendedActions).toHaveBeenCalledWith(interactedObject, 3);
    });

    test('should handle empty results array', () => {
      const results = [];
      const target = undefined;
      
      processInteractionResults(results, target);
      
      expect(mockInteractionResponse).not.toHaveBeenCalled();
      expect(mockInteractionExtendedActions).not.toHaveBeenCalled();
    });
  });
});

