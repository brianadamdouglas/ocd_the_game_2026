# Library Replacement Plan

**Date:** January 7, 2026  
**Branch:** feature/update_libraries-010726  
**Status:** Planning Phase

---

## Executive Summary

This document outlines the plan to replace outdated jQuery and jQuery Mobile libraries with modern alternatives or custom implementations. The goal is to eliminate security vulnerabilities, reduce bundle size, and improve maintainability while preserving all existing functionality.

---

## Current Libraries Analysis

### 1. jQuery 2.1.3 (Released 2014, End-of-Life)

**Usage Analysis:**
- **DOM Selection**: `$('#id')`, `$(selector)`
- **DOM Manipulation**: `.css()`, `.hasClass()`, `.addClass()`, `.removeClass()`, `.show()`, `.hide()`
- **Positioning**: `.position()`, `.append()`, `.html()`
- **Animations**: `.animate()`, `.fadeIn()`, `.fadeOut()`
- **Event Handling**: `.on()`, `.bind()`

**Files Using jQuery:** 29 files across the codebase

**Replacement Strategy:** Vanilla JavaScript with helper utilities

---

### 2. jQuery Mobile 1.4.5 (Released 2014, End-of-Life)

**Usage Analysis:**
- **Orientation Events**: `orientationchange` event
- **Swipe Events**: `swipeup`, `swipedown`, `swipeleft`, `swiperight`
- **Tap Events**: `tap`, `taphold`

**Files Using jQuery Mobile:**
- `dev/js_MVC/utils/mobileResize.js` - Orientation change
- `dev/js_MVC/controllers/Touch_Controller.js` - Swipe and tap events

**Replacement Strategy:** Custom event handlers using native browser APIs

---

### 3. jquerymobile-swipeupdown.js (Plugin)

**Usage:** Vertical swipe detection (`swipeup`, `swipedown`)

**Replacement Strategy:** Custom swipe detection utility

---

### 4. jquery.easing.1.3.js (Animation Easing)

**Usage:** Animation easing functions for `.animate()`

**Replacement Strategy:** CSS transitions or Web Animations API with easing

---

### 5. e-smart-hittest-jquery.js (Custom Plugin)

**Usage:** `objectHitTest()` method for collision detection

**Files Using:**
- `dev/js_MVC/controllers/Main_Controller.js` - Hit testing

**Replacement Strategy:** Custom hit testing utility

---

## Replacement Implementation Plan

### Phase 1: Create Vanilla JavaScript Utilities

#### Step 1.1: Create DOM Utility Module

**File:** `dev/js_MVC/core/DOMUtils.js`

**Purpose:** Replace jQuery DOM manipulation methods

**Methods to Implement:**
```javascript
class DOMUtils {
    // Selection
    static $(selector) { }
    static query(selector, context) { }
    
    // Manipulation
    static css(element, property, value) { }
    static hasClass(element, className) { }
    static addClass(element, className) { }
    static removeClass(element, className) { }
    static show(element) { }
    static hide(element) { }
    static position(element) { }
    static append(parent, child) { }
    static html(element, content) { }
    
    // Events
    static on(element, event, handler) { }
    static off(element, event, handler) { }
    static bind(element, event, handler) { }
}
```

**Benefits:**
- Lightweight (no jQuery dependency)
- Modern ES6 syntax
- Better performance
- Easier to test

---

#### Step 1.2: Create Animation Utility Module

**File:** `dev/js_MVC/core/AnimationUtils.js`

**Purpose:** Replace jQuery animations with CSS transitions or Web Animations API

**Methods to Implement:**
```javascript
class AnimationUtils {
    static animate(element, properties, duration, easing, complete) { }
    static fadeIn(element, duration, complete) { }
    static fadeOut(element, duration, complete) { }
}
```

**Implementation Options:**
1. **CSS Transitions** (Recommended for simple animations)
   - Use `transition` CSS property
   - Change CSS values
   - Listen for `transitionend` event

2. **Web Animations API** (For complex animations)
   - Native browser API
   - Better performance
   - More control

**Easing Functions:**
- Implement common easing functions (ease-in, ease-out, ease-in-out)
- Or use CSS easing keywords

---

#### Step 1.3: Create Touch Event Utility Module

**File:** `dev/js_MVC/core/TouchUtils.js`

**Purpose:** Replace jQuery Mobile swipe and tap events

**Methods to Implement:**
```javascript
class TouchUtils {
    static onSwipe(element, direction, handler) { }
    static onTap(element, handler) { }
    static onTapHold(element, handler, holdDuration) { }
    static onOrientationChange(handler) { }
}
```

**Implementation:**
- Use native `touchstart`, `touchmove`, `touchend` events
- Calculate swipe direction and distance
- Detect tap vs tap-hold based on duration
- Use native `orientationchange` or `resize` event for orientation

