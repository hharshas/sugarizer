define(["sugar-web/activity/activity", "l10n", "sugar-web/datastore", "sugar-web/env"], function (activity, _l10n, datastore, env) {

	// Manipulate the DOM only when it is ready.
	requirejs(['domReady!'], function (doc) {

		// Initialize the activity.
		l10n = _l10n
		activity.setup();
		var buttons = ["insertText", "wmd-bold-button-second", "wmd-italic-button-second", "wmd-heading-button", "wmd-hr-button",
				"wmd-olist-button", "wmd-ulist-button", "wmd-code-button", "wmd-quote-button", "wmd-link-button",
				"wmd-undo-button", "wmd-redo-button", "wmd-showHideEditor-button", "wmd-showHidePreview-button"];
		inputTextContent = document.getElementById("wmd-input-second");

		//to save and resume the contents from datastore.
		var datastoreObject = activity.getDatastoreObject();

		inputTextContent.onblur = function () {

			var jsonData = JSON.stringify((inputTextContent.value).toString());
			datastoreObject.setDataAsText(jsonData);
			datastoreObject.save(function () {});
		};
		markdownParsing();
		env.getEnvironment(function(err, environment) {
			var defaultLanguage = (typeof chrome != 'undefined' && chrome.app && chrome.app.runtime) ? chrome.i18n.getUILanguage() : navigator.language;
			var language = environment.user ? environment.user.language : defaultLanguage;
			window.addEventListener('localized', function () {
				for (i = 0; i < buttons.length; i++) {
					document.getElementById(buttons[i]).title = l10n.get(buttons[i]);
				}
				if (!environment.objectId) {
					inputTextContent.value = "#" + l10n.get("sample-input");
					markdownParsing();
				} else {
					datastoreObject.loadAsText(function (error, metadata, data) {
						markdowntext = JSON.parse(data);
						inputTextContent.value = markdowntext;
						markdownParsing();
					});
				}
			});
			l10n.init(language);	
		})

		var journal = document.getElementById("insertText");

		journal.onclick = function () {
			activity.showObjectChooser(function (error, result) {
				//result1 = result.toString();
				var datastoreObject2 = new datastore.DatastoreObject(result);
				datastoreObject2.loadAsText(function (error, metadata, data) {
					try {
						textdata = JSON.parse(data);
					} catch (e) {
						textdata = data;
					}

					var inputTextContent = document.getElementById("wmd-input-second");
					//inputTextContent.value += textdata;
					insertAtCursor(inputTextContent, textdata);
				});
			});
		};
		var showHideEditor = document.getElementById("wmd-showHideEditor-button");
		var showHidePreview = document.getElementById("wmd-showHidePreview-button");

		var panel = document.getElementById("wmd-panel");
		var preview = document.getElementById("wmd-preview-second");
		var textArea = document.getElementById("wmd-input-second");

		function isElementHidden(element){
			return window.getComputedStyle(element, null).getPropertyValue('display') === 'none';
		}
		showHideEditor.onclick = function(){

			if (isElementHidden(preview))
			{
				preview.style.display = "inline";
				preview.style.width = "97%";
				panel.style.width = "1%";
			}
			if (isElementHidden(panel))
			{
				panel.style.display = "inline";
				panel.style.width = "47%";
				preview.style.width = "47%";
			}
			else {
				panel.style.display = "none";
				panel.style.width = "1%";
				preview.style.width = "97%";
			}

		}
		showHidePreview.onclick = function () {
			if (isElementHidden(panel))
			{
				panel.style.display = "inline";
				panel.style.width = "97%";
				preview.style.width = "1%";
			}
			if (isElementHidden(preview))
			{
				preview.style.display = "inline";
				preview.style.width = "47%";
				panel.style.width = "47%";
			}
			else{
				preview.style.display = "none";
				preview.style.width = "1%";
				panel.style.width = "94%";
			}

		}

		function insertAtCursor(myField, myValue) {
			//IE support
			if (document.selection) {
				myField.focus();
				sel = document.selection.createRange();
				sel.text = myValue;
			}
			//MOZILLA and others
			else if (myField.selectionStart || myField.selectionStart == '0') {
				var startPos = myField.selectionStart;
				var endPos = myField.selectionEnd;
				myField.value = myField.value.substring(0, startPos)
					+ myValue
					+ myField.value.substring(endPos, myField.value.length);
			} else {
				myField.value += myValue;
			}
		}

		function markdownParsing() {
			var converter2 = new Markdown.Converter();

			var help = function () {
				alert(l10n.get("need-help"));
			}
			var options = {
				helpButton: {
					handler: help
				},
				strings: {
					quoteexample: l10n.get("put-it-right-here")
				}
			};

			var editor2 = new Markdown.Editor(converter2, "-second", options);

			editor2.run();
		}

	});

});
