var utils = require('./utils');

function KentEditor(options) {
  var self = this;

  this.element = options.element;
  this.content = options.content;
  this.element.classList.add('kent-editor');
  this.toolbarOptions = options.toolbarOptions || KentEditor.defaultToolbarOptions;
  this.editorToolbar = this.buildToolbar();
  this.editorContent = this.buildContent();

  this._buildEditor();
  this.dimensions = {
    editorToolbar: {
      width: this.editorToolbar.scrollWidth,
      height: this.editorToolbar.scrollHeight
    }
  };

  this.editorContent.addEventListener('click', this.editorContent.focus.bind(this.editorContent));
  this.editorContent.addEventListener('mouseup', function(event) {
    // check if selection is an image
    if (event.target.tagName === 'IMG') {
      self.eventTarget = event.target;
      self.buildToolbarOptions(utils.toolbarOptionsForImages);
      self.showToolbar(event.target.getClientRects()[0]);
    }
    else {
      self.buildToolbarOptions(utils.toolbarOptionsForText);
      self.showToolbar();
    }
  });

  this.editorContent.addEventListener('input', function(event) {
    if (event.currentTarget.textContent.trim() === '') {
      var paragraph = document.createElement('p'),
          range = document.createRange(),
          selection;

      paragraph.innerHTML = '&nbsp;';

      range.setStart(paragraph, paragraph.childNodes.length - 1);
      range.setEnd(paragraph, paragraph.childNodes.length);

      while (event.currentTarget.hasChildNodes()) {
        event.currentTarget.removeChild(event.currentTarget.firstChild);
      }

      event.currentTarget.appendChild(paragraph);

      selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);

      event.currentTarget.focus();
      self.buildToolbarOptions(utils.toolbarOptionsForText);
      self.showToolbar();
      selection.collapse(paragraph, 0);
    }

    self.lastSelectionRange = window.getSelection().getRangeAt(0);
    utils.dispatchEvent('kent:change', event.currentTarget);
  });

  this.editorContent.addEventListener('paste', function(event) {
    var clipboardData = event.clipboardData.getData('text/plain').trim();

    event.preventDefault();

    document.queryCommandSupported('insertHTML') && document.execCommand('insertHTML', false, clipboardData);
    utils.dispatchEvent('kent:change', event.currentTarget);
  });

  this.editorContent.addEventListener('keyup', function(event) {
    switch (event.which) {
      case 27:
        self.hideToolbar();
      break;
    }
  });

  window.addEventListener('scroll', this.hideToolbar.bind(this));
  window.addEventListener('resize', this.hideToolbar.bind(this));
}

KentEditor.prototype.buildContent = function() {
  var editorContent = document.createElement('div');

  editorContent.setAttribute('contenteditable', true);
  editorContent.setAttribute('spellcheck', false);
  editorContent.classList.add('kent-content');

  return editorContent;
};

KentEditor.prototype.buildToolbar = function() {
  var editorToolbar = document.createElement('nav'),
      editorToolbarFragment = document.createDocumentFragment(),
      editorToolbarArrow = document.createElement('span'),
      self = this;

  self.toolbarOptions.forEach(function(toolbarOption) {
    var editorToolbarButton = document.createElement('button');

    editorToolbarButton.type = 'button';
    editorToolbarButton.dataset.id = toolbarOption.id;
    editorToolbarButton.innerHTML = '<img src="' + toolbarOption.icon + '" alt="' + toolbarOption.title + '" />';
    editorToolbarButton.addEventListener('click', function(event) {
      toolbarOption.action.call(self, event, self.editorContent);
      utils.dispatchEvent('kent:exec' + toolbarOption.id, self.editorContent);
      utils.dispatchEvent('kent:change', self.editorContent);
    });

    editorToolbarFragment.appendChild(editorToolbarButton);
  });

  editorToolbarArrow.classList.add('kent-toolbar-arrow');
  editorToolbarFragment.appendChild(editorToolbarArrow);

  editorToolbar.appendChild(editorToolbarFragment);
  editorToolbar.classList.add('kent-toolbar');

  return editorToolbar;
};

KentEditor.prototype.buildToolbarOptions = function(filterFunction) {
  var filterFunction = filterFunction || utils.toolbarOptionsForAll,
      visibleToolbarOptions = this.toolbarOptions.filter(filterFunction).map(function(toolbarOption) { return toolbarOption.id; });

  Array.from(this.editorToolbar.querySelectorAll('button')).forEach(function(editorToolbarButton) {
    if (visibleToolbarOptions.indexOf(editorToolbarButton.dataset.id) > -1) {
      editorToolbarButton.style.display = 'inline-block';
    }
    else {
      editorToolbarButton.style.display = 'none';
    }
  });
};

KentEditor.prototype.showToolbar = function(currentRangeBoundingRect) {
  var currentSelection = window.getSelection(),
      currentRange,
      currentRangeClientRects,
      currentRangeBoundingRect,
      currentRangeBoundingRectTop,
      currentRangeBoundingRectLeft;

  if (currentRangeBoundingRect) {
    currentRangeBoundingRectTop = currentRangeBoundingRect.top;
    currentRangeBoundingRectLeft = currentRangeBoundingRect.left;
  }
  else {
    if (currentSelection.rangeCount > 0) {
      currentRange = currentSelection.getRangeAt(0);
      currentRangeClientRects = currentRange.getClientRects();
      currentRangeBoundingRect = currentRangeClientRects[0] || currentRange.getBoundingClientRect();

      currentRangeBoundingRectTop = currentRangeBoundingRect.top;
      currentRangeBoundingRectLeft = currentRangeBoundingRect.left;
    }
  }

  if (currentRangeBoundingRectTop !== undefined && currentRangeBoundingRectLeft !== undefined) {
    this.editorToolbar.style.top = (currentRangeBoundingRectTop - this.dimensions.editorToolbar.height) + 'px';
    this.editorToolbar.style.left = ((currentRangeBoundingRectLeft + (currentRangeBoundingRect.width / 2)) - (this.editorToolbar.scrollWidth / 2)) + 'px';
    this.editorToolbar.style.visibility = 'visible';
  }
};

KentEditor.prototype.hideToolbar = function() {
  this.editorToolbar.style.visibility = 'hidden';
};

KentEditor.prototype._buildEditor = function() {
  var documentFragment = document.createDocumentFragment();

  documentFragment.appendChild(this.editorContent);
  documentFragment.appendChild(this.editorToolbar);

  if (this.element.hasChildNodes()) {
    while (this.element.hasChildNodes()) {
      this.editorContent.appendChild(this.element.firstChild);
    }
  }
  else if (this.content) {
    this.editorContent.innerHTML = this.content;
  }
  else {
    this.editorContent.innerHTML = '<p><br/></p>';
  }

  this.element.appendChild(documentFragment);
};

KentEditor.defaultToolbarOptions = require('./toolbarOptions');

module.exports = global.KentEditor = KentEditor;