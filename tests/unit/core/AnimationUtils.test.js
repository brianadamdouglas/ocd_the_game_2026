/**
 * Unit tests for AnimationUtils
 */

// Copy of DOMUtils class (needed by AnimationUtils)
class DOMUtils {
    static css(element, property, value) {
        if (!element) return null;
        if (typeof property === 'object' && property !== null) {
            Object.keys(property).forEach(prop => {
                element.style[prop] = property[prop];
            });
            return element;
        }
        if (value === undefined) {
            return window.getComputedStyle(element)[property];
        }
        element.style[property] = value;
        return element;
    }
    
    static show(element, display = '') {
        if (!element) return element;
        element.style.display = display;
        return element;
    }
    
    static hide(element) {
        if (!element) return element;
        element.style.display = 'none';
        return element;
    }
}

// Copy of AnimationUtils class for testing
class AnimationUtils {
    static _easingMap = {
        'linear': 'linear',
        'ease': 'ease',
        'ease-in': 'ease-in',
        'ease-out': 'ease-out',
        'ease-in-out': 'ease-in-out',
        'easeOutCirc': 'cubic-bezier(0.075, 0.82, 0.165, 1)',
        'easeInOutCirc': 'cubic-bezier(0.785, 0.135, 0.15, 0.86)',
        'easeInOutQuad': 'cubic-bezier(0.455, 0.03, 0.515, 0.955)',
        'easeOutQuad': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'easeInQuad': 'cubic-bezier(0.55, 0.085, 0.68, 0.53)'
    };
    
    static _durationMap = {
        'slow': 600,
        'fast': 200,
        'default': 400
    };
    
    static _parseDuration(duration) {
        if (typeof duration === 'string') {
            return AnimationUtils._durationMap[duration] || AnimationUtils._durationMap['default'];
        }
        return typeof duration === 'number' ? duration : AnimationUtils._durationMap['default'];
    }
    
    static _parseEasing(easing) {
        return AnimationUtils._easingMap[easing] || easing || 'ease';
    }
    
    static _parseValue(value, element, property) {
        if (typeof value === 'number') {
            return `${value}px`;
        }
        
        if (typeof value === 'string') {
            if (value.startsWith('+=') || value.startsWith('-=')) {
                const operator = value[0];
                const amount = parseFloat(value.substring(2));
                const current = parseFloat(window.getComputedStyle(element)[property]) || 0;
                const newValue = operator === '+' ? current + amount : current - amount;
                return `${newValue}px`;
            }
            
            if (value === 'target') {
                return value;
            }
            
            return value;
        }
        
        return value;
    }
    
    static animate(element, properties, duration, easing, complete) {
        if (!element) return element;
        
        let options = {};
        if (typeof duration === 'object' && duration !== null) {
            options = duration;
            duration = options.duration || AnimationUtils._durationMap['default'];
            easing = options.easing || 'ease';
            complete = options.complete;
        }
        
        const durationMs = AnimationUtils._parseDuration(duration);
        const easingValue = AnimationUtils._parseEasing(easing);
        const step = options.step;
        
        if (properties.target !== undefined && step) {
            return AnimationUtils._animateWithStep(element, properties.target, durationMs, easingValue, step, complete);
        }
        
        const parsedProperties = {};
        Object.keys(properties).forEach(prop => {
            parsedProperties[prop] = AnimationUtils._parseValue(properties[prop], element, prop);
        });
        
        if (durationMs > 0) {
            const originalTransition = element.style.transition;
            element.style.transition = `all ${durationMs}ms ${easingValue}`;
            
            Object.keys(parsedProperties).forEach(prop => {
                if (prop === 'left' || prop === 'top' || prop === 'right' || prop === 'bottom') {
                    DOMUtils.css(element, prop, parsedProperties[prop]);
                } else {
                    element.style[prop] = parsedProperties[prop];
                }
            });
            
            if (complete) {
                const handleComplete = (e) => {
                    if (e.target === element) {
                        element.removeEventListener('transitionend', handleComplete);
                        element.style.transition = originalTransition;
                        complete.call(element);
                    }
                };
                element.addEventListener('transitionend', handleComplete);
                
                setTimeout(() => {
                    element.removeEventListener('transitionend', handleComplete);
                    element.style.transition = originalTransition;
                    if (complete) complete.call(element);
                }, durationMs + 50);
            } else {
                setTimeout(() => {
                    element.style.transition = originalTransition;
                }, durationMs);
            }
        } else {
            Object.keys(parsedProperties).forEach(prop => {
                if (prop === 'left' || prop === 'top' || prop === 'right' || prop === 'bottom') {
                    DOMUtils.css(element, prop, parsedProperties[prop]);
                } else {
                    element.style[prop] = parsedProperties[prop];
                }
            });
            if (complete) complete.call(element);
        }
        
        return element;
    }
    
