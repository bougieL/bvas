import {getBoundFromCoordinates, getCircleBound} from './bound'

import {pointDistance} from './distance'

import * as shapes from '../shape/index'

// http://www.html-js.com/article/1528

/**
 * @description 射线法判断点是否在多边形内部
 * @param {Array} p 待判断的点，格式：[X坐标, Y坐标 ]
 * @param {Array} poly 多边形顶点，数组成员的格式同 p
 * @return {Boolean} 点 p 是否多边形 poly 内部
 */
export function isPointInPolygon(p, poly) {
    let px = p[0],
        py = p[1],
        flag = false
    for (let i = 0, l = poly.length, j = l - 1; i < l; j = i, i++) {
        let sx = poly[i][0],
            sy = poly[i][1],
            tx = poly[j][0],
            ty = poly[j][1]
        // 点与多边形顶点重合
        if ((sx === px && sy === py) || (tx === px && ty === py)) {
            flag = true
        }
        // 判断线段两端点是否在射线两侧
        if ((sy < py && ty >= py) || (sy >= py && ty < py)) {
            // 线段上与射线 Y 坐标相同的点的 X 坐标
            let x = sx + (py - sy) * (tx - sx) / (ty - sy)
            // 点在多边形的边上
            if (x === px) {
                flag = true
            }
            // 射线穿过多边形的边界
            if (x > px) {
                flag = !flag
            }
        }
    }
    // 射线穿过多边形边界的次数为奇数时点在多边形内
    return flag
}

/**
 * @description 判断点是否在矩形内
 *
 * @export
 * @param {Array} p
 * @param {Array} rect
 * @returns {Boolean}
 */
export function isPointInRect(p, rect) {
    let [
        [
            minX, minY
        ],
        [maxX, maxY]
    ] = rect
    let [x,
        y] = p
    return !(x < minX || x > maxX || y < minY || y > maxY)
}

/**
 * @description 判断点是否在线段上
 *
 * @export
 * @param {Array} p
 * @param {Array} line
 * @returns
 */
export function isPointOnLine(p, line) {
    let bound = getBoundFromCoordinates(line)
    if (!isPointInRect(p, bound)) {
        return false
    }
    let [x,
        y] = p
    let [
        [
            minX, minY
        ],
        [maxX, maxY]
    ] = bound
    if ((y - minY) / (x - minX) === (maxY - y) / (maxX - x)) {
        return true
    } else {
        return false
    }
}

/**
 * @description 判断点是否在polyline
 * @param {Array} p 待判断的点，格式：{ x: X坐标, y: Y坐标 }
 * @param {Array} poly 多边形顶点，数组成员的格式同 p
 * @return {Boolean} 点 p 和多边形 poly 的几何关系
 */
export function isPointOnPolyLine(p, poly) {
    let bound = getBoundFromCoordinates(poly)
    if (!isPointInRect(p, bound)) {
        return false
    }
    let flag = false
    for (let i = 0; i < poly.length - 1; i++) {
        if (isPointOnLine(p, [
            poly[i],
            poly[i + 1]
        ])) {
            flag = true
            break
        }
    }
    return flag
}

/**
 * @description 判断点是否在圆形内
 *
 * @export
 * @param {Array} p
 * @param {Object} circle
 * @returns {Boolean}
 */
export function isPointInCircle(p, circle) {
    let bound = getCircleBound(circle)
    // console.log(isPointInRect(p, bound))
    if (!isPointInRect(p, bound)) {
        return false
    }
    if (pointDistance(p, circle.position) > circle.radius) {
        return false
    } else {
        return true
    }
}

export function getShapeBound(shape) {
    if(shape instanceof shapes.Point) {
        let {position, size} = shape.$style
        let [x, y] = position
        return [[x - size, y - size], [x + size, y + size]]
    }
    if(shape instanceof shapes.Circle) {
        let {position, radius} = shape.$style
        let [x, y] = position
        return [[x - radius, y - radius], [x + radius, y + radius]]
    }
    if(shape instanceof shapes.PolyLine || shape instanceof shapes.PolyGon) {
        let {points} = shape.$style
        return getBoundFromCoordinates(points)
    }
}

export function isPointInShape(p, shape) {
    // let type = shape.constructor.name
    // alert(type)
    // console.log(type)
    if (shape instanceof shapes.Point) {
        let {position, size} = shape.$style
        let circle = {
            position,
            radius: size
        }
        // console.log(p, circle)
        return isPointInCircle(p, circle)
    }
    if (shape instanceof shapes.Circle) {
        let {position, radius} = shape.$style
        let circle = {
            position,
            radius
        }
        // console.log(p, circle)
        return isPointInCircle(p, circle)
    }
}