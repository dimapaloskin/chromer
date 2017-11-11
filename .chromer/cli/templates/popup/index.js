/** @jsx h */
import { h, render } from 'preact'

const style = {
  width: '300px',
  height: '300px'
}

render((
  <div style={style}>
    <span>Hello, world!</span>
  </div>
), document.querySelector('#app'))
