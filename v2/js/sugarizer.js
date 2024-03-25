// Rebase require directory
requirejs.config({
	baseUrl: "lib",
	paths: {
		activity: "../js",
		modules: "../js/modules",
	}
});

// Sugarizer context
let sugarizer = {
	modules: {},

	constant: {
		webAppType: 0,
		appType: 1,
		sugarizerVersion: '2.0.0',
		noServerMode: false,
		platform: {
			ios: /(iPhone|iPad|iPod)/.test(navigator.userAgent),
			android: (navigator.userAgent.indexOf("Android") != -1),
			firefox: (navigator.userAgent.indexOf("Firefox") != -1),
			chrome: (navigator.userAgent.indexOf("Chrome") != -1),
			safari: (navigator.userAgent.indexOf("Safari") != -1),
			windows: (navigator.platform.indexOf("Win") != -1),
			macos: (navigator.platform.indexOf("Mac") != -1),
			unix: (navigator.platform.indexOf("X11") != -1),
			linux: (navigator.platform.indexOf("Linux") != -1),
			electron: (navigator.userAgent.indexOf("Electron") != -1),
			touch: ('ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0),
			androidChrome: /Android .* Chrome\/(\d+)[.\d]+/.test(navigator.userAgent)
		},
	},

	// Init function
	init: async function() {	
		return new Promise(function(resolve, reject) {
			// Load modules
			requirejs(
				["modules/xocolor","modules/server","modules/settings","modules/activities", "modules/journal", "modules/user", "modules/history", "modules/stats", 'lib/i18next.min.js', "lib/humane.js",],
				function(xocolor, server, settings, activities, journal, user, history, stats, i18next, humane) {
					sugarizer.modules.xocolor = xocolor;
					sugarizer.modules.server = server;
					sugarizer.modules.settings = settings;
					sugarizer.modules.activities = activities;
					sugarizer.modules.journal = journal;
					sugarizer.modules.user = user;
					sugarizer.modules.history = history;
					sugarizer.modules.stats = stats;
					sugarizer.modules.i18next = i18next;
					sugarizer.modules.humane = humane;
					resolve();
				}
			);
		});
	},

	// Get client type
	getClientType: function() {
		return (document.location.protocol.substr(0,4) == "http" && !this.constant.noServerMode) ? this.constant.webAppType : this.constant.appType;
	},

	// Get client name
	getClientName() {
		return this.getClientType() == this.constant.webAppType ? "Web App" : "App";
	},

	// Get browser name
	getBrowserName() {
		if (this.constant.platform.android) return "Android";
		else if (this.constant.platform.ios) return "iOS";
		else if (this.constant.platform.chrome) return "Chrome";
		else if (this.constant.platform.firefox) return "Firefox";
		else if (this.constant.platform.safari) return "Safari";
		return "Unknown";
	},

	// Get browser version
	getBrowserVersion() {
		let browserAgent = navigator.userAgent;
		let browserVersion = '' + parseFloat(navigator.appVersion);
		let browserMajorVersion = parseInt(navigator.appVersion, 10);
		let Offset, OffsetVersion, ix;
		if ((OffsetVersion = browserAgent.indexOf("Chrome")) != -1) {
			browserVersion = browserAgent.substring(OffsetVersion + 7);
		} else if ((OffsetVersion = browserAgent.indexOf("Firefox")) != -1) {
			browserName = "Firefox";
			browserVersion = browserAgent.substring(OffsetVersion + 8);
		} else if ((OffsetVersion = browserAgent.indexOf("Safari")) != -1) {
			browserName = "Safari";
			browserVersion = browserAgent.substring(OffsetVersion + 7);
			if ((OffsetVersion = browserAgent.indexOf("Version")) != -1)
				browserVersion = browserAgent.substring(OffsetVersion + 8);
		} else if ((Offset = browserAgent.lastIndexOf(' ') + 1) < (OffsetVersion = browserAgent.lastIndexOf('/'))) {
			browserName = browserAgent.substring(Offset, OffsetVersion);
			browserVersion = browserAgent.substring(OffsetVersion + 1);
			if (browserName.toLowerCase() == browserName.toUpperCase()) {
				browserName = navigator.appName;
			}
		}
		if ((ix = browserVersion.indexOf(";")) != -1) {
			browserVersion = browserVersion.substring(0, ix);
		}
		if ((ix = browserVersion.indexOf(" ")) != -1) {
			browserVersion = browserVersion.substring(0, ix);
		}
		browserMajorVersion = parseInt('' + browserVersion, 10);
		if (isNaN(browserMajorVersion)) {
			browserVersion = '' + parseFloat(navigator.appVersion);
			browserMajorVersion = parseInt(navigator.appVersion, 10);
		}
		return browserVersion;
	},

	// Get sugarizer version
	getVersion() {
		return this.constant.sugarizerVersion;
	},

	// Reload app
	reload: function() {
		window.location.reload();
	},

	// Restart app
	restart: function() {
		this.modules.settings.removeUser();
		this.modules.journal.cleanLocal().then(() => {
			location.assign(location.href.replace(/\?rst=?./g,"?rst=0"));
		});
		this.modules.stats.clean(true);
	},
};