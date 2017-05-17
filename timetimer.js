(function() {
	document.addEventListener("touchmove",function(e){
		e.preventDefault();
	})

	var clock = document.querySelector("#timetimer-clock"),
	svgpath = document.querySelector("#timetimer-path"),
	display = document.querySelector("#timetimer-display"),
	startStop = document.querySelector("#timetimer-startstop"),
	alarm = document.querySelector("#timetimer-audioalarm"),
	centerpoint = document.querySelector("#timetimer-centerpoint"),
	tickInterval = null,
	startTime = 0,
	startValue = 0;

	start_event = function(e){

		this._isPressed = true;
		
		stopTimer();

		var bounds = centerpoint.getBoundingClientRect();

		var cx = bounds.left + bounds.width / 2;
		var cy = bounds.top + 45 + bounds.height / 2;

		this._cx = cx;
		this._cy = cy;

		var dx = 0, dy= 0;
		if( e.type == "touchstart" ){
			dx = e.targetTouches[0].pageX - cx;
			dy = e.targetTouches[0].pageY + 45 - cy;
		} else {
			dx = e.pageX - cx;
			dy = e.pageY + 45 - cy;
		}

		    var a = Math.atan2(dy, dx) * 180 / Math.PI;
		    a += 90;
		    a = a > 0 ? a - 360 : a;
		    var s = a * -10;
		    renderClock( s );
						
	}
				
	clock.addEventListener("touchstart",start_event);
	clock.addEventListener("mousedown",start_event);
				
	move_event = function(e){
		e.preventDefault();
		if( !this._isPressed ){ return }

		var dx = 0, dy= 0;
		if( e.type == "touchmove" ){
			dx = e.targetTouches[0].pageX - this._cx;
			dy = e.targetTouches[0].pageY + 45  - this._cy;
		} else {
			dx = e.pageX - this._cx;
			dy = e.pageY + 45  - this._cy;
		}

		var a = Math.atan2(dy, dx) * 180 / Math.PI;
		a += 90;
		a = a > 0 ? a - 360 : a;
		var s = a * -10;
					
		renderClock( s );

	};
				
	clock.addEventListener("touchmove",move_event);
	clock.addEventListener("mousemove",move_event);
				
	end_event = function(e){
		this._isPressed = false;
		if( startStop.getAttribute("class").match("stop") ){
			startValue = clock.getAttribute("data-time");
			startTime = new Date().getTime();
			startTimer();
		}
	}
				
	clock.addEventListener("touchend",end_event);
	clock.addEventListener("mouseup",end_event);
				
	digit_event = function(e){
	e.stopPropagation();
		var t = this.getAttribute("data-time");
		renderClock( t * 60 );
		
	}
				
	var digits = document.querySelectorAll(".digit");
	for( i = 0; i < digits.length; i++ ){
		digits[i].addEventListener("mousedown",digit_event);
		digits[i].addEventListener("touchstart",digit_event);
	}
				
				
	startStopEvent = function(){
		var classNow=this.getAttribute("class");
		if( classNow.match("go") ){
			this.setAttribute("class",classNow.replace(/go/,"stop") )
			this.textContent = "Stop!"
			startValue = clock.getAttribute("data-time");
			if( startValue <= 1 ){
				renderClock( 60*15 );
			} 
			startTime = new Date().getTime();
			localStorage.setItem("timerState",JSON.stringify( {"startValue":startValue,"startTime":startTime} )); 
			startTimer();   
		} else if( classNow.match("stop") ) {
			this.setAttribute("class",classNow.replace(/stop/,"go") );
			this.textContent = "Start!"
			localStorage.removeItem("timerState");
			document.body.removeAttribute("class");
			stopTimer();
		}
	}
				
	startStop.addEventListener("mousedown",startStopEvent);
				
	startTimer = function(){
		
		if( tickInterval != null ){
			window.clearInterval(tickInterval);
		}
		startTime = new Date().getTime();
		startValue = clock.getAttribute("data-time");
		tickInterval = window.setInterval(tick,1000);
		
	}
		
	stopTimer = function(){
		if( tickInterval != null ){
			window.clearInterval(tickInterval);
			tickInterval = null;
		}
	}
				
	renderClock = function( seconds ){
	
		
		var txtsec=seconds;
		seconds = Math.max(seconds,0);
		
		
		clock.setAttribute("data-time", Math.round( seconds ));
		
		var deg =  seconds / 10 ;
		deg = Math.max(0, deg); deg = Math.min(360, deg);
		deg = 360 - deg;
		
		var l = 35;

		var r = ( deg * Math.PI / 180 )
		, x = 50.0001 + Math.sin( r ) * l
		, y = 60 + Math.cos( r ) * -l
		, mid = ( deg > 180 ) ? 0 : 1
		, anim = 'M 50 60 v -' + l + ' A '+ l +' '+ l +' 1 ' + mid + ' 0 ' +  x  + ' ' +  y  + ' z';

		svgpath.setAttribute("d", anim);
		
		var min = Math.floor( txtsec / 60 );
		var sec = Math.floor( txtsec - min * 60 );
		var txt = "00:" + (("0"+min).substr(-2)) + ":" + (("0"+sec).substr(-2));
		

		display.textContent = txt;
	}
				
	tick = function(){
		if( clock._isPressed ){ return; } 
		var diff = new Date().getTime() - startTime;
		diff = Math.floor(diff/1000);
		var val = startValue - diff;
		
		renderClock( val );
		
		if( val <= 0 ){
			fireAlarm();
		}
	}
				
	fireAlarm = function(){
    			
		document.body.setAttribute("class","alarming");
    			
		try{
			alarm.play();
		}catch(e){
		}

		startStop.setAttribute("class","go" );
		startStop.textContent = "Start!"
				
		localStorage.removeItem("timerState");

		setTimeout(function(){
			document.body.removeAttribute("class");
		},5000)
	
		stopTimer();
				
	}
				
	var restore = localStorage.getItem("timerState");

	if( restore ){
		try{
			var r = JSON.parse(restore);
			startValue = parseFloat(r.startValue);
			startTime = parseInt(r.startTime);
		
			var diff = new Date().getTime() - startTime;
			diff = Math.floor(diff/1000);
			var val = startValue - diff;
		
			renderClock( val );
					
			startStop.setAttribute("class", "stop");
			startStop.textContent = "Stop!"
			startTimer(); 

		} catch(e) {
			stopTimer();
			renderClock( 2700 )
		}	
	} else {
		renderClock( 2700 )	
	}

})();
