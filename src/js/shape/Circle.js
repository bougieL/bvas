import Base from './Base'

export default class Circle extends Base {
    _render() {
        let { position, radius, strokeStyle = '#000', fillStyle = '#000', strokeWidth = 1, startAngle = 0, endAngle = Math.PI * 2, counterclockwise = true } = this.$style
        this
            .$ctx
            .beginPath()
        this
            .$ctx
            .arc(position[0], position[1], radius, startAngle, endAngle, counterclockwise);
        this.$ctx.fillStyle = fillStyle
        this.$ctx.strokeStyle = strokeStyle
        this.$ctx.lineWidth = strokeWidth
        this
            .$ctx
            .fill()
        this.$ctx.stroke()
        this
            .$ctx
            .closePath()
    }
}