(function () {

	// Bootstrap AJAX form directive

	function ajaxForm($http, $parse, $window)
	{
		// Reset the form
		var clearValidationErrors = function(form, keepHelpBlock) {
			
			form.find('.form-control-feedback, .ajax-form-alert').remove();

			if( ! keepHelpBlock) {
				form.find('.help-block-error').remove();
			}

			form.find('.has-error').removeClass('has-error');
			form.removeClass('has-error');
		}

		var showValidationErrors = function(form, validation) {

			for (var field in validation) {
				var error = validation[field];

				var el = form.find('[name=' + field + ']');
				if( el.length ) {
					
					var parent = el.parent('.form-group');
					if (parent.length) {

						parent.addClass('has-error has-feedback');

						el.after('<p class="help-block help-block-error">' + error + '</p>');

						if( el.is('input') ) {
							parent.addClass('has-feedback');
							parent.append('<span class="glyphicon glyphicon-remove form-control-feedback"></span>');
						}

						continue;
					}

				}

				var el = $('<div class="alert alert-danger alert-dismissible ajax-form-alert" role="alert">\
					<button type="button" class="close" data-dismiss="alert">\
					<span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>\
					<strong>Error!</strong> ' + error + '</div>');

				form.prepend(el);

			}

			// Focus on the first form item with an error
			form.find('.has-error')[0].focus();
			//console.log(form.find('.has-error').find('label').offset());
			$('html, body').animate({ scrollTop: (form.find('.has-error').find('label').offset().top - 100) }, 500);
		}


		var successHandler = function(form, data) {
			
			console.log('default successHandler', arguments);

			// Clear the form
			form[0].reset();

			// Alert the user that all is well
			var el = $('<div class="alert alert-success alert-dismissible ajax-form-alert" role="alert">\
				<button type="button" class="close" data-dismiss="alert">\
				<span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>\
				<strong>Success!</strong> Your form has been submitted!</div>');

			form.prepend(el);

			// Still not sure about the approach
			//el.focus();
			//$(window).scrollTop(form.position().top);
			$('html, body').animate({ scrollTop: (form.offset().top - 100) }, 500);

			setTimeout(function() {
			    el.fadeOut('slow', function() { el.remove(); });
			}, 8000);

		};


		var errorHandler = function(form, data, response) {

			if(data.validation) {
				showValidationErrors(form, data.validation);
			}

		}

		var filterHandler = function(form, data) {
			return data;
		};

		return {
			restrict:"A",
			link: function ($scope, element, attrs) { 

				// Allow the parent controller, root scope, or even window to define a callback
				if(attrs.ajaxFormSuccess) {
					
					if($scope[attrs.ajaxFormSuccess]) {
						successHandler = $scope[attrs.ajaxFormSuccess];

					} else if($window[attrs.ajaxFormSuccess]) {
						successHandler = $window[attrs.ajaxFormSuccess];
					}

				}

				if(attrs.ajaxFormError) {
					
					if($scope[attrs.ajaxFormError]) {
						errorHandler = $scope[attrs.ajaxFormError];

					} else if($window[attrs.ajaxFormError]) {
						errorHandler = $window[attrs.ajaxFormError];
					}

				}

				if(attrs.ajaxFormFilter) {
					
					if($scope[attrs.ajaxFormFilter]) {
						filterHandler = $scope[attrs.ajaxFormFilter];

					} else if($window[attrs.ajaxFormFilter]) {
						filterHandler = $window[attrs.ajaxFormFilter];
					}

				}

				// Tell the user they are doing good and we notice!
				if( ! attrs.ajaxFormIgnoreBlur) {
					element.find(':input').on('blur', function() {
						clearValidationErrors($(this).parent('.has-error'), true);
					});
				}

				// On submit, do validation
				element.on('submit', function(e) {
					e.preventDefault();

					clearValidationErrors(element);

					data = filterHandler(element, $(element).serializeObject());

					$.ajax({
						type: "POST",
						url: element.attr('action'),
						data: data,
						success: function(data, txt, xhr) {
							successHandler(element, data);
						},
						error: function(data, txt, xhr) {
							errorHandler(element, data, showValidationErrors);
						},
					});

				});

			}
		};
	}

	angular.module('AngularAjaxForm', [])
		.directive('ajaxForm', ['$http', '$parse', '$window', ajaxForm]);

})();


// @todo remove jQuery
(function($){
	$.fn.serializeObject = function () {
		"use strict";

		var result = {};
		var extend = function (i, element) {
			var node = result[element.name];

			// If node with same name exists already, need to convert it to an array as it
			// is a multi-value field (i.e., checkboxes)

			if ('undefined' !== typeof node && node !== null) {
				if ($.isArray(node)) {
					node.push(element.value);
				} else {
					result[element.name] = [node, element.value];
				}
			} else {
				result[element.name] = element.value;
			}
		};

		$.each(this.serializeArray(), extend);
		return result;
	};
})(jQuery);
