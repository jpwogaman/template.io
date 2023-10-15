import reactCSS from 'reactcss'
import { Component, Fragment } from 'react'
import { SketchPicker } from 'react-color'

export default class ColorPicker extends Component {
  state = {
    displayColorPicker: false,
    color: {
      a: 1,
      b: 19,
      g: 112,
      r: 241
    }
  }

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker })
  }

  handleClose = () => {
    this.setState({ displayColorPicker: false })
  }

  handleChange = (color: { rgb: any }) => {
    this.setState({ color: color.rgb })
    console.log(color.rgb)
  }

  render() {
    const styles = reactCSS({
      default: {
        color: {
          height: '14px',
          borderRadius: '2px',
          background: `rgba(
                        ${this.state.color.r}, 
                        ${this.state.color.g}, 
                        ${this.state.color.b}, 
                        ${this.state.color.a})`
        },
        swatch: {
          padding: '5px',
          background: '#fff',
          borderRadius: '1px',
          boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
          cursor: 'pointer'
        },
        popover: {
          position: 'absolute',
          zIndex: '2'
        },
        cover: {
          position: 'fixed',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px'
        }
      }
    })

    /*
        C:\Users\jpwog\github\template.io\node_modules\@types\react\index.d.ts
        C:\Users\jpwog\github\template.io\node_modules\@types\react-color\index.d.ts'
        
        had to add types in these docs, otherwise "color" and "style" (below) in the return were throwing errors
        */

    const { r, g, b, a } = this.state.color
    const { displayColorPicker, color } = this.state

    return (
      <Fragment>
        <div
          style={styles.swatch}
          onClick={this.handleClick}>
          <div
            className={`h-[14px] rounded-sm bg-[rgba(${r},${g},${b},${a})]`}
          />
        </div>
        {displayColorPicker ? (
          <div className='absolute z-[2]'>
            <div
              className={`h-[14px] rounded-sm bg-[rgba(${r},${g},${b},${a})]`}
              onClick={this.handleClose}
            />
            <SketchPicker
              color={color}
              onChange={this.handleChange}
            />
          </div>
        ) : null}
      </Fragment>
    )
  }
}
