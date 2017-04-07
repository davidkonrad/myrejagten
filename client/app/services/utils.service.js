'use strict';

angular.module('myrejagtenApp')
  .factory('Utils', function() {
		return {

			getObj: function($resource, prefix) {
				var exclude = ['$promise','$resolved','toJSON','$get','$save','$query','$remove','$delete','$update'],
						prop, p = {};
				for (prop in $resource) {
					if (prefix) {
						if (~prop.indexOf(prefix)) p[prop] = $resource[prop]
					} else {
						if (!~exclude.indexOf(prop)) p[prop] = $resource[prop]
					}
				}
				return p;
			},

			mergeObj: function(toObject, srcObject, overwrite) {
				srcObject = this.getObj(srcObject)
				for (var p in srcObject) {
					toObject[p] = srcObject[p]
				}
			},

			fixDate : function(date) {
				var d = new Date(date);
				if (!isNaN(d.getTime())) {
					return ('0' + d.getDate()).slice(-2) + '-' + ('0' + (d.getMonth()+1)).slice(-2) + '-' + d.getFullYear();
				} else {
					return '' //'?'
				}
			},

			//expects fixed date .i.e dd-mm-yyyy
			systemDate: function(date) {
				date = date.split('-')
				if (date.length != 3) return ''
				return date[1]+'/'+date[0]+'/'+date[2]
			},

			generateHash: function(length) {
				length = length || 10;
				var charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
				var retVal = "";
				for (var i=0, n=charset.length; i<length; ++i) {
					retVal += charset.charAt(Math.floor(Math.random() * n));
				}
				return retVal
			},

			//from http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
			emailIsValid: function(email) {
				if (!email) return true
		    var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		    return regex.test(email)
			},

			//insert value into array IF the value is unique and not null
			arrayInsert: function(array, value) {
				if (value && !~array.indexOf(value)) array.push(value)
			},
			
			strPad: function(s, len, padChar) {
				padChar = padChar || '0';
				s = s.toString();
				while (s.length < len) s = padChar + s;
				return s;
			},

			formIsEdited: function(id) {
				var form = document.querySelector(id)
				if (form) {
					var i; 
					var inputs = form.querySelectorAll('input:not(.exclude-from-form)');
					var textareas = form.querySelectorAll('textarea:not(.exclude-from-form)');
					var selects = form.querySelectorAll('button[bs-select]');
					//var ngCheckboxes = form.querySelectorAll('button[name="madding_sjaalet"]');
	
					for (i=0; i<inputs.length; i++) {
						if (angular.element(inputs[i]).hasClass('ng-dirty')) {
							return true
						}
					}
					for (i=0; i<selects.length; i++) {
						if (angular.element(selects[i]).hasClass('ng-dirty')) {
							return true
						}
					}
					for (i=0; i<textareas.length; i++) {
						if (angular.element(textareas[i]).hasClass('ng-dirty')) {
							return true
						}
					}
					/*
					for (i=0; i<ngCheckboxes.length; i++) {
						if (angular.element(ngCheckboxes[i]).hasClass('ng-dirty')) {
							return true
						} 
					}
					*/

				}
				return false
			},

			formReset: function(id) {
				var form = document.querySelector(id)
				if (form) {
					var i;
					var inputs = form.querySelectorAll('input:not(.exclude-from-form)');
					var textareas = form.querySelectorAll('textarea:not(.exclude-from-form)');
					var selects = form.querySelectorAll('button[bs-select]');
					var ngCheckboxes = form.querySelectorAll('button[name="madding_sjaalet"]');

					for (i=0; i<inputs.length; i++) {
						angular.element(inputs[i]).removeClass('ng-dirty')
						angular.element(inputs[i]).removeClass('ng-touched')
						angular.element(inputs[i]).addClass('ng-pristine')
					}
					for (i=0; i<selects.length; i++) {
						angular.element(selects[i]).removeClass('ng-dirty')
					}
					for (i=0; i<textareas.length; i++) {
						angular.element(textareas[i]).removeClass('ng-dirty')
						angular.element(textareas[i]).removeClass('ng-touched')
						angular.element(textareas[i]).addClass('ng-pristine')
					}
					for (i=0; i<ngCheckboxes.length; i++) {
						angular.element(ngCheckboxes[i]).removeClass('ng-dirty')
					}

				}
			},

			formSetDirty: function(id) {
				var form = document.querySelector(id)
				if (form) {
					var i=0, inputs = form.querySelectorAll('input');
					for (i; i<inputs.length; i++) {
						angular.element(inputs[i]).addClass('ng-dirty')
					}
				}
			},

			formToObj: function(id) {
				//console.log(this)
				var form = document.querySelector(id), obj = {}
				if (form) {
					var e, name, isDatePicker;
					var inputs = form.querySelectorAll('input, textarea');

					for (var i=0, l=inputs.length; i<l; i++) {
						e = inputs[i];
						name = e.getAttribute('name');
						isDatePicker = e.getAttribute('bs-datepicker') != '';

						//console.log('isDatePicker', isDatePicker)
						if (name) {
							obj[name] = isDatePicker ? e.value : this.systemDate(e.value)
						}
					}
				}
				return obj
			},
			
			dataTables_daDk: {
		    "sEmptyTable":     "Ingen tilgængelige data (prøv en anden søgning)",
		    "sInfo":           "Viser _START_ til _END_ af _TOTAL_ rækker",
		    "sInfoEmpty":      "Viser 0 til 0 af 0 rækker",
  		  "sInfoFiltered":   "(filtreret ud af _MAX_ rækker ialt)",
  		  "sInfoPostFix":    "",
  		  "sInfoThousands":  ",",
		    "sLengthMenu":     "Vis _MENU_ rækker",
		    "sLoadingRecords": "Henter data...",
		    "sProcessing":     "Processing...",
		    "sSearch":         "Filter:",
		    "sZeroRecords":    "Ingen rækker matchede filter",
		    "oPaginate": {
	        "sFirst":    "Første",
	        "sLast":     "Sidste",
	        "sNext":     "Næste",
	        "sPrevious": "Forrige"
		    },
		    "oAria": {
	        "sSortAscending":  ": activate to sort column ascending",
	        "sSortDescending": ": activate to sort column descending"
		    }
			}
		}
	});


	/**
		defaults for jQuery dataTables
	 */	
	$.extend( true, $.fn.dataTable.defaults, {
	  "lengthMenu": [ [10, 25, 50, -1], [10, 25, 50, "Alle"] ]
	});

