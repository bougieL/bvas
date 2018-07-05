import Base from './Base'

export default class PolyLine extends Base{
    _render() {
        let {$style, $ctx} = this
        let {points, strokeStyle = '#000', strokeWidth = 1} = $style
        $ctx.beginPath()
        $ctx.moveTo(...points[0])
        points.forEach(p => {
            $ctx.lineTo(...p)
        })
        $ctx.strokeStyle = strokeStyle
        $ctx.lineWidth = strokeWidth
        $ctx.stroke()
        $ctx.closePath()
    }
}