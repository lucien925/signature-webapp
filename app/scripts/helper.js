$(function() {
	'use strict'
	
	var helper = {}

	helper.loadCropper = function(file) {
		$('.alert-popup').addClass('open')

	}

	helper.generateUUID = function() {
		var d = new Date().getTime();
	    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	        var r = (d + Math.random() * 16) % 16 | 0
	        d = Math.floor(d/16)
	        return (c=='x' ? r : (r&0x7|0x8)).toString(16);
	    })
	   return uuid
	}

	helper.isRgb = function() {
		return (str.match(/^rgba?/)).length > 0
	}

	// http://jsfiddle.net/Mottie/xcqpF/1/light/
	helper.rgb2hex = function(rgb) {
		rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
	 	return (rgb && rgb.length === 4) ? "#" +
	  		("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
	  		("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
	  		("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : ''
	  	
	}

	window.helper = helper
})