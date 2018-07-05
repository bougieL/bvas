// import {pointDistance} from '../util/distance'
import {isPointInShape, getShapeBound} from '../util/isPointInShape'

export default class Base {
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
        this.$style = style
        this
            .$layer
            .addShape(this, rerender)
        return this
    }
    on(evType, fn) {
        let func = (e) => {
            // console.log(isPointInShape([e.offsetX, e.offsetY], this))
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
        return this
    }
    getStyle() {
        return this.$style
    }
    getBound() {
        return getShapeBound(this)
    }
    _rotate() {
        let {$ctx, $style} = this
        let {rotate, rotateCenter} = $style
        if(!rotateCenter) {
            let bound = this.getBound()
            let [[minX, minY], [maxX, maxY]] = bound
            rotateCenter = [(minX + maxX) / 2, (minY + maxY) / 2]
        }
        $ctx.translate(...rotateCenter)
        $ctx.rotate(rotate)
    }
}