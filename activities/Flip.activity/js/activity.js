define(["sugar-web/activity/activity", "l10n", 'easeljs','tweenjs','activity/game','activity/flipdot'], function (act, l10n) {

	// Manipulate the DOM only when it is ready.
	requirejs(['domReady!'], function (doc) {

		// Initialize the activity.
		requirejs(["sugar-web/env","sugar-web/datastore","activity/sizepalette","tutorial"], function(env,datastore,sizepalette,tutorial) {
			act.setup();
			act.getXOColor(function (error, colors) {
				runactivity(act,doc,colors,env,datastore,sizepalette,tutorial);
			});
			env.getEnvironment(function(err, environment) {
				currentenv = environment;
				// Set current language to Sugarizer
				var defaultLanguage = (typeof chrome != 'undefined' && chrome.app && chrome.app.runtime) ? chrome.i18n.getUILanguage() : navigator.language;
				var language = environment.user ? environment.user.language : defaultLanguage;
				l10n.init(language);
			});
		});
	});

});

function runactivity(act,doc,colors,env,datastore,sizepalette,tutorial){
	var canvas;
	var stage;
	var g;
	var e;

	function init(){
		canvas = document.getElementById('actualcanvas');
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		stage = new createjs.Stage(canvas);
		stage.update();
		stage.mouseEventsEnabled = true;

		document.getElementById("flip-count").style.color = colors['stroke'];
		document.getElementById("fliptext").style.borderBottom = "5px solid #00ff1b";

		createjs.Ticker.setFPS(30);
		createjs.Ticker.addEventListener("tick", handleTick);
		function handleTick() {
			stage.update();
		}
		var g = new Game(stage,colors,doc,datastore,act,sizepalette);
		setTimeout(function(){ g.init(); }, 500);

		var hasBeenResized = false;
		window.addEventListener('resize', resizeCanvas, false);
		function resizeCanvas() {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight-(+document.getElementById("main-toolbar").style.opacity ? 55 : 0);
			g.initialiseFromArray();
		}
		var solveButton = doc.getElementById("solve-button");
		solveButton.addEventListener('click', function (a) {
			g.solve();
		});

		var newGameButton = doc.getElementById("new-game-button");
		newGameButton.addEventListener('click', function (a) {
			g.newGame();
		});

		// Launch tutorial
		document.getElementById("help-button").addEventListener('click', function(e) {
			tutorial.start();
		});

		window.addEventListener('activityStop', function (eve) {
			eve.preventDefault();
			g.stop();
		});

		// Full screen
		document.getElementById("fullscreen-button").addEventListener('click', function() {
			document.getElementById("main-toolbar").style.opacity = 0;
			document.getElementById("canvas").style.top = "0px";
			document.getElementById("unfullscreen-button").style.visibility = "visible";
			resizeCanvas();
		});
		document.getElementById("unfullscreen-button").addEventListener('click', function() {
			document.getElementById("main-toolbar").style.opacity = 1;
			document.getElementById("canvas").style.top = "55px";
			document.getElementById("unfullscreen-button").style.visibility = "hidden";
			resizeCanvas();
		});
	}
	init();
}
