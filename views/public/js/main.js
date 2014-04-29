$(function() {
	var Notification = {
		$target: $('#notification'),
		duration: 3000,
		show: function(msg, type) {
			type = type || 'info';
			$('<p></p>').addClass(type).html(msg).appendTo(Notification.$target).hide(0).show('normal', function() {
				var self = this;
				setTimeout(function() {
					$(self).hide(function() {
						$(self).remove();
					});
				}, Notification.duration);
			});
		},
		info: function(str) {
			Notification.show(str, 'info');
		},
		success: function(str) {
			Notification.show(str, 'success');
		},
		error: function(str) {
			Notification.show(str, 'error');
		}
	};

	$.getJSON('/apis', function(json) {
		json.apis.forEach(function(api) {
			$('<p class="api">' + api + '</p>')
				.appendTo('#apis')
				.on('click', function() {
					var apiUrl = '/' + $(this).text();
					$.getJSON(apiUrl, function(json) {
						if (json.error) {
							Notification.error(json.error);
						} else {
							Notification.success(json.reply);
						}
					});
				});
		});
	}).fail(function() {
		Notification.error('Something wrong occurs in API server. Please reload.');
	});
});
