import {isPointInShape} from './util/isPointInShape'

function addClass(el, className) {
    el
        .classList
        .add(className)
}

export default class Bvas {
    constructor({el, disableCursor, disableEvents}) {
        this.$disableCursor = disableCursor
        this.$disableEvents = disableEvents
        this.$el = document.querySelector(el)
        this.$canvas = document.createElement('canvas')
        this.$canvas.width = this.$el.offsetWidth
        this.$canvas.height = this.$el.offsetHeight
        addClass(this.$el, 'bvas-wrapper')
        addClass(this.$canvas, 'bvas-viewport')
        this.$ctx = this
            .$canvas
            .getContext('2d')
        this
            .$el
            .append(this.$canvas)
        this.$layers = []
    }
    addLayer(layer, rerender = true) {
        this
            .$layers
            .push(layer)
        if(rerender) {
            this._render()
        }
    }
    removeLayer(layer, rerender = true) {
        this.$layers = this.$layers.filter(layerI => {
            return layerI !== layer
        })
        if(rerender) {
            this._render()
        }
    }
    clear() {
        this
            .$ctx
            .clearRect(0, 0, this.$canvas.width, this.$canvas.height)
    }
    getViewport() {
        return this.$canvas
    }
    _sort() {
        this
            .$layers
            .sort((a, b) => a.$style.zIndex - b.$style.zIndex)
    }
    _cursor(e) {
        let cursor = null
        breakPoint:
        for(let i = this.$layers.length - 1; i > -1; i--) {
            let layer = this.$layers[i]
            for(let j = layer.$shapes.length - 1; j > -1; j--) {
                let shape = layer.$shapes[j]
                if(shape.$style.cursor) {
                    if(isPointInShape([e.offsetX, e.offsetY], shape)) {
                        cursor = shape.$style.cursor
                        break breakPoint
                    }
                }
            }
        }
        this.$canvas.style.cursor = cursor
    }
    _events() {
        for(let i = this.$layers.length - 1; i > -1; i--) {
            let layer = this.$layers[i]
            for(let j = layer.$shapes.length - 1; j > -1; j--) {
                let shape = layer.$shapes[j]
                shape.$events.forEach(event => {
                    function func(e) {
                        if(isPointInShape([e.offsetX, e.offsetY], shape)) {
                            event.fn(shape, e)
                        }
                    }
                    this.$canvas.removeEventListener(event.evType, func)
                    this.$canvas.addEventListener(event.evType, func)
                })
                
            }
        }
    }
    _render() {
        this.clear()
        this.$layers.forEach(layer => {
            layer._render()
        })
        if(!this.$disableEvents) {
            this._events()
        }
        
        if(!this.$disableCursor) {
            this.$canvas.removeEventListener('mousemove', this._cursor.bind(this))
            this.$canvas.addEventListener('mousemove', this._cursor.bind(this))
        }
    }
}