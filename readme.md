## Description
Bvas.js is a framework that makes it easy to work with HTML5 canvas element. It is an interactive object model on top of canvas element.  

![bvas](./screen_shots/welcome.png)  

Using Bvas.js, you can create and populate objects on canvas; objects like simple geometrical shapes — rectangles, circles, polygons. You can modify their properties — color, z-index, cursor, etc. You can also bind custom event like click, mouseover, mousemove, etc. Just like DOM in HTML!

## Use
* insert into head tag
```html
<script src='https://raw.githubusercontent.com/bougieL/bvas/master/dist/js/bvas.min.js'></script>
```
or
* import in commonJs/ES6 module
```bash
npm i bvas -S
```
```javascript
const Bvas = require('bvas')
```
```javascript
import Bvas from './js/bvas.min.js'
```

## Quick start
```html
<!DOCTYPE html>
<html>
<head>
</head>
<body>
    <div id="box" style='width: 300px; height: 300px;'></div>
    <script src="dist/bvas.js"></script>
    <script>
        let bvas = new Bvas({el: '#box'})
        let layer = new Bvas.Layer().addTo(bvas)
        let circle = new Bvas.Circle({
            style: {
                position: [50, 50],
                radius: 50,
                cursor: 'pointer'
            }
        }).addTo(layer)
    </script>
</body>
</html>
```

## Documentation
```java
// TODO
```