---

#### Step 1.4: Create Hit Testing Utility Module

**File:** `dev/js_MVC/core/HitTestUtils.js`

**Purpose:** Replace `e-smart-hittest-jquery.js` plugin

**Methods to Implement:**
```javascript
class HitTestUtils {
    static objectHitTest(options) {
        // options: { object, transparency }
        // Returns: boolean
    }
}
```

**Implementation:**
- Use `getBoundingClientRect()` for element positions
- Calculate overlap between rectangles
- Handle transparency option (if needed)

---

### Phase 2: Update Codebase

#### Step 2.1: Update View.js Base Class

**File:** `dev/js_MVC/core/View.js`

**Changes:**
- Replace `this._div` (jQuery object) with native DOM element
- Update all jQuery method calls to use DOMUtils
- Update `getDiv()` to return native element or wrapper

**Example:**
```javascript
// Before
this._div.css('left', x);
this._div.css('top', y);

// After
DOMUtils.css(this._div, 'left', x);
DOMUtils.css(this._div, 'top', y);
```

---

#### Step 2.2: Update Main_Controller.js

**File:** `dev/js_MVC/controllers/Main_Controller.js`

**Changes:**
- Replace `$('#playerHead')` with `DOMUtils.$('#playerHead')`
- Replace `objectHitTest()` calls with `HitTestUtils.objectHitTest()`
- Update all jQuery method calls

**Example:**
```javascript
// Before
if($('#playerHead').objectHitTest({"object":$(spriteSelector), "transparency":false})) {

// After
if(HitTestUtils.objectHitTest({
    element: DOMUtils.$('#playerHead'),
    target: DOMUtils.$(spriteSelector),
    transparency: false
})) {
```

---

#### Step 2.3: Update Touch_Controller.js

**File:** `dev/js_MVC/controllers/Touch_Controller.js`

**Changes:**
- Replace jQuery Mobile swipe events with TouchUtils
- Replace tap events with TouchUtils

**Example:**
```javascript
// Before
$('#swipeInterface').on("swipeup", this.moveUp.bind(this));
$('#swipeInterface').on("tap", this.stopAndDropOrWalk.bind(this));

// After
TouchUtils.onSwipe(DOMUtils.$('#swipeInterface'), 'up', this.moveUp.bind(this));
TouchUtils.onTap(DOMUtils.$('#swipeInterface'), this.stopAndDropOrWalk.bind(this));
```

---

#### Step 2.4: Update mobileResize.js

**File:** `dev/js_MVC/utils/mobileResize.js`

**Changes:**
- Replace jQuery orientation change with TouchUtils

**Example:**
```javascript
// Before
$(window).on("orientationchange", mobile_orientationChange);

// After
TouchUtils.onOrientationChange(mobile_orientationChange);
```

---

#### Step 2.5: Update All View Files

**Files:** All files in `dev/js_MVC/views/`

**Changes:**
- Replace jQuery method calls with DOMUtils
- Replace animation calls with AnimationUtils

---

### Phase 3: Remove Old Libraries

#### Step 3.1: Update game.html

**File:** `game.html`

**Remove:**
```html
<script src="dev/js_MVC/vendors/jQuery_v2_1_3.js"></script>
<script src="dev/js_MVC/vendors/jquery.mobile-1.4.5.js"></script>
<script src="dev/js_MVC/vendors/jquerymobile-swipeupdown.js"></script>
<script src="dev/js_MVC/vendors/jquery.easing.1.3.js"></script>
<script src="dev/js_MVC/vendors/e-smart-hittest-jquery.js"></script>
```

**Add:**
```html
<script src="dev/js_MVC/core/DOMUtils.js"></script>
<script src="dev/js_MVC/core/AnimationUtils.js"></script>
<script src="dev/js_MVC/core/TouchUtils.js"></script>
<script src="dev/js_MVC/core/HitTestUtils.js"></script>
```

---

#### Step 3.2: Delete Vendor Files

**Files to Delete:**
- `dev/js_MVC/vendors/jQuery_v2_1_3.js`
- `dev/js_MVC/vendors/jquery.mobile-1.4.5.js`
- `dev/js_MVC/vendors/jquerymobile-swipeupdown.js`
- `dev/js_MVC/vendors/jquery.easing.1.3.js`
- `dev/js_MVC/vendors/e-smart-hittest-jquery.js`

---

### Phase 4: Testing & Validation

#### Step 4.1: Update Test Mocks

**File:** `tests/helpers/mocks.js`

**Changes:**
- Update jQuery mocks to match new DOMUtils API
- Create mocks for new utility classes

---

#### Step 4.2: Integration Testing

