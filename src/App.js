import React from 'react'
import Voice from './voice'
import Piano from './Piano'

const voice = new Voice()
const keys = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';']

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      waveform: 'sine',
      activeIndex: -1
    }

    this.handleChangeWave = this.handleChangeWave.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleKeyUp = this.handleKeyUp.bind(this)
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown)
    window.addEventListener('keyup', this.handleKeyUp)
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown)
    window.removeEventListener('keyup', this.handleKeyUp)
  }

  play(index) {
    voice.play(index, this.state.waveform)
  }

  handleKeyDown(e) {
    console.log('====down====')
    const keyIndex = keys.indexOf(e.key)
    if (keyIndex < 0) {
      return
    }
    this.setState({
      activeIndex: keyIndex
    })
    this.play(keyIndex)
  }

  handleKeyUp() {
    console.log('====up====')
    this.setState({
      activeIndex: -1
    })
  }
  handleChangeWave(e) {
    this.setState({
      waveform: e.target.value
    })
  }

  render() {
    return (
      <div className="wrapper">
        <div className="piano">
          <div className="controls">
            <div>
              <label htmlFor="waveform">Waveform</label>
              <select
                className="js-control"
                value={this.state.waveform}
                onChange={this.handleChangeWave}
              >
                <option value="sine">Sine</option>
                <option value="triangle">Triangle</option>
                <option value="sawtooth">Sawtooth</option>
                <option value="square">Square</option>
              </select>
            </div>
          </div>
          <Piano
            activeIndex={this.state.activeIndex}
            onClick={index => {
              this.play(index)
            }}
          />
        </div>
      </div>
    )
  }
}
