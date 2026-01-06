var MultiPaneMenu = Base.extend({
  construct: function() { 
		this.SC.construct();
		this.interfaceReferences;
		this.slideShow;
		this.currentPage;
		this.maxPages;
		this._className = "MultiPaneMenu";
  },

  /**
  * @description Initializes the instance
  * @param {Selection} container // the selection on the stage that houses the player tile
  * @param {String} id // unique name of the new DIV
  * @param {String} className // space delimited string of CSS classes that are attached to this instance.
  * @param {Interger} x // X coordinate on the stage.
  * @param {Interger} y // Y coordinate on the stage.
  * @param {Interger} width // Max width .
  * @param {Interger} height // Max height .
  * @return 
  */

  init: function(classContainer, container, id, className, x, y, width, height) {
    	this.setID(id);
		var newDiv = document.createElement('div');
		newDiv.id = id;
		this._classContainer = classContainer;
		O(container).appendChild(newDiv); //appends the newly created div into the container. 
		this._div = $('#'+id);//making the jQuery selection reference
		this._div.addClass(className);
		
		this.rect = {
			top:0,
			right:0,
			bottom:0,
			left:0
		};
		//this.setImagesState(startFrame);
		this.setDimensions(width,height);
		this.setLoc(x,y);
		this.interfaceReferences = new Object();
		this.currentPage = 0;
		this.hide();
  },
  
 

  /**
  * @description Set the location for the Player tile in the Stage Selector
  * @param {Interger} x // the x position of the Player tile Selector
  * @param {Interger} y // the y position of the Player tile Selector
  */   
  setLoc: function(x,y) {
      	this._x = x;
      	this._y = y;
     	this._div.css('left',x);
		this._div.css('top',y);
		this.setRect(x,y);
  },
  
  setInterfaceElement: function(name, reference){
      this.interfaceReferences[name] = reference;
  },
  
  getInterfaceElement: function(name){
      return this.interfaceReferences[name];
  },

  
  /**
  * @description Return the dimensions of the PLayer tile;
  * @return {Object} the dimensions Object(width, height); 
  */    
  getDimensions: function() {
      	return {width:this._width,height:this._height};
  },
  
  addTile: function(data) {
      	if(data.className.match(/button/gi) != null){
			var newButton = new Button();
			var buttonFunction = this[data.buttonFunction].bind(this);
			newButton.init(this, data.container, data.spriteID, data.className, data.x, data.y,data.w,data.h,data.imagePath, 0,buttonFunction, data.IDOverride);
			this.setInterfaceElement(data.IDOverride, newButton);
		/* OnOffTile*/
		
		}else if(data.className.match(/tile/gi) != null){
			
			var newslideShow = new SlideShow();
			newslideShow.init(data.container, data.spriteID, data.className, data.x, data.y,data.w,data.h,data.imagePath,0, this);
			this.slideShow = newslideShow;
			this.maxPages = data.imagePath.length;
		/* StickyTile*/
			
		}
			
  },
  
  nextPanel: function(){
      if(this.slideShow.nextFrame()){
          this.getInterfaceElement("forward").hide();
          this.getInterfaceElement("back").show();
      }else{
      	this.getInterfaceElement("forward").show();  
      	this.getInterfaceElement("back").show();
      }
  },
  
  previousPanel: function(){
      if(this.slideShow.previousFrame()){
      	  this.getInterfaceElement("back").hide();
          this.getInterfaceElement("forward").show();
      }else{
          this.getInterfaceElement("back").show();
          this.getInterfaceElement("forward").show();  
      	
      }
  },
  
 close: function(){
      this.slideShow.hideSequence(0);
      this.hide();
  },
  
  open: function(){
      this.resetSlideshow();
      this.show();
  },
  
  resetSlideshow: function(){
      if(this.getInterfaceElement("back") != undefined){
      	this.getInterfaceElement("back").hide();
	    this.getInterfaceElement("forward").show();
      }
      
      this.slideShow.resetFrames();
      this.slideShow.showSequence();
  }
  
  
  
});

