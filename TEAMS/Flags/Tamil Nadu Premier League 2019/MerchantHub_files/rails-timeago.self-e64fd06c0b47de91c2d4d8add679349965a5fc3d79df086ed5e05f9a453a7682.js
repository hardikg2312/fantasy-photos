//
// jQuery Timeago bootstrap for rails-timeago helper
//


(function($) {
	$(document).on('ready page:load ajax:success', function() {
		$('time[data-time-ago]').timeago();
	});
})(jQuery);
