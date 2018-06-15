// import {pointDistance} from '../util/distance'
import {isPointInShape} from '../util/isPointInShape'

export default class Point {
    constructor({style, props}) {
        this.$style = style
        this.$props = props
        this.$layer = null
        this.$ctx = null
        this.$canvas = null
        this.$bvas = null
        this.$events = []
    }
    addTo(layer, rerender = true) {
        this.$canvas = layer.$canvas
        this.$layer = layer
        this.$ctx = layer.$ctx
        this.$bvas = layer.$bvas
        layer.addShape(this, rerender)
        return this
    }
    setStyle(style, rerender = true) {
        this
            .$layer
            .removeShape(this, false)
        Object.assign(this.$style, style)
        this
            .$layer
            .addShape(this, rerender)
        return this
    }
    on(evType, fn) {
        let func = (e) => {
            if(isPointInShape([e.offsetX, e.offsetY], this)) {
                fn(this, e)
            }
        }
        this.$events.push({
            evType,
            func,
            fn
        })
        this.$canvas.addEventListener(evType, func)
        // this.$bvas._events()
    }
    un(evType, fn) {
        this.$events = this.$events.filter(event => {
            if(event.evType === evType && event.fn === fn) {
                this.$canvas.removeEventListener(evType, event.func)
                return true
            }
        })
    }
    remove() {
        this
            .$layer
            .removeShape(this)
    }
    _render() {
        let {position, size, color, cursor} = this.$style
        size = size || 2
        color = color || '#000'
        this
            .$ctx
            .beginPath()
        this
            .$ctx
            .arc(position[0], position[1], size, 0, 2 * Math.PI);
        this.$ctx.fillStyle = color
        this
            .$ctx
            .fill()
        this
            .$ctx
            .closePath()
    }
}