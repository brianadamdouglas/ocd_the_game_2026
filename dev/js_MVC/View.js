/**
* @class View
* @description The basic View class
*/
class View {
	constructor() { 
		this._id = null; // the String name of the View in the DOM
		this._div = null; // the jQuery reference for View
		this.animationSequence = null; // 
		this.imageDiv = null; // a neseted DIV Selection that contains image(s)
		this._width = null; // Interger of the width of the View
		this._height = null; // Interger of the height of the View
		this._x = null; // Interger of the x position of the View
		this._y = null; // Interger of the y position of the View
		this._defaultX = null; // Interger of the starting X position of the View
		this._defaultY = null; // Interger of the starting Y position of the View
		this._defaultRot = null; // Interger of the starting Y position of the View
		this._className = null;
		this._imageController = null;
		this._visible = null;
		this._controller = null;
		this._classContainer = null;// reference to the containing selectors Class, used for callback functions 
	}



	/**
* @description Return the name of the Class
* @return {String} Name of the class
	*/
	getClass() {
		return(this._className);
	}

	/**
* @description Return a reference to the JQuery Tile Selection
* @return {jQuery} the jQuery object
	*/
	getDiv() {
		return(this._div);
	}

	/**
* @description Return a reference to the Images_Controller instance
* @return {jQuery} the jQuery object
	*/
	getImageController() {
		return(this._imageController);
	}

	/**
* @description Return the name of the View instance in the DOM
* @return {String} Name of the View
	*/
	getID() {
		return (this._id);
	}

	/**
* @description Set the name of the View instance in the DOM
* @param {String} id // the name of the View instance
	*/  
	setID(id) {
		this._id = id;
	}

	/**
* @description Inspect the CSS classes that are part of the Selector(jQuery)
* @param {String} c // the name of the class to check for
* @return {Boolean} contains the class 
	*/  
	checkForClass(c) {//string
		return this._div.hasClass(c);
	}

	/**
* @description Return the location(jQuery position) of a Selector
* @return {Object} position of the Selector in absolute positioning 
	*/   
	getLoc() {
		return this._div.position();
	}

	/**
* @description Set the location for the View instance in the Stage View
* @param {Interger} x // the x position of the View instance
* @param {Interger} y // the y position of the View instance
	*/  
	setLoc(x,y) {
		this._x = x;
		this._y = y;
		this._div.css('left',x);
		this._div.css('top',y);
		this._controller.setRect(x,y);
	}

	/**
* @description Set the default position for use when restarting game
* @param {Interger} x // the x position of the View instance
* @param {Interger} y // the y position of the View instance
	*/  
	setDefaultLoc(x,y) {
		this._defaultX = x;
		this._defaultY = y;
	}

	resetPosition(){
		this.setLoc(this._defaultX,this._defaultY);
	}


	/**
* @description Set the dimensions and basic styling for the View instance
* @param {Interger} w // the width of the View instance
* @param {Interger} h // the height of the View instance
	*/ 
	setDimensions(w,h) { //CHANGE TO SETSTYLE
		this._width = w;
		this._height = h;
		this._div.css('width',w);
		this._div.css('height',h);
		this._div.css('margin',0);
		this._div.css('padding',0);
		this._div.css('border',0);//"1px blue solid");
	}


	/**
* @description Return the width of the View instance
* @return {Interger}
	*/  
	getWidth() {
		return this._width;
	}


	/**
* @description Return the height of the View instance
* @return {Interger}
	*/ 
	getHeight() {
		return this._height;
	}


	/**
* @description Return the X position of the View instance
* @return {Interger}
	*/  
	getX() {
		return this._x;
	}


	/**
* @description Return the Y position of the View instance
* @return {Interger}
	*/ 
	getY() {
		return this._y;
	}


	/**
* @description Rotate the View instance
* @param {Interger} degrees // the angle of rotation of the View instance
	*/ 
	rotateDiv(degrees){
		this._div.css('-webkit-transform',`rotate(${degrees}deg)`); 
		this._div.css('-moz-transform',`rotate(${degrees}deg)`);
		this._div.css('transform',`rotate(${degrees}deg)`);
	}

	/**
* @description Set the visibility for the View instance
* @param {Boolean} b // the visibility of the View instance
	*/   
	setVisibility(b){
		this._visible = b;
	}

	/**
* @description Get the visibility of the View instance
* @return {Boolean} is the View instance
	*/   
	getVisibility(){
		return this._visible;
	}

	/**
* @description Hide the View instance
	*/ 
	hide(){
		this._div.hide(0);
	}

	/**
* @description Show the View instance
	*/ 
	show(){
		this._div.show(0);   
	}

	/**
	* @description Set the css for the View instance
	* @param {Object} data // data for styling the View instance
	*/ 
	setCSS(data){
		this._div.css(data);
	}






}