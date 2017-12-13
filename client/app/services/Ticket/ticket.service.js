
angular.module('myrejagtenApp')
  .factory('TicketService', ['$cookies', function($cookies) {

		var cookieName = 'myrejagtenTicket';
		var	pass = 	"&login=davidkonrad&password=nhmdzm";

		return {

			refresh: function() {
				$cookies.remove(cookieName);
				this.get();
			},

			get: function() {
				var ticket = $cookies.get(cookieName);
				if (!ticket) {
					$.get('http://services.kortforsyningen.dk/service?service=META&request=GetTicket'+pass, function(newTicket) {
						ticket = newTicket;
						var expireDate = new Date();
						expireDate.setDate(expireDate.getDate() + 1);
						$cookies.put(cookieName, ticket, { expires: expireDate } );
						return ticket
					})
				} else {
					return ticket
				}
			}

		}


	}]);


