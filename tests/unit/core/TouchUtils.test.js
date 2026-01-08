/**
 * Unit tests for TouchUtils
 */

// Copy of TouchUtils class for testing
class TouchUtils {
    static SWIPE_CONFIG = {
        minDistance: 30,
        maxTime: 1000,
        verticalThreshold: 75,
        horizontalThreshold: 30
    };

    static TAP_CONFIG = {
        maxDistance: 10,
        maxTime: 300
    };

    static TAP_HOLD_THRESHOLD = 750;

    static onSwipe(element, direction, handler) {
        if (!element || !handler) {
            console.warn('TouchUtils.onSwipe: element and handler are required');
            return () => {};
        }

        const validDirections = ['up', 'down', 'left', 'right'];
        if (!validDirections.includes(direction.toLowerCase())) {
            console.warn(`TouchUtils.onSwipe: Invalid direction "${direction}". Must be one of: ${validDirections.join(', ')}`);
            return () => {};
        }

        let startX, startY, startTime;
        const config = TouchUtils.SWIPE_CONFIG;

        const touchStart = (e) => {
            const touch = e.touches[0];
            if (!touch) return;
            
            startX = touch.clientX;
            startY = touch.clientY;
            startTime = Date.now();
        };

        const touchMove = (e) => {
            if (!startX || !startY) return;
            
            const touch = e.touches[0];
            if (!touch) return;
            
            const deltaX = Math.abs(touch.clientX - startX);
            const deltaY = Math.abs(touch.clientY - startY);
            
            if (deltaY > 10 || deltaX > 10) {
                e.preventDefault();
            }
        };

        const touchEnd = (e) => {
            if (!startX || !startY || !startTime) {
                startX = startY = startTime = null;
                return;
            }

            const touch = e.changedTouches[0];
            if (!touch) {
                startX = startY = startTime = null;
                return;
            }

            const endX = touch.clientX;
            const endY = touch.clientY;
            const endTime = Date.now();

            const deltaX = endX - startX;
            const deltaY = endY - startY;
            const deltaTime = endTime - startTime;

            if (deltaTime < config.maxTime) {
                const absDeltaX = Math.abs(deltaX);
                const absDeltaY = Math.abs(deltaY);

                if (absDeltaX > absDeltaY) {
                    if (absDeltaX > config.minDistance && absDeltaY < config.horizontalThreshold) {
                        const swipeDirection = deltaX < 0 ? 'left' : 'right';
                        if (direction.toLowerCase() === swipeDirection) {
                            handler(e);
                        }
                    }
                } else {
                    if (absDeltaY > config.minDistance && absDeltaX < config.verticalThreshold) {
                        const swipeDirection = deltaY < 0 ? 'up' : 'down';
                        if (direction.toLowerCase() === swipeDirection) {
                            handler(e);
                        }
                    }
                }
            }

            startX = startY = startTime = null;
        };

        element.addEventListener('touchstart', touchStart, { passive: false });
        element.addEventListener('touchmove', touchMove, { passive: false });
        element.addEventListener('touchend', touchEnd);

        return () => {
            element.removeEventListener('touchstart', touchStart);
            element.removeEventListener('touchmove', touchMove);
            element.removeEventListener('touchend', touchEnd);
        };
    }

    static onTap(element, handler) {
        if (!element || !handler) {
            console.warn('TouchUtils.onTap: element and handler are required');
            return () => {};
        }

        let startTime, startX, startY;
        const config = TouchUtils.TAP_CONFIG;

        const touchStart = (e) => {
            const touch = e.touches[0];
            if (!touch) return;
            
            startX = touch.clientX;
            startY = touch.clientY;
            startTime = Date.now();
        };

        const touchEnd = (e) => {
            if (!startTime || !startX || !startY) {
                startTime = startX = startY = null;
                return;
            }

            const touch = e.changedTouches[0];
            if (!touch) {
                startTime = startX = startY = null;
                return;
            }

            const deltaX = Math.abs(touch.clientX - startX);
            const deltaY = Math.abs(touch.clientY - startY);
            const deltaTime = Date.now() - startTime;

            if (deltaTime < config.maxTime && deltaX < config.maxDistance && deltaY < config.maxDistance) {
                handler(e);
            }

            startTime = startX = startY = null;
        };

        element.addEventListener('touchstart', touchStart);
        element.addEventListener('touchend', touchEnd);

        return () => {
            element.removeEventListener('touchstart', touchStart);
            element.removeEventListener('touchend', touchEnd);
        };
    }

