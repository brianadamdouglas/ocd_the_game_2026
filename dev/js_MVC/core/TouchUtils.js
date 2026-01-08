/**
 * TouchUtils - Touch Event Utility Module
 * 
 * Replaces jQuery Mobile swipe and tap events with native browser APIs.
 * Provides methods for handling swipe gestures, tap events, tap-hold, and orientation changes.
 * 
 * @class TouchUtils
 */
class TouchUtils {
    /**
     * Default swipe thresholds (matching jQuery Mobile behavior)
     */
    static SWIPE_CONFIG = {
        minDistance: 30,        // Minimum distance in pixels for a swipe
        maxTime: 1000,          // Maximum time in milliseconds for a swipe
        verticalThreshold: 75,  // Maximum horizontal movement for vertical swipes
        horizontalThreshold: 30 // Maximum vertical movement for horizontal swipes
    };

    /**
     * Default tap thresholds (matching jQuery Mobile behavior)
     */
    static TAP_CONFIG = {
        maxDistance: 10,        // Maximum distance in pixels for a tap
        maxTime: 300            // Maximum time in milliseconds for a tap
    };

    /**
     * Default tap-hold threshold (matching jQuery Mobile behavior)
     */
    static TAP_HOLD_THRESHOLD = 750; // Milliseconds

    /**
     * Register a swipe event handler on an element
     * 
     * @param {Element} element - The element to attach the swipe listener to
     * @param {string} direction - Swipe direction: 'up', 'down', 'left', or 'right'
     * @param {Function} handler - Callback function to execute on swipe
     * @returns {Function} Cleanup function to remove the event listeners
     * 
     * @example
     * TouchUtils.onSwipe(element, 'up', (e) => {
     *     console.log('Swipe up detected');
     * });
     */
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
            
            // Prevent scrolling if significant movement detected
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

            // Check if swipe meets time threshold
            if (deltaTime < config.maxTime) {
                const absDeltaX = Math.abs(deltaX);
                const absDeltaY = Math.abs(deltaY);

                // Determine if this is a horizontal or vertical swipe
                if (absDeltaX > absDeltaY) {
                    // Horizontal swipe
                    if (absDeltaX > config.minDistance && absDeltaY < config.horizontalThreshold) {
                        const swipeDirection = deltaX < 0 ? 'left' : 'right';
                        if (direction.toLowerCase() === swipeDirection) {
                            handler(e);
                        }
                    }
                } else {
                    // Vertical swipe
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

        // Return cleanup function
        return () => {
            element.removeEventListener('touchstart', touchStart);
            element.removeEventListener('touchmove', touchMove);
            element.removeEventListener('touchend', touchEnd);
        };
    }

    /**
     * Register a tap event handler on an element
     * 
     * @param {Element} element - The element to attach the tap listener to
     * @param {Function} handler - Callback function to execute on tap
     * @returns {Function} Cleanup function to remove the event listeners
     * 
     * @example
     * TouchUtils.onTap(element, (e) => {
     *     console.log('Tap detected');
     * });
     */
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

            // Check if tap meets criteria (short time and small distance)
            if (deltaTime < config.maxTime && deltaX < config.maxDistance && deltaY < config.maxDistance) {
                handler(e);
            }

            startTime = startX = startY = null;
        };

        element.addEventListener('touchstart', touchStart);
        element.addEventListener('touchend', touchEnd);

        // Return cleanup function
        return () => {
            element.removeEventListener('touchstart', touchStart);
            element.removeEventListener('touchend', touchEnd);
        };
    }

    /**
     * Register a tap-hold event handler on an element
     * 
     * @param {Element} element - The element to attach the tap-hold listener to
     * @param {Function} handler - Callback function to execute on tap-hold
     * @param {number} holdDuration - Duration in milliseconds to hold before triggering (default: 750ms)
     * @returns {Function} Cleanup function to remove the event listeners
     * 
     * @example
     * TouchUtils.onTapHold(element, () => {
     *     console.log('Tap-hold detected');
     * }, 500);
     */
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
            // Cancel tap-hold if user moves finger
            if (holdTimer) {
                clearTimeout(holdTimer);
                holdTimer = null;
            }
        };

        element.addEventListener('touchstart', touchStart);
        element.addEventListener('touchend', touchEnd);
        element.addEventListener('touchmove', touchMove);

        // Return cleanup function
        return () => {
            if (holdTimer) {
                clearTimeout(holdTimer);
            }
            element.removeEventListener('touchstart', touchStart);
            element.removeEventListener('touchend', touchEnd);
            element.removeEventListener('touchmove', touchMove);
        };
    }

    /**
     * Register an orientation change event handler
     * 
     * @param {Function} handler - Callback function to execute on orientation change
     *                              Receives an event object with an 'orientation' property ('portrait' or 'landscape')
     * @returns {Function} Cleanup function to remove the event listeners
     * 
     * @example
     * TouchUtils.onOrientationChange((e) => {
     *     console.log('Orientation:', e.orientation);
     * });
     */
    static onOrientationChange(handler) {
        if (!handler) {
            console.warn('TouchUtils.onOrientationChange: handler is required');
            return () => {};
        }

        let lastOrientation = null;

        const getOrientation = () => {
            // Try to use window.orientation if available
            if (window.orientation !== undefined) {
                return Math.abs(window.orientation) === 90 ? 'landscape' : 'portrait';
            }
            // Fallback to window dimensions
            return window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
        };

        const orientationHandler = (e) => {
            const currentOrientation = getOrientation();
            
            // Only trigger if orientation actually changed
            if (lastOrientation !== currentOrientation) {
                lastOrientation = currentOrientation;
                
                // Create event-like object with orientation property (matching jQuery Mobile behavior)
                const event = {
                    orientation: currentOrientation,
                    originalEvent: e
                };
                
                handler(event);
            }
        };

        // Initialize last orientation
        lastOrientation = getOrientation();

        // Use native orientationchange if available, otherwise use resize
        if ('onorientationchange' in window) {
            window.addEventListener('orientationchange', orientationHandler);
        } else {
            window.addEventListener('resize', orientationHandler);
        }

        // Return cleanup function
        return () => {
            if ('onorientationchange' in window) {
                window.removeEventListener('orientationchange', orientationHandler);
            } else {
                window.removeEventListener('resize', orientationHandler);
            }
        };
    }
}
