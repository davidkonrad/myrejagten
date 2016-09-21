'use strict';

angular.module('myrejagtenApp')
  .directive('infoPopover', function ($compile) {
    return {
      restrict: 'A',
			replace: false,
      terminal: true,
      priority: 1000,
      link: function link(scope, element, attrs) {
				element.attr('bs-popover', '')
				element.attr('data-content', attrs['infoPopover'] ? attrs['infoPopover'] : 'undefined' )
				element.attr('data-trigger', 'hover')
				element.attr('data-placement', 'top')
				element.attr('data-container', 'html')
	
        element.removeAttr("info-popover"); //remove the attribute to avoid indefinite loop
        element.removeAttr("data-info-popover"); //also remove the same attribute with data- prefix in case users specify data-common-things in the html

				var template = '<div style="border-radius: 50%; border:1px solid #dadada; display:inline-block; cursor:pointer;">'
									+	'<i class="fa fa-question" style="color:steelblue;"></i>'
								  +	'</div>';

				var $template = $($.parseHTML(template))

				$template.attr('bs-popover', '')
				$template.attr('data-content', attrs['infoPopover'] ? attrs['infoPopover'] : 'undefined' )
				$template.attr('data-trigger', 'hover')
				$template.attr('data-placement', 'top')
				$template.attr('data-container', 'html')
				$template.css('backgroundColor', '#fff')
				$template.find('i').css('backgroundColor', '#fff')

				/*
				$template.css('-webkit-box-shadow', '0 0 1px 1px #C2C2C2')
				$template.css('box-shadow', '0 0 1px 1px #C2C2C2')
				*/

				function getAttrVal(v) {
					return attrs.hasOwnProperty(v) ? v.replace('info', '').toLowerCase() : false
				}
				var size = getAttrVal('infoXs') || getAttrVal('infoSm') || getAttrVal('infoMd') || getAttrVal('infoLg') || 'md';
				switch (size) {

					case 'xs' : 
						$template.css('width', '14px')
						$template.css('height', '14px')
						$template.find('i').css('fontSize', '12px')
						$template.find('i').css('marginLeft', '3px')
						break;

					case 'sm' : 
						$template.css('width', '23px')
						$template.css('height', '23px')
						$template.find('i').css('fontSize', '13px')
						$template.find('i').css('marginLeft', '6px')
						$template.find('i').css('marginTop', '2px')
						break;

					case 'lg' : 
						$template.css('width', '60px')
						$template.css('height', '60px')
						$template.find('i').css('fontSize', '40px')
						$template.find('i').css('marginLeft', '16px')
						$template.find('i').css('marginTop', '11px')

						break;

					default :
						$template.css('width', '30px')
						$template.css('height', '30px')
						$template.find('i').css('fontSize', '20px')
						$template.find('i').css('marginLeft', '8px')
						$template.find('i').css('marginTop', '5px')
						break;
				}					

				var e = $compile($template[0].outerHTML)(scope);
				element.replaceWith(e);			

      }
    };
  })