**Test Areas:**
1. DOM manipulation (show/hide, CSS changes)
2. Animations (fade in/out, animate)
3. Touch events (swipe, tap, tap-hold)
4. Orientation changes
5. Hit testing
6. Event handling

---

## Implementation Details

### DOMUtils Implementation

```javascript
class DOMUtils {
    /**
     * Select element(s) - jQuery-like selector
     * @param {string|Element} selector - CSS selector or element
     * @param {Element} context - Optional context element
     * @returns {Element|NodeList|Array} Selected element(s)
     */
    static $(selector, context = document) {
        if (typeof selector === 'string') {
            const elements = context.querySelectorAll(selector);
            return elements.length === 1 ? elements[0] : Array.from(elements);
        }
        return selector;
    }
    
    /**
     * Get or set CSS property
     */
    static css(element, property, value) {
        if (value === undefined) {
            return window.getComputedStyle(element)[property];
        }
        element.style[property] = value;
        return element;
    }
    
    /**
     * Check if element has class
     */
    static hasClass(element, className) {
        return element.classList.contains(className);
    }
    
    /**
     * Add class to element
     */
    static addClass(element, className) {
        element.classList.add(className);
        return element;
    }
    
    /**
     * Remove class from element
     */
    static removeClass(element, className) {
        element.classList.remove(className);
        return element;
    }
    
    /**
     * Show element
     */
    static show(element) {
        element.style.display = '';
        return element;
    }
    
    /**
     * Hide element
     */
    static hide(element) {
        element.style.display = 'none';
        return element;
    }
    
    /**
     * Get element position
     */
    static position(element) {
        const rect = element.getBoundingClientRect();
        return {
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX
        };
    }
    
    /**
     * Append child to parent
     */
    static append(parent, child) {
        if (typeof child === 'string') {
            parent.insertAdjacentHTML('beforeend', child);
        } else {
            parent.appendChild(child);
        }
        return parent;
    }
    
    /**
     * Get or set HTML content
     */
    static html(element, content) {
        if (content === undefined) {
            return element.innerHTML;
        }
        element.innerHTML = content;
        return element;
    }
    
    /**
     * Add event listener
     */
    static on(element, event, handler) {
        element.addEventListener(event, handler);
        return element;
    }
    
    /**
     * Remove event listener
     */
    static off(element, event, handler) {
        element.removeEventListener(event, handler);
        return element;
    }
}
```

---

### TouchUtils Implementation

```javascript
class TouchUtils {
    /**
     * Detect swipe direction and trigger handler
     */
    static onSwipe(element, direction, handler) {
        let startX, startY, startTime;
        
        const touchStart = (e) => {
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            startTime = Date.now();
        };
        
        const touchEnd = (e) => {
            if (!startX || !startY) return;
            
            const touch = e.changedTouches[0];
            const endX = touch.clientX;
            const endY = touch.clientY;
            const endTime = Date.now();
            
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            const deltaTime = endTime - startTime;
            
            const minDistance = 50;
            const maxTime = 300;
            
            if (deltaTime < maxTime) {
                if (Math.abs(deltaX) > Math.abs(deltaY)) {
                    // Horizontal swipe
                    if (Math.abs(deltaX) > minDistance) {
                        if (direction === 'left' && deltaX < 0) handler(e);
                        if (direction === 'right' && deltaX > 0) handler(e);
                    }
                } else {
                    // Vertical swipe
                    if (Math.abs(deltaY) > minDistance) {
                        if (direction === 'up' && deltaY < 0) handler(e);
                        if (direction === 'down' && deltaY > 0) handler(e);
                    }
                }
            }
            
            startX = startY = startTime = null;
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
     * Detect tap
     */
    static onTap(element, handler) {
        let startTime, startX, startY;
        
        const touchStart = (e) => {
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            startTime = Date.now();
        };
        
        const touchEnd = (e) => {
            if (!startTime) return;
            
            const touch = e.changedTouches[0];
            const deltaX = Math.abs(touch.clientX - startX);
            const deltaY = Math.abs(touch.clientY - startY);
            const deltaTime = Date.now() - startTime;
            
            const maxDistance = 10;
            const maxTime = 300;
            
            if (deltaTime < maxTime && deltaX < maxDistance && deltaY < maxDistance) {
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
    
    /**
     * Detect tap and hold
     */
    static onTapHold(element, handler, holdDuration = 500) {
        let holdTimer;
        
        const touchStart = () => {
            holdTimer = setTimeout(() => {
                handler();
            }, holdDuration);
        };
        
        const touchEnd = () => {
            if (holdTimer) {
                clearTimeout(holdTimer);
                holdTimer = null;
            }
        };
        
        element.addEventListener('touchstart', touchStart);
        element.addEventListener('touchend', touchEnd);
        element.addEventListener('touchmove', touchEnd);
        
        return () => {
            element.removeEventListener('touchstart', touchStart);
            element.removeEventListener('touchend', touchEnd);
            element.removeEventListener('touchmove', touchEnd);
        };
    }
    
    /**
     * Listen for orientation changes
     */
    static onOrientationChange(handler) {
        const orientationHandler = (e) => {
            const orientation = window.orientation !== undefined 
                ? (Math.abs(window.orientation) === 90 ? 'landscape' : 'portrait')
                : (window.innerWidth > window.innerHeight ? 'landscape' : 'portrait');
            
            handler({ orientation });
        };
        
        // Use native orientationchange if available, otherwise use resize
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
```

