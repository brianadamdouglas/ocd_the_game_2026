/**
* @class EventHandler
* @description A global class that dispatches and receives Events
*/
class EventHandler {
	/**
	* Constructor
	* @return null
	*/ 
	constructor() { 
		this._events = {};
	}


	/**
* @description Add an Event to the _events Object, set up to prevent redundencies
* @param {String} type // the name of the event
* @return null
	*/
	addAnEvent(type){
		let exists = false;
		for(const i in this._events){
			if(this._events[i].type === type){
				console.log(`${type} event already exists`);
				exists = true;
			}
		}
		if(!exists){
			this._events[type] = {type:type, listeners:[]};
		}
	}


	/**
* @description Dispatch and event to all listeners of that event type
* @param {String} type // the name of the event
* @param {Object} data // package of data
* @return null
	*/
	dispatchAnEvent(type, data){
		if(this._events[type] === undefined){
			return; // Event doesn't exist, no listeners to notify
		}
		const listeners = this._events[type].listeners;
		for (const i in listeners){
			listeners[i].handleAnEvent(type,data);
		}
	}


	/**
* @description Dispatch and event to a specific listener of that type
* @param {String} type // the name of the event
* @param {Object} data // package of data
* @return null
	*/
	dispatchAnEventOneTarget(type, data){
		if(this._events[type] === undefined){
			return; // Event doesn't exist, no listeners to notify
		}
		const listeners = this._events[type].listeners;
		for (const i in listeners){
			if(listeners[i] === data.target){
				listeners[i].handleAnEvent(type,data);
				break;
			}
		}
	}


	/**
* @description Add a listener to a specific event
* @param {String} type // the name of the event
* @param {Controller} controller // instance of a controller to be added
* @return null
	*/
	addAListener(type, controller){
		if(this._events[type] === undefined){
			this.addAnEvent(type);
		}
		this._events[type].listeners.push(controller);
	}


	/**
* @description Remove a listener from a specific event
* @param {String} type // the name of the event
* @param {Controller} controller // instance of a controller to be removed
* @return null
	*/
	removeAListener(type, controller){
		// code to slice controller from the listenerArray 
		const index = this._events[type].listeners.indexOf(controller); 
		if (index > -1) {
			this._events[type].listeners.splice(index, 1);
		} 
	}
}