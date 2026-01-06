 /**
 * There will be only one event handler and it will exist always in the model
 */

var EventHandler = Class.extend({
 
construct: function() { 
	this._events;
},

_addAnEvent: function(type){
  var exists = false;
  for(var i in this._events){
  	if(this._events.type == type){
  		exists = true;
  	}
  }
  if(!exists){
  	this._events[type] = {type:type, listeners:[]};   	
  }
},

_dispatchAnEvent: function(type, data){
  var listeners = this._events[type].listeners;
  for (var i in listeners){
      listeners[i].handleAnEvent(type,data);
  }
},

_addAListener: function(type, controller){
  if(this._events[type] == undefined){
      this.addAnEvent(type);
  }
  this._events[type].listners.push(controller);
  
},

_removeAListener: function(type, controller){
  // code to slice controller from the listenerArray     
}

});
