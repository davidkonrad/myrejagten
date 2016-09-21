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
			systemDate : function(date) {
				date = date.split('-')
				if (date.length != 3) return ''
				return date[1]+'/'+date[0]+'/'+date[2]
			},

			//insert value into array IF the value is unique and not null
			arrayInsert: function(array, value) {
				if (value && !~array.indexOf(value)) array.push(value)
			},
			
			formIsEdited : function(id) {
				var form = document.querySelector(id)
				if (form) {
					var i, 
							inputs = form.querySelectorAll('input:not(.exclude-from-form)'),
							selects = form.querySelectorAll('button[bs-select]');
	
					for (i=0; i<inputs.length; i++) {
						if (angular.element(inputs[i]).hasClass('ng-dirty')) return true
					}
					for (i=0; i<selects.length; i++) {
						if (angular.element(selects[i]).hasClass('ng-dirty')) return true
					}

				}
				return false
			},

			formReset: function(id) {
				var form = document.querySelector(id)
				if (form) {
					var i, 
							inputs = form.querySelectorAll('input:not(.exclude-from-form)'),
							selects = form.querySelectorAll('button[bs-select]');

					for (i=0; i<inputs.length; i++) {
						angular.element(inputs[i]).removeClass('ng-dirty')
					}
					for (i=0; i<selects.length; i++) {
						angular.element(selects[i]).removeClass('ng-dirty')
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
				console.log(this)
				var form = document.querySelector(id), obj = {}
				if (form) {
					var e, name, isDatePicker, inputs = form.querySelectorAll('input');
					for (var i=0, l=inputs.length; i<l; i++) {
						e = inputs[i];
						name = e.getAttribute('name');
						isDatePicker = e.getAttribute('bs-datepicker') != '';

						console.log('isDatePicker', isDatePicker)
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



