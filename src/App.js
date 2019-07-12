import React from 'react'
import Voice from './voice'
import Keyboard from './Keyboard'
import fetchData from './http'

const voice = new Voice()
const KEYS = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';']

class Piano extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      waveform: 'sine',
      activeIndex: -1,
      loading: false
    }

    this.pianoRef = React.createRef()

    this.handleChangeWave = this.handleChangeWave.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleKeyUp = this.handleKeyUp.bind(this)
    this.handleClickKeyboard = this.handleClickKeyboard.bind(this)
    this.handleAutoPlay = this.handleAutoPlay.bind(this)
  }

  componentDidMount() {
    document.title = this.state.waveform
    this.pianoRef.current.focus()
  }

  componentWillUnmount() {
    console.log('====unmount====')
  }

  componentDidUpdate() {
    document.title = this.state.waveform
  }

  play(index) {
    voice.play(index, this.state.waveform)
  }

  handleKeyDown(e) {
    console.log('====down====')
    const keyIndex = KEYS.indexOf(e.key)
    if (keyIndex < 0) {
      return
    }
    this.setState({
      activeIndex: keyIndex
    })
    voice.play(keyIndex, this.state.waveform)
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

  handleClickKeyboard(index) {
    voice.play(index, this.state.waveform)
  }

  autoPlay(music) {
    let currentSection
    let currentPitch
    const timer = setInterval(() => {
      if (!music.length && !currentSection.length) {
        clearInterval(timer)
        this.setState({
          activeIndex: -1
        })
        return
      }
      if ((!currentSection || !currentSection.length) && music.length) {
        currentSection = Array.from(music.shift())
        currentSection.unshift(null)
      }
      currentPitch = currentSection.shift()
      this.setState(
        {
          activeIndex: currentPitch - 1
        },
        () => {
          setTimeout(() => {
            this.setState({
              activeIndex: -1
            })
          }, 200)
        }
      )
      currentPitch && voice.play(currentPitch - 1, this.state.waveform)
    }, 300)
  }

  handleAutoPlay() {
    this.setState({
      loading: true
    })
    fetchData().then(res => {
      console.log('====res====', res)
      this.setState({
        loading: false
      })
      this.autoPlay(res.data)
    })
  }

  render() {
    return (
      <div className="wrapper">
        <div
          className="piano"
          tabIndex="0"
          ref={this.pianoRef}
          onKeyDown={this.handleKeyDown}
          onKeyUp={this.handleKeyUp}
        >
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
            {this.state.loading && <div>loading</div>}
            <div>
              <button onClick={this.handleAutoPlay}>auto play</button>
            </div>
          </div>
          <Keyboard
            activeIndex={this.state.activeIndex}
            onClick={index => {
              this.handleClickKeyboard(index)
            }}
          />
        </div>
      </div>
    )
  }
}

export default class App extends React.Component {
  state = {
    showPiano: true
  }

  render() {
    return (
      <>
        <div>
          <button
            onClick={() => {
              this.setState({
                showPiano: false
              })
            }}
          >
            distroy
          </button>
        </div>
        {this.state.showPiano ? <Piano /> : null}
      </>
    )
  }
}
