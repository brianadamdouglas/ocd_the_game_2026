/**
 * DesktopTouchSimulator - Simulates touch events for desktop testing
 * 
 * This utility allows testing touch swipe and tap events on desktop browsers
 * by mapping keyboard/mouse events to touch events.
 * 
 * Usage:
 *   DesktopTouchSimulator.enable();
 *   // Now you can use TouchUtils methods and they'll work with keyboard/mouse
 * 
 * @class DesktopTouchSimulator
 */
class DesktopTouchSimulator {
    static _enabled = false;
    static _element = null;
    static _swipeHandlers = new Map();
    static _tapHandlers = new Map();
    static _tapHoldHandlers = new Map();

    /**
     * Enable desktop touch simulation
     * Maps arrow keys to swipe events and spacebar/click to tap events
     */
    static enable() {
        if (this._enabled) return;
        
        this._enabled = true;
        console.log('Desktop Touch Simulator enabled');
        console.log('Controls:');
        console.log('  Arrow Keys: Swipe (Up/Down/Left/Right)');
        console.log('  Spacebar: Tap');
        console.log('  Shift+Spacebar: Tap-Hold');
        console.log('  Mouse Click: Tap');
        
        // Listen for keyboard events
        document.addEventListener('keydown', this._handleKeyDown.bind(this));
        document.addEventListener('keyup', this._handleKeyUp.bind(this));
        
        // Listen for mouse events on swipe interface
        const swipeInterface = document.getElementById('swipeInterface');
        if (swipeInterface) {
            this._element = swipeInterface;
            swipeInterface.addEventListener('mousedown', this._handleMouseDown.bind(this));
            swipeInterface.addEventListener('mouseup', this._handleMouseUp.bind(this));
            swipeInterface.addEventListener('mousemove', this._handleMouseMove.bind(this));
        }
    }

    /**
     * Disable desktop touch simulation
     */
    static disable() {
        if (!this._enabled) return;
        
        this._enabled = false;
        document.removeEventListener('keydown', this._handleKeyDown);
        document.removeEventListener('keyup', this._handleKeyUp);
        
        if (this._element) {
            this._element.removeEventListener('mousedown', this._handleMouseDown);
            this._element.removeEventListener('mouseup', this._handleMouseUp);
            this._element.removeEventListener('mousemove', this._handleMouseMove);
        }
        
        console.log('Desktop Touch Simulator disabled');
    }

    /**
     * Handle keyboard keydown events
     */
    static _handleKeyDown(event) {
        // Prevent default only for our keys
        const key = event.key;
        
        if (key === 'ArrowUp' || key === 'ArrowDown' || key === 'ArrowLeft' || key === 'ArrowRight') {
            event.preventDefault();
            this._simulateSwipe(key.replace('Arrow', '').toLowerCase());
        } else if (key === ' ' && event.shiftKey) {
            // Shift+Spacebar for tap-hold
            event.preventDefault();
            this._simulateTapHold();
        }
    }

    /**
     * Handle keyboard keyup events
     */
    static _handleKeyUp(event) {
        if (event.key === ' ' && !event.shiftKey) {
            event.preventDefault();
            this._simulateTap();
        }
    }

    /**
     * Handle mouse down events
     */
    static _handleMouseDown(event) {
        this._mouseStartX = event.clientX;
        this._mouseStartY = event.clientY;
        this._mouseStartTime = Date.now();
        this._isMouseDown = true;
    }

    /**
     * Handle mouse up events
     */
    static _handleMouseUp(event) {
        if (!this._isMouseDown) return;
        
        const deltaX = event.clientX - this._mouseStartX;
        const deltaY = event.clientY - this._mouseStartY;
        const deltaTime = Date.now() - this._mouseStartTime;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        this._isMouseDown = false;
        
        // If moved less than 10px, treat as tap
        if (distance < 10 && deltaTime < 300) {
            this._simulateTap();
        } else if (distance > 30 && deltaTime < 1000) {
            // Determine swipe direction
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                // Horizontal swipe
                this._simulateSwipe(deltaX > 0 ? 'right' : 'left');
            } else {
                // Vertical swipe
                this._simulateSwipe(deltaY > 0 ? 'down' : 'up');
            }
        }
    }

    /**
     * Handle mouse move events
     */
    static _handleMouseMove(event) {
        // Could be used for drag gestures in the future
    }

    /**
     * Simulate a swipe event
     */
    static _simulateSwipe(direction) {
        if (!this._element) {
            this._element = document.getElementById('swipeInterface');
        }
        
        if (!this._element) {
            console.warn('DesktopTouchSimulator: swipeInterface element not found');
            return;
        }
        
        // Trigger swipe handlers directly
        const handlers = this._swipeHandlers.get(`${this._element}_${direction}`);
        if (handlers) {
            handlers.forEach(handler => {
                // Create a mock event object
                const mockEvent = {
                    preventDefault: () => {},
                    target: this._element,
                    currentTarget: this._element
                };
                handler(mockEvent);
            });
        }
    }

    /**
     * Simulate a tap event
     */
    static _simulateTap() {
        if (!this._element) {
            this._element = document.getElementById('swipeInterface');
        }
        
        if (!this._element) {
            console.warn('DesktopTouchSimulator: swipeInterface element not found');
            return;
        }
        
        // Trigger tap handlers directly
        const handlers = this._tapHandlers.get(this._element);
        if (handlers) {
            handlers.forEach(handler => {
                const mockEvent = {
                    preventDefault: () => {},
                    target: this._element,
                    currentTarget: this._element,
                    pageX: this._mouseStartX || 0,
                    pageY: this._mouseStartY || 0
                };
                handler(mockEvent);
            });
        }
    }

    /**
     * Simulate a tap-hold event
     */
    static _simulateTapHold() {
        if (!this._element) {
            this._element = document.getElementById('swipeInterface');
        }
        
        if (!this._element) {
            console.warn('DesktopTouchSimulator: swipeInterface element not found');
            return;
        }
        
        // Trigger tap-hold handlers directly
        const handlers = this._tapHoldHandlers.get(this._element);
        if (handlers) {
            handlers.forEach(handler => {
                const mockEvent = {
                    preventDefault: () => {},
                    target: this._element,
                    currentTarget: this._element
                };
                handler(mockEvent);
            });
        }
    }

    /**
     * Register a swipe handler (called by TouchUtils wrapper)
     */
    static registerSwipe(element, direction, handler) {
        const key = `${element}_${direction}`;
        if (!this._swipeHandlers.has(key)) {
            this._swipeHandlers.set(key, []);
        }
        this._swipeHandlers.get(key).push(handler);
    }

    /**
     * Register a tap handler (called by TouchUtils wrapper)
     */
    static registerTap(element, handler) {
        if (!this._tapHandlers.has(element)) {
            this._tapHandlers.set(element, []);
        }
        this._tapHandlers.get(element).push(handler);
    }

    /**
     * Register a tap-hold handler (called by TouchUtils wrapper)
     */
    static registerTapHold(element, handler) {
        if (!this._tapHoldHandlers.has(element)) {
            this._tapHoldHandlers.set(element, []);
        }
        this._tapHoldHandlers.get(element).push(handler);
    }

    /**
     * Check if simulator is enabled
     */
    static isEnabled() {
        return this._enabled;
    }
}