    static _animateWithStep(element, target, duration, easing, step, complete) {
        const start = 0;
        const change = target - start;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const eased = AnimationUtils._ease(easing, progress);
            const current = start + (change * eased);
            
            if (step) {
                const fakeEvent = {
                    target: element,
                    currentTarget: element
                };
                step.call(element, current, { elem: element });
            }
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                if (complete) complete.call(element);
            }
        };
        
        requestAnimationFrame(animate);
        return element;
    }
    
    static _ease(easing, t) {
        if (easing.includes('easeOutCirc')) {
            return Math.sqrt(1 - Math.pow(t - 1, 2));
        }
        if (easing.includes('easeInOutCirc')) {
            return t < 0.5
                ? (1 - Math.sqrt(1 - Math.pow(2 * t, 2))) / 2
                : (Math.sqrt(1 - Math.pow(-2 * t + 2, 2)) + 1) / 2;
        }
        return 1 - Math.pow(1 - t, 3);
    }
    
    static fadeIn(element, duration, complete) {
        if (!element) return element;
        
        const durationMs = AnimationUtils._parseDuration(duration);
        element.style.opacity = '0';
        if (typeof DOMUtils !== 'undefined' && DOMUtils.show) {
            DOMUtils.show(element);
        } else {
            element.style.display = '';
        }
        
        requestAnimationFrame(() => {
            AnimationUtils.animate(element, { opacity: '1' }, durationMs, 'ease', complete);
        });
        
        return element;
    }
    
    static fadeOut(element, duration, complete) {
        if (!element) return element;
        
        const durationMs = AnimationUtils._parseDuration(duration);
        
        AnimationUtils.animate(element, { opacity: '0' }, durationMs, 'ease', () => {
            if (typeof DOMUtils !== 'undefined' && DOMUtils.hide) {
                DOMUtils.hide(element);
            } else {
                element.style.display = 'none';
            }
            if (complete) complete.call(element);
        });
        
        return element;
    }
}

