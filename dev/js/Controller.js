var Controller = Class.extend({
  /**
  * Constructor
  * This class calls on at present one other Class, animationFrame.js
  *	As I continue to refine the code, I will delegate a subclass that deals strictly with the images
  */
construct: function() { 
	this._view;
},

init: function(){
},


bindView: function(view, data){
  this._view = view;
  this._view.init(this,data);
},

handleAnEvent:function(event, data){
  
}
 
});
