import { h, render } from 'preact'

console.log('hello from popup')

render((
  <div id='foo'>
    <span>Hello, world!</span>
  </div>
), document.querySelector('#app'))
