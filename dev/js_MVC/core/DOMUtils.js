/**
 * DOM Utilities
 * 
 * Vanilla JavaScript replacement for jQuery DOM manipulation methods.
 * Provides a jQuery-like API for common DOM operations.
 * 
 * @class DOMUtils
 */
class DOMUtils {
    /**
     * Select element(s) - jQuery-like selector
     * @param {string|Element} selector - CSS selector or DOM element
     * @param {Element} context - Optional context element (default: document)
     * @returns {Element|NodeList|Array} Selected element(s) or single element
     */
    static $(selector, context = document) {
        // If selector is already a DOM element, return it
        if (selector instanceof Element || selector instanceof Document) {
            return selector;
        }
        
        // If selector is a string, query the DOM
        if (typeof selector === 'string') {
            const elements = context.querySelectorAll(selector);
            // Return single element if only one found, otherwise return NodeList/Array
            return elements.length === 1 ? elements[0] : Array.from(elements);
        }
        
        return selector;
    }
    
    /**
     * Get or set CSS property/properties
     * @param {Element} element - DOM element
     * @param {string|Object} property - CSS property name or object of properties
     * @param {string} value - Optional value if property is a string
     * @returns {string|Element} CSS value (get) or element (set)
     */
    static css(element, property, value) {
        if (!element) return null;
        
        // If property is an object, set multiple properties
        if (typeof property === 'object' && property !== null) {
            Object.keys(property).forEach(prop => {
                element.style[prop] = property[prop];
            });
            return element;
        }
        
        // If value is undefined, get the property
        if (value === undefined) {
            return window.getComputedStyle(element)[property];
        }
        
        // Set the property
        element.style[property] = value;
        return element;
    }
    
    /**
     * Check if element has class
     * @param {Element} element - DOM element
     * @param {string} className - Class name to check
     * @returns {boolean} True if element has the class
     */
    static hasClass(element, className) {
        if (!element) return false;
        return element.classList.contains(className);
    }
    
    /**
     * Add class to element
     * @param {Element} element - DOM element
     * @param {string} className - Class name to add
     * @returns {Element} The element
     */
    static addClass(element, className) {
        if (!element) return element;
        element.classList.add(className);
        return element;
    }
    
    /**
     * Remove class from element
     * @param {Element} element - DOM element
     * @param {string} className - Class name to remove
     * @returns {Element} The element
     */
    static removeClass(element, className) {
        if (!element) return element;
        element.classList.remove(className);
        return element;
    }
    
    /**
     * Show element (remove display:none)
     * @param {Element} element - DOM element
     * @param {string} display - Optional display value (default: '')
     * @returns {Element} The element
     */
    static show(element, display = '') {
        if (!element) return element;
        element.style.display = display;
        return element;
    }
    
    /**
     * Hide element (set display:none)
     * @param {Element} element - DOM element
     * @returns {Element} The element
     */
    static hide(element) {
        if (!element) return element;
        element.style.display = 'none';
        return element;
    }
    
    /**
     * Get element position relative to document
     * @param {Element} element - DOM element
     * @returns {Object} Position object with top and left properties
     */
    static position(element) {
        if (!element) return { top: 0, left: 0 };
        
        const rect = element.getBoundingClientRect();
        return {
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX
        };
    }
    
    /**
     * Get element offset (position relative to document)
     * @param {Element} element - DOM element
     * @returns {Object} Offset object with top and left properties
     */
    static offset(element) {
        if (!element) return { top: 0, left: 0 };
        
        const rect = element.getBoundingClientRect();
        return {
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX
        };
    }
    
    /**
     * Append child to parent element
     * @param {Element} parent - Parent DOM element
     * @param {Element|string} child - Child element or HTML string
     * @returns {Element} The parent element
     */
    static append(parent, child) {
        if (!parent) return parent;
        
        if (typeof child === 'string') {
            parent.insertAdjacentHTML('beforeend', child);
        } else if (child instanceof Element) {
            parent.appendChild(child);
        }
        
        return parent;
    }
    
    /**
     * Get or set HTML content
     * @param {Element} element - DOM element
     * @param {string} content - Optional HTML content to set
     * @returns {string|Element} HTML content (get) or element (set)
     */
    static html(element, content) {
        if (!element) return null;
        
        if (content === undefined) {
            return element.innerHTML;
        }
        
        element.innerHTML = content;
        return element;
    }
    
    /**
     * Add event listener
     * @param {Element} element - DOM element
     * @param {string} event - Event name
     * @param {Function} handler - Event handler function
     * @returns {Element} The element
     */
    static on(element, event, handler) {
        if (!element) return element;
        element.addEventListener(event, handler);
        return element;
    }
    
    /**
     * Remove event listener
     * @param {Element} element - DOM element
     * @param {string} event - Event name
     * @param {Function} handler - Event handler function
     * @returns {Element} The element
     */
    static off(element, event, handler) {
        if (!element) return element;
        element.removeEventListener(event, handler);
        return element;
    }
    
    /**
     * Bind event listener (alias for on)
     * @param {Element} element - DOM element
     * @param {string} event - Event name
     * @param {Function} handler - Event handler function
     * @returns {Element} The element
     */
    static bind(element, event, handler) {
        return DOMUtils.on(element, event, handler);
    }
    
    /**
     * Unbind event listener (alias for off)
     * @param {Element} element - DOM element
     * @param {string} event - Event name
     * @param {Function} handler - Event handler function
     * @returns {Element} The element
     */
    static unbind(element, event, handler) {
        return DOMUtils.off(element, event, handler);
    }
    
    /**
     * Get outer width of element (including padding and border)
     * @param {Element} element - DOM element
     * @returns {number} Outer width in pixels
     */
    static outerWidth(element) {
        if (!element) return 0;
        const rect = element.getBoundingClientRect();
        return rect.width;
    }
    
    /**
     * Get outer height of element (including padding and border)
     * @param {Element} element - DOM element
     * @returns {number} Outer height in pixels
     */
    static outerHeight(element) {
        if (!element) return 0;
        const rect = element.getBoundingClientRect();
        return rect.height;
    }
}