    static onTapHold(element, handler, holdDuration = TouchUtils.TAP_HOLD_THRESHOLD) {
        if (!element || !handler) {
            console.warn('TouchUtils.onTapHold: element and handler are required');
            return () => {};
        }

        let holdTimer;
        let hasTriggered = false;

        const touchStart = (e) => {
            hasTriggered = false;
            holdTimer = setTimeout(() => {
                hasTriggered = true;
                handler(e);
            }, holdDuration);
        };

        const touchEnd = () => {
            if (holdTimer) {
                clearTimeout(holdTimer);
                holdTimer = null;
            }
        };

        const touchMove = () => {
            if (holdTimer) {
                clearTimeout(holdTimer);
                holdTimer = null;
            }
        };

        element.addEventListener('touchstart', touchStart);
        element.addEventListener('touchend', touchEnd);
        element.addEventListener('touchmove', touchMove);

        return () => {
            if (holdTimer) {
                clearTimeout(holdTimer);
            }
            element.removeEventListener('touchstart', touchStart);
            element.removeEventListener('touchend', touchEnd);
            element.removeEventListener('touchmove', touchMove);
        };
    }

    static onOrientationChange(handler) {
        if (!handler) {
            console.warn('TouchUtils.onOrientationChange: handler is required');
            return () => {};
        }

        let lastOrientation = null;

        const getOrientation = () => {
            if (window.orientation !== undefined) {
                return Math.abs(window.orientation) === 90 ? 'landscape' : 'portrait';
            }
            return window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
        };

        const orientationHandler = (e) => {
            const currentOrientation = getOrientation();
            
            if (lastOrientation !== currentOrientation) {
                lastOrientation = currentOrientation;
                
                const event = {
                    orientation: currentOrientation,
                    originalEvent: e
                };
                
                handler(event);
            }
        };

        lastOrientation = getOrientation();

        if ('onorientationchange' in window) {
            window.addEventListener('orientationchange', orientationHandler);
        } else {
            window.addEventListener('resize', orientationHandler);
        }

        return () => {
            if ('onorientationchange' in window) {
                window.removeEventListener('orientationchange', orientationHandler);
            } else {
                window.removeEventListener('resize', orientationHandler);
            }
        };
    }
}

// Helper function to create mock touch events
function createTouchEvent(type, touches, changedTouches) {
    const event = new Event(type, { bubbles: true, cancelable: true });
    event.touches = touches || [];
    event.changedTouches = changedTouches || touches || [];
    event.preventDefault = jest.fn();
    return event;
}

function createTouch(clientX, clientY) {
    return { clientX, clientY };
}

