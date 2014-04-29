$(function() {
	var DEVICE_API_URL  = 'http://' + location.hostname + ':23456';
	var CONTROL_API_URL = 'http://' + location.host;

	var Netatmo = {
		roomTag:
			'<p class="netatmo-content">' +
				'<span class="title">[室内]</span>' +
				'<span class="key">気温</span><span class="value"><%= temperature %>℃</span>' +
				'<span class="key">湿度</span><span class="value"><%= humidity %>%</span>' +
				'<span class="key">気圧</span><span class="value"><%= pressure %> mbar</span>' +
				'<span class="key">騒音</span><span class="value"><%= noise %> dB</span>' +
				'<span class="key">CO<sub>2</sub> </span><span class="value"><%= co2 %> ppm</span>' +
			'</p>',
		outsideTag:
			'<p class="netatmo-content">' +
				'<span class="title">[室外]</span>' +
				'<span class="key">気温</span><span class="value"><%= temperature %>℃</span>' +
				'<span class="key">湿度</span><span class="value"><%= humidity %>%</span>' +
			'</p>'
	};

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

	$.getJSON(CONTROL_API_URL + '/apis', function(json) {
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

	$.getJSON(DEVICE_API_URL + '/device/netatmo/room?callback=?', function(json) {
		$('#room').html( ejs.render(Netatmo.roomTag, json) );
	});

	$.getJSON(DEVICE_API_URL + '/device/netatmo/outside?callback=?', function(json) {
		$('#outside').html( ejs.render(Netatmo.outsideTag, json) );
	});
});
