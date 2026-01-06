var StartMenu_Controller = MultiPaneMenu_Controller.extend({
construct: function() { 
	this.SC.construct();
	this.interfaceReferences;
	this.externalControlls;
	this._className = "StartScreen";
},

init: function(){
	this._rect = {
			top:0,
			right:0,
			bottom:0,
			left:0
	};
	this._interfaceReferences = new Object();
	this.externalControlls = new Object()
	this._currentPage = 0;	
	this.addListners();
},

/**
* @description Add Listeners to the Global Event Handler
* @return null
*/
addListners:function(){
	g_eventHandler.addAListener("startGame", this);
	g_eventHandler.addAListener("openInstructions", this);
	g_eventHandler.addAListener("openDisclaimer", this);
},



addTile: function(data) {
  
  
  	if(data.className.match(/button/gi) != null){
  	    	data.buttonTarget = this;
			var newButton = new Button_Controller();
			var newView = new Button_View();
			newButton.bindView(newView,data);  	    
  	    
			
			this.setInterfaceElement(data.IDOverride, newButton);
		/* OnOffTile*/
		
		}else if(data.className.match(/tile/gi) != null){
			
			var newController = new Tile_Controller();
			var newView = new Tile_View();
			newController.bindView(newView,data);
			
			if(data.IDOverride != undefined){
				this.setInterfaceElement(data.IDOverride, newController);
			}
		
		/* StickyTile*/
			
		}
},

setExternalControlls: function(name, reference){
  this.externalControlls[name] = reference;
},

startGame: function(){
  /* document.getElementById("myAudio").play();
  document.getElementById("myAudio").volume = 0.1; */
  /* g_eventHandler.dispatchAnEvent("startAudio",{}); */
  g_eventHandler.dispatchAnEvent("playGame",{});
},
openInstructions: function(){
  g_eventHandler.dispatchAnEventOneTarget("open",{target:this.externalControlls["informationSlideshow"]});
},

openDisclaimer:function(){
  g_eventHandler.dispatchAnEventOneTarget("open",{target:this.externalControlls["disclaimerSlideshow"]});
}




});
