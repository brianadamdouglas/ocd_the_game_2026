console.log('present');
var Timer = Class.extend({
  /**
  * Constructor
  * This class calls on at present one other Class, animationFrame.js
  *	As I continue to refine the code, I will delegate a subclass that deals strictly with the images
  */
  construct: function() { 
      console.log('a');
  		this._timerInterval;
  		this._endTime;
  		this._totalTime;
  		this._className = "Timer";
  },
 	
  init: function(time) {
      console.log('hey');
    	this._totalTime = time;
  },
  
  getTimeRemaining: function (endtime){
  	  var t = Date.parse(endtime) - Date.parse(new Date());
	  var seconds = Math.floor( (t/1000) % 60 );
	  var minutes = Math.floor( (t/1000/60) % 60 );
	  var hours = Math.floor( (t/(1000*60*60)) % 24 );
	  var days = Math.floor( t/(1000*60*60*24) );
	  return ({
	    	total: t,
		    days: days,
		    hours: hours,
		    minutes: minutes,
		    seconds: seconds
	  		});
	},
	
	getEndTime: function(){
		var timeInMinutes = this._totalTime;
  		var currentTime = Date.parse(new Date());
  		var deadline = new Date(currentTime + timeInMinutes*60*1000);
  		return (deadline);	
	},
	
	updateClock: function(){
		this.timeObj = this.getTimeRemaining(this._endTime);
		//console.log(timeObj.minutes + " : " + timeObj.seconds);
	},
	
	startClock: function (){
		//this._div.text("3:00");
		this._endTime = this.getEndTime();
		this._timerInterval = setInterval(this.updateClock.bind(this), 1000); // use .bind to correct scope
		
	}
  
  
  
});
