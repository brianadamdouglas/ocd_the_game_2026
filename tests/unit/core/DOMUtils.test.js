/**
 * Unit tests for DOMUtils
 */

// Since DOMUtils is a class in a non-module script file,
// we'll define it inline here for testing purposes
// In production, it will be loaded via script tag and available globally

// Copy of DOMUtils class for testing
class DOMUtils {
    static $(selector, context = document) {
        if (selector instanceof Element || selector instanceof Document) {
            return selector;
        }
        if (typeof selector === 'string') {
            const elements = context.querySelectorAll(selector);
            return elements.length === 1 ? elements[0] : Array.from(elements);
        }
        return selector;
    }
    
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
    
    static hasClass(element, className) {
        if (!element) return false;
        return element.classList.contains(className);
    }
    
    static addClass(element, className) {
        if (!element) return element;
        element.classList.add(className);
        return element;
    }
    
    static removeClass(element, className) {
        if (!element) return element;
        element.classList.remove(className);
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
    
    static position(element) {
        if (!element) return { top: 0, left: 0 };
        const rect = element.getBoundingClientRect();
        return {
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX
        };
    }
    
    static offset(element) {
        if (!element) return { top: 0, left: 0 };
        const rect = element.getBoundingClientRect();
        return {
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX
        };
    }
    
    static append(parent, child) {
        if (!parent) return parent;
        if (typeof child === 'string') {
            parent.insertAdjacentHTML('beforeend', child);
        } else if (child instanceof Element) {
            parent.appendChild(child);
        }
        return parent;
    }
    
    static html(element, content) {
        if (!element) return null;
        if (content === undefined) {
            return element.innerHTML;
        }
        element.innerHTML = content;
        return element;
    }
    
    static on(element, event, handler) {
        if (!element) return element;
        element.addEventListener(event, handler);
        return element;
    }
    
    static off(element, event, handler) {
        if (!element) return element;
        element.removeEventListener(event, handler);
        return element;
    }
    
    static bind(element, event, handler) {
        return DOMUtils.on(element, event, handler);
    }
    
    static unbind(element, event, handler) {
        return DOMUtils.off(element, event, handler);
    }
    
    static outerWidth(element) {
        if (!element) return 0;
        const rect = element.getBoundingClientRect();
        return rect.width;
    }
    
    static outerHeight(element) {
        if (!element) return 0;
        const rect = element.getBoundingClientRect();
        return rect.height;
    }
}

describe('DOMUtils', () => {
    let testElement;
    let testContainer;
    
    beforeEach(() => {
        // Create test elements
        testContainer = document.createElement('div');
        testContainer.id = 'test-container';
        document.body.appendChild(testContainer);
        
        testElement = document.createElement('div');
        testElement.id = 'test-element';
        testElement.className = 'test-class';
        testElement.style.width = '100px';
        testElement.style.height = '50px';
        testContainer.appendChild(testElement);
    });
    
    afterEach(() => {
        // Clean up
        if (testContainer && testContainer.parentNode) {
            testContainer.parentNode.removeChild(testContainer);
        }
    });
    
    describe('$() - Element Selection', () => {
        test('should select element by ID', () => {
            const result = DOMUtils.$('#test-element');
            expect(result).toBe(testElement);
        });
        
        test('should select element by class', () => {
            const result = DOMUtils.$('.test-class');
            expect(result).toBe(testElement);
        });
        
        test('should return element if already a DOM element', () => {
            const result = DOMUtils.$(testElement);
            expect(result).toBe(testElement);
        });
        
        test('should return array for multiple elements', () => {
            const element2 = document.createElement('div');
            element2.className = 'test-class';
            testContainer.appendChild(element2);
            
            const result = DOMUtils.$('.test-class');
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(2);
        });
        
        test('should return empty array for non-existent selector', () => {
            const result = DOMUtils.$('#non-existent');
            // querySelectorAll returns empty NodeList, which becomes empty array
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(0);
        });
        
        test('should use context element', () => {
            const context = document.createElement('div');
            const child = document.createElement('div');
            child.id = 'child-element';
            context.appendChild(child);
            
            const result = DOMUtils.$('#child-element', context);
            expect(result).toBe(child);
        });
    });
    
    describe('css() - CSS Manipulation', () => {
        test('should get CSS property', () => {
            testElement.style.color = 'red';
            const color = DOMUtils.css(testElement, 'color');
            expect(color).toBeTruthy();
        });
        
        test('should set CSS property', () => {
            DOMUtils.css(testElement, 'color', 'blue');
            expect(testElement.style.color).toBe('blue');
        });
        
        test('should set multiple CSS properties', () => {
            DOMUtils.css(testElement, {
                color: 'green',
                backgroundColor: 'yellow',
                fontSize: '16px'
            });
            
            expect(testElement.style.color).toBe('green');
            expect(testElement.style.backgroundColor).toBe('yellow');
            expect(testElement.style.fontSize).toBe('16px');
        });
        
        test('should return element when setting', () => {
            const result = DOMUtils.css(testElement, 'color', 'red');
            expect(result).toBe(testElement);
        });
        
        test('should handle null element', () => {
            const result = DOMUtils.css(null, 'color', 'red');
            expect(result).toBeNull();
        });
    });
    
    describe('hasClass() - Class Checking', () => {
        test('should return true if element has class', () => {
            expect(DOMUtils.hasClass(testElement, 'test-class')).toBe(true);
        });
        
        test('should return false if element does not have class', () => {
            expect(DOMUtils.hasClass(testElement, 'non-existent')).toBe(false);
        });
        
        test('should handle null element', () => {
            expect(DOMUtils.hasClass(null, 'test-class')).toBe(false);
        });
    });
    
    describe('addClass() - Add Class', () => {
        test('should add class to element', () => {
            DOMUtils.addClass(testElement, 'new-class');
            expect(testElement.classList.contains('new-class')).toBe(true);
        });
        
        test('should return element', () => {
            const result = DOMUtils.addClass(testElement, 'new-class');
            expect(result).toBe(testElement);
        });
        
        test('should handle null element', () => {
            const result = DOMUtils.addClass(null, 'new-class');
            expect(result).toBeNull();
        });
    });
    
    describe('removeClass() - Remove Class', () => {
        test('should remove class from element', () => {
            DOMUtils.removeClass(testElement, 'test-class');
            expect(testElement.classList.contains('test-class')).toBe(false);
        });
        
        test('should return element', () => {
            const result = DOMUtils.removeClass(testElement, 'test-class');
            expect(result).toBe(testElement);
        });
        
        test('should handle null element', () => {
            const result = DOMUtils.removeClass(null, 'test-class');
            expect(result).toBeNull();
        });
    });
    
    describe('show() - Show Element', () => {
        test('should show element by removing display none', () => {
            testElement.style.display = 'none';
            DOMUtils.show(testElement);
            expect(testElement.style.display).toBe('');
        });
        
        test('should set custom display value', () => {
            testElement.style.display = 'none';
            DOMUtils.show(testElement, 'block');
            expect(testElement.style.display).toBe('block');
        });
        
        test('should return element', () => {
            const result = DOMUtils.show(testElement);
            expect(result).toBe(testElement);
        });
        
        test('should handle null element', () => {
            const result = DOMUtils.show(null);
            expect(result).toBeNull();
        });
    });
    
    describe('hide() - Hide Element', () => {
        test('should hide element by setting display none', () => {
            DOMUtils.hide(testElement);
            expect(testElement.style.display).toBe('none');
        });
        
        test('should return element', () => {
            const result = DOMUtils.hide(testElement);
            expect(result).toBe(testElement);
        });
        
        test('should handle null element', () => {
            const result = DOMUtils.hide(null);
            expect(result).toBeNull();
        });
    });
    
    describe('position() - Get Position', () => {
        test('should return position object', () => {
            const position = DOMUtils.position(testElement);
            expect(position).toHaveProperty('top');
            expect(position).toHaveProperty('left');
            expect(typeof position.top).toBe('number');
            expect(typeof position.left).toBe('number');
        });
        
        test('should handle null element', () => {
            const position = DOMUtils.position(null);
            expect(position).toEqual({ top: 0, left: 0 });
        });
    });
    
    describe('offset() - Get Offset', () => {
        test('should return offset object', () => {
            const offset = DOMUtils.offset(testElement);
            expect(offset).toHaveProperty('top');
            expect(offset).toHaveProperty('left');
        });
        
        test('should handle null element', () => {
            const offset = DOMUtils.offset(null);
            expect(offset).toEqual({ top: 0, left: 0 });
        });
    });
    
    describe('append() - Append Child', () => {
        test('should append element child', () => {
            const child = document.createElement('span');
            DOMUtils.append(testElement, child);
            expect(testElement.contains(child)).toBe(true);
        });
        
        test('should append HTML string', () => {
            DOMUtils.append(testElement, '<span>Test</span>');
            expect(testElement.querySelector('span')).toBeTruthy();
        });
        
        test('should return parent element', () => {
            const child = document.createElement('span');
            const result = DOMUtils.append(testElement, child);
            expect(result).toBe(testElement);
        });
        
        test('should handle null parent', () => {
            const child = document.createElement('span');
            const result = DOMUtils.append(null, child);
            expect(result).toBeNull();
        });
    });
    
    describe('html() - HTML Content', () => {
        test('should get HTML content', () => {
            testElement.innerHTML = '<span>Test</span>';
            const html = DOMUtils.html(testElement);
            expect(html).toBe('<span>Test</span>');
        });
        
        test('should set HTML content', () => {
            DOMUtils.html(testElement, '<div>New Content</div>');
            expect(testElement.innerHTML).toBe('<div>New Content</div>');
        });
        
        test('should return element when setting', () => {
            const result = DOMUtils.html(testElement, '<div>Test</div>');
            expect(result).toBe(testElement);
        });
        
        test('should handle null element', () => {
            const result = DOMUtils.html(null, '<div>Test</div>');
            expect(result).toBeNull();
        });
    });
    
    describe('on() - Add Event Listener', () => {
        test('should add event listener', () => {
            const handler = jest.fn();
            DOMUtils.on(testElement, 'click', handler);
            testElement.click();
            expect(handler).toHaveBeenCalled();
        });
        
        test('should return element', () => {
            const handler = jest.fn();
            const result = DOMUtils.on(testElement, 'click', handler);
            expect(result).toBe(testElement);
        });
        
        test('should handle null element', () => {
            const handler = jest.fn();
            const result = DOMUtils.on(null, 'click', handler);
            expect(result).toBeNull();
        });
    });
    
    describe('off() - Remove Event Listener', () => {
        test('should remove event listener', () => {
            const handler = jest.fn();
            DOMUtils.on(testElement, 'click', handler);
            DOMUtils.off(testElement, 'click', handler);
            testElement.click();
            expect(handler).not.toHaveBeenCalled();
        });
        
        test('should return element', () => {
            const handler = jest.fn();
            DOMUtils.on(testElement, 'click', handler);
            const result = DOMUtils.off(testElement, 'click', handler);
            expect(result).toBe(testElement);
        });
        
        test('should handle null element', () => {
            const handler = jest.fn();
            const result = DOMUtils.off(null, 'click', handler);
            expect(result).toBeNull();
        });
    });
    
    describe('bind() - Bind Event (alias)', () => {
        test('should work as alias for on()', () => {
            const handler = jest.fn();
            DOMUtils.bind(testElement, 'click', handler);
            testElement.click();
            expect(handler).toHaveBeenCalled();
        });
    });
    
    describe('unbind() - Unbind Event (alias)', () => {
        test('should work as alias for off()', () => {
            const handler = jest.fn();
            DOMUtils.on(testElement, 'click', handler);
            DOMUtils.unbind(testElement, 'click', handler);
            testElement.click();
            expect(handler).not.toHaveBeenCalled();
        });
    });
    
    describe('outerWidth() - Get Outer Width', () => {
        test('should return outer width', () => {
            // Mock getBoundingClientRect for jsdom
            testElement.getBoundingClientRect = jest.fn(() => ({
                width: 100,
                height: 50,
                top: 0,
                left: 0,
                bottom: 50,
                right: 100
            }));
            
            const width = DOMUtils.outerWidth(testElement);
            expect(typeof width).toBe('number');
            expect(width).toBe(100);
        });
        
        test('should handle null element', () => {
            const width = DOMUtils.outerWidth(null);
            expect(width).toBe(0);
        });
    });
    
    describe('outerHeight() - Get Outer Height', () => {
        test('should return outer height', () => {
            // Mock getBoundingClientRect for jsdom
            testElement.getBoundingClientRect = jest.fn(() => ({
                width: 100,
                height: 50,
                top: 0,
                left: 0,
                bottom: 50,
                right: 100
            }));
            
            const height = DOMUtils.outerHeight(testElement);
            expect(typeof height).toBe('number');
            expect(height).toBe(50);
        });
        
        test('should handle null element', () => {
            const height = DOMUtils.outerHeight(null);
            expect(height).toBe(0);
        });
    });
});

