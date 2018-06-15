(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.Bvas = factory());
}(this, (function () { 'use strict';

    var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

    /**
     * @description 获取圆的边界
     *
     * @export
     * @param {Object} circle
     * @returns {Array}
     */
    function getCircleBound(circle) {
        var position = circle.position,
            radius = circle.radius;

        var _position = _slicedToArray(position, 2),
            x = _position[0],
            y = _position[1];

        return [[x - radius, y - radius], [x + radius, y + radius]];
    }

    function pointDistance(p1, p2) {
        return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));
    }

    var _slicedToArray$1 = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

    /**
     * @description 判断点是否在矩形内
     *
     * @export
     * @param {Array} p
     * @param {Array} rect
     * @returns {Boolean}
     */
    function isPointInRect(p, rect) {
        var _rect = _slicedToArray$1(rect, 2),
            _rect$ = _slicedToArray$1(_rect[0], 2),
            minX = _rect$[0],
            minY = _rect$[1],
            _rect$2 = _slicedToArray$1(_rect[1], 2),
            maxX = _rect$2[0],
            maxY = _rect$2[1];

        var _p = _slicedToArray$1(p, 2),
            x = _p[0],
            y = _p[1];

        return !(x < minX || x > maxX || y < minY || y > maxY);
    }

    /**
     * @description 判断点是否在圆形内
     *
     * @export
     * @param {Array} p
     * @param {Object} circle
     * @returns {Boolean}
     */
    function isPointInCircle(p, circle) {
        var bound = getCircleBound(circle);
        // console.log(isPointInRect(p, bound))
        if (!isPointInRect(p, bound)) {
            return false;
        }
        if (pointDistance(p, circle.position) > circle.radius) {
            return false;
        } else {
            return true;
        }
    }

    function isPointInShape(p, shape) {
        var type = shape.constructor.name;
        // console.log(type)
        if (type === 'Point') {
            var _shape$$style = shape.$style,
                position = _shape$$style.position,
                size = _shape$$style.size;

            var circle = {
                position: position,
                radius: size
                // console.log(p, circle)
            };return isPointInCircle(p, circle);
        }
    }

    var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    function addClass(el, className) {
        el.classList.add(className);
    }

    var Bvas = function () {
        function Bvas(_ref) {
            var el = _ref.el,
                disableCursor = _ref.disableCursor,
                disableEvents = _ref.disableEvents;

            _classCallCheck(this, Bvas);

            this.$disableCursor = disableCursor;
            this.$disableEvents = disableEvents;
            this.$el = document.querySelector(el);
            this.$canvas = document.createElement('canvas');
            this.$canvas.width = this.$el.offsetWidth;
            this.$canvas.height = this.$el.offsetHeight;
            addClass(this.$el, 'bvas-wrapper');
            addClass(this.$canvas, 'bvas-viewport');
            this.$ctx = this.$canvas.getContext('2d');
            this.$el.append(this.$canvas);
            this.$layers = [];
        }

        _createClass(Bvas, [{
            key: 'addLayer',
            value: function addLayer(layer) {
                var rerender = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

                this.$layers.push(layer);
                if (rerender) {
                    this._render();
                }
            }
        }, {
            key: 'removeLayer',
            value: function removeLayer(layer) {
                var rerender = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

                this.$layers = this.$layers.filter(function (layerI) {
                    return layerI !== layer;
                });
                if (rerender) {
                    this._render();
                }
            }
        }, {
            key: 'clear',
            value: function clear() {
                this.$ctx.clearRect(0, 0, this.$canvas.width, this.$canvas.height);
            }
        }, {
            key: 'getViewport',
            value: function getViewport() {
                return this.$canvas;
            }
        }, {
            key: '_sort',
            value: function _sort() {
                this.$layers.sort(function (a, b) {
                    return a.$style.zIndex - b.$style.zIndex;
                });
            }
        }, {
            key: '_cursor',
            value: function _cursor(e) {
                var cursor = null;
                breakPoint: for (var i = this.$layers.length - 1; i > -1; i--) {
                    var layer = this.$layers[i];
                    for (var j = layer.$shapes.length - 1; j > -1; j--) {
                        var shape = layer.$shapes[j];
                        if (shape.$style.cursor) {
                            if (isPointInShape([e.offsetX, e.offsetY], shape)) {
                                cursor = shape.$style.cursor;
                                break breakPoint;
                            }
                        }
                    }
                }
                this.$canvas.style.cursor = cursor;
            }
        }, {
            key: '_events',
            value: function _events() {
                var _this = this;

                for (var i = this.$layers.length - 1; i > -1; i--) {
                    var layer = this.$layers[i];

                    var _loop = function _loop(j) {
                        var shape = layer.$shapes[j];
                        shape.$events.forEach(function (event) {
                            function func(e) {
                                if (isPointInShape([e.offsetX, e.offsetY], shape)) {
                                    event.fn(shape, e);
                                }
                            }
                            _this.$canvas.removeEventListener(event.evType, func);
                            _this.$canvas.addEventListener(event.evType, func);
                        });
                    };

                    for (var j = layer.$shapes.length - 1; j > -1; j--) {
                        _loop(j);
                    }
                }
            }
        }, {
            key: '_render',
            value: function _render() {
                this.clear();
                this.$layers.forEach(function (layer) {
                    layer._render();
                });
                if (!this.$disableEvents) {
                    this._events();
                }

                if (!this.$disableCursor) {
                    this.$canvas.removeEventListener('mousemove', this._cursor.bind(this));
                    this.$canvas.addEventListener('mousemove', this._cursor.bind(this));
                }
            }
        }]);

        return Bvas;
    }();

    var _createClass$1 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

    function _classCallCheck$1(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    var Layer = function () {
        function Layer() {
            var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
                style = _ref.style,
                props = _ref.props;

            _classCallCheck$1(this, Layer);

            this.$style = style;
            this.$props = props;
            this.$shapes = [];
            this.$bvas = null;
            this.$ctx = null;
            this.$canvas = null;
        }

        _createClass$1(Layer, [{
            key: "addTo",
            value: function addTo(bvas) {
                var rerender = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

                this.$canvas = bvas.$canvas;
                this.$ctx = bvas.$ctx;
                this.$bvas = bvas;
                bvas.addLayer(this, rerender = true);
            }
        }, {
            key: "addShape",
            value: function addShape(shape) {
                var rerender = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

                this.$bvas.removeLayer(this, false);
                this.$shapes.push(shape);
                this.$bvas.addLayer(this, rerender);
            }
        }, {
            key: "removeShape",
            value: function removeShape(shape) {
                var rerender = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

                this.$bvas.removeLayer(this, false);
                this.$shapes = this.$shapes.filter(function (shapeI) {
                    return shapeI !== shape;
                });
                this.$bvas.addLayer(this, rerender);
            }
        }, {
            key: "_sort",
            value: function _sort() {
                this.$shapes.sort(function (a, b) {
                    return a.$style.zIndex - b.$style.zIndex;
                });
            }
        }, {
            key: "_render",
            value: function _render() {
                this._sort();
                this.$shapes.forEach(function (shape) {
                    shape._render();
                });
            }
        }]);

        return Layer;
    }();

    Bvas.Layer = Layer;

    var _createClass$2 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

    function _classCallCheck$2(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    var Point = function () {
        function Point(_ref) {
            var style = _ref.style,
                props = _ref.props;

            _classCallCheck$2(this, Point);

            this.$style = style;
            this.$props = props;
            this.$layer = null;
            this.$ctx = null;
            this.$canvas = null;
            this.$bvas = null;
            this.$events = [];
        }

        _createClass$2(Point, [{
            key: 'addTo',
            value: function addTo(layer) {
                var rerender = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

                this.$canvas = layer.$canvas;
                this.$layer = layer;
                this.$ctx = layer.$ctx;
                this.$bvas = layer.$bvas;
                layer.addShape(this, rerender);
                return this;
            }
        }, {
            key: 'setStyle',
            value: function setStyle(style) {
                var rerender = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

                this.$layer.removeShape(this, false);
                Object.assign(this.$style, style);
                this.$layer.addShape(this, rerender);
                return this;
            }
        }, {
            key: 'on',
            value: function on(evType, fn) {
                var _this = this;

                var func = function func(e) {
                    if (isPointInShape([e.offsetX, e.offsetY], _this)) {
                        fn(_this, e);
                    }
                };
                this.$events.push({
                    evType: evType,
                    func: func,
                    fn: fn
                });
                this.$canvas.addEventListener(evType, func);
                // this.$bvas._events()
            }
        }, {
            key: 'un',
            value: function un(evType, fn) {
                var _this2 = this;

                this.$events = this.$events.filter(function (event) {
                    if (event.evType === evType && event.fn === fn) {
                        _this2.$canvas.removeEventListener(evType, event.func);
                        return true;
                    }
                });
            }
        }, {
            key: 'remove',
            value: function remove() {
                this.$layer.removeShape(this);
            }
        }, {
            key: '_render',
            value: function _render() {
                var _$style = this.$style,
                    position = _$style.position,
                    size = _$style.size,
                    color = _$style.color,
                    cursor = _$style.cursor;

                size = size || 2;
                color = color || '#000';
                this.$ctx.beginPath();
                this.$ctx.arc(position[0], position[1], size, 0, 2 * Math.PI);
                this.$ctx.fillStyle = color;
                this.$ctx.fill();
                this.$ctx.closePath();
            }
        }]);

        return Point;
    }();

    Bvas.Point = Point;

    return Bvas;

})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnZhcy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2pzL3V0aWwvYm91bmQuanMiLCIuLi8uLi9zcmMvanMvdXRpbC9kaXN0YW5jZS5qcyIsIi4uLy4uL3NyYy9qcy91dGlsL2lzUG9pbnRJblNoYXBlLmpzIiwiLi4vLi4vc3JjL2pzL0J2YXMuanMiLCIuLi8uLi9zcmMvanMvbGF5ZXIvTGF5ZXIuanMiLCIuLi8uLi9zcmMvanMvbGF5ZXIvaW5kZXguanMiLCIuLi8uLi9zcmMvanMvc2hhcGUvUG9pbnQuanMiLCIuLi8uLi9zcmMvanMvc2hhcGUvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiXHJcbi8qKlxyXG4gKlxyXG4gKiBAZGVzY3JpcHRpb24g6I635Y+W5Z2Q5qCH5Liy55qE6L6555WMXHJcbiAqIEBleHBvcnRcclxuICogQHBhcmFtIHtBcnJheX0gcG9seVxyXG4gKiBAcmV0dXJucyB7QXJyYXl9XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZ2V0Qm91bmRGcm9tQ29vcmRpbmF0ZXMocG9seSkge1xyXG4gICAgbGV0IG1pblgsIG1pblksIG1heFgsIG1heFlcclxuICAgIGZvcihsZXQgaW5kZXggaW4gcG9seSkge1xyXG4gICAgICAgIGxldCB4ID0gcG9seVtpbmRleF1bMF1cclxuICAgICAgICBsZXQgeSA9IHBvbHlbaW5kZXhdWzFdXHJcbiAgICAgICAgaWYoaW5kZXggPT0gMCkge1xyXG4gICAgICAgICAgICBtaW5YID0gbWF4WCA9IHhcclxuICAgICAgICAgICAgbWluWSA9IG1heFkgPSB5XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbWluWCA9IHggPCBtaW5YID8geCA6IG1pblhcclxuICAgICAgICAgICAgbWF4WCA9IHggPiBtYXhYID8geCA6IG1heFhcclxuICAgICAgICAgICAgbWluWSA9IHkgPCBtaW5ZID8geSA6IG1pbllcclxuICAgICAgICAgICAgbWF4WSA9IHkgPiBtYXhZID8geSA6IG1heFlcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gW1ttaW5YLCBtaW5ZXSwgW21heFgsIG1heFldXVxyXG59XHJcblxyXG4vKipcclxuICogQGRlc2NyaXB0aW9uIOiOt+WPluWchueahOi+ueeVjFxyXG4gKlxyXG4gKiBAZXhwb3J0XHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBjaXJjbGVcclxuICogQHJldHVybnMge0FycmF5fVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGdldENpcmNsZUJvdW5kKGNpcmNsZSkge1xyXG4gICAgbGV0IHtwb3NpdGlvbiwgcmFkaXVzfSA9IGNpcmNsZVxyXG4gICAgbGV0IFt4LCB5XSA9IHBvc2l0aW9uXHJcbiAgICByZXR1cm4gW1t4IC0gcmFkaXVzLCB5IC0gcmFkaXVzXSwgW3ggKyByYWRpdXMsIHkgKyByYWRpdXNdXVxyXG59IiwiZXhwb3J0IGZ1bmN0aW9uIHBvaW50RGlzdGFuY2UocDEsIHAyKSB7XHJcbiAgICByZXR1cm4gTWF0aC5zcXJ0KChwMVswXSAtIHAyWzBdKSoqMiArIChwMVsxXSAtIHAyWzFdKSoqMilcclxufSIsImltcG9ydCB7Z2V0Qm91bmRGcm9tQ29vcmRpbmF0ZXMsIGdldENpcmNsZUJvdW5kfSBmcm9tICcuL2JvdW5kJ1xyXG5cclxuaW1wb3J0IHtwb2ludERpc3RhbmNlfSBmcm9tICcuL2Rpc3RhbmNlJ1xyXG5cclxuLy8gaHR0cDovL3d3dy5odG1sLWpzLmNvbS9hcnRpY2xlLzE1MjhcclxuXHJcbi8qKlxyXG4gKiBAZGVzY3JpcHRpb24g5bCE57q/5rOV5Yik5pat54K55piv5ZCm5Zyo5aSa6L655b2i5YaF6YOoXHJcbiAqIEBwYXJhbSB7QXJyYXl9IHAg5b6F5Yik5pat55qE54K577yM5qC85byP77yaW1jlnZDmoIcsIFnlnZDmoIcgXVxyXG4gKiBAcGFyYW0ge0FycmF5fSBwb2x5IOWkmui+ueW9oumhtueCue+8jOaVsOe7hOaIkOWRmOeahOagvOW8j+WQjCBwXHJcbiAqIEByZXR1cm4ge0Jvb2xlYW59IOeCuSBwIOaYr+WQpuWkmui+ueW9oiBwb2x5IOWGhemDqFxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGlzUG9pbnRJblBvbHlnb24ocCwgcG9seSkge1xyXG4gICAgbGV0IHB4ID0gcFswXSxcclxuICAgICAgICBweSA9IHBbMV0sXHJcbiAgICAgICAgZmxhZyA9IGZhbHNlXHJcbiAgICBmb3IgKGxldCBpID0gMCwgbCA9IHBvbHkubGVuZ3RoLCBqID0gbCAtIDE7IGkgPCBsOyBqID0gaSwgaSsrKSB7XHJcbiAgICAgICAgbGV0IHN4ID0gcG9seVtpXVswXSxcclxuICAgICAgICAgICAgc3kgPSBwb2x5W2ldWzFdLFxyXG4gICAgICAgICAgICB0eCA9IHBvbHlbal1bMF0sXHJcbiAgICAgICAgICAgIHR5ID0gcG9seVtqXVsxXVxyXG4gICAgICAgIC8vIOeCueS4juWkmui+ueW9oumhtueCuemHjeWQiFxyXG4gICAgICAgIGlmICgoc3ggPT09IHB4ICYmIHN5ID09PSBweSkgfHwgKHR4ID09PSBweCAmJiB0eSA9PT0gcHkpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAnb24nXHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIOWIpOaWree6v+auteS4pOerr+eCueaYr+WQpuWcqOWwhOe6v+S4pOS+p1xyXG4gICAgICAgIGlmICgoc3kgPCBweSAmJiB0eSA+PSBweSkgfHwgKHN5ID49IHB5ICYmIHR5IDwgcHkpKSB7XHJcbiAgICAgICAgICAgIC8vIOe6v+auteS4iuS4juWwhOe6vyBZIOWdkOagh+ebuOWQjOeahOeCueeahCBYIOWdkOagh1xyXG4gICAgICAgICAgICBsZXQgeCA9IHN4ICsgKHB5IC0gc3kpICogKHR4IC0gc3gpIC8gKHR5IC0gc3kpXHJcbiAgICAgICAgICAgIC8vIOeCueWcqOWkmui+ueW9oueahOi+ueS4ilxyXG4gICAgICAgICAgICBpZiAoeCA9PT0gcHgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAnb24nXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8g5bCE57q/56m/6L+H5aSa6L655b2i55qE6L6555WMXHJcbiAgICAgICAgICAgIGlmICh4ID4gcHgpIHtcclxuICAgICAgICAgICAgICAgIGZsYWcgPSAhZmxhZ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8g5bCE57q/56m/6L+H5aSa6L655b2i6L6555WM55qE5qyh5pWw5Li65aWH5pWw5pe254K55Zyo5aSa6L655b2i5YaFXHJcbiAgICByZXR1cm4gZmxhZ1xyXG59XHJcblxyXG4vKipcclxuICogQGRlc2NyaXB0aW9uIOWIpOaWreeCueaYr+WQpuWcqOefqeW9ouWGhVxyXG4gKlxyXG4gKiBAZXhwb3J0XHJcbiAqIEBwYXJhbSB7QXJyYXl9IHBcclxuICogQHBhcmFtIHtBcnJheX0gcmVjdFxyXG4gKiBAcmV0dXJucyB7Qm9vbGVhbn1cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBpc1BvaW50SW5SZWN0KHAsIHJlY3QpIHtcclxuICAgIGxldCBbXHJcbiAgICAgICAgW1xyXG4gICAgICAgICAgICBtaW5YLCBtaW5ZXHJcbiAgICAgICAgXSxcclxuICAgICAgICBbbWF4WCwgbWF4WV1cclxuICAgIF0gPSByZWN0XHJcbiAgICBsZXQgW3gsXHJcbiAgICAgICAgeV0gPSBwXHJcbiAgICByZXR1cm4gISh4IDwgbWluWCB8fCB4ID4gbWF4WCB8fCB5IDwgbWluWSB8fCB5ID4gbWF4WSlcclxufVxyXG5cclxuLyoqXHJcbiAqIEBkZXNjcmlwdGlvbiDliKTmlq3ngrnmmK/lkKblnKjnur/mrrXkuIpcclxuICpcclxuICogQGV4cG9ydFxyXG4gKiBAcGFyYW0ge0FycmF5fSBwXHJcbiAqIEBwYXJhbSB7QXJyYXl9IGxpbmVcclxuICogQHJldHVybnNcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBpc1BvaW50T25MaW5lKHAsIGxpbmUpIHtcclxuICAgIGxldCBib3VuZCA9IGdldEJvdW5kRnJvbUNvb3JkaW5hdGVzKGxpbmUpXHJcbiAgICBpZiAoIWlzUG9pbnRJblJlY3QocCwgYm91bmQpKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICB9XHJcbiAgICBsZXQgW3gsXHJcbiAgICAgICAgeV0gPSBwXHJcbiAgICBsZXQgW1xyXG4gICAgICAgIFtcclxuICAgICAgICAgICAgbWluWCwgbWluWVxyXG4gICAgICAgIF0sXHJcbiAgICAgICAgW21heFgsIG1heFldXHJcbiAgICBdID0gYm91bmRcclxuICAgIGlmICgoeSAtIG1pblkpIC8gKHggLSBtaW5YKSA9PT0gKG1heFkgLSB5KSAvIChtYXhYIC0geCkpIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEBkZXNjcmlwdGlvbiDliKTmlq3ngrnmmK/lkKblnKhwb2x5bGluZVxyXG4gKiBAcGFyYW0ge0FycmF5fSBwIOW+heWIpOaWreeahOeCue+8jOagvOW8j++8mnsgeDogWOWdkOaghywgeTogWeWdkOaghyB9XHJcbiAqIEBwYXJhbSB7QXJyYXl9IHBvbHkg5aSa6L655b2i6aG254K577yM5pWw57uE5oiQ5ZGY55qE5qC85byP5ZCMIHBcclxuICogQHJldHVybiB7Qm9vbGVhbn0g54K5IHAg5ZKM5aSa6L655b2iIHBvbHkg55qE5Yeg5L2V5YWz57O7XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gaXNQb2ludE9uUG9seUxpbmUocCwgcG9seSkge1xyXG4gICAgbGV0IGJvdW5kID0gZ2V0Qm91bmRGcm9tQ29vcmRpbmF0ZXMocG9seSlcclxuICAgIGlmICghaXNQb2ludEluUmVjdChwLCBib3VuZCkpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgIH1cclxuICAgIGxldCBmbGFnID0gZmFsc2VcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcG9seS5sZW5ndGggLSAxOyBpKyspIHtcclxuICAgICAgICBpZiAoaXNQb2ludE9uTGluZShwLCBbXHJcbiAgICAgICAgICAgIHBvbHlbaV0sXHJcbiAgICAgICAgICAgIHBvbHlbaSArIDFdXHJcbiAgICAgICAgXSkpIHtcclxuICAgICAgICAgICAgZmxhZyA9IHRydWVcclxuICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmxhZ1xyXG59XHJcblxyXG4vKipcclxuICogQGRlc2NyaXB0aW9uIOWIpOaWreeCueaYr+WQpuWcqOWchuW9ouWGhVxyXG4gKlxyXG4gKiBAZXhwb3J0XHJcbiAqIEBwYXJhbSB7QXJyYXl9IHBcclxuICogQHBhcmFtIHtPYmplY3R9IGNpcmNsZVxyXG4gKiBAcmV0dXJucyB7Qm9vbGVhbn1cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBpc1BvaW50SW5DaXJjbGUocCwgY2lyY2xlKSB7XHJcbiAgICBsZXQgYm91bmQgPSBnZXRDaXJjbGVCb3VuZChjaXJjbGUpXHJcbiAgICAvLyBjb25zb2xlLmxvZyhpc1BvaW50SW5SZWN0KHAsIGJvdW5kKSlcclxuICAgIGlmICghaXNQb2ludEluUmVjdChwLCBib3VuZCkpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgIH1cclxuICAgIGlmIChwb2ludERpc3RhbmNlKHAsIGNpcmNsZS5wb3NpdGlvbikgPiBjaXJjbGUucmFkaXVzKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiB0cnVlXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpc1BvaW50SW5TaGFwZShwLCBzaGFwZSkge1xyXG4gICAgbGV0IHR5cGUgPSBzaGFwZS5jb25zdHJ1Y3Rvci5uYW1lXHJcbiAgICAvLyBjb25zb2xlLmxvZyh0eXBlKVxyXG4gICAgaWYgKHR5cGUgPT09ICdQb2ludCcpIHtcclxuICAgICAgICBsZXQge3Bvc2l0aW9uLCBzaXplfSA9IHNoYXBlLiRzdHlsZVxyXG4gICAgICAgIGxldCBjaXJjbGUgPSB7XHJcbiAgICAgICAgICAgIHBvc2l0aW9uLFxyXG4gICAgICAgICAgICByYWRpdXM6IHNpemVcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2cocCwgY2lyY2xlKVxyXG4gICAgICAgIHJldHVybiBpc1BvaW50SW5DaXJjbGUocCwgY2lyY2xlKVxyXG4gICAgfVxyXG59IiwiaW1wb3J0IHtpc1BvaW50SW5TaGFwZX0gZnJvbSAnLi91dGlsL2lzUG9pbnRJblNoYXBlJ1xyXG5cclxuZnVuY3Rpb24gYWRkQ2xhc3MoZWwsIGNsYXNzTmFtZSkge1xyXG4gICAgZWxcclxuICAgICAgICAuY2xhc3NMaXN0XHJcbiAgICAgICAgLmFkZChjbGFzc05hbWUpXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJ2YXMge1xyXG4gICAgY29uc3RydWN0b3Ioe2VsLCBkaXNhYmxlQ3Vyc29yLCBkaXNhYmxlRXZlbnRzfSkge1xyXG4gICAgICAgIHRoaXMuJGRpc2FibGVDdXJzb3IgPSBkaXNhYmxlQ3Vyc29yXHJcbiAgICAgICAgdGhpcy4kZGlzYWJsZUV2ZW50cyA9IGRpc2FibGVFdmVudHNcclxuICAgICAgICB0aGlzLiRlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZWwpXHJcbiAgICAgICAgdGhpcy4kY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJylcclxuICAgICAgICB0aGlzLiRjYW52YXMud2lkdGggPSB0aGlzLiRlbC5vZmZzZXRXaWR0aFxyXG4gICAgICAgIHRoaXMuJGNhbnZhcy5oZWlnaHQgPSB0aGlzLiRlbC5vZmZzZXRIZWlnaHRcclxuICAgICAgICBhZGRDbGFzcyh0aGlzLiRlbCwgJ2J2YXMtd3JhcHBlcicpXHJcbiAgICAgICAgYWRkQ2xhc3ModGhpcy4kY2FudmFzLCAnYnZhcy12aWV3cG9ydCcpXHJcbiAgICAgICAgdGhpcy4kY3R4ID0gdGhpc1xyXG4gICAgICAgICAgICAuJGNhbnZhc1xyXG4gICAgICAgICAgICAuZ2V0Q29udGV4dCgnMmQnKVxyXG4gICAgICAgIHRoaXNcclxuICAgICAgICAgICAgLiRlbFxyXG4gICAgICAgICAgICAuYXBwZW5kKHRoaXMuJGNhbnZhcylcclxuICAgICAgICB0aGlzLiRsYXllcnMgPSBbXVxyXG4gICAgfVxyXG4gICAgYWRkTGF5ZXIobGF5ZXIsIHJlcmVuZGVyID0gdHJ1ZSkge1xyXG4gICAgICAgIHRoaXNcclxuICAgICAgICAgICAgLiRsYXllcnNcclxuICAgICAgICAgICAgLnB1c2gobGF5ZXIpXHJcbiAgICAgICAgaWYocmVyZW5kZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5fcmVuZGVyKClcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZW1vdmVMYXllcihsYXllciwgcmVyZW5kZXIgPSB0cnVlKSB7XHJcbiAgICAgICAgdGhpcy4kbGF5ZXJzID0gdGhpcy4kbGF5ZXJzLmZpbHRlcihsYXllckkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gbGF5ZXJJICE9PSBsYXllclxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgaWYocmVyZW5kZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5fcmVuZGVyKClcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBjbGVhcigpIHtcclxuICAgICAgICB0aGlzXHJcbiAgICAgICAgICAgIC4kY3R4XHJcbiAgICAgICAgICAgIC5jbGVhclJlY3QoMCwgMCwgdGhpcy4kY2FudmFzLndpZHRoLCB0aGlzLiRjYW52YXMuaGVpZ2h0KVxyXG4gICAgfVxyXG4gICAgZ2V0Vmlld3BvcnQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuJGNhbnZhc1xyXG4gICAgfVxyXG4gICAgX3NvcnQoKSB7XHJcbiAgICAgICAgdGhpc1xyXG4gICAgICAgICAgICAuJGxheWVyc1xyXG4gICAgICAgICAgICAuc29ydCgoYSwgYikgPT4gYS4kc3R5bGUuekluZGV4IC0gYi4kc3R5bGUuekluZGV4KVxyXG4gICAgfVxyXG4gICAgX2N1cnNvcihlKSB7XHJcbiAgICAgICAgbGV0IGN1cnNvciA9IG51bGxcclxuICAgICAgICBicmVha1BvaW50OlxyXG4gICAgICAgIGZvcihsZXQgaSA9IHRoaXMuJGxheWVycy5sZW5ndGggLSAxOyBpID4gLTE7IGktLSkge1xyXG4gICAgICAgICAgICBsZXQgbGF5ZXIgPSB0aGlzLiRsYXllcnNbaV1cclxuICAgICAgICAgICAgZm9yKGxldCBqID0gbGF5ZXIuJHNoYXBlcy5sZW5ndGggLSAxOyBqID4gLTE7IGotLSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHNoYXBlID0gbGF5ZXIuJHNoYXBlc1tqXVxyXG4gICAgICAgICAgICAgICAgaWYoc2hhcGUuJHN0eWxlLmN1cnNvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGlzUG9pbnRJblNoYXBlKFtlLm9mZnNldFgsIGUub2Zmc2V0WV0sIHNoYXBlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJzb3IgPSBzaGFwZS4kc3R5bGUuY3Vyc29yXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrIGJyZWFrUG9pbnRcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy4kY2FudmFzLnN0eWxlLmN1cnNvciA9IGN1cnNvclxyXG4gICAgfVxyXG4gICAgX2V2ZW50cygpIHtcclxuICAgICAgICBmb3IobGV0IGkgPSB0aGlzLiRsYXllcnMubGVuZ3RoIC0gMTsgaSA+IC0xOyBpLS0pIHtcclxuICAgICAgICAgICAgbGV0IGxheWVyID0gdGhpcy4kbGF5ZXJzW2ldXHJcbiAgICAgICAgICAgIGZvcihsZXQgaiA9IGxheWVyLiRzaGFwZXMubGVuZ3RoIC0gMTsgaiA+IC0xOyBqLS0pIHtcclxuICAgICAgICAgICAgICAgIGxldCBzaGFwZSA9IGxheWVyLiRzaGFwZXNbal1cclxuICAgICAgICAgICAgICAgIHNoYXBlLiRldmVudHMuZm9yRWFjaChldmVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gZnVuYyhlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGlzUG9pbnRJblNoYXBlKFtlLm9mZnNldFgsIGUub2Zmc2V0WV0sIHNoYXBlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQuZm4oc2hhcGUsIGUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy4kY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQuZXZUeXBlLCBmdW5jKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuJGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKGV2ZW50LmV2VHlwZSwgZnVuYylcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIF9yZW5kZXIoKSB7XHJcbiAgICAgICAgdGhpcy5jbGVhcigpXHJcbiAgICAgICAgdGhpcy4kbGF5ZXJzLmZvckVhY2gobGF5ZXIgPT4ge1xyXG4gICAgICAgICAgICBsYXllci5fcmVuZGVyKClcclxuICAgICAgICB9KVxyXG4gICAgICAgIGlmKCF0aGlzLiRkaXNhYmxlRXZlbnRzKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2V2ZW50cygpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGlmKCF0aGlzLiRkaXNhYmxlQ3Vyc29yKSB7XHJcbiAgICAgICAgICAgIHRoaXMuJGNhbnZhcy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLl9jdXJzb3IuYmluZCh0aGlzKSlcclxuICAgICAgICAgICAgdGhpcy4kY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMuX2N1cnNvci5iaW5kKHRoaXMpKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIExheWVyIHtcclxuICAgIGNvbnN0cnVjdG9yKHtzdHlsZSwgcHJvcHN9ID0ge30pIHtcclxuICAgICAgICB0aGlzLiRzdHlsZSA9IHN0eWxlXHJcbiAgICAgICAgdGhpcy4kcHJvcHMgPSBwcm9wc1xyXG4gICAgICAgIHRoaXMuJHNoYXBlcyA9IFtdXHJcbiAgICAgICAgdGhpcy4kYnZhcyA9IG51bGxcclxuICAgICAgICB0aGlzLiRjdHggPSBudWxsXHJcbiAgICAgICAgdGhpcy4kY2FudmFzID0gbnVsbFxyXG4gICAgfVxyXG4gICAgYWRkVG8oYnZhcywgcmVyZW5kZXIgPSB0cnVlKSB7XHJcbiAgICAgICAgdGhpcy4kY2FudmFzID0gYnZhcy4kY2FudmFzXHJcbiAgICAgICAgdGhpcy4kY3R4ID0gYnZhcy4kY3R4XHJcbiAgICAgICAgdGhpcy4kYnZhcyA9IGJ2YXNcclxuICAgICAgICBidmFzLmFkZExheWVyKHRoaXMsIHJlcmVuZGVyID0gdHJ1ZSlcclxuICAgIH1cclxuICAgIGFkZFNoYXBlKHNoYXBlLCByZXJlbmRlciA9IHRydWUpIHtcclxuICAgICAgICB0aGlzLiRidmFzLnJlbW92ZUxheWVyKHRoaXMsIGZhbHNlKVxyXG4gICAgICAgIHRoaXNcclxuICAgICAgICAgICAgLiRzaGFwZXNcclxuICAgICAgICAgICAgLnB1c2goc2hhcGUpXHJcbiAgICAgICAgdGhpcy4kYnZhcy5hZGRMYXllcih0aGlzLCByZXJlbmRlcilcclxuICAgIH1cclxuICAgIHJlbW92ZVNoYXBlKHNoYXBlLCByZXJlbmRlciA9IHRydWUpIHtcclxuICAgICAgICB0aGlzLiRidmFzLnJlbW92ZUxheWVyKHRoaXMsIGZhbHNlKVxyXG4gICAgICAgIHRoaXMuJHNoYXBlcyA9IHRoaXMuJHNoYXBlcy5maWx0ZXIoc2hhcGVJID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHNoYXBlSSAhPT0gc2hhcGVcclxuICAgICAgICB9KVxyXG4gICAgICAgIHRoaXMuJGJ2YXMuYWRkTGF5ZXIodGhpcywgcmVyZW5kZXIpXHJcbiAgICB9XHJcbiAgICBfc29ydCgpIHtcclxuICAgICAgICB0aGlzXHJcbiAgICAgICAgICAgIC4kc2hhcGVzXHJcbiAgICAgICAgICAgIC5zb3J0KChhLCBiKSA9PiBhLiRzdHlsZS56SW5kZXggLSBiLiRzdHlsZS56SW5kZXgpXHJcbiAgICB9XHJcbiAgICBfcmVuZGVyKCkge1xyXG4gICAgICAgIHRoaXMuX3NvcnQoKVxyXG4gICAgICAgIHRoaXNcclxuICAgICAgICAgICAgLiRzaGFwZXNcclxuICAgICAgICAgICAgLmZvckVhY2goc2hhcGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgc2hhcGUuX3JlbmRlcigpXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgQnZhcyBmcm9tICcuLi9CdmFzJ1xyXG5cclxuaW1wb3J0IExheWVyIGZyb20gJy4vTGF5ZXInXHJcblxyXG5CdmFzLkxheWVyID0gTGF5ZXIiLCIvLyBpbXBvcnQge3BvaW50RGlzdGFuY2V9IGZyb20gJy4uL3V0aWwvZGlzdGFuY2UnXHJcbmltcG9ydCB7aXNQb2ludEluU2hhcGV9IGZyb20gJy4uL3V0aWwvaXNQb2ludEluU2hhcGUnXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQb2ludCB7XHJcbiAgICBjb25zdHJ1Y3Rvcih7c3R5bGUsIHByb3BzfSkge1xyXG4gICAgICAgIHRoaXMuJHN0eWxlID0gc3R5bGVcclxuICAgICAgICB0aGlzLiRwcm9wcyA9IHByb3BzXHJcbiAgICAgICAgdGhpcy4kbGF5ZXIgPSBudWxsXHJcbiAgICAgICAgdGhpcy4kY3R4ID0gbnVsbFxyXG4gICAgICAgIHRoaXMuJGNhbnZhcyA9IG51bGxcclxuICAgICAgICB0aGlzLiRidmFzID0gbnVsbFxyXG4gICAgICAgIHRoaXMuJGV2ZW50cyA9IFtdXHJcbiAgICB9XHJcbiAgICBhZGRUbyhsYXllciwgcmVyZW5kZXIgPSB0cnVlKSB7XHJcbiAgICAgICAgdGhpcy4kY2FudmFzID0gbGF5ZXIuJGNhbnZhc1xyXG4gICAgICAgIHRoaXMuJGxheWVyID0gbGF5ZXJcclxuICAgICAgICB0aGlzLiRjdHggPSBsYXllci4kY3R4XHJcbiAgICAgICAgdGhpcy4kYnZhcyA9IGxheWVyLiRidmFzXHJcbiAgICAgICAgbGF5ZXIuYWRkU2hhcGUodGhpcywgcmVyZW5kZXIpXHJcbiAgICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuICAgIHNldFN0eWxlKHN0eWxlLCByZXJlbmRlciA9IHRydWUpIHtcclxuICAgICAgICB0aGlzXHJcbiAgICAgICAgICAgIC4kbGF5ZXJcclxuICAgICAgICAgICAgLnJlbW92ZVNoYXBlKHRoaXMsIGZhbHNlKVxyXG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcy4kc3R5bGUsIHN0eWxlKVxyXG4gICAgICAgIHRoaXNcclxuICAgICAgICAgICAgLiRsYXllclxyXG4gICAgICAgICAgICAuYWRkU2hhcGUodGhpcywgcmVyZW5kZXIpXHJcbiAgICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuICAgIG9uKGV2VHlwZSwgZm4pIHtcclxuICAgICAgICBsZXQgZnVuYyA9IChlKSA9PiB7XHJcbiAgICAgICAgICAgIGlmKGlzUG9pbnRJblNoYXBlKFtlLm9mZnNldFgsIGUub2Zmc2V0WV0sIHRoaXMpKSB7XHJcbiAgICAgICAgICAgICAgICBmbih0aGlzLCBlKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuJGV2ZW50cy5wdXNoKHtcclxuICAgICAgICAgICAgZXZUeXBlLFxyXG4gICAgICAgICAgICBmdW5jLFxyXG4gICAgICAgICAgICBmblxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgdGhpcy4kY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoZXZUeXBlLCBmdW5jKVxyXG4gICAgICAgIC8vIHRoaXMuJGJ2YXMuX2V2ZW50cygpXHJcbiAgICB9XHJcbiAgICB1bihldlR5cGUsIGZuKSB7XHJcbiAgICAgICAgdGhpcy4kZXZlbnRzID0gdGhpcy4kZXZlbnRzLmZpbHRlcihldmVudCA9PiB7XHJcbiAgICAgICAgICAgIGlmKGV2ZW50LmV2VHlwZSA9PT0gZXZUeXBlICYmIGV2ZW50LmZuID09PSBmbikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy4kY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZUeXBlLCBldmVudC5mdW5jKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbiAgICByZW1vdmUoKSB7XHJcbiAgICAgICAgdGhpc1xyXG4gICAgICAgICAgICAuJGxheWVyXHJcbiAgICAgICAgICAgIC5yZW1vdmVTaGFwZSh0aGlzKVxyXG4gICAgfVxyXG4gICAgX3JlbmRlcigpIHtcclxuICAgICAgICBsZXQge3Bvc2l0aW9uLCBzaXplLCBjb2xvciwgY3Vyc29yfSA9IHRoaXMuJHN0eWxlXHJcbiAgICAgICAgc2l6ZSA9IHNpemUgfHwgMlxyXG4gICAgICAgIGNvbG9yID0gY29sb3IgfHwgJyMwMDAnXHJcbiAgICAgICAgdGhpc1xyXG4gICAgICAgICAgICAuJGN0eFxyXG4gICAgICAgICAgICAuYmVnaW5QYXRoKClcclxuICAgICAgICB0aGlzXHJcbiAgICAgICAgICAgIC4kY3R4XHJcbiAgICAgICAgICAgIC5hcmMocG9zaXRpb25bMF0sIHBvc2l0aW9uWzFdLCBzaXplLCAwLCAyICogTWF0aC5QSSk7XHJcbiAgICAgICAgdGhpcy4kY3R4LmZpbGxTdHlsZSA9IGNvbG9yXHJcbiAgICAgICAgdGhpc1xyXG4gICAgICAgICAgICAuJGN0eFxyXG4gICAgICAgICAgICAuZmlsbCgpXHJcbiAgICAgICAgdGhpc1xyXG4gICAgICAgICAgICAuJGN0eFxyXG4gICAgICAgICAgICAuY2xvc2VQYXRoKClcclxuICAgIH1cclxufSIsImltcG9ydCBCdmFzIGZyb20gJy4uL0J2YXMnXHJcblxyXG5pbXBvcnQgUG9pbnQgZnJvbSAnLi9Qb2ludCdcclxuXHJcblxyXG5CdmFzLlBvaW50ID0gUG9pbnQiXSwibmFtZXMiOlsiZ2V0Q2lyY2xlQm91bmQiLCJjaXJjbGUiLCJwb3NpdGlvbiIsInJhZGl1cyIsIngiLCJ5IiwicG9pbnREaXN0YW5jZSIsInAxIiwicDIiLCJNYXRoIiwic3FydCIsImlzUG9pbnRJblJlY3QiLCJwIiwicmVjdCIsIm1pblgiLCJtaW5ZIiwibWF4WCIsIm1heFkiLCJpc1BvaW50SW5DaXJjbGUiLCJib3VuZCIsImlzUG9pbnRJblNoYXBlIiwic2hhcGUiLCJ0eXBlIiwiY29uc3RydWN0b3IiLCJuYW1lIiwiJHN0eWxlIiwic2l6ZSIsImFkZENsYXNzIiwiZWwiLCJjbGFzc05hbWUiLCJjbGFzc0xpc3QiLCJhZGQiLCJCdmFzIiwiZGlzYWJsZUN1cnNvciIsImRpc2FibGVFdmVudHMiLCIkZGlzYWJsZUN1cnNvciIsIiRkaXNhYmxlRXZlbnRzIiwiJGVsIiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiJGNhbnZhcyIsImNyZWF0ZUVsZW1lbnQiLCJ3aWR0aCIsIm9mZnNldFdpZHRoIiwiaGVpZ2h0Iiwib2Zmc2V0SGVpZ2h0IiwiJGN0eCIsImdldENvbnRleHQiLCJhcHBlbmQiLCIkbGF5ZXJzIiwibGF5ZXIiLCJyZXJlbmRlciIsInB1c2giLCJfcmVuZGVyIiwiZmlsdGVyIiwibGF5ZXJJIiwiY2xlYXJSZWN0Iiwic29ydCIsImEiLCJiIiwiekluZGV4IiwiZSIsImN1cnNvciIsImJyZWFrUG9pbnQiLCJpIiwibGVuZ3RoIiwiaiIsIiRzaGFwZXMiLCJvZmZzZXRYIiwib2Zmc2V0WSIsInN0eWxlIiwiJGV2ZW50cyIsImZvckVhY2giLCJmdW5jIiwiZXZlbnQiLCJmbiIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJldlR5cGUiLCJhZGRFdmVudExpc3RlbmVyIiwiY2xlYXIiLCJfZXZlbnRzIiwiX2N1cnNvciIsImJpbmQiLCJMYXllciIsInByb3BzIiwiJHByb3BzIiwiJGJ2YXMiLCJidmFzIiwiYWRkTGF5ZXIiLCJyZW1vdmVMYXllciIsInNoYXBlSSIsIl9zb3J0IiwiUG9pbnQiLCIkbGF5ZXIiLCJhZGRTaGFwZSIsInJlbW92ZVNoYXBlIiwiT2JqZWN0IiwiYXNzaWduIiwiY29sb3IiLCJiZWdpblBhdGgiLCJhcmMiLCJQSSIsImZpbGxTdHlsZSIsImZpbGwiLCJjbG9zZVBhdGgiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0lBMEJBOzs7Ozs7O0FBT0EsSUFBTyxTQUFTQSxjQUFULENBQXdCQyxNQUF4QixFQUFnQztJQUFBLFFBQzlCQyxRQUQ4QixHQUNWRCxNQURVLENBQzlCQyxRQUQ4QjtJQUFBLFFBQ3BCQyxNQURvQixHQUNWRixNQURVLENBQ3BCRSxNQURvQjs7SUFBQSxtQ0FFdEJELFFBRnNCO0lBQUEsUUFFOUJFLENBRjhCO0lBQUEsUUFFM0JDLENBRjJCOztJQUduQyxXQUFPLENBQUMsQ0FBQ0QsSUFBSUQsTUFBTCxFQUFhRSxJQUFJRixNQUFqQixDQUFELEVBQTJCLENBQUNDLElBQUlELE1BQUwsRUFBYUUsSUFBSUYsTUFBakIsQ0FBM0IsQ0FBUDtJQUNIOztJQ3JDTSxTQUFTRyxhQUFULENBQXVCQyxFQUF2QixFQUEyQkMsRUFBM0IsRUFBK0I7SUFDbEMsV0FBT0MsS0FBS0MsSUFBTCxDQUFVLFNBQUNILEdBQUcsQ0FBSCxJQUFRQyxHQUFHLENBQUgsQ0FBVCxFQUFpQixDQUFqQixhQUFzQkQsR0FBRyxDQUFILElBQVFDLEdBQUcsQ0FBSCxDQUE5QixFQUFzQyxDQUF0QyxDQUFWLENBQVA7SUFDSDs7OztJQ3lDRDs7Ozs7Ozs7QUFRQSxJQUFPLFNBQVNHLGFBQVQsQ0FBdUJDLENBQXZCLEVBQTBCQyxJQUExQixFQUFnQztJQUFBLGlDQU0vQkEsSUFOK0I7SUFBQTtJQUFBLFFBRzNCQyxJQUgyQjtJQUFBLFFBR3JCQyxJQUhxQjtJQUFBO0lBQUEsUUFLOUJDLElBTDhCO0lBQUEsUUFLeEJDLElBTHdCOztJQUFBLDhCQVExQkwsQ0FSMEI7SUFBQSxRQU85QlIsQ0FQOEI7SUFBQSxRQVEvQkMsQ0FSK0I7O0lBU25D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