describe('AnimationUtils', () => {
    let testElement;
    let testContainer;
    
    beforeEach(() => {
        // Mock requestAnimationFrame
        global.requestAnimationFrame = jest.fn((cb) => {
            setTimeout(cb, 16);
            return 1;
        });
        
        global.performance = {
            now: jest.fn(() => Date.now())
        };
        
        // Create test elements
        testContainer = document.createElement('div');
        testContainer.id = 'test-container';
        document.body.appendChild(testContainer);
        
        testElement = document.createElement('div');
        testElement.id = 'test-element';
        testElement.style.position = 'absolute';
        testElement.style.left = '0px';
        testElement.style.top = '0px';
        testElement.style.opacity = '1';
        testContainer.appendChild(testElement);
        
        // Mock getComputedStyle
        global.getComputedStyle = jest.fn(() => ({
            left: '0px',
            top: '0px',
            opacity: '1',
            transition: ''
        }));
    });
    
    afterEach(() => {
        if (testContainer && testContainer.parentNode) {
            testContainer.parentNode.removeChild(testContainer);
        }
        jest.clearAllTimers();
    });
    
    describe('_parseDuration()', () => {
        test('should parse numeric duration', () => {
            expect(AnimationUtils._parseDuration(500)).toBe(500);
        });
        
        test('should parse "slow" duration', () => {
            expect(AnimationUtils._parseDuration('slow')).toBe(600);
        });
        
        test('should parse "fast" duration', () => {
            expect(AnimationUtils._parseDuration('fast')).toBe(200);
        });
        
        test('should default for unknown string', () => {
            expect(AnimationUtils._parseDuration('unknown')).toBe(400);
        });
        
        test('should default for invalid input', () => {
            expect(AnimationUtils._parseDuration(null)).toBe(400);
        });
    });
    
    describe('_parseEasing()', () => {
        test('should parse known easing functions', () => {
            expect(AnimationUtils._parseEasing('easeOutCirc')).toContain('cubic-bezier');
            expect(AnimationUtils._parseEasing('easeInOutCirc')).toContain('cubic-bezier');
        });
        
        test('should return default for unknown easing', () => {
            expect(AnimationUtils._parseEasing('unknown')).toBe('unknown');
        });
        
        test('should return "ease" for null/undefined', () => {
            expect(AnimationUtils._parseEasing(null)).toBe('ease');
            expect(AnimationUtils._parseEasing(undefined)).toBe('ease');
        });
    });
    
    describe('_parseValue()', () => {
        test('should parse numeric values to pixels', () => {
            const result = AnimationUtils._parseValue(100, testElement, 'left');
            expect(result).toBe('100px');
        });
        
        test('should handle relative values "+="', () => {
            global.getComputedStyle = jest.fn(() => ({ left: '50px' }));
            const result = AnimationUtils._parseValue('+=10', testElement, 'left');
            expect(result).toBe('60px');
        });
        
        test('should handle relative values "-="', () => {
            global.getComputedStyle = jest.fn(() => ({ left: '50px' }));
            const result = AnimationUtils._parseValue('-=10', testElement, 'left');
            expect(result).toBe('40px');
        });
        
        test('should return string values as-is', () => {
            const result = AnimationUtils._parseValue('50%', testElement, 'left');
            expect(result).toBe('50%');
        });
    });
    
    describe('animate()', () => {
        test('should animate element properties', () => {
            jest.useFakeTimers();
            const complete = jest.fn();
            
            AnimationUtils.animate(testElement, { left: '100px', top: '50px' }, 400, 'ease', complete);
            
            expect(testElement.style.transition).toContain('400ms');
            expect(testElement.style.left).toBe('100px');
            expect(testElement.style.top).toBe('50px');
            
            jest.advanceTimersByTime(450);
            expect(complete).toHaveBeenCalled();
            
            jest.useRealTimers();
        });
        
        test('should handle options object', () => {
            jest.useFakeTimers();
            const complete = jest.fn();
            
            AnimationUtils.animate(testElement, { left: '100px' }, {
                duration: 500,
                easing: 'easeOutCirc',
                complete: complete
            });
            
            expect(testElement.style.transition).toContain('500ms');
            expect(testElement.style.left).toBe('100px');
            
            jest.advanceTimersByTime(550);
            expect(complete).toHaveBeenCalled();
            
            jest.useRealTimers();
        });
        
        test('should handle relative values', () => {
            global.getComputedStyle = jest.fn(() => ({ left: '50px', top: '30px' }));
            jest.useFakeTimers();
            
            AnimationUtils.animate(testElement, { left: '+=10', top: '-=5' }, 400);
            
            expect(testElement.style.left).toBe('60px');
            expect(testElement.style.top).toBe('25px');
            
            jest.useRealTimers();
        });
        
        test('should handle zero duration (immediate)', () => {
            const complete = jest.fn();
            AnimationUtils.animate(testElement, { left: '100px' }, 0, 'ease', complete);
            
            expect(testElement.style.left).toBe('100px');
            expect(complete).toHaveBeenCalled();
        });
        
        test('should handle null element', () => {
            const result = AnimationUtils.animate(null, { left: '100px' }, 400);
            expect(result).toBeNull();
        });
    });
    
    describe('fadeIn()', () => {
        test('should fade in element', () => {
            jest.useFakeTimers();
            testElement.style.display = 'none';
            testElement.style.opacity = '0';
            
            AnimationUtils.fadeIn(testElement, 400);
            
            expect(testElement.style.display).toBe('');
            expect(testElement.style.opacity).toBe('0');
            
            // After requestAnimationFrame
            jest.advanceTimersByTime(20);
            expect(testElement.style.transition).toContain('400ms');
            
            jest.useRealTimers();
        });
        
        test('should handle string duration', () => {
            jest.useFakeTimers();
            AnimationUtils.fadeIn(testElement, 'slow');
            
            jest.advanceTimersByTime(20);
            expect(testElement.style.transition).toContain('600ms');
            
            jest.useRealTimers();
        });
        
        test('should call complete callback', () => {
            jest.useFakeTimers();
            const complete = jest.fn();
            
            AnimationUtils.fadeIn(testElement, 400, complete);
            
            // First advance to trigger requestAnimationFrame callback (16ms)
            jest.advanceTimersByTime(20);
            // Then advance to trigger the completion timeout (400ms + 50ms buffer)
            jest.advanceTimersByTime(450);
            
            expect(complete).toHaveBeenCalled();
            
            jest.useRealTimers();
        });
        
        test('should handle null element', () => {
            const result = AnimationUtils.fadeIn(null, 400);
            expect(result).toBeNull();
        });
    });
    
    describe('fadeOut()', () => {
        test('should fade out element', () => {
            jest.useFakeTimers();
            testElement.style.opacity = '1';
            
            AnimationUtils.fadeOut(testElement, 400);
            
            expect(testElement.style.transition).toContain('400ms');
            expect(testElement.style.opacity).toBe('0');
            
            jest.advanceTimersByTime(450);
            expect(testElement.style.display).toBe('none');
            
            jest.useRealTimers();
        });
        
        test('should handle string duration', () => {
            jest.useFakeTimers();
            AnimationUtils.fadeOut(testElement, 'fast');
            
            expect(testElement.style.transition).toContain('200ms');
            
            jest.useRealTimers();
        });
        
        test('should call complete callback', () => {
            jest.useFakeTimers();
            const complete = jest.fn();
            
            AnimationUtils.fadeOut(testElement, 400, complete);
            jest.advanceTimersByTime(450);
            
            expect(complete).toHaveBeenCalled();
            
            jest.useRealTimers();
        });
        
        test('should handle null element', () => {
            const result = AnimationUtils.fadeOut(null, 400);
            expect(result).toBeNull();
        });
    });
    
    describe('_animateWithStep() - Step function animations', () => {
        test('should call step function during animation', () => {
            jest.useFakeTimers();
            const step = jest.fn();
            const complete = jest.fn();
            
            AnimationUtils._animateWithStep(testElement, 90, 100, 'easeOutCirc', step, complete);
            
            // Advance time to trigger animation frames
            jest.advanceTimersByTime(50);
            expect(step).toHaveBeenCalled();
            
            jest.advanceTimersByTime(100);
            expect(complete).toHaveBeenCalled();
            
            jest.useRealTimers();
        });
    });
});

