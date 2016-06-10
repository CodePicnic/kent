var utils = require('./utils');

module.exports = [
  {
    id: 'h2',
    icon: 'icons/h2.svg',
    title: 'H2',
    action: function() {
      var range = window.getSelection().getRangeAt(0);

      if (
        range.startContainer.nodeType === Node.TEXT_NODE &&
        range.startContainer.parentNode.tagName === 'H2'
      ) {
        document.queryCommandSupported('formatBlock') && document.execCommand('formatBlock', false, 'p');
      }
      else {
        document.queryCommandSupported('formatBlock') && document.execCommand('formatBlock', false, 'h2');
      }
    }
  },
  {
    id: 'h3',
    icon: 'icons/h3.svg',
    title: 'H3',
    action: function() {
      var range = window.getSelection().getRangeAt(0);

      if (
        range.startContainer.nodeType === Node.TEXT_NODE &&
        range.startContainer.parentNode.tagName === 'H3'
      ) {
        document.queryCommandSupported('formatBlock') && document.execCommand('formatBlock', false, 'p');
      }
      else {
        document.queryCommandSupported('formatBlock') && document.execCommand('formatBlock', false, 'h3');
      }
    }
  },
  {
    id: 'bold',
    icon: 'icons/bold.svg',
    title: 'Bold',
    action: function() {
      document.queryCommandSupported('bold') && document.execCommand('bold', false);
    }
  },
  {
    id: 'italic',
    icon: 'icons/italic.svg',
    title: 'Italic',
    action: function() {
      document.queryCommandSupported('italic') && document.execCommand('italic', false);
    }
  },
  {
    id: 'underline',
    icon: 'icons/underline.svg',
    title: 'Underline',
    action: function() {
      document.queryCommandSupported('underline') && document.execCommand('underline', false);
    }
  },
  {
    id: 'link',
    icon: 'icons/link.svg',
    title: 'Link',
    action: function() {
      var range = window.getSelection().getRangeAt(0);

      if (
        range.startContainer.nodeType === Node.TEXT_NODE &&
        range.startContainer.parentNode.tagName === 'A'
      ) {
        document.queryCommandSupported('unlink') && document.execCommand('unlink', false);
      }
      else {
        document.queryCommandSupported('createLink') && document.execCommand('createLink', false, prompt('URL'));
      }
    }
  },
  {
    id: 'code',
    icon: 'icons/code.svg',
    title: 'Code',
    action: function() {
      var range = window.getSelection().getRangeAt(0),
          clonedContent = range.cloneContents(),
          clonedContentChildNodes = Array.from(clonedContent.childNodes),
          clonedContentElements = clonedContentChildNodes.filter(function(node) { return node.nodeType === Node.ELEMENT_NODE; });

      if (
        range.startContainer.nodeType === Node.TEXT_NODE &&
        range.startContainer.parentNode.tagName === 'CODE'
      ) {
        document.queryCommandSupported('removeFormat') && document.execCommand('removeFormat', false);
      }
      else if (
        // Firefox "hack"
        clonedContentElements.length === 1 &&
        clonedContentElements[0].textContent === clonedContent.textContent
      ) {
        document.queryCommandSupported('removeFormat') && document.execCommand('removeFormat', false);
      }
      else {
        var code = document.createElement('code'),
            contentFragment = range.extractContents();

        while (contentFragment.hasChildNodes()) {
          code.appendChild(contentFragment.firstChild);
        }

        if (!code.hasChildNodes()) {
          return;
        }

        contentFragment.appendChild(code);
        range.insertNode(contentFragment);
      }
    }
  },
  {
    id: 'quote',
    icon: 'icons/quote.svg',
    title: 'Quote',
    action: function(event, editorContent) {
      var selection = window.getSelection(),
          range = selection.getRangeAt(0);

      if (
        range.startContainer.nodeType === Node.TEXT_NODE &&
        range.startContainer.parentNode.tagName === 'BLOCKQUOTE'
      ) {
        document.queryCommandSupported('formatBlock') && document.execCommand('formatBlock', false, 'p');
      }
      else if (
        // Firefox "hack"
        range.startContainer.tagName === 'P' &&
        range.startContainer.parentNode.tagName === 'BLOCKQUOTE'
      ) {
        range.setStart(range.startContainer.parentNode, 0);

        var contentFragment = range.extractContents(),
            contentFragmentfirstChild = contentFragment.firstChild,
            newRange = document.createRange();

        range.commonAncestorContainer.parentNode.replaceChild(contentFragment, range.commonAncestorContainer);

        newRange.setStart(contentFragmentfirstChild, 0);
        newRange.setEnd(contentFragmentfirstChild, contentFragmentfirstChild.childNodes.length);

        selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(newRange);
      }
      else if (
        range.startContainer.nodeType === Node.TEXT_NODE &&
        range.startContainer.parentNode.tagName === 'P' &&
        range.startContainer.parentNode.parentNode.tagName === 'BLOCKQUOTE'
      ) {
        var newRange = range.cloneRange(),
            newRangeStartContainer = range.startContainer,
            newRangeStartOffset = range.startOffset,
            newRangeEndOffset = range.endOffset,
            paragraph = range.startContainer.parentNode,
            blockquote = paragraph.parentNode,
            selection;

        blockquote.parentNode.replaceChild(paragraph, blockquote);

        newRange.setStart(newRangeStartContainer, newRangeStartOffset);

        selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(newRange);

        editorContent.focus();
      }
      else {
        document.queryCommandSupported('formatBlock') && document.execCommand('formatBlock', false, 'blockquote');
        editorContent.focus();
      }
    }
  },
  {
    id: 'picture',
    icon: 'icons/picture.svg',
    title: 'Picture',
    action: function(editorContent) {
      var range = window.getSelection().getRangeAt(0),
          img = document.createElement('img');

      img.src = prompt('URL');
      range.deleteContents();

      range.insertNode(img);
      utils.dispatchEvent('kent:imageinsert', editorContent, { img: img });
    }
  },
  {
    id: 'compress',
    icon: 'icons/compress.svg',
    title: 'Compress',
    on: 'img',
    action: function() {
      var selection = window.getSelection(),
          range,
          image;

      if (selection.rangeCount > 0) {
        range = selection.getRangeAt(0);
      }

      if (this.eventTarget && this.eventTarget.tagName === 'IMG') {
        image = this.eventTarget;

        switch (image.className) {
          case '_25':
          break;
          case '_50':
            image.className = '_25';
          break;
          case '_75':
            image.className = '_50';
          break;
          case '_100':
          default:
            image.className = '_75';
          break;
        }
      }
    }
  },
  {
    id: 'expand',
    icon: 'icons/expand.svg',
    title: 'Expand',
    on: 'img',
    action: function() {
      var selection = window.getSelection(),
          range,
          image;

      if (selection.rangeCount > 0) {
        range = selection.getRangeAt(0);
      }

      if (this.eventTarget && this.eventTarget.tagName === 'IMG') {
        image = this.eventTarget;

        switch (image.className) {
          case '_25':
            image.className = '_50';
          break;
          case '_50':
            image.className = '_75';
          break;
          case '_75':
            image.className = '_100';
          break;
          case '_100':
          default:
          break;
        }
      }
    }
  },
  {
    id: 'left',
    icon: 'icons/left.svg',
    title: 'Left',
    action: function() {
      document.execCommand('styleWithCss', false, true);
      document.queryCommandSupported('justifyLeft') && document.execCommand('justifyLeft', false);
      document.execCommand('styleWithCss', false, false);
    }
  },
  {
    id: 'center',
    icon: 'icons/center.svg',
    title: 'Center',
    action: function() {
      document.execCommand('styleWithCss', false, true);
      document.queryCommandSupported('justifyCenter') && document.execCommand('justifyCenter', false);
      document.execCommand('styleWithCss', false, false);
    }
  },
  {
    id: 'right',
    icon: 'icons/right.svg',
    title: 'Right',
    action: function() {
      document.execCommand('styleWithCss', false, true);
      document.queryCommandSupported('justifyRight') && document.execCommand('justifyRight', false);
      document.execCommand('styleWithCss', false, false);
    }
  },
  {
    id: 'justify',
    icon: 'icons/justify.svg',
    title: 'Justify',
    action: function() {
      document.execCommand('styleWithCss', false, true);
      document.queryCommandSupported('justifyFull') && document.execCommand('justifyFull', false);
      document.execCommand('styleWithCss', false, false);
    }
  }
];