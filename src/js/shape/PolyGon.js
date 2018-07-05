import Base from './Base'

export default class PolyGon extends Base{
    _render() {
        let {points, strokeStyle = '#000', strokeWidth = 1, fillStyle = '#000'} = this.$style
        let {$ctx} = this
        $ctx.save()
        // $ctx.translate(250, 200)
        $ctx.rotate(Math.PI / 20)
        // this._rotate()
        $ctx.beginPath()
        $ctx.moveTo(...points[0])
        points.forEach(point => {
            $ctx.lineTo(...point)
        })
        $ctx.lineTo(...points[0])
        $ctx.strokeStyle = strokeStyle
        $ctx.lineWidth = strokeWidth
        $ctx.fillStyle = fillStyle
        $ctx.stroke()
        $ctx.fill()
        $ctx.closePath()
        $ctx.restore()
    }
}