---

### HitTestUtils Implementation

```javascript
class HitTestUtils {
    /**
     * Test if two elements overlap (hit test)
     * @param {Object} options - Hit test options
     * @param {Element} options.element - First element
     * @param {Element} options.target - Target element to test against
     * @param {boolean} options.transparency - Whether to consider transparency
     * @returns {boolean} True if elements overlap
     */
    static objectHitTest(options) {
        const { element, target, transparency = false } = options;
        
        if (!element || !target) return false;
        
        const rect1 = element.getBoundingClientRect();
        const rect2 = target.getBoundingClientRect();
        
        // Check if rectangles overlap
        const overlap = !(
            rect1.right < rect2.left ||
            rect1.left > rect2.right ||
            rect1.bottom < rect2.top ||
            rect1.top > rect2.bottom
        );
        
        if (!overlap) return false;
        
        // If transparency check is needed, could use canvas to check pixel data
        // For now, just return rectangle overlap
        return true;
    }
}
```

---

### AnimationUtils Implementation

```javascript
class AnimationUtils {
    /**
     * Animate element properties
     */
    static animate(element, properties, duration = 400, easing = 'ease', complete) {
        // Set transition
        element.style.transition = `all ${duration}ms ${easing}`;
        
        // Apply properties
        Object.keys(properties).forEach(prop => {
            element.style[prop] = properties[prop];
        });
        
        // Handle completion
        if (complete) {
            const handleComplete = () => {
                element.removeEventListener('transitionend', handleComplete);
                complete();
            };
            element.addEventListener('transitionend', handleComplete);
        }
        
        return element;
    }
    
    /**
     * Fade in element
     */
    static fadeIn(element, duration = 400, complete) {
        element.style.opacity = '0';
        element.style.display = '';
        
        requestAnimationFrame(() => {
            AnimationUtils.animate(element, { opacity: '1' }, duration, 'ease', complete);
        });
        
        return element;
    }
    
    /**
     * Fade out element
     */
    static fadeOut(element, duration = 400, complete) {
        AnimationUtils.animate(element, { opacity: '0' }, duration, 'ease', () => {
            element.style.display = 'none';
            if (complete) complete();
        });
        
        return element;
    }
}
```

---

## Migration Strategy

### Step-by-Step Approach

1. **Create utility modules** (Phase 1)
2. **Test utilities in isolation**
3. **Update one file at a time** (Phase 2)
4. **Test after each file update**
5. **Remove old libraries** (Phase 3)
6. **Final integration testing** (Phase 4)

### Backward Compatibility

- Keep jQuery-like API where possible (`$()` selector)
- Maintain same method signatures
- Ensure same return values

### Rollback Plan

- Keep old vendor files in git history
- Can revert if issues arise
- Test thoroughly before removing

---

## Benefits

1. **Security**: Eliminate outdated libraries with potential vulnerabilities
2. **Performance**: Smaller bundle size, faster load times
3. **Maintainability**: Own code, easier to debug and modify
4. **Modern**: Use native browser APIs
5. **Testing**: Easier to test custom utilities
6. **Future-proof**: No dependency on deprecated libraries

---

## Risks & Mitigation

### Risk 1: Breaking Changes
**Mitigation:** Thorough testing, gradual migration, keep old code in git

### Risk 2: Missing Features
**Mitigation:** Comprehensive analysis of jQuery usage, implement all needed methods

### Risk 3: Browser Compatibility
**Mitigation:** Test on target browsers, use polyfills if needed

---

## Timeline

- **Phase 1**: 2-3 days (Create utilities)
- **Phase 2**: 3-4 days (Update codebase)
- **Phase 3**: 1 day (Remove libraries)
- **Phase 4**: 2-3 days (Testing)
- **Total**: 8-11 days

---

## Success Criteria

- ✅ All jQuery functionality replaced
- ✅ All jQuery Mobile functionality replaced
- ✅ All tests passing
- ✅ Game functionality unchanged
- ✅ No console errors
- ✅ Performance maintained or improved
- ✅ Bundle size reduced

---

**End of Plan**

