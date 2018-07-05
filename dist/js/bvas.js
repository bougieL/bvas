(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.Bvas = factory());
}(this, (function () { 'use strict';

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var inherits = function (subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  };

  var possibleConstructorReturn = function (self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  };

  var slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  var toConsumableArray = function (arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    } else {
      return Array.from(arr);
    }
  };

  // import {isPointInShape} from './util/isPointInShape'

  function addClass(el, className) {
      el.classList.add(className);
  }

  var Bvas = function () {
      function Bvas(_ref) {
          var el = _ref.el,
              disableCursor = _ref.disableCursor,
              disableEvents = _ref.disableEvents;
          classCallCheck(this, Bvas);

          this.$el = document.querySelector(el);
          this.$canvas = document.createElement('canvas');
          this.$canvas.width = this.$el.offsetWidth;
          this.$canvas.height = this.$el.offsetHeight;
          addClass(this.$el, 'bvas-wrapper');
          addClass(this.$canvas, 'bvas-viewport');
          this.$ctx = this.$canvas.getContext('2d');
          this.$el.append(this.$canvas);
          this.$layers = [];
          if (!disableCursor) {
              this.$canvas.addEventListener('mousemove', this._cursor.bind(this));
          }
      }

      createClass(Bvas, [{
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
              var _this = this;

              this.clear();
              var cursor = null;
              // breakPoint:
              // for(let i = this.$layers.length - 1; i > -1; i--) {
              //     let layer = this.$layers[i]
              //     for(let j = layer.$shapes.length - 1; j > -1; j--) {
              //         let shape = layer.$shapes[j]
              //         if(shape.$style.cursor) {
              //             if(isPointInShape([e.offsetX, e.offsetY], shape)) {
              //                 cursor = shape.$style.cursor
              //                 break breakPoint
              //             }
              //         }
              //     }
              // }
              this._sort();
              this.$layers.forEach(function (layer) {
                  layer._sort();
                  layer.$shapes.forEach(function (shape) {
                      shape._render();
                      if (_this.$ctx.isPointInPath(e.offsetX, e.offsetY, 'evenodd')) {
                          cursor = shape.$style.cursor;
                      }
                  });
              });
              this.$canvas.style.cursor = cursor;
          }
      }, {
          key: '_events',
          value: function _events() {
              var _this2 = this;

              this._sort();
              this.$layers.forEach(function (layer) {
                  layer._sort();
                  layer.$shapes.forEach(function (shape) {
                      shape._render();
                      if (_this2.$ctx.isPointInPath(e.offsetX, e.offsetY)) {
                          cursor = shape.$style.cursor;
                      }
                  });
              });
              this.$canvas.style.cursor = cursor;
              // for(let i = this.$layers.length - 1; i > -1; i--) {
              //     let layer = this.$layers[i]
              //     for(let j = layer.$shapes.length - 1; j > -1; j--) {
              //         let shape = layer.$shapes[j]
              //         shape.$events.forEach(event => {
              //             function func(e) {
              //                 if(isPointInShape([e.offsetX, e.offsetY], shape)) {
              //                     event.fn(shape, e)
              //                 }
              //             }
              //             this.$canvas.removeEventListener(event.evType, func)
              //             this.$canvas.addEventListener(event.evType, func)
              //         })
              //     }
              // }
          }
      }, {
          key: '_render',
          value: function _render() {
              this.clear();
              this._sort();
              this.$layers.forEach(function (layer) {
                  layer._render();
              });
              // if(!this.$disableEvents) {
              //     this._events()
              // }

              // if(!this.$disableCursor) {
              //     this.$canvas.removeEventListener('mousemove', this._cursor.bind(this))
              //     this.$canvas.addEventListener('mousemove', this._cursor.bind(this))
              // }
          }
      }]);
      return Bvas;
  }();

  var Layer = function () {
      function Layer() {
          var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
              style = _ref.style,
              props = _ref.props;

          classCallCheck(this, Layer);

          this.$style = style;
          this.$props = props;
          this.$shapes = [];
          this.$bvas = null;
          this.$ctx = null;
          this.$canvas = null;
      }

      createClass(Layer, [{
          key: "addTo",
          value: function addTo(bvas) {
              var rerender = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

              this.$canvas = bvas.$canvas;
              this.$ctx = bvas.$ctx;
              this.$bvas = bvas;
              bvas.addLayer(this, rerender);
              return this;
          }
      }, {
          key: "addShape",
          value: function addShape(shape) {
              var rerender = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

              this.$bvas.removeLayer(this, false);
              this.$shapes.push(shape);
              this.$bvas.addLayer(this, rerender);
              return this;
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
              return this;
          }
      }, {
          key: "remove",
          value: function remove() {
              var rerender = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

              this.$bvas.removeLayer(this, rerender);
              return this;
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

  /**
   *
   * @description 获取坐标串的边界
   * @export
   * @param {Array} poly
   * @returns {Array}
   */
  function getBoundFromCoordinates(poly) {
      var minX = void 0,
          minY = void 0,
          maxX = void 0,
          maxY = void 0;
      for (var index in poly) {
          var x = poly[index][0];
          var y = poly[index][1];
          if (index == 0) {
              minX = maxX = x;
              minY = maxY = y;
          } else {
              minX = x < minX ? x : minX;
              maxX = x > maxX ? x : maxX;
              minY = y < minY ? y : minY;
              maxY = y > maxY ? y : maxY;
          }
      }
      return [[minX, minY], [maxX, maxY]];
  }

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

      var _position = slicedToArray(position, 2),
          x = _position[0],
          y = _position[1];

      return [[x - radius, y - radius], [x + radius, y + radius]];
  }

  function pointDistance(p1, p2) {
      return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));
  }

  /**
   * @description 判断点是否在矩形内
   *
   * @export
   * @param {Array} p
   * @param {Array} rect
   * @returns {Boolean}
   */
  function isPointInRect(p, rect) {
      var _rect = slicedToArray(rect, 2),
          _rect$ = slicedToArray(_rect[0], 2),
          minX = _rect$[0],
          minY = _rect$[1],
          _rect$2 = slicedToArray(_rect[1], 2),
          maxX = _rect$2[0],
          maxY = _rect$2[1];

      var _p = slicedToArray(p, 2),
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

  function getShapeBound(shape) {
      if (shape instanceof Point) {
          var _shape$$style = shape.$style,
              position = _shape$$style.position,
              size = _shape$$style.size;

          var _position = slicedToArray(position, 2),
              x = _position[0],
              y = _position[1];

          return [[x - size, y - size], [x + size, y + size]];
      }
      if (shape instanceof Circle) {
          var _shape$$style2 = shape.$style,
              _position2 = _shape$$style2.position,
              radius = _shape$$style2.radius;

          var _position3 = slicedToArray(_position2, 2),
              _x = _position3[0],
              _y = _position3[1];

          return [[_x - radius, _y - radius], [_x + radius, _y + radius]];
      }
      if (shape instanceof PolyLine || shape instanceof PolyGon) {
          var points = shape.$style.points;

          return getBoundFromCoordinates(points);
      }
  }

  function isPointInShape(p, shape) {
      // let type = shape.constructor.name
      // alert(type)
      // console.log(type)
      if (shape instanceof Point) {
          var _shape$$style3 = shape.$style,
              position = _shape$$style3.position,
              size = _shape$$style3.size;

          var circle = {
              position: position,
              radius: size
              // console.log(p, circle)
          };return isPointInCircle(p, circle);
      }
      if (shape instanceof Circle) {
          var _shape$$style4 = shape.$style,
              _position4 = _shape$$style4.position,
              radius = _shape$$style4.radius;

          var _circle = {
              position: _position4,
              radius: radius
              // console.log(p, circle)
          };return isPointInCircle(p, _circle);
      }
  }

  // import {pointDistance} from '../util/distance'

  var Base = function () {
      function Base(_ref) {
          var style = _ref.style,
              props = _ref.props;
          classCallCheck(this, Base);

          this.$style = style;
          this.$props = props;
          this.$layer = null;
          this.$ctx = null;
          this.$canvas = null;
          this.$bvas = null;
          this.$events = [];
      }

      createClass(Base, [{
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
              this.$style = style;
              this.$layer.addShape(this, rerender);
              return this;
          }
      }, {
          key: 'on',
          value: function on(evType, fn) {
              var _this = this;

              var func = function func(e) {
                  // console.log(isPointInShape([e.offsetX, e.offsetY], this))
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
              return this;
          }
      }, {
          key: 'getStyle',
          value: function getStyle() {
              return this.$style;
          }
      }, {
          key: 'getBound',
          value: function getBound() {
              return getShapeBound(this);
          }
      }, {
          key: '_rotate',
          value: function _rotate() {
              var $ctx = this.$ctx,
                  $style = this.$style;
              var rotate = $style.rotate,
                  rotateCenter = $style.rotateCenter;

              if (!rotateCenter) {
                  var bound = this.getBound();

                  var _bound = slicedToArray(bound, 2),
                      _bound$ = slicedToArray(_bound[0], 2),
                      minX = _bound$[0],
                      minY = _bound$[1],
                      _bound$2 = slicedToArray(_bound[1], 2),
                      maxX = _bound$2[0],
                      maxY = _bound$2[1];

                  rotateCenter = [(minX + maxX) / 2, (minY + maxY) / 2];
              }
              $ctx.translate.apply($ctx, toConsumableArray(rotateCenter));
              $ctx.rotate(rotate);
          }
      }]);
      return Base;
  }();

  var Point = function (_Base) {
      inherits(Point, _Base);

      function Point() {
          classCallCheck(this, Point);
          return possibleConstructorReturn(this, (Point.__proto__ || Object.getPrototypeOf(Point)).apply(this, arguments));
      }

      createClass(Point, [{
          key: '_render',
          value: function _render() {
              var _$style = this.$style,
                  position = _$style.position,
                  _$style$size = _$style.size,
                  size = _$style$size === undefined ? 2 : _$style$size,
                  _$style$color = _$style.color,
                  color = _$style$color === undefined ? '#000' : _$style$color;

              this.$ctx.beginPath();
              this.$ctx.arc(position[0], position[1], size, 0, 2 * Math.PI);
              this.$ctx.fillStyle = color;
              this.$ctx.fill();
              this.$ctx.closePath();
          }
      }]);
      return Point;
  }(Base);

  var Circle = function (_Base) {
      inherits(Circle, _Base);

      function Circle() {
          classCallCheck(this, Circle);
          return possibleConstructorReturn(this, (Circle.__proto__ || Object.getPrototypeOf(Circle)).apply(this, arguments));
      }

      createClass(Circle, [{
          key: '_render',
          value: function _render() {
              var _$style = this.$style,
                  position = _$style.position,
                  radius = _$style.radius,
                  _$style$strokeStyle = _$style.strokeStyle,
                  strokeStyle = _$style$strokeStyle === undefined ? '#000' : _$style$strokeStyle,
                  _$style$fillStyle = _$style.fillStyle,
                  fillStyle = _$style$fillStyle === undefined ? '#000' : _$style$fillStyle,
                  _$style$strokeWidth = _$style.strokeWidth,
                  strokeWidth = _$style$strokeWidth === undefined ? 1 : _$style$strokeWidth,
                  _$style$startAngle = _$style.startAngle,
                  startAngle = _$style$startAngle === undefined ? 0 : _$style$startAngle,
                  _$style$endAngle = _$style.endAngle,
                  endAngle = _$style$endAngle === undefined ? Math.PI * 2 : _$style$endAngle,
                  _$style$counterclockw = _$style.counterclockwise,
                  counterclockwise = _$style$counterclockw === undefined ? true : _$style$counterclockw;

              this.$ctx.beginPath();
              this.$ctx.arc(position[0], position[1], radius, startAngle, endAngle, counterclockwise);
              this.$ctx.fillStyle = fillStyle;
              this.$ctx.strokeStyle = strokeStyle;
              this.$ctx.lineWidth = strokeWidth;
              this.$ctx.fill();
              this.$ctx.stroke();
              this.$ctx.closePath();
          }
      }]);
      return Circle;
  }(Base);

  var PolyLine = function (_Base) {
      inherits(PolyLine, _Base);

      function PolyLine() {
          classCallCheck(this, PolyLine);
          return possibleConstructorReturn(this, (PolyLine.__proto__ || Object.getPrototypeOf(PolyLine)).apply(this, arguments));
      }

      createClass(PolyLine, [{
          key: '_render',
          value: function _render() {
              var $style = this.$style,
                  $ctx = this.$ctx;
              var points = $style.points,
                  _$style$strokeStyle = $style.strokeStyle,
                  strokeStyle = _$style$strokeStyle === undefined ? '#000' : _$style$strokeStyle,
                  _$style$strokeWidth = $style.strokeWidth,
                  strokeWidth = _$style$strokeWidth === undefined ? 1 : _$style$strokeWidth;

              $ctx.beginPath();
              $ctx.moveTo.apply($ctx, toConsumableArray(points[0]));
              points.forEach(function (p) {
                  $ctx.lineTo.apply($ctx, toConsumableArray(p));
              });
              $ctx.strokeStyle = strokeStyle;
              $ctx.lineWidth = strokeWidth;
              $ctx.stroke();
              $ctx.closePath();
          }
      }]);
      return PolyLine;
  }(Base);

  var PolyGon = function (_Base) {
      inherits(PolyGon, _Base);

      function PolyGon() {
          classCallCheck(this, PolyGon);
          return possibleConstructorReturn(this, (PolyGon.__proto__ || Object.getPrototypeOf(PolyGon)).apply(this, arguments));
      }

      createClass(PolyGon, [{
          key: '_render',
          value: function _render() {
              var _$style = this.$style,
                  points = _$style.points,
                  _$style$strokeStyle = _$style.strokeStyle,
                  strokeStyle = _$style$strokeStyle === undefined ? '#000' : _$style$strokeStyle,
                  _$style$strokeWidth = _$style.strokeWidth,
                  strokeWidth = _$style$strokeWidth === undefined ? 1 : _$style$strokeWidth,
                  _$style$fillStyle = _$style.fillStyle,
                  fillStyle = _$style$fillStyle === undefined ? '#000' : _$style$fillStyle;
              var $ctx = this.$ctx;

              $ctx.save();
              // $ctx.translate(250, 200)
              $ctx.rotate(Math.PI / 20);
              // this._rotate()
              $ctx.beginPath();
              $ctx.moveTo.apply($ctx, toConsumableArray(points[0]));
              points.forEach(function (point) {
                  $ctx.lineTo.apply($ctx, toConsumableArray(point));
              });
              $ctx.lineTo.apply($ctx, toConsumableArray(points[0]));
              $ctx.strokeStyle = strokeStyle;
              $ctx.lineWidth = strokeWidth;
              $ctx.fillStyle = fillStyle;
              $ctx.stroke();
              $ctx.fill();
              $ctx.closePath();
              $ctx.restore();
          }
      }]);
      return PolyGon;
  }(Base);

  Bvas.Point = Point;
  Bvas.Circle = Circle;
  Bvas.PolyLine = PolyLine;
  Bvas.PolyGon = PolyGon;

  return Bvas;

})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnZhcy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2pzL0J2YXMuanMiLCIuLi8uLi9zcmMvanMvbGF5ZXIvTGF5ZXIuanMiLCIuLi8uLi9zcmMvanMvbGF5ZXIvaW5kZXguanMiLCIuLi8uLi9zcmMvanMvdXRpbC9ib3VuZC5qcyIsIi4uLy4uL3NyYy9qcy91dGlsL2Rpc3RhbmNlLmpzIiwiLi4vLi4vc3JjL2pzL3V0aWwvaXNQb2ludEluU2hhcGUuanMiLCIuLi8uLi9zcmMvanMvc2hhcGUvQmFzZS5qcyIsIi4uLy4uL3NyYy9qcy9zaGFwZS9Qb2ludC5qcyIsIi4uLy4uL3NyYy9qcy9zaGFwZS9DaXJjbGUuanMiLCIuLi8uLi9zcmMvanMvc2hhcGUvUG9seUxpbmUuanMiLCIuLi8uLi9zcmMvanMvc2hhcGUvUG9seUdvbi5qcyIsIi4uLy4uL3NyYy9qcy9zaGFwZS9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBpbXBvcnQge2lzUG9pbnRJblNoYXBlfSBmcm9tICcuL3V0aWwvaXNQb2ludEluU2hhcGUnXHJcblxyXG5mdW5jdGlvbiBhZGRDbGFzcyhlbCwgY2xhc3NOYW1lKSB7XHJcbiAgICBlbFxyXG4gICAgICAgIC5jbGFzc0xpc3RcclxuICAgICAgICAuYWRkKGNsYXNzTmFtZSlcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQnZhcyB7XHJcbiAgICBjb25zdHJ1Y3Rvcih7ZWwsIGRpc2FibGVDdXJzb3IsIGRpc2FibGVFdmVudHN9KSB7XHJcbiAgICAgICAgdGhpcy4kZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGVsKVxyXG4gICAgICAgIHRoaXMuJGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpXHJcbiAgICAgICAgdGhpcy4kY2FudmFzLndpZHRoID0gdGhpcy4kZWwub2Zmc2V0V2lkdGhcclxuICAgICAgICB0aGlzLiRjYW52YXMuaGVpZ2h0ID0gdGhpcy4kZWwub2Zmc2V0SGVpZ2h0XHJcbiAgICAgICAgYWRkQ2xhc3ModGhpcy4kZWwsICdidmFzLXdyYXBwZXInKVxyXG4gICAgICAgIGFkZENsYXNzKHRoaXMuJGNhbnZhcywgJ2J2YXMtdmlld3BvcnQnKVxyXG4gICAgICAgIHRoaXMuJGN0eCA9IHRoaXNcclxuICAgICAgICAgICAgLiRjYW52YXNcclxuICAgICAgICAgICAgLmdldENvbnRleHQoJzJkJylcclxuICAgICAgICB0aGlzXHJcbiAgICAgICAgICAgIC4kZWxcclxuICAgICAgICAgICAgLmFwcGVuZCh0aGlzLiRjYW52YXMpXHJcbiAgICAgICAgdGhpcy4kbGF5ZXJzID0gW11cclxuICAgICAgICBpZighZGlzYWJsZUN1cnNvcikge1xyXG4gICAgICAgICAgICB0aGlzLiRjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5fY3Vyc29yLmJpbmQodGhpcykpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgYWRkTGF5ZXIobGF5ZXIsIHJlcmVuZGVyID0gdHJ1ZSkge1xyXG4gICAgICAgIHRoaXNcclxuICAgICAgICAgICAgLiRsYXllcnNcclxuICAgICAgICAgICAgLnB1c2gobGF5ZXIpXHJcbiAgICAgICAgaWYocmVyZW5kZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5fcmVuZGVyKClcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZW1vdmVMYXllcihsYXllciwgcmVyZW5kZXIgPSB0cnVlKSB7XHJcbiAgICAgICAgdGhpcy4kbGF5ZXJzID0gdGhpcy4kbGF5ZXJzLmZpbHRlcihsYXllckkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gbGF5ZXJJICE9PSBsYXllclxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgaWYocmVyZW5kZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5fcmVuZGVyKClcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBjbGVhcigpIHtcclxuICAgICAgICB0aGlzXHJcbiAgICAgICAgICAgIC4kY3R4XHJcbiAgICAgICAgICAgIC5jbGVhclJlY3QoMCwgMCwgdGhpcy4kY2FudmFzLndpZHRoLCB0aGlzLiRjYW52YXMuaGVpZ2h0KVxyXG4gICAgfVxyXG4gICAgZ2V0Vmlld3BvcnQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuJGNhbnZhc1xyXG4gICAgfVxyXG4gICAgX3NvcnQoKSB7XHJcbiAgICAgICAgdGhpc1xyXG4gICAgICAgICAgICAuJGxheWVyc1xyXG4gICAgICAgICAgICAuc29ydCgoYSwgYikgPT4gYS4kc3R5bGUuekluZGV4IC0gYi4kc3R5bGUuekluZGV4KVxyXG4gICAgfVxyXG4gICAgX2N1cnNvcihlKSB7XHJcbiAgICAgICAgdGhpcy5jbGVhcigpXHJcbiAgICAgICAgbGV0IGN1cnNvciA9IG51bGxcclxuICAgICAgICAvLyBicmVha1BvaW50OlxyXG4gICAgICAgIC8vIGZvcihsZXQgaSA9IHRoaXMuJGxheWVycy5sZW5ndGggLSAxOyBpID4gLTE7IGktLSkge1xyXG4gICAgICAgIC8vICAgICBsZXQgbGF5ZXIgPSB0aGlzLiRsYXllcnNbaV1cclxuICAgICAgICAvLyAgICAgZm9yKGxldCBqID0gbGF5ZXIuJHNoYXBlcy5sZW5ndGggLSAxOyBqID4gLTE7IGotLSkge1xyXG4gICAgICAgIC8vICAgICAgICAgbGV0IHNoYXBlID0gbGF5ZXIuJHNoYXBlc1tqXVxyXG4gICAgICAgIC8vICAgICAgICAgaWYoc2hhcGUuJHN0eWxlLmN1cnNvcikge1xyXG4gICAgICAgIC8vICAgICAgICAgICAgIGlmKGlzUG9pbnRJblNoYXBlKFtlLm9mZnNldFgsIGUub2Zmc2V0WV0sIHNoYXBlKSkge1xyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICBjdXJzb3IgPSBzaGFwZS4kc3R5bGUuY3Vyc29yXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIGJyZWFrIGJyZWFrUG9pbnRcclxuICAgICAgICAvLyAgICAgICAgICAgICB9XHJcbiAgICAgICAgLy8gICAgICAgICB9XHJcbiAgICAgICAgLy8gICAgIH1cclxuICAgICAgICAvLyB9XHJcbiAgICAgICAgdGhpcy5fc29ydCgpXHJcbiAgICAgICAgdGhpcy4kbGF5ZXJzLmZvckVhY2gobGF5ZXIgPT4ge1xyXG4gICAgICAgICAgICBsYXllci5fc29ydCgpXHJcbiAgICAgICAgICAgIGxheWVyLiRzaGFwZXMuZm9yRWFjaChzaGFwZSA9PiB7XHJcbiAgICAgICAgICAgICAgICBzaGFwZS5fcmVuZGVyKClcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMuJGN0eC5pc1BvaW50SW5QYXRoKGUub2Zmc2V0WCwgZS5vZmZzZXRZLCAnZXZlbm9kZCcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3Vyc29yID0gc2hhcGUuJHN0eWxlLmN1cnNvclxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSlcclxuICAgICAgICB0aGlzLiRjYW52YXMuc3R5bGUuY3Vyc29yID0gY3Vyc29yXHJcbiAgICB9XHJcbiAgICBfZXZlbnRzKCkge1xyXG4gICAgICAgIHRoaXMuX3NvcnQoKVxyXG4gICAgICAgIHRoaXMuJGxheWVycy5mb3JFYWNoKGxheWVyID0+IHtcclxuICAgICAgICAgICAgbGF5ZXIuX3NvcnQoKVxyXG4gICAgICAgICAgICBsYXllci4kc2hhcGVzLmZvckVhY2goc2hhcGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgc2hhcGUuX3JlbmRlcigpXHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLiRjdHguaXNQb2ludEluUGF0aChlLm9mZnNldFgsIGUub2Zmc2V0WSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjdXJzb3IgPSBzaGFwZS4kc3R5bGUuY3Vyc29yXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9KVxyXG4gICAgICAgIHRoaXMuJGNhbnZhcy5zdHlsZS5jdXJzb3IgPSBjdXJzb3JcclxuICAgICAgICAvLyBmb3IobGV0IGkgPSB0aGlzLiRsYXllcnMubGVuZ3RoIC0gMTsgaSA+IC0xOyBpLS0pIHtcclxuICAgICAgICAvLyAgICAgbGV0IGxheWVyID0gdGhpcy4kbGF5ZXJzW2ldXHJcbiAgICAgICAgLy8gICAgIGZvcihsZXQgaiA9IGxheWVyLiRzaGFwZXMubGVuZ3RoIC0gMTsgaiA+IC0xOyBqLS0pIHtcclxuICAgICAgICAvLyAgICAgICAgIGxldCBzaGFwZSA9IGxheWVyLiRzaGFwZXNbal1cclxuICAgICAgICAvLyAgICAgICAgIHNoYXBlLiRldmVudHMuZm9yRWFjaChldmVudCA9PiB7XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgZnVuY3Rpb24gZnVuYyhlKSB7XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIGlmKGlzUG9pbnRJblNoYXBlKFtlLm9mZnNldFgsIGUub2Zmc2V0WV0sIHNoYXBlKSkge1xyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgZXZlbnQuZm4oc2hhcGUsIGUpXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAvLyAgICAgICAgICAgICB9XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgdGhpcy4kY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQuZXZUeXBlLCBmdW5jKVxyXG4gICAgICAgIC8vICAgICAgICAgICAgIHRoaXMuJGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKGV2ZW50LmV2VHlwZSwgZnVuYylcclxuICAgICAgICAvLyAgICAgICAgIH0pXHJcbiAgICAgICAgLy8gICAgIH1cclxuICAgICAgICAvLyB9XHJcbiAgICB9XHJcbiAgICBfcmVuZGVyKCkge1xyXG4gICAgICAgIHRoaXMuY2xlYXIoKVxyXG4gICAgICAgIHRoaXMuX3NvcnQoKVxyXG4gICAgICAgIHRoaXMuJGxheWVycy5mb3JFYWNoKGxheWVyID0+IHtcclxuICAgICAgICAgICAgbGF5ZXIuX3JlbmRlcigpXHJcbiAgICAgICAgfSlcclxuICAgICAgICAvLyBpZighdGhpcy4kZGlzYWJsZUV2ZW50cykge1xyXG4gICAgICAgIC8vICAgICB0aGlzLl9ldmVudHMoKVxyXG4gICAgICAgIC8vIH1cclxuICAgICAgICBcclxuICAgICAgICAvLyBpZighdGhpcy4kZGlzYWJsZUN1cnNvcikge1xyXG4gICAgICAgIC8vICAgICB0aGlzLiRjYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5fY3Vyc29yLmJpbmQodGhpcykpXHJcbiAgICAgICAgLy8gICAgIHRoaXMuJGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLl9jdXJzb3IuYmluZCh0aGlzKSlcclxuICAgICAgICAvLyB9XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBMYXllciB7XHJcbiAgICBjb25zdHJ1Y3Rvcih7c3R5bGUsIHByb3BzfSA9IHt9KSB7XHJcbiAgICAgICAgdGhpcy4kc3R5bGUgPSBzdHlsZVxyXG4gICAgICAgIHRoaXMuJHByb3BzID0gcHJvcHNcclxuICAgICAgICB0aGlzLiRzaGFwZXMgPSBbXVxyXG4gICAgICAgIHRoaXMuJGJ2YXMgPSBudWxsXHJcbiAgICAgICAgdGhpcy4kY3R4ID0gbnVsbFxyXG4gICAgICAgIHRoaXMuJGNhbnZhcyA9IG51bGxcclxuICAgIH1cclxuICAgIGFkZFRvKGJ2YXMsIHJlcmVuZGVyID0gdHJ1ZSkge1xyXG4gICAgICAgIHRoaXMuJGNhbnZhcyA9IGJ2YXMuJGNhbnZhc1xyXG4gICAgICAgIHRoaXMuJGN0eCA9IGJ2YXMuJGN0eFxyXG4gICAgICAgIHRoaXMuJGJ2YXMgPSBidmFzXHJcbiAgICAgICAgYnZhcy5hZGRMYXllcih0aGlzLCByZXJlbmRlcilcclxuICAgICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG4gICAgYWRkU2hhcGUoc2hhcGUsIHJlcmVuZGVyID0gdHJ1ZSkge1xyXG4gICAgICAgIHRoaXMuJGJ2YXMucmVtb3ZlTGF5ZXIodGhpcywgZmFsc2UpXHJcbiAgICAgICAgdGhpc1xyXG4gICAgICAgICAgICAuJHNoYXBlc1xyXG4gICAgICAgICAgICAucHVzaChzaGFwZSlcclxuICAgICAgICB0aGlzLiRidmFzLmFkZExheWVyKHRoaXMsIHJlcmVuZGVyKVxyXG4gICAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcbiAgICByZW1vdmVTaGFwZShzaGFwZSwgcmVyZW5kZXIgPSB0cnVlKSB7XHJcbiAgICAgICAgdGhpcy4kYnZhcy5yZW1vdmVMYXllcih0aGlzLCBmYWxzZSlcclxuICAgICAgICB0aGlzLiRzaGFwZXMgPSB0aGlzLiRzaGFwZXMuZmlsdGVyKHNoYXBlSSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBzaGFwZUkgIT09IHNoYXBlXHJcbiAgICAgICAgfSlcclxuICAgICAgICB0aGlzLiRidmFzLmFkZExheWVyKHRoaXMsIHJlcmVuZGVyKSBcclxuICAgICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG4gICAgcmVtb3ZlKHJlcmVuZGVyID0gdHJ1ZSkge1xyXG4gICAgICAgIHRoaXMuJGJ2YXMucmVtb3ZlTGF5ZXIodGhpcywgcmVyZW5kZXIpXHJcbiAgICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuICAgIF9zb3J0KCkge1xyXG4gICAgICAgIHRoaXNcclxuICAgICAgICAgICAgLiRzaGFwZXNcclxuICAgICAgICAgICAgLnNvcnQoKGEsIGIpID0+IGEuJHN0eWxlLnpJbmRleCAtIGIuJHN0eWxlLnpJbmRleClcclxuICAgIH1cclxuICAgIF9yZW5kZXIoKSB7XHJcbiAgICAgICAgdGhpcy5fc29ydCgpXHJcbiAgICAgICAgdGhpc1xyXG4gICAgICAgICAgICAuJHNoYXBlc1xyXG4gICAgICAgICAgICAuZm9yRWFjaChzaGFwZSA9PiB7XHJcbiAgICAgICAgICAgICAgICBzaGFwZS5fcmVuZGVyKClcclxuICAgICAgICAgICAgfSlcclxuICAgIH1cclxufSIsImltcG9ydCBCdmFzIGZyb20gJy4uL0J2YXMnXHJcblxyXG5pbXBvcnQgTGF5ZXIgZnJvbSAnLi9MYXllcidcclxuXHJcbkJ2YXMuTGF5ZXIgPSBMYXllciIsIlxyXG4vKipcclxuICpcclxuICogQGRlc2NyaXB0aW9uIOiOt+WPluWdkOagh+S4sueahOi+ueeVjFxyXG4gKiBAZXhwb3J0XHJcbiAqIEBwYXJhbSB7QXJyYXl9IHBvbHlcclxuICogQHJldHVybnMge0FycmF5fVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGdldEJvdW5kRnJvbUNvb3JkaW5hdGVzKHBvbHkpIHtcclxuICAgIGxldCBtaW5YLCBtaW5ZLCBtYXhYLCBtYXhZXHJcbiAgICBmb3IobGV0IGluZGV4IGluIHBvbHkpIHtcclxuICAgICAgICBsZXQgeCA9IHBvbHlbaW5kZXhdWzBdXHJcbiAgICAgICAgbGV0IHkgPSBwb2x5W2luZGV4XVsxXVxyXG4gICAgICAgIGlmKGluZGV4ID09IDApIHtcclxuICAgICAgICAgICAgbWluWCA9IG1heFggPSB4XHJcbiAgICAgICAgICAgIG1pblkgPSBtYXhZID0geVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIG1pblggPSB4IDwgbWluWCA/IHggOiBtaW5YXHJcbiAgICAgICAgICAgIG1heFggPSB4ID4gbWF4WCA/IHggOiBtYXhYXHJcbiAgICAgICAgICAgIG1pblkgPSB5IDwgbWluWSA/IHkgOiBtaW5ZXHJcbiAgICAgICAgICAgIG1heFkgPSB5ID4gbWF4WSA/IHkgOiBtYXhZXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIFtbbWluWCwgbWluWV0sIFttYXhYLCBtYXhZXV1cclxufVxyXG5cclxuLyoqXHJcbiAqIEBkZXNjcmlwdGlvbiDojrflj5blnIbnmoTovrnnlYxcclxuICpcclxuICogQGV4cG9ydFxyXG4gKiBAcGFyYW0ge09iamVjdH0gY2lyY2xlXHJcbiAqIEByZXR1cm5zIHtBcnJheX1cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRDaXJjbGVCb3VuZChjaXJjbGUpIHtcclxuICAgIGxldCB7cG9zaXRpb24sIHJhZGl1c30gPSBjaXJjbGVcclxuICAgIGxldCBbeCwgeV0gPSBwb3NpdGlvblxyXG4gICAgcmV0dXJuIFtbeCAtIHJhZGl1cywgeSAtIHJhZGl1c10sIFt4ICsgcmFkaXVzLCB5ICsgcmFkaXVzXV1cclxufSIsImV4cG9ydCBmdW5jdGlvbiBwb2ludERpc3RhbmNlKHAxLCBwMikge1xyXG4gICAgcmV0dXJuIE1hdGguc3FydCgocDFbMF0gLSBwMlswXSkqKjIgKyAocDFbMV0gLSBwMlsxXSkqKjIpXHJcbn0iLCJpbXBvcnQge2dldEJvdW5kRnJvbUNvb3JkaW5hdGVzLCBnZXRDaXJjbGVCb3VuZH0gZnJvbSAnLi9ib3VuZCdcclxuXHJcbmltcG9ydCB7cG9pbnREaXN0YW5jZX0gZnJvbSAnLi9kaXN0YW5jZSdcclxuXHJcbmltcG9ydCAqIGFzIHNoYXBlcyBmcm9tICcuLi9zaGFwZS9pbmRleCdcclxuXHJcbi8vIGh0dHA6Ly93d3cuaHRtbC1qcy5jb20vYXJ0aWNsZS8xNTI4XHJcblxyXG4vKipcclxuICogQGRlc2NyaXB0aW9uIOWwhOe6v+azleWIpOaWreeCueaYr+WQpuWcqOWkmui+ueW9ouWGhemDqFxyXG4gKiBAcGFyYW0ge0FycmF5fSBwIOW+heWIpOaWreeahOeCue+8jOagvOW8j++8mltY5Z2Q5qCHLCBZ5Z2Q5qCHIF1cclxuICogQHBhcmFtIHtBcnJheX0gcG9seSDlpJrovrnlvaLpobbngrnvvIzmlbDnu4TmiJDlkZjnmoTmoLzlvI/lkIwgcFxyXG4gKiBAcmV0dXJuIHtCb29sZWFufSDngrkgcCDmmK/lkKblpJrovrnlvaIgcG9seSDlhoXpg6hcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBpc1BvaW50SW5Qb2x5Z29uKHAsIHBvbHkpIHtcclxuICAgIGxldCBweCA9IHBbMF0sXHJcbiAgICAgICAgcHkgPSBwWzFdLFxyXG4gICAgICAgIGZsYWcgPSBmYWxzZVxyXG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSBwb2x5Lmxlbmd0aCwgaiA9IGwgLSAxOyBpIDwgbDsgaiA9IGksIGkrKykge1xyXG4gICAgICAgIGxldCBzeCA9IHBvbHlbaV1bMF0sXHJcbiAgICAgICAgICAgIHN5ID0gcG9seVtpXVsxXSxcclxuICAgICAgICAgICAgdHggPSBwb2x5W2pdWzBdLFxyXG4gICAgICAgICAgICB0eSA9IHBvbHlbal1bMV1cclxuICAgICAgICAvLyDngrnkuI7lpJrovrnlvaLpobbngrnph43lkIhcclxuICAgICAgICBpZiAoKHN4ID09PSBweCAmJiBzeSA9PT0gcHkpIHx8ICh0eCA9PT0gcHggJiYgdHkgPT09IHB5KSkge1xyXG4gICAgICAgICAgICBmbGFnID0gdHJ1ZVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyDliKTmlq3nur/mrrXkuKTnq6/ngrnmmK/lkKblnKjlsITnur/kuKTkvqdcclxuICAgICAgICBpZiAoKHN5IDwgcHkgJiYgdHkgPj0gcHkpIHx8IChzeSA+PSBweSAmJiB0eSA8IHB5KSkge1xyXG4gICAgICAgICAgICAvLyDnur/mrrXkuIrkuI7lsITnur8gWSDlnZDmoIfnm7jlkIznmoTngrnnmoQgWCDlnZDmoIdcclxuICAgICAgICAgICAgbGV0IHggPSBzeCArIChweSAtIHN5KSAqICh0eCAtIHN4KSAvICh0eSAtIHN5KVxyXG4gICAgICAgICAgICAvLyDngrnlnKjlpJrovrnlvaLnmoTovrnkuIpcclxuICAgICAgICAgICAgaWYgKHggPT09IHB4KSB7XHJcbiAgICAgICAgICAgICAgICBmbGFnID0gdHJ1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIOWwhOe6v+epv+i/h+Wkmui+ueW9oueahOi+ueeVjFxyXG4gICAgICAgICAgICBpZiAoeCA+IHB4KSB7XHJcbiAgICAgICAgICAgICAgICBmbGFnID0gIWZsYWdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8vIOWwhOe6v+epv+i/h+Wkmui+ueW9oui+ueeVjOeahOasoeaVsOS4uuWlh+aVsOaXtueCueWcqOWkmui+ueW9ouWGhVxyXG4gICAgcmV0dXJuIGZsYWdcclxufVxyXG5cclxuLyoqXHJcbiAqIEBkZXNjcmlwdGlvbiDliKTmlq3ngrnmmK/lkKblnKjnn6nlvaLlhoVcclxuICpcclxuICogQGV4cG9ydFxyXG4gKiBAcGFyYW0ge0FycmF5fSBwXHJcbiAqIEBwYXJhbSB7QXJyYXl9IHJlY3RcclxuICogQHJldHVybnMge0Jvb2xlYW59XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gaXNQb2ludEluUmVjdChwLCByZWN0KSB7XHJcbiAgICBsZXQgW1xyXG4gICAgICAgIFtcclxuICAgICAgICAgICAgbWluWCwgbWluWVxyXG4gICAgICAgIF0sXHJcbiAgICAgICAgW21heFgsIG1heFldXHJcbiAgICBdID0gcmVjdFxyXG4gICAgbGV0IFt4LFxyXG4gICAgICAgIHldID0gcFxyXG4gICAgcmV0dXJuICEoeCA8IG1pblggfHwgeCA+IG1heFggfHwgeSA8IG1pblkgfHwgeSA+IG1heFkpXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAZGVzY3JpcHRpb24g5Yik5pat54K55piv5ZCm5Zyo57q/5q615LiKXHJcbiAqXHJcbiAqIEBleHBvcnRcclxuICogQHBhcmFtIHtBcnJheX0gcFxyXG4gKiBAcGFyYW0ge0FycmF5fSBsaW5lXHJcbiAqIEByZXR1cm5zXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gaXNQb2ludE9uTGluZShwLCBsaW5lKSB7XHJcbiAgICBsZXQgYm91bmQgPSBnZXRCb3VuZEZyb21Db29yZGluYXRlcyhsaW5lKVxyXG4gICAgaWYgKCFpc1BvaW50SW5SZWN0KHAsIGJvdW5kKSkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgfVxyXG4gICAgbGV0IFt4LFxyXG4gICAgICAgIHldID0gcFxyXG4gICAgbGV0IFtcclxuICAgICAgICBbXHJcbiAgICAgICAgICAgIG1pblgsIG1pbllcclxuICAgICAgICBdLFxyXG4gICAgICAgIFttYXhYLCBtYXhZXVxyXG4gICAgXSA9IGJvdW5kXHJcbiAgICBpZiAoKHkgLSBtaW5ZKSAvICh4IC0gbWluWCkgPT09IChtYXhZIC0geSkgLyAobWF4WCAtIHgpKSB7XHJcbiAgICAgICAgcmV0dXJuIHRydWVcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAZGVzY3JpcHRpb24g5Yik5pat54K55piv5ZCm5ZyocG9seWxpbmVcclxuICogQHBhcmFtIHtBcnJheX0gcCDlvoXliKTmlq3nmoTngrnvvIzmoLzlvI/vvJp7IHg6IFjlnZDmoIcsIHk6IFnlnZDmoIcgfVxyXG4gKiBAcGFyYW0ge0FycmF5fSBwb2x5IOWkmui+ueW9oumhtueCue+8jOaVsOe7hOaIkOWRmOeahOagvOW8j+WQjCBwXHJcbiAqIEByZXR1cm4ge0Jvb2xlYW59IOeCuSBwIOWSjOWkmui+ueW9oiBwb2x5IOeahOWHoOS9leWFs+ezu1xyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGlzUG9pbnRPblBvbHlMaW5lKHAsIHBvbHkpIHtcclxuICAgIGxldCBib3VuZCA9IGdldEJvdW5kRnJvbUNvb3JkaW5hdGVzKHBvbHkpXHJcbiAgICBpZiAoIWlzUG9pbnRJblJlY3QocCwgYm91bmQpKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICB9XHJcbiAgICBsZXQgZmxhZyA9IGZhbHNlXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBvbHkubGVuZ3RoIC0gMTsgaSsrKSB7XHJcbiAgICAgICAgaWYgKGlzUG9pbnRPbkxpbmUocCwgW1xyXG4gICAgICAgICAgICBwb2x5W2ldLFxyXG4gICAgICAgICAgICBwb2x5W2kgKyAxXVxyXG4gICAgICAgIF0pKSB7XHJcbiAgICAgICAgICAgIGZsYWcgPSB0cnVlXHJcbiAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZsYWdcclxufVxyXG5cclxuLyoqXHJcbiAqIEBkZXNjcmlwdGlvbiDliKTmlq3ngrnmmK/lkKblnKjlnIblvaLlhoVcclxuICpcclxuICogQGV4cG9ydFxyXG4gKiBAcGFyYW0ge0FycmF5fSBwXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBjaXJjbGVcclxuICogQHJldHVybnMge0Jvb2xlYW59XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gaXNQb2ludEluQ2lyY2xlKHAsIGNpcmNsZSkge1xyXG4gICAgbGV0IGJvdW5kID0gZ2V0Q2lyY2xlQm91bmQoY2lyY2xlKVxyXG4gICAgLy8gY29uc29sZS5sb2coaXNQb2ludEluUmVjdChwLCBib3VuZCkpXHJcbiAgICBpZiAoIWlzUG9pbnRJblJlY3QocCwgYm91bmQpKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICB9XHJcbiAgICBpZiAocG9pbnREaXN0YW5jZShwLCBjaXJjbGUucG9zaXRpb24pID4gY2lyY2xlLnJhZGl1cykge1xyXG4gICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2hhcGVCb3VuZChzaGFwZSkge1xyXG4gICAgaWYoc2hhcGUgaW5zdGFuY2VvZiBzaGFwZXMuUG9pbnQpIHtcclxuICAgICAgICBsZXQge3Bvc2l0aW9uLCBzaXplfSA9IHNoYXBlLiRzdHlsZVxyXG4gICAgICAgIGxldCBbeCwgeV0gPSBwb3NpdGlvblxyXG4gICAgICAgIHJldHVybiBbW3ggLSBzaXplLCB5IC0gc2l6ZV0sIFt4ICsgc2l6ZSwgeSArIHNpemVdXVxyXG4gICAgfVxyXG4gICAgaWYoc2hhcGUgaW5zdGFuY2VvZiBzaGFwZXMuQ2lyY2xlKSB7XHJcbiAgICAgICAgbGV0IHtwb3NpdGlvbiwgcmFkaXVzfSA9IHNoYXBlLiRzdHlsZVxyXG4gICAgICAgIGxldCBbeCwgeV0gPSBwb3NpdGlvblxyXG4gICAgICAgIHJldHVybiBbW3ggLSByYWRpdXMsIHkgLSByYWRpdXNdLCBbeCArIHJhZGl1cywgeSArIHJhZGl1c11dXHJcbiAgICB9XHJcbiAgICBpZihzaGFwZSBpbnN0YW5jZW9mIHNoYXBlcy5Qb2x5TGluZSB8fCBzaGFwZSBpbnN0YW5jZW9mIHNoYXBlcy5Qb2x5R29uKSB7XHJcbiAgICAgICAgbGV0IHtwb2ludHN9ID0gc2hhcGUuJHN0eWxlXHJcbiAgICAgICAgcmV0dXJuIGdldEJvdW5kRnJvbUNvb3JkaW5hdGVzKHBvaW50cylcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGlzUG9pbnRJblNoYXBlKHAsIHNoYXBlKSB7XHJcbiAgICAvLyBsZXQgdHlwZSA9IHNoYXBlLmNvbnN0cnVjdG9yLm5hbWVcclxuICAgIC8vIGFsZXJ0KHR5cGUpXHJcbiAgICAvLyBjb25zb2xlLmxvZyh0eXBlKVxyXG4gICAgaWYgKHNoYXBlIGluc3RhbmNlb2Ygc2hhcGVzLlBvaW50KSB7XHJcbiAgICAgICAgbGV0IHtwb3NpdGlvbiwgc2l6ZX0gPSBzaGFwZS4kc3R5bGVcclxuICAgICAgICBsZXQgY2lyY2xlID0ge1xyXG4gICAgICAgICAgICBwb3NpdGlvbixcclxuICAgICAgICAgICAgcmFkaXVzOiBzaXplXHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHAsIGNpcmNsZSlcclxuICAgICAgICByZXR1cm4gaXNQb2ludEluQ2lyY2xlKHAsIGNpcmNsZSlcclxuICAgIH1cclxuICAgIGlmIChzaGFwZSBpbnN0YW5jZW9mIHNoYXBlcy5DaXJjbGUpIHtcclxuICAgICAgICBsZXQge3Bvc2l0aW9uLCByYWRpdXN9ID0gc2hhcGUuJHN0eWxlXHJcbiAgICAgICAgbGV0IGNpcmNsZSA9IHtcclxuICAgICAgICAgICAgcG9zaXRpb24sXHJcbiAgICAgICAgICAgIHJhZGl1c1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhwLCBjaXJjbGUpXHJcbiAgICAgICAgcmV0dXJuIGlzUG9pbnRJbkNpcmNsZShwLCBjaXJjbGUpXHJcbiAgICB9XHJcbn0iLCIvLyBpbXBvcnQge3BvaW50RGlzdGFuY2V9IGZyb20gJy4uL3V0aWwvZGlzdGFuY2UnXHJcbmltcG9ydCB7aXNQb2ludEluU2hhcGUsIGdldFNoYXBlQm91bmR9IGZyb20gJy4uL3V0aWwvaXNQb2ludEluU2hhcGUnXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNlIHtcclxuICAgIGNvbnN0cnVjdG9yKHtzdHlsZSwgcHJvcHN9KSB7XHJcbiAgICAgICAgdGhpcy4kc3R5bGUgPSBzdHlsZVxyXG4gICAgICAgIHRoaXMuJHByb3BzID0gcHJvcHNcclxuICAgICAgICB0aGlzLiRsYXllciA9IG51bGxcclxuICAgICAgICB0aGlzLiRjdHggPSBudWxsXHJcbiAgICAgICAgdGhpcy4kY2FudmFzID0gbnVsbFxyXG4gICAgICAgIHRoaXMuJGJ2YXMgPSBudWxsXHJcbiAgICAgICAgdGhpcy4kZXZlbnRzID0gW11cclxuICAgIH1cclxuICAgIGFkZFRvKGxheWVyLCByZXJlbmRlciA9IHRydWUpIHtcclxuICAgICAgICB0aGlzLiRjYW52YXMgPSBsYXllci4kY2FudmFzXHJcbiAgICAgICAgdGhpcy4kbGF5ZXIgPSBsYXllclxyXG4gICAgICAgIHRoaXMuJGN0eCA9IGxheWVyLiRjdHhcclxuICAgICAgICB0aGlzLiRidmFzID0gbGF5ZXIuJGJ2YXNcclxuICAgICAgICBsYXllci5hZGRTaGFwZSh0aGlzLCByZXJlbmRlcilcclxuICAgICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG4gICAgc2V0U3R5bGUoc3R5bGUsIHJlcmVuZGVyID0gdHJ1ZSkge1xyXG4gICAgICAgIHRoaXNcclxuICAgICAgICAgICAgLiRsYXllclxyXG4gICAgICAgICAgICAucmVtb3ZlU2hhcGUodGhpcywgZmFsc2UpXHJcbiAgICAgICAgdGhpcy4kc3R5bGUgPSBzdHlsZVxyXG4gICAgICAgIHRoaXNcclxuICAgICAgICAgICAgLiRsYXllclxyXG4gICAgICAgICAgICAuYWRkU2hhcGUodGhpcywgcmVyZW5kZXIpXHJcbiAgICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuICAgIG9uKGV2VHlwZSwgZm4pIHtcclxuICAgICAgICBsZXQgZnVuYyA9IChlKSA9PiB7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGlzUG9pbnRJblNoYXBlKFtlLm9mZnNldFgsIGUub2Zmc2V0WV0sIHRoaXMpKVxyXG4gICAgICAgICAgICBpZihpc1BvaW50SW5TaGFwZShbZS5vZmZzZXRYLCBlLm9mZnNldFldLCB0aGlzKSkge1xyXG4gICAgICAgICAgICAgICAgZm4odGhpcywgZSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLiRldmVudHMucHVzaCh7XHJcbiAgICAgICAgICAgIGV2VHlwZSxcclxuICAgICAgICAgICAgZnVuYyxcclxuICAgICAgICAgICAgZm5cclxuICAgICAgICB9KVxyXG4gICAgICAgIHRoaXMuJGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKGV2VHlwZSwgZnVuYylcclxuICAgIH1cclxuICAgIHVuKGV2VHlwZSwgZm4pIHtcclxuICAgICAgICB0aGlzLiRldmVudHMgPSB0aGlzLiRldmVudHMuZmlsdGVyKGV2ZW50ID0+IHtcclxuICAgICAgICAgICAgaWYoZXZlbnQuZXZUeXBlID09PSBldlR5cGUgJiYgZXZlbnQuZm4gPT09IGZuKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRjYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lcihldlR5cGUsIGV2ZW50LmZ1bmMpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuICAgIHJlbW92ZSgpIHtcclxuICAgICAgICB0aGlzXHJcbiAgICAgICAgICAgIC4kbGF5ZXJcclxuICAgICAgICAgICAgLnJlbW92ZVNoYXBlKHRoaXMpXHJcbiAgICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuICAgIGdldFN0eWxlKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLiRzdHlsZVxyXG4gICAgfVxyXG4gICAgZ2V0Qm91bmQoKSB7XHJcbiAgICAgICAgcmV0dXJuIGdldFNoYXBlQm91bmQodGhpcylcclxuICAgIH1cclxuICAgIF9yb3RhdGUoKSB7XHJcbiAgICAgICAgbGV0IHskY3R4LCAkc3R5bGV9ID0gdGhpc1xyXG4gICAgICAgIGxldCB7cm90YXRlLCByb3RhdGVDZW50ZXJ9ID0gJHN0eWxlXHJcbiAgICAgICAgaWYoIXJvdGF0ZUNlbnRlcikge1xyXG4gICAgICAgICAgICBsZXQgYm91bmQgPSB0aGlzLmdldEJvdW5kKClcclxuICAgICAgICAgICAgbGV0IFtbbWluWCwgbWluWV0sIFttYXhYLCBtYXhZXV0gPSBib3VuZFxyXG4gICAgICAgICAgICByb3RhdGVDZW50ZXIgPSBbKG1pblggKyBtYXhYKSAvIDIsIChtaW5ZICsgbWF4WSkgLyAyXVxyXG4gICAgICAgIH1cclxuICAgICAgICAkY3R4LnRyYW5zbGF0ZSguLi5yb3RhdGVDZW50ZXIpXHJcbiAgICAgICAgJGN0eC5yb3RhdGUocm90YXRlKVxyXG4gICAgfVxyXG59IiwiaW1wb3J0IEJhc2UgZnJvbSAnLi9CYXNlJ1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUG9pbnQgZXh0ZW5kcyBCYXNle1xyXG4gICAgX3JlbmRlcigpIHsgXHJcbiAgICAgICAgbGV0IHtwb3NpdGlvbiwgc2l6ZSA9IDIsIGNvbG9yID0gJyMwMDAnfSA9IHRoaXMuJHN0eWxlXHJcbiAgICAgICAgdGhpc1xyXG4gICAgICAgICAgICAuJGN0eFxyXG4gICAgICAgICAgICAuYmVnaW5QYXRoKClcclxuICAgICAgICB0aGlzXHJcbiAgICAgICAgICAgIC4kY3R4XHJcbiAgICAgICAgICAgIC5hcmMocG9zaXRpb25bMF0sIHBvc2l0aW9uWzFdLCBzaXplLCAwLCAyICogTWF0aC5QSSk7XHJcbiAgICAgICAgdGhpcy4kY3R4LmZpbGxTdHlsZSA9IGNvbG9yXHJcbiAgICAgICAgdGhpc1xyXG4gICAgICAgICAgICAuJGN0eFxyXG4gICAgICAgICAgICAuZmlsbCgpXHJcbiAgICAgICAgdGhpc1xyXG4gICAgICAgICAgICAuJGN0eFxyXG4gICAgICAgICAgICAuY2xvc2VQYXRoKClcclxuICAgIH1cclxufSIsImltcG9ydCBCYXNlIGZyb20gJy4vQmFzZSdcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENpcmNsZSBleHRlbmRzIEJhc2Uge1xyXG4gICAgX3JlbmRlcigpIHtcclxuICAgICAgICBsZXQgeyBwb3NpdGlvbiwgcmFkaXVzLCBzdHJva2VTdHlsZSA9ICcjMDAwJywgZmlsbFN0eWxlID0gJyMwMDAnLCBzdHJva2VXaWR0aCA9IDEsIHN0YXJ0QW5nbGUgPSAwLCBlbmRBbmdsZSA9IE1hdGguUEkgKiAyLCBjb3VudGVyY2xvY2t3aXNlID0gdHJ1ZSB9ID0gdGhpcy4kc3R5bGVcclxuICAgICAgICB0aGlzXHJcbiAgICAgICAgICAgIC4kY3R4XHJcbiAgICAgICAgICAgIC5iZWdpblBhdGgoKVxyXG4gICAgICAgIHRoaXNcclxuICAgICAgICAgICAgLiRjdHhcclxuICAgICAgICAgICAgLmFyYyhwb3NpdGlvblswXSwgcG9zaXRpb25bMV0sIHJhZGl1cywgc3RhcnRBbmdsZSwgZW5kQW5nbGUsIGNvdW50ZXJjbG9ja3dpc2UpO1xyXG4gICAgICAgIHRoaXMuJGN0eC5maWxsU3R5bGUgPSBmaWxsU3R5bGVcclxuICAgICAgICB0aGlzLiRjdHguc3Ryb2tlU3R5bGUgPSBzdHJva2VTdHlsZVxyXG4gICAgICAgIHRoaXMuJGN0eC5saW5lV2lkdGggPSBzdHJva2VXaWR0aFxyXG4gICAgICAgIHRoaXNcclxuICAgICAgICAgICAgLiRjdHhcclxuICAgICAgICAgICAgLmZpbGwoKVxyXG4gICAgICAgIHRoaXMuJGN0eC5zdHJva2UoKVxyXG4gICAgICAgIHRoaXNcclxuICAgICAgICAgICAgLiRjdHhcclxuICAgICAgICAgICAgLmNsb3NlUGF0aCgpXHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgQmFzZSBmcm9tICcuL0Jhc2UnXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQb2x5TGluZSBleHRlbmRzIEJhc2V7XHJcbiAgICBfcmVuZGVyKCkge1xyXG4gICAgICAgIGxldCB7JHN0eWxlLCAkY3R4fSA9IHRoaXNcclxuICAgICAgICBsZXQge3BvaW50cywgc3Ryb2tlU3R5bGUgPSAnIzAwMCcsIHN0cm9rZVdpZHRoID0gMX0gPSAkc3R5bGVcclxuICAgICAgICAkY3R4LmJlZ2luUGF0aCgpXHJcbiAgICAgICAgJGN0eC5tb3ZlVG8oLi4ucG9pbnRzWzBdKVxyXG4gICAgICAgIHBvaW50cy5mb3JFYWNoKHAgPT4ge1xyXG4gICAgICAgICAgICAkY3R4LmxpbmVUbyguLi5wKVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgJGN0eC5zdHJva2VTdHlsZSA9IHN0cm9rZVN0eWxlXHJcbiAgICAgICAgJGN0eC5saW5lV2lkdGggPSBzdHJva2VXaWR0aFxyXG4gICAgICAgICRjdHguc3Ryb2tlKClcclxuICAgICAgICAkY3R4LmNsb3NlUGF0aCgpXHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgQmFzZSBmcm9tICcuL0Jhc2UnXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQb2x5R29uIGV4dGVuZHMgQmFzZXtcclxuICAgIF9yZW5kZXIoKSB7XHJcbiAgICAgICAgbGV0IHtwb2ludHMsIHN0cm9rZVN0eWxlID0gJyMwMDAnLCBzdHJva2VXaWR0aCA9IDEsIGZpbGxTdHlsZSA9ICcjMDAwJ30gPSB0aGlzLiRzdHlsZVxyXG4gICAgICAgIGxldCB7JGN0eH0gPSB0aGlzXHJcbiAgICAgICAgJGN0eC5zYXZlKClcclxuICAgICAgICAvLyAkY3R4LnRyYW5zbGF0ZSgyNTAsIDIwMClcclxuICAgICAgICAkY3R4LnJvdGF0ZShNYXRoLlBJIC8gMjApXHJcbiAgICAgICAgLy8gdGhpcy5fcm90YXRlKClcclxuICAgICAgICAkY3R4LmJlZ2luUGF0aCgpXHJcbiAgICAgICAgJGN0eC5tb3ZlVG8oLi4ucG9pbnRzWzBdKVxyXG4gICAgICAgIHBvaW50cy5mb3JFYWNoKHBvaW50ID0+IHtcclxuICAgICAgICAgICAgJGN0eC5saW5lVG8oLi4ucG9pbnQpXHJcbiAgICAgICAgfSlcclxuICAgICAgICAkY3R4LmxpbmVUbyguLi5wb2ludHNbMF0pXHJcbiAgICAgICAgJGN0eC5zdHJva2VTdHlsZSA9IHN0cm9rZVN0eWxlXHJcbiAgICAgICAgJGN0eC5saW5lV2lkdGggPSBzdHJva2VXaWR0aFxyXG4gICAgICAgICRjdHguZmlsbFN0eWxlID0gZmlsbFN0eWxlXHJcbiAgICAgICAgJGN0eC5zdHJva2UoKVxyXG4gICAgICAgICRjdHguZmlsbCgpXHJcbiAgICAgICAgJGN0eC5jbG9zZVBhdGgoKVxyXG4gICAgICAgICRjdHgucmVzdG9yZSgpXHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgQnZhcyBmcm9tICcuLi9CdmFzJ1xyXG5cclxuaW1wb3J0IFBvaW50IGZyb20gJy4vUG9pbnQnXHJcbmltcG9ydCBDaXJjbGUgZnJvbSAnLi9DaXJjbGUnXHJcbmltcG9ydCBQb2x5TGluZSBmcm9tICcuL1BvbHlMaW5lJ1xyXG5pbXBvcnQgUG9seUdvbiBmcm9tICcuL1BvbHlHb24nXHJcblxyXG5CdmFzLlBvaW50ID0gUG9pbnRcclxuQnZhcy5DaXJjbGUgPSBDaXJjbGVcclxuQnZhcy5Qb2x5TGluZSA9IFBvbHlMaW5lXHJcbkJ2YXMuUG9seUdvbiA9IFBvbHlHb25cclxuXHJcbmV4cG9ydHtcclxuICAgIFBvaW50LFxyXG4gICAgQ2lyY2xlLFxyXG4gICAgUG9seUxpbmUsXHJcbiAgICBQb2x5R29uXHJcbn0iXSwibmFtZXMiOlsiYWRkQ2xhc3MiLCJlbCIsImNsYXNzTmFtZSIsImNsYXNzTGlzdCIsImFkZCIsIkJ2YXMiLCJkaXNhYmxlQ3Vyc29yIiwiZGlzYWJsZUV2ZW50cyIsIiRlbCIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsIiRjYW52YXMiLCJjcmVhdGVFbGVtZW50Iiwid2lkdGgiLCJvZmZzZXRXaWR0aCIsImhlaWdodCIsIm9mZnNldEhlaWdodCIsIiRjdHgiLCJnZXRDb250ZXh0IiwiYXBwZW5kIiwiJGxheWVycyIsImFkZEV2ZW50TGlzdGVuZXIiLCJfY3Vyc29yIiwiYmluZCIsImxheWVyIiwicmVyZW5kZXIiLCJwdXNoIiwiX3JlbmRlciIsImZpbHRlciIsImxheWVySSIsImNsZWFyUmVjdCIsInNvcnQiLCJhIiwiYiIsIiRzdHlsZSIsInpJbmRleCIsImUiLCJjbGVhciIsImN1cnNvciIsIl9zb3J0IiwiZm9yRWFjaCIsIiRzaGFwZXMiLCJzaGFwZSIsImlzUG9pbnRJblBhdGgiLCJvZmZzZXRYIiwib2Zmc2V0WSIsInN0eWxlIiwiTGF5ZXIiLCJwcm9wcyIsIiRwcm9wcyIsIiRidmFzIiwiYnZhcyIsImFkZExheWVyIiwicmVtb3ZlTGF5ZXIiLCJzaGFwZUkiLCJnZXRCb3VuZEZyb21Db29yZGluYXRlcyIsInBvbHkiLCJtaW5YIiwibWluWSIsIm1heFgiLCJtYXhZIiwiaW5kZXgiLCJ4IiwieSIsImdldENpcmNsZUJvdW5kIiwiY2lyY2xlIiwicG9zaXRpb24iLCJyYWRpdXMiLCJwb2ludERpc3RhbmNlIiwicDEiLCJwMiIsIk1hdGgiLCJzcXJ0IiwiaXNQb2ludEluUmVjdCIsInAiLCJyZWN0IiwiaXNQb2ludEluQ2lyY2xlIiwiYm91bmQiLCJnZXRTaGFwZUJvdW5kIiwic2hhcGVzIiwic2l6ZSIsInBvaW50cyIsImlzUG9pbnRJblNoYXBlIiwiQmFzZSIsIiRsYXllciIsIiRldmVudHMiLCJhZGRTaGFwZSIsInJlbW92ZVNoYXBlIiwiZXZUeXBlIiwiZm4iLCJmdW5jIiwiZXZlbnQiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwicm90YXRlIiwicm90YXRlQ2VudGVyIiwiZ2V0Qm91bmQiLCJ0cmFuc2xhdGUiLCJQb2ludCIsImNvbG9yIiwiYmVnaW5QYXRoIiwiYXJjIiwiUEkiLCJmaWxsU3R5bGUiLCJmaWxsIiwiY2xvc2VQYXRoIiwiQ2lyY2xlIiwic3Ryb2tlU3R5bGUiLCJzdHJva2VXaWR0aCIsInN0YXJ0QW5nbGUiLCJlbmRBbmdsZSIsImNvdW50ZXJjbG9ja3dpc2UiLCJsaW5lV2lkdGgiLCJzdHJva2UiLCJQb2x5TGluZSIsIm1vdmVUbyIsImxpbmVUbyIsIlBvbHlHb24iLCJzYXZlIiwicG9pbnQiLCJyZXN0b3JlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUFBQTs7RUFFQSxTQUFTQSxRQUFULENBQWtCQyxFQUFsQixFQUFzQkMsU0FBdEIsRUFBaUM7RUFDN0JELE9BQ0tFLFNBREwsQ0FFS0MsR0FGTCxDQUVTRixTQUZUO0VBR0g7O01BRW9CRztFQUNqQix3QkFBZ0Q7RUFBQSxZQUFuQ0osRUFBbUMsUUFBbkNBLEVBQW1DO0VBQUEsWUFBL0JLLGFBQStCLFFBQS9CQSxhQUErQjtFQUFBLFlBQWhCQyxhQUFnQixRQUFoQkEsYUFBZ0I7RUFBQTs7RUFDNUMsYUFBS0MsR0FBTCxHQUFXQyxTQUFTQyxhQUFULENBQXVCVCxFQUF2QixDQUFYO0VBQ0EsYUFBS1UsT0FBTCxHQUFlRixTQUFTRyxhQUFULENBQXVCLFFBQXZCLENBQWY7RUFDQSxhQUFLRCxPQUFMLENBQWFFLEtBQWIsR0FBcUIsS0FBS0wsR0FBTCxDQUFTTSxXQUE5QjtFQUNBLGFBQUtILE9BQUwsQ0FBYUksTUFBYixHQUFzQixLQUFLUCxHQUFMLENBQVNRLFlBQS9CO0VBQ0FoQixpQkFBUyxLQUFLUSxHQUFkLEVBQW1CLGNBQW5CO0VBQ0FSLGlCQUFTLEtBQUtXLE9BQWQsRUFBdUIsZUFBdkI7RUFDQSxhQUFLTSxJQUFMLEdBQVksS0FDUE4sT0FETyxDQUVQTyxVQUZPLENBRUksSUFGSixDQUFaO0VBR0EsYUFDS1YsR0FETCxDQUVLVyxNQUZMLENBRVksS0FBS1IsT0FGakI7RUFHQSxhQUFLUyxPQUFMLEdBQWUsRUFBZjtFQUNBLFlBQUcsQ0FBQ2QsYUFBSixFQUFt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
