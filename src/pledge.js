'use strict';
/*----------------------------------------------------------------
Promises Workshop: build the pledge.js deferral-style promise library
----------------------------------------------------------------*/
function $Promise() {
	this._state = 'pending';
	this._value = null;
}

function Deferral() {
	this.$promise = new $Promise;
}

Deferral.prototype.resolve = function(data) {
	if (this.$promise._state === 'pending') {
		this.$promise._state = 'resolved';
		this.$promise._value = data;
	}
};

Deferral.prototype.reject = function(myReason) {
	if (this.$promise._state === 'pending') {
		this.$promise._state = 'rejected';
		this.$promise._value = myReason;
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
