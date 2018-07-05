export default class Layer {
    constructor({style, props} = {}) {
        this.$style = style
        this.$props = props
        this.$shapes = []
        this.$bvas = null
        this.$ctx = null
        this.$canvas = null
    }
    addTo(bvas, rerender = true) {
        this.$canvas = bvas.$canvas
        this.$ctx = bvas.$ctx
        this.$bvas = bvas
        bvas.addLayer(this, rerender)
        return this
    }
    addShape(shape, rerender = true) {
        this.$bvas.removeLayer(this, false)
        this
            .$shapes
            .push(shape)
        this.$bvas.addLayer(this, rerender)
        return this
    }
    removeShape(shape, rerender = true) {
        this.$bvas.removeLayer(this, false)
        this.$shapes = this.$shapes.filter(shapeI => {
            return shapeI !== shape
        })
        this.$bvas.addLayer(this, rerender) 
        return this
    }
    remove(rerender = true) {
        this.$bvas.removeLayer(this, rerender)
        return this
    }
    _sort() {
        this
            .$shapes
            .sort((a, b) => a.$style.zIndex - b.$style.zIndex)
    }
    _render() {
        this._sort()
        this
            .$shapes
            .forEach(shape => {
                shape._render()
            })
    }
}