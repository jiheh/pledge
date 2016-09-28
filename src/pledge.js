'use strict';
/*----------------------------------------------------------------
Promises Workshop: build the pledge.js deferral-style promise library
----------------------------------------------------------------*/
function $Promise() {
	this._state = 'pending';
	this._value = null;
	this._handlerGroups = [];
}

$Promise.prototype.then = function(resolve, reject) {

	var newPromise = defer();

	var _handler = {
		successCb: null,
		errorCb: null,
		downstream: newPromise
	};

	if (typeof resolve === 'function'){
		_handler.successCb = resolve;
	}
	if (typeof reject === 'function'){
		_handler.errorCb = reject;
	}

	this._handlerGroups.push(_handler);

	this.callHandlers();

	if (resolve !== null) return newPromise.$promise;
	// if (resolve === null) {
	// 	newPromise.$promise._value = reject();
	// 	newPromise.$promise._state = 'resolved';
	// }
	// returns the promise of the new deferral
};

$Promise.prototype.callHandlers = function (){
	var currentHandler;

	if (this._state === 'resolved'){
		currentHandler = this._handlerGroups.shift();

		if (currentHandler.downstream && !currentHandler.successCb) {
			currentHandler.downstream.resolve(this._value);
		} else if (currentHandler.downstream) {
			currentHandler.downstream.resolve(currentHandler.successCb(this._value));
		} else {
			currentHandler.successCb(this._value);
		}

	} else if (this._state === 'rejected'){
		currentHandler = this._handlerGroups.shift();

		if (currentHandler.downstream && !currentHandler.errorCb) {
			currentHandler.downstream.reject(this._value);
		} else {
			currentHandler.errorCb(this._value);
		}
	}

};

$Promise.prototype.catch = function(errFn){
	this.then(null, errFn);
};


function Deferral() {
	this.$promise = new $Promise;
}

Deferral.prototype.resolve = function(data) {
	if (this.$promise._state === 'pending') {
		this.$promise._state = 'resolved';
		this.$promise._value = data;
	}

	while (this.$promise._handlerGroups.length > 0) {
		this.$promise.callHandlers();
	}
};

Deferral.prototype.reject = function(myReason) {
	if (this.$promise._state === 'pending') {
		this.$promise._state = 'rejected';
		this.$promise._value = myReason;
	}

	while (this.$promise._handlerGroups.length > 0) {
		this.$promise.callHandlers();
	}
};

function defer() {
	return new Deferral;
}


/*-------------------------------------------------------
The spec was designed to work with Test'Em, so we don't
actually use module.exports. But here it is for reference:

module.exports = {
  defer: defer,
};

So in a Node-based project we could write things like this:

var pledge = require('pledge');
…
var myDeferral = pledge.defer();
var myPromise1 = myDeferral.$promise;
--------------------------------------------------------*/
