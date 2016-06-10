# Kent

Simple rich text editor

![alt text](screenshot.png "Kent Editor")

## Installation

Copy `public` folder in your site and put `icons` in your root folder.

## Usage

```html
  <div id="editor-1"><%= raw @post.content %></div>
  <script>
    var editor = new KentEditor({
      element: document.querySelector('#editor-1')
    });
  </script>
```

## Events

* `kent:change`: Fired after user changes editor's content.

## Browser support

Tested in:

* Google Chrome
* Mozilla Firefox
* Apple Safari
* Opera

## License

MIT License. Copyright 2016 Gustavo Leon. http://github.com/hpneo

Permission is hereby granted, free of charge, to any
person obtaining a copy of this software and associated
documentation files (the "Software"), to deal in the
Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the
Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice
shall be included in all copies or substantial portions of
the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY
KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS
OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.