/* sorting plugins */
jQuery.extend( jQuery.fn.dataTableExt.oSort, {
	"dkdato-pre": function ( a ) {
      if (a == null || a == "") {
         return 0;
      }
      var date = a.split('/');
			return Date.parse(date[1] + '-' + date[0] + '-' + date[2])
    }
} );

jQuery.extend( jQuery.fn.dataTableExt.oSort, {
	"dk-pre": function ( a ) {
		return a.localeCompare(a, 'dk')
	}
} );

jQuery.extend( jQuery.fn.dataTableExt.oSort, {
  "locale-compare-asc": function ( a, b ) {
		return a.localeCompare(b, 'da', { sensitivity: 'accent' })
  },
  "locale-compare-desc": function ( a, b ) {
		return b.localeCompare(a, 'da', { sensitivity: 'accent' })
  }
});


//global path to leaflet defaults
L.Icon.Default.imagePath = 'public/bower_components/leaflet/dist/images';

/** 
	default google stylers 
*/
var DefaultGoogleStyles = [
	//remove unwanted transport lines, færgeruter osv	
	{
    featureType: "transit.line",
    elementType: "geometry",
    stylers: [{ 
			visibility: "off" 
		}]
	},
	{
   //remove "Danmark / Denmark"
   featureType: "administrative.country",
   elementType: 'labels',
   stylers: [{
     visibility: 'off'
   }]
  }, {
   //remove points of interest
   featureType: "poi",
   elementType: 'all',
   stylers: [{
     visibility: 'off'
   }]
	}, 
];


