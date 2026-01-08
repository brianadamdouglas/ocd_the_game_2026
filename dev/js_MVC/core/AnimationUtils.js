/**
 * Animation Utilities
 * 
 * Vanilla JavaScript replacement for jQuery animations.
 * Supports CSS transitions, Web Animations API, and custom easing functions.
 * 
 * @class AnimationUtils
 */
class AnimationUtils {
    /**
     * Easing functions map
     * Maps easing names to CSS timing functions or custom functions
     */
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
    
    /**
     * Duration map for string durations
     */
    static _durationMap = {
        'slow': 600,
        'fast': 200,
        'default': 400
    };
    
    /**
     * Parse duration (number or string)
     * @param {number|string} duration - Duration in ms or string ('slow', 'fast')
     * @returns {number} Duration in milliseconds
     */
    static _parseDuration(duration) {
        if (typeof duration === 'string') {
            return AnimationUtils._durationMap[duration] || AnimationUtils._durationMap['default'];
        }
        return typeof duration === 'number' ? duration : AnimationUtils._durationMap['default'];
    }
    
    /**
     * Parse easing function name
     * @param {string} easing - Easing function name
     * @returns {string} CSS timing function
     */
    static _parseEasing(easing) {
        return AnimationUtils._easingMap[easing] || easing || 'ease';
    }
    
    /**
     * Parse property value (handles relative values like "+=10")
     * @param {string|number} value - Property value
     * @param {Element} element - Element to get current value from
     * @param {string} property - Property name
     * @returns {string} Parsed value
     */
    static _parseValue(value, element, property) {
        if (typeof value === 'number') {
            return `${value}px`;
        }
        
        if (typeof value === 'string') {
            // Handle relative values like "+=10" or "-=10"
            if (value.startsWith('+=') || value.startsWith('-=')) {
                const operator = value[0];
                const amount = parseFloat(value.substring(2));
                const current = parseFloat(window.getComputedStyle(element)[property]) || 0;
                const newValue = operator === '+' ? current + amount : current - amount;
                return `${newValue}px`;
            }
            
            // Handle "target" for rotation (special case)
            if (value === 'target') {
                return value;
            }
            
            // Return as-is if it's already a valid CSS value
            return value;
        }
        
        return value;
    }
    
    /**
     * Animate element properties
     * @param {Element} element - DOM element to animate
     * @param {Object} properties - Object of CSS properties to animate
     * @param {number|string|Object} duration - Duration in ms, string ('slow', 'fast'), or options object
     * @param {string|Function} easing - Easing function name or step function
     * @param {Function} complete - Completion callback
     * @returns {Element} The element
     */
    static animate(element, properties, duration, easing, complete) {
        if (!element) return element;
        
        // Handle jQuery-style options object: animate(props, {duration, easing, complete, step})
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
        
        // Special handling for rotation with step function
        if (properties.target !== undefined && step) {
            return AnimationUtils._animateWithStep(element, properties.target, durationMs, easingValue, step, complete);
        }
        
        // Parse all property values
        const parsedProperties = {};
        Object.keys(properties).forEach(prop => {
            parsedProperties[prop] = AnimationUtils._parseValue(properties[prop], element, prop);
        });
        
        // Use CSS transitions for simple animations
        if (durationMs > 0) {
            // Store original transition
            const originalTransition = element.style.transition;
            
            // Set transition
            element.style.transition = `all ${durationMs}ms ${easingValue}`;
            
            // Apply properties
            Object.keys(parsedProperties).forEach(prop => {
                if (prop === 'left' || prop === 'top' || prop === 'right' || prop === 'bottom') {
                    DOMUtils.css(element, prop, parsedProperties[prop]);
                } else {
                    element.style[prop] = parsedProperties[prop];
                }
            });
            
            // Handle completion
            if (complete) {
                const handleComplete = (e) => {
                    // Only handle if this is the transition for our element
                    if (e.target === element) {
                        element.removeEventListener('transitionend', handleComplete);
                        element.style.transition = originalTransition;
                        complete.call(element);
                    }
                };
                element.addEventListener('transitionend', handleComplete);
                
                // Fallback timeout in case transitionend doesn't fire
                setTimeout(() => {
                    element.removeEventListener('transitionend', handleComplete);
                    element.style.transition = originalTransition;
                    if (complete) complete.call(element);
                }, durationMs + 50);
            } else {
                // Restore transition after animation
                setTimeout(() => {
                    element.style.transition = originalTransition;
                }, durationMs);
            }
        } else {
            // No duration - apply immediately
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
    
    /**
     * Animate with step function (for complex animations like rotation)
     * @private
     */
    static _animateWithStep(element, target, duration, easing, step, complete) {
        const start = 0; // Starting rotation value
        const change = target - start;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Calculate eased value
            const eased = AnimationUtils._ease(easing, progress);
            const current = start + (change * eased);
            
            // Call step function
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
    
    /**
     * Apply easing function
     * @private
     */
    static _ease(easing, t) {
        // For CSS easing functions, we'll use a simplified version
        // For more complex easing, we'd need to implement the full functions
        if (easing.includes('easeOutCirc')) {
            return Math.sqrt(1 - Math.pow(t - 1, 2));
        }
        if (easing.includes('easeInOutCirc')) {
            return t < 0.5
                ? (1 - Math.sqrt(1 - Math.pow(2 * t, 2))) / 2
                : (Math.sqrt(1 - Math.pow(-2 * t + 2, 2)) + 1) / 2;
        }
        // Default to ease-out
        return 1 - Math.pow(1 - t, 3);
    }
    
    /**
     * Fade in element
     * @param {Element} element - DOM element
     * @param {number|string} duration - Duration in ms or string ('slow', 'fast')
     * @param {Function} complete - Completion callback
     * @returns {Element} The element
     */
    static fadeIn(element, duration, complete) {
        if (!element) return element;
        
        const durationMs = AnimationUtils._parseDuration(duration);
        
        // Set initial state
        element.style.opacity = '0';
        if (typeof DOMUtils !== 'undefined' && DOMUtils.show) {
            DOMUtils.show(element);
        } else {
            element.style.display = '';
        }
        
        // Trigger animation on next frame
        requestAnimationFrame(() => {
            AnimationUtils.animate(element, { opacity: '1' }, durationMs, 'ease', complete);
        });
        
        return element;
    }
    
    /**
     * Fade out element
     * @param {Element} element - DOM element
     * @param {number|string} duration - Duration in ms or string ('slow', 'fast')
     * @param {Function} complete - Completion callback
     * @returns {Element} The element
     */
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

