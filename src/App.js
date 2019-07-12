import React, { useState, useEffect, useRef } from 'react'
import Voice from './voice'
import Keyboard from './Keyboard'
import fetchData from './http'

const voice = new Voice()
const KEYS = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';']

// 这种自定义组件可以设计的更通用一些，这个只是针对这种场景的demo
function useFetch(dependency) {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])

  useEffect(() => {
    if(!dependency){
      return
    }
    setLoading(true)
    fetchData().then(res => {
      console.log('====res====', res)
      setLoading(false)
      setData(res.data)
    })
  }, [dependency])

  return [loading, data]
}

function Piano(props) {
  const [waveform, setWaveform] = useState('sine')
  const [activeIndex, setActiveIndex] = useState(-1)
  // const [loading, setLoading] = useState(false)
  const [musicId, setMusicId] = useState(0)
  // const [music, setMusic] = useState(null)
  const pianoRef = useRef()

  const [loading, music] = useFetch(musicId)

  useEffect(() => {
    console.log('====mount====')
    document.title = waveform
    pianoRef.current.focus()
    return () => {
      console.log('====unmount====')
    }
  }, [waveform])

  useEffect(() => {
    if(!musicId){
      return
    }
    let currentSection = []
    let currentPitch
    const timer = setInterval(() => {
      if (!music.length && !currentSection.length) {
        clearInterval(timer)
        setActiveIndex(-1)
        return
      }
      if ((!currentSection || !currentSection.length) && music.length) {
        currentSection = Array.from(music.shift())
        currentSection.unshift(null)
      }
      currentPitch = currentSection.shift()
      setActiveIndex(currentPitch - 1)
      setTimeout(() => {
        setActiveIndex(-1)
      }, 200)
      currentPitch && voice.play(currentPitch - 1, waveform)
    }, 300)
  }, [music, musicId, waveform])

  const handleKeyDown = e => {
    console.log('====down====')
    const keyIndex = KEYS.indexOf(e.key)
    if (keyIndex < 0) {
      return
    }
    setActiveIndex(keyIndex)
    voice.play(keyIndex, waveform)
  }

  const handleKeyUp = () => {
    console.log('====up====')
    setActiveIndex(-1)
  }
  const handleChangeWave = e => {
    setWaveform(e.target.value)
  }

  const handleClickKeyboard = index => {
    voice.play(index, waveform)
  }

  const handleAutoPlay = () => {
    // setLoading(true)
    // fetchData().then(res => {
    //   console.log('====res====', res)
    //   setLoading(false)
    //   autoPlay(res.data)
    // })
    setMusicId(id => id + 1)
  }

  return (
    <div className="wrapper">
      <div
        className="piano"
        tabIndex="0"
        ref={pianoRef}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
      >
        <div className="controls">
          <div>
            <label htmlFor="waveform">Waveform</label>
            <select
              className="js-control"
              value={waveform}
              onChange={handleChangeWave}
            >
              <option value="sine">Sine</option>
              <option value="triangle">Triangle</option>
              <option value="sawtooth">Sawtooth</option>
              <option value="square">Square</option>
            </select>
          </div>
          {loading && <div>loading</div>}
          <div>
            <button onClick={handleAutoPlay}>auto play</button>
          </div>
        </div>
        <Keyboard
          activeIndex={activeIndex}
          onClick={index => {
            handleClickKeyboard(index)
          }}
        />
      </div>
    </div>
  )
}

export default function App(props) {
  const [showPiano, setShowPiano] = useState(true)

  return (
    <>
      <div>
        <button
          onClick={() => {
            setShowPiano(false)
          }}
        >
          distroy
        </button>
      </div>
      {showPiano ? <Piano /> : null}
    </>
  )
}
