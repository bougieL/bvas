
/**
 *
 * @description 获取坐标串的边界
 * @export
 * @param {Array} poly
 * @returns {Array}
 */
export function getBoundFromCoordinates(poly) {
    let minX, minY, maxX, maxY
    for(let index in poly) {
        let x = poly[index][0]
        let y = poly[index][1]
        if(index == 0) {
            minX = maxX = x
            minY = maxY = y
        } else {
            minX = x < minX ? x : minX
            maxX = x > maxX ? x : maxX
            minY = y < minY ? y : minY
            maxY = y > maxY ? y : maxY
        }
    }
    return [[minX, minY], [maxX, maxY]]
}

/**
 * @description 获取圆的边界
 *
 * @export
 * @param {Object} circle
 * @returns {Array}
 */
export function getCircleBound(circle) {
    let {position, radius} = circle
    let [x, y] = position
    return [[x - radius, y - radius], [x + radius, y + radius]]
}