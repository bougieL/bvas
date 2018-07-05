import Base from './Base'

export default class Point extends Base{
    _render() { 
        let {position, size = 2, color = '#000'} = this.$style
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