export default class Voice {
  constructor() {
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    this.arrFrequency = [
      196.0,
      220.0,
      246.94,
      261.63,
      293.66,
      329.63,
      349.23,
      392.0,
      440.0,
      493.88,
      523.25,
      587.33,
      659.25,
      698.46,
      783.99,
      880.0,
      987.77,
      1046.5
    ]
  }

  play(index, waveform) {
    const audioCtx = this.audioCtx
    // 改变索引，下一次hover时候使用

    // 创建一个OscillatorNode, 它表示一个周期性波形（振荡），基本上来说创造了一个音调
    var oscillator = audioCtx.createOscillator()
    // 创建一个GainNode,它可以控制音频的总音量
    var gainNode = audioCtx.createGain()
    // 把音量，音调和终节点进行关联
    oscillator.connect(gainNode)
    // audioCtx.destination返回AudioDestinationNode对象，表示当前audio context中所有节点的最终节点，一般表示音频渲染设备
    gainNode.connect(audioCtx.destination)
    // 指定音调的类型，其他还有square|triangle|sawtooth
    oscillator.type = waveform || 'sine'
    // 设置当前播放声音的频率，也就是最终播放声音的调调
    oscillator.frequency.value = this.arrFrequency[index]
    // 当前时间设置音量为0
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime)
    // 0.01秒后音量为1
    gainNode.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 0.01)
    // 音调从当前时间开始播放
    oscillator.start(audioCtx.currentTime)
    // 1秒内声音慢慢降低，是个不错的停止声音的方法
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1)
    // 1秒后完全停止声音
    oscillator.stop(audioCtx.currentTime + 1)
  }
}