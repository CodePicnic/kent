var extend = require('lodash/extend');

function dispatchEvent(eventName, eventTarget, details) {
  var event = global.document.createEvent('CustomEvent'),
      baseDetails = {
        editor: eventTarget
      };

  details = extend(baseDetails, details);
  event.initCustomEvent(eventName, true, true, details);

  eventTarget.dispatchEvent(event);
}

function toolbarOptionsForText(toolbarOption) { return toolbarOption.on !== 'img'; }
function toolbarOptionsForImages(toolbarOption) { return toolbarOption.on === 'img'; }
function toolbarOptionsForAll(toolbarOption) { return toolbarOption }

module.exports = {
  toolbarOptionsForText: toolbarOptionsForText,
  toolbarOptionsForImages: toolbarOptionsForImages,
  toolbarOptionsForAll: toolbarOptionsForAll,
  dispatchEvent: dispatchEvent
};