describe('TouchUtils', () => {
    let element;
    let handler;

    beforeEach(() => {
        element = document.createElement('div');
        document.body.appendChild(element);
        handler = jest.fn();
        jest.useFakeTimers();
    });

    afterEach(() => {
        document.body.removeChild(element);
        jest.clearAllTimers();
        jest.useRealTimers();
    });

    describe('onSwipe', () => {
        it('should call handler on valid swipe up', () => {
            const cleanup = TouchUtils.onSwipe(element, 'up', handler);

            // Simulate swipe up (start at y=100, end at y=50, move 50px up)
            const startEvent = createTouchEvent('touchstart', [createTouch(100, 100)]);
            element.dispatchEvent(startEvent);

            // Advance time by 100ms (within maxTime)
            jest.advanceTimersByTime(100);

            const endEvent = createTouchEvent('touchend', [], [createTouch(100, 50)]);
            element.dispatchEvent(endEvent);

            expect(handler).toHaveBeenCalledTimes(1);
            cleanup();
        });

        it('should call handler on valid swipe down', () => {
            const cleanup = TouchUtils.onSwipe(element, 'down', handler);

            const startEvent = createTouchEvent('touchstart', [createTouch(100, 100)]);
            element.dispatchEvent(startEvent);

            jest.advanceTimersByTime(100);

            const endEvent = createTouchEvent('touchend', [], [createTouch(100, 150)]);
            element.dispatchEvent(endEvent);

            expect(handler).toHaveBeenCalledTimes(1);
            cleanup();
        });

        it('should call handler on valid swipe left', () => {
            const cleanup = TouchUtils.onSwipe(element, 'left', handler);

            const startEvent = createTouchEvent('touchstart', [createTouch(100, 100)]);
            element.dispatchEvent(startEvent);

            jest.advanceTimersByTime(100);

            const endEvent = createTouchEvent('touchend', [], [createTouch(50, 100)]);
            element.dispatchEvent(endEvent);

            expect(handler).toHaveBeenCalledTimes(1);
            cleanup();
        });

        it('should call handler on valid swipe right', () => {
            const cleanup = TouchUtils.onSwipe(element, 'right', handler);

            const startEvent = createTouchEvent('touchstart', [createTouch(100, 100)]);
            element.dispatchEvent(startEvent);

            jest.advanceTimersByTime(100);

            const endEvent = createTouchEvent('touchend', [], [createTouch(150, 100)]);
            element.dispatchEvent(endEvent);

            expect(handler).toHaveBeenCalledTimes(1);
            cleanup();
        });

        it('should not call handler if swipe distance is too small', () => {
            const cleanup = TouchUtils.onSwipe(element, 'up', handler);

            const startEvent = createTouchEvent('touchstart', [createTouch(100, 100)]);
            element.dispatchEvent(startEvent);

            jest.advanceTimersByTime(100);

            // Only move 20px (less than minDistance of 30px)
            const endEvent = createTouchEvent('touchend', [], [createTouch(100, 80)]);
            element.dispatchEvent(endEvent);

            expect(handler).not.toHaveBeenCalled();
            cleanup();
        });

        it('should not call handler if swipe takes too long', () => {
            const cleanup = TouchUtils.onSwipe(element, 'up', handler);

            const startEvent = createTouchEvent('touchstart', [createTouch(100, 100)]);
            element.dispatchEvent(startEvent);

            // Advance time by 1100ms (more than maxTime of 1000ms)
            jest.advanceTimersByTime(1100);

            const endEvent = createTouchEvent('touchend', [], [createTouch(100, 50)]);
            element.dispatchEvent(endEvent);

            expect(handler).not.toHaveBeenCalled();
            cleanup();
        });

        it('should not call handler for wrong direction', () => {
            const cleanup = TouchUtils.onSwipe(element, 'up', handler);

            const startEvent = createTouchEvent('touchstart', [createTouch(100, 100)]);
            element.dispatchEvent(startEvent);

            jest.advanceTimersByTime(100);

            // Swipe down but listening for up
            const endEvent = createTouchEvent('touchend', [], [createTouch(100, 150)]);
            element.dispatchEvent(endEvent);

            expect(handler).not.toHaveBeenCalled();
            cleanup();
        });

        it('should not call handler if vertical swipe has too much horizontal movement', () => {
            const cleanup = TouchUtils.onSwipe(element, 'up', handler);

            const startEvent = createTouchEvent('touchstart', [createTouch(100, 100)]);
            element.dispatchEvent(startEvent);

            jest.advanceTimersByTime(100);

            // Move up 50px but also move right 80px (exceeds verticalThreshold of 75px)
            const endEvent = createTouchEvent('touchend', [], [createTouch(180, 50)]);
            element.dispatchEvent(endEvent);

            expect(handler).not.toHaveBeenCalled();
            cleanup();
        });

        it('should not call handler if horizontal swipe has too much vertical movement', () => {
            const cleanup = TouchUtils.onSwipe(element, 'left', handler);

            const startEvent = createTouchEvent('touchstart', [createTouch(100, 100)]);
            element.dispatchEvent(startEvent);

            jest.advanceTimersByTime(100);

            // Move left 50px but also move down 40px (exceeds horizontalThreshold of 30px)
            const endEvent = createTouchEvent('touchend', [], [createTouch(50, 140)]);
            element.dispatchEvent(endEvent);

            expect(handler).not.toHaveBeenCalled();
            cleanup();
        });

        it('should prevent default on touchmove if movement detected', () => {
            const cleanup = TouchUtils.onSwipe(element, 'up', handler);

            const startEvent = createTouchEvent('touchstart', [createTouch(100, 100)]);
            element.dispatchEvent(startEvent);

            // Move more than 10px to trigger preventDefault
            const moveEvent = createTouchEvent('touchmove', [createTouch(100, 85)]);
            element.dispatchEvent(moveEvent);

            expect(moveEvent.preventDefault).toHaveBeenCalled();
            cleanup();
        });

        it('should return cleanup function that removes listeners', () => {
            const cleanup = TouchUtils.onSwipe(element, 'up', handler);

            cleanup();

            const startEvent = createTouchEvent('touchstart', [createTouch(100, 100)]);
            element.dispatchEvent(startEvent);

            jest.advanceTimersByTime(100);

            const endEvent = createTouchEvent('touchend', [], [createTouch(100, 50)]);
            element.dispatchEvent(endEvent);

            expect(handler).not.toHaveBeenCalled();
        });

        it('should handle case-insensitive direction', () => {
            const cleanup = TouchUtils.onSwipe(element, 'UP', handler);

            const startEvent = createTouchEvent('touchstart', [createTouch(100, 100)]);
            element.dispatchEvent(startEvent);

            jest.advanceTimersByTime(100);

            const endEvent = createTouchEvent('touchend', [], [createTouch(100, 50)]);
            element.dispatchEvent(endEvent);

            expect(handler).toHaveBeenCalledTimes(1);
            cleanup();
        });

        it('should return no-op cleanup if element is null', () => {
            const cleanup = TouchUtils.onSwipe(null, 'up', handler);
            expect(typeof cleanup).toBe('function');
            cleanup(); // Should not throw
        });

        it('should return no-op cleanup if handler is null', () => {
            const cleanup = TouchUtils.onSwipe(element, 'up', null);
            expect(typeof cleanup).toBe('function');
            cleanup(); // Should not throw
        });

        it('should return no-op cleanup if direction is invalid', () => {
            const cleanup = TouchUtils.onSwipe(element, 'invalid', handler);
            expect(typeof cleanup).toBe('function');
            cleanup(); // Should not throw
        });
    });

    describe('onTap', () => {
        it('should call handler on valid tap', () => {
            const cleanup = TouchUtils.onTap(element, handler);

            const startEvent = createTouchEvent('touchstart', [createTouch(100, 100)]);
            element.dispatchEvent(startEvent);

            jest.advanceTimersByTime(100);

            const endEvent = createTouchEvent('touchend', [], [createTouch(105, 105)]);
            element.dispatchEvent(endEvent);

            expect(handler).toHaveBeenCalledTimes(1);
            cleanup();
        });

        it('should not call handler if tap distance is too large', () => {
            const cleanup = TouchUtils.onTap(element, handler);

            const startEvent = createTouchEvent('touchstart', [createTouch(100, 100)]);
            element.dispatchEvent(startEvent);

            jest.advanceTimersByTime(100);

            // Move 15px (exceeds maxDistance of 10px)
            const endEvent = createTouchEvent('touchend', [], [createTouch(115, 100)]);
            element.dispatchEvent(endEvent);

            expect(handler).not.toHaveBeenCalled();
            cleanup();
        });

        it('should not call handler if tap takes too long', () => {
            const cleanup = TouchUtils.onTap(element, handler);

            const startEvent = createTouchEvent('touchstart', [createTouch(100, 100)]);
            element.dispatchEvent(startEvent);

            // Advance time by 400ms (exceeds maxTime of 300ms)
            jest.advanceTimersByTime(400);

            const endEvent = createTouchEvent('touchend', [], [createTouch(105, 105)]);
            element.dispatchEvent(endEvent);

            expect(handler).not.toHaveBeenCalled();
            cleanup();
        });

        it('should call handler for tap at exact same position', () => {
            const cleanup = TouchUtils.onTap(element, handler);

            const startEvent = createTouchEvent('touchstart', [createTouch(100, 100)]);
            element.dispatchEvent(startEvent);

            jest.advanceTimersByTime(100);

            const endEvent = createTouchEvent('touchend', [], [createTouch(100, 100)]);
            element.dispatchEvent(endEvent);

            expect(handler).toHaveBeenCalledTimes(1);
            cleanup();
        });

        it('should return cleanup function that removes listeners', () => {
            const cleanup = TouchUtils.onTap(element, handler);

            cleanup();

            const startEvent = createTouchEvent('touchstart', [createTouch(100, 100)]);
            element.dispatchEvent(startEvent);

            jest.advanceTimersByTime(100);

            const endEvent = createTouchEvent('touchend', [], [createTouch(105, 105)]);
            element.dispatchEvent(endEvent);

            expect(handler).not.toHaveBeenCalled();
        });

        it('should return no-op cleanup if element is null', () => {
            const cleanup = TouchUtils.onTap(null, handler);
            expect(typeof cleanup).toBe('function');
            cleanup();
        });

        it('should return no-op cleanup if handler is null', () => {
            const cleanup = TouchUtils.onTap(element, null);
            expect(typeof cleanup).toBe('function');
            cleanup();
        });
    });

    describe('onTapHold', () => {
        it('should call handler after hold duration', () => {
            const cleanup = TouchUtils.onTapHold(element, handler, 500);

            const startEvent = createTouchEvent('touchstart', [createTouch(100, 100)]);
            element.dispatchEvent(startEvent);

            // Advance time by 500ms
            jest.advanceTimersByTime(500);

            expect(handler).toHaveBeenCalledTimes(1);
            cleanup();
        });

        it('should use default hold duration if not specified', () => {
            const cleanup = TouchUtils.onTapHold(element, handler);

            const startEvent = createTouchEvent('touchstart', [createTouch(100, 100)]);
            element.dispatchEvent(startEvent);

            // Advance time by default threshold (750ms)
            jest.advanceTimersByTime(750);

            expect(handler).toHaveBeenCalledTimes(1);
            cleanup();
        });

        it('should not call handler if released before hold duration', () => {
            const cleanup = TouchUtils.onTapHold(element, handler, 500);

            const startEvent = createTouchEvent('touchstart', [createTouch(100, 100)]);
            element.dispatchEvent(startEvent);

            jest.advanceTimersByTime(300);

            const endEvent = createTouchEvent('touchend', []);
            element.dispatchEvent(endEvent);

            jest.advanceTimersByTime(300);

            expect(handler).not.toHaveBeenCalled();
            cleanup();
        });

        it('should not call handler if moved before hold duration', () => {
            const cleanup = TouchUtils.onTapHold(element, handler, 500);

            const startEvent = createTouchEvent('touchstart', [createTouch(100, 100)]);
            element.dispatchEvent(startEvent);

            jest.advanceTimersByTime(300);

            const moveEvent = createTouchEvent('touchmove', [createTouch(110, 100)]);
            element.dispatchEvent(moveEvent);

            jest.advanceTimersByTime(300);

            expect(handler).not.toHaveBeenCalled();
            cleanup();
        });

        it('should return cleanup function that removes listeners and clears timer', () => {
            const cleanup = TouchUtils.onTapHold(element, handler, 500);

            const startEvent = createTouchEvent('touchstart', [createTouch(100, 100)]);
            element.dispatchEvent(startEvent);

            cleanup();

            jest.advanceTimersByTime(500);

            expect(handler).not.toHaveBeenCalled();
        });

        it('should return no-op cleanup if element is null', () => {
            const cleanup = TouchUtils.onTapHold(null, handler);
            expect(typeof cleanup).toBe('function');
            cleanup();
        });

        it('should return no-op cleanup if handler is null', () => {
            const cleanup = TouchUtils.onTapHold(element, null);
            expect(typeof cleanup).toBe('function');
            cleanup();
        });
    });

    describe('onOrientationChange', () => {
        beforeEach(() => {
            // Mock window.orientation
            Object.defineProperty(window, 'orientation', {
                writable: true,
                configurable: true,
                value: 0
            });
        });

        afterEach(() => {
            // Clean up orientation property
            delete window.orientation;
        });

        it('should call handler when orientation changes to landscape', () => {
            // Set initial orientation to portrait
            window.orientation = 0;
            
            // Make sure onorientationchange exists in window (jsdom might not have it)
            if (!('onorientationchange' in window)) {
                Object.defineProperty(window, 'onorientationchange', {
                    writable: true,
                    configurable: true,
                    value: null
                });
            }
            
            const cleanup = TouchUtils.onOrientationChange(handler);

            // Change to landscape
            window.orientation = 90;
            const event = new Event('orientationchange');
            window.dispatchEvent(event);

            expect(handler).toHaveBeenCalledTimes(1);
            expect(handler).toHaveBeenCalledWith(
                expect.objectContaining({ orientation: 'landscape' })
            );
            cleanup();
        });

        it('should call handler when orientation changes to portrait', () => {
            // Set initial orientation to landscape
            window.orientation = 90;
            
            // Make sure onorientationchange exists in window
            if (!('onorientationchange' in window)) {
                Object.defineProperty(window, 'onorientationchange', {
                    writable: true,
                    configurable: true,
                    value: null
                });
            }
            
            const cleanup = TouchUtils.onOrientationChange(handler);

            // Change to portrait
            window.orientation = 0;
            const event = new Event('orientationchange');
            window.dispatchEvent(event);

            expect(handler).toHaveBeenCalledTimes(1);
            expect(handler).toHaveBeenCalledWith(
                expect.objectContaining({ orientation: 'portrait' })
            );
            cleanup();
        });

        it('should not call handler if orientation does not change', () => {
            window.orientation = 0; // portrait
            const cleanup = TouchUtils.onOrientationChange(handler);

            // Dispatch event but orientation stays the same
            const event = new Event('orientationchange');
            window.dispatchEvent(event);

            expect(handler).not.toHaveBeenCalled();
            cleanup();
        });

        it('should use window dimensions as fallback when orientation is undefined', () => {
            // Remove orientation property and onorientationchange
            delete window.orientation;
            delete window.onorientationchange;
            
            // Set initial portrait dimensions
            Object.defineProperty(window, 'innerWidth', {
                writable: true,
                configurable: true,
                value: 600
            });
            Object.defineProperty(window, 'innerHeight', {
                writable: true,
                configurable: true,
                value: 800
            });

            const cleanup = TouchUtils.onOrientationChange(handler);

            // Change to landscape dimensions
            Object.defineProperty(window, 'innerWidth', {
                writable: true,
                configurable: true,
                value: 1000
            });
            Object.defineProperty(window, 'innerHeight', {
                writable: true,
                configurable: true,
                value: 500
            });
            
            const event = new Event('resize');
            window.dispatchEvent(event);

            expect(handler).toHaveBeenCalledTimes(1);
            expect(handler).toHaveBeenCalledWith(
                expect.objectContaining({ orientation: 'landscape' })
            );
            cleanup();
        });

        it('should return cleanup function that removes listeners', () => {
            window.orientation = 0;
            const cleanup = TouchUtils.onOrientationChange(handler);

            cleanup();

            window.orientation = 90;
            const event = new Event('orientationchange');
            window.dispatchEvent(event);

            expect(handler).not.toHaveBeenCalled();
        });

        it('should return no-op cleanup if handler is null', () => {
            const cleanup = TouchUtils.onOrientationChange(null);
            expect(typeof cleanup).toBe('function');
            cleanup();
        });
    });
});
