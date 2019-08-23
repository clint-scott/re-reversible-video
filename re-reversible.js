

console.log('***** re-reversible.js loaded.');


var vid_players = [
	{
		'id': 'player_0',
		'ele': '#vid_0',
		'currentTime': 0,
		'src': '',
		'canplay': false,
		'active': true,
		'player': ''
	},
	{
		'id': 'player_1',
		'ele': '#vid_1',
		'currentTime': 0,
		'src': '',
		'canplay': false,
		'active': false,
		'player': ''
	}
];


$(function ($) {

	$('.videoWrapper').toggleClass('hidden', false);
	initVidPlayers();
	initListeners();
	
});

function updateTimeline(currentTime, vidDuration) {
	
	vidDuration = $(vid_players[0].ele)[0].duration;
	
	$.each($('.timeline-bar  a:not(.start)'), function(index, obj){
		var time = $(this).data().time,
			bottom = Math.min((time/vidDuration*100), 100);
		
		$(this)
			.css({
				'bottom': 'calc('+bottom+'% - 19px)'
			})
			.toggleClass('selected', (currentTime >= time));
	});
	
	var scale = Math.min(currentTime / vidDuration, 1);
	$('.timeline .progress.fill').css ({
		'transform': 'scaleY('+scale+')'
	});
	
	
}

function initVidPlayers() {
	$.each(vid_players, function(index, obj){
		var video = $(obj.ele);
		
		obj.src = video.data().video;

		video[0].oncanplay = function() {
			obj.canplay = true;
			updateTimeline(0);
			//console.log('Can start playing video '+ index);
		};
		
		video[0].ontimeupdate  = function() {
			obj.currentTime = video[0].currentTime;
			updateTimeline(video[0].currentTime, video[0].duration);
		};
		
		video[0].src = obj.src;
	});
	
	var initCheck = setInterval(function() {
		if(vid_players[0].canplay && vid_players[1].canplay) {
			clearInterval(initCheck);
			
			setTimeout(function() {
				$('.videoWrapper.loading').removeClass('loading');
				$('.timeline').css({'opacity': 1});
				
			},500);
		}
	},100);
	
}


function initListeners() {
	$(document).on('click', '.btn-back', function (event) {
		parent.updateTrayPosition(true);
	});

	$(document).on('click', '.timeline  a.btn-start', function(event) {
		$('.btn-toggle')
			.css({'opacity': 1})
			.toggleClass('disabled', false);
		
		$('.timeline-bar  a.disabled').toggleClass('disabled', false);
		
		var activePlayer = vid_players[0].active ? vid_players[0] : vid_players[1];
		$(activePlayer.ele).toggleClass('hidden', false);
		$(activePlayer.ele)[0].currentTime = 0;
		$(activePlayer.ele)[0].play();
		$(activePlayer.ele)[0].muted = false;
		$(activePlayer.ele)[0].removeAttribute('muted');
	});

	$(document).on('click', '.timeline-bar  a', function(event) {
		var time = $(this).data().time;
		
		var activePlayer = vid_players[0].active ? vid_players[0] : vid_players[1];
		$(activePlayer.ele)[0].currentTime = time;
	});

	$(document).on('click', '.btn-toggle', function(event) {	
		console.log('btn toggle');
		
		$(this).toggleClass('mode-2');
		
		var activePlayer = vid_players[0].active ? vid_players[0] : vid_players[1];
		var inactivePlayer = !vid_players[0].active ? vid_players[0] : vid_players[1];
		
		console.log(activePlayer.ele+' | '+vid_players[0].active);
		
		$(activePlayer.ele)[0].muted = true;
		$(activePlayer.ele)[0].pause();
		$(activePlayer.ele).toggleClass('hidden', true);
		activePlayer.active = false;
		
		$(inactivePlayer.ele)[0].currentTime = activePlayer.currentTime;
		$(inactivePlayer.ele)[0].play();
		$(inactivePlayer.ele).toggleClass('hidden', false);
		inactivePlayer.active = true;
		$(inactivePlayer.ele)[0].muted = false;
		
	});

}
