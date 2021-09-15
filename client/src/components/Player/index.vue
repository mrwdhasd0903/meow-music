<template>
  <div class="Player">
    <audio
      class="audio"
      @ended="next"
      @timeupdate="timeupdate"
      @canplay="getInitData"
      @play="playEvent"
      @pause="pauseEvent"
      controls="controls"
      autoplay
      ref="audio"
    />
    <div class="progress" ref="progress" @click="progressClick">
      <div class="pointer" :style="{width:progressWidth}">
        <div class="drag" ref="drag"></div>
      </div>
    </div>
    <div class="controller">
      <div class="left"></div>
      <div class="center">
        <Svg name="c_last" @click="last" />
        <Svg :name="state?'c_play':'c_stop'" @click="centerClick" />
        <Svg name="c_next" @click="next" />
      </div>
      <div class="right">
        <Volume :set="setVolume"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Volume from '@/components/Volume/index.vue'
export default defineComponent({
  name: 'Player',
  emits: ['next', 'last'],
  props: {
    currSrc: {
      type: String,
      default: ''
    }
  },
  components: { Volume },
  data() {
    return {
      // 播放总时长
      duration: 0,
      // 当前已播放时长
      currDuration: 0,
      // 当前播放状态 0 暂停 1 播放
      state: 0,

      // 是否允许进度条点击 - 用于取消进度条拖动时触发click的bug
      allowProClick: true
    }
  },
  watch: {
    currSrc(src) {
      this.audio.src = src

      if (!this.state) {
        this.audio.play()
      }
    }
  },
  computed: {
    // 进度条宽度
    progressWidth() {
      return this.progress * 100 + '%'
    },
    // 当前进度 0 -1
    progress() {
      if (this.duration === 0 || this.currDuration == 0) return 0
      return this.currDuration / this.duration
    },
    audio() {
      return this.$refs.audio
    },
    drag() {
      return this.$refs.drag
    }
  },
  methods: {
    // 下一首
    next() {
      this.$emit('next')
      this.audio.pause()
    },
    // 上一首
    last() {
      this.$emit('last')
      this.audio.pause()
    },
    // 修改音量
    setVolume(v) {
      this.audio.volume = v
    },
    // 播放\暂停
    centerClick() {
      if (this.currSrc) {
        if (this.state) {
          this.audio.pause()
        } else {
          this.audio.play()
        }
      }
    },
    // 获取初始化数据
    getInitData() {
      const { duration } = this.audio
      this.duration = duration
    },
    // 时间更新
    timeupdate() {
      const { currentTime } = this.audio
      this.currDuration = currentTime
    },
    // 进度条点击
    progressClick(e) {
      if (this.allowProClick) {
        this.setProWidth(e.offsetX)
      }
    },
    // 设置进度条宽度
    setProWidth(width) {
      const pro = width / this.$refs.progress.clientWidth
      const _currDuration = pro * this.duration
      this.audio.currentTime = _currDuration
    },
    // 播放事件
    playEvent() {
      this.state = 1
    },
    // 暂停事件
    pauseEvent() {
      this.state = 0
    }
  },
  mounted() {
    this.drag.onmousedown = e => {
      const state = this.state
      this.audio.pause()
      this.allowProClick = false
      // 总进度长度
      const progressWidth = this.$refs.progress.clientWidth
      // 当前进度长度
      const baseWidth = progressWidth * this.progress
      // 当前播放状态
      document.onmousemove = m_e => {
        // 调整后的进度长度
        let offsetX = baseWidth + m_e.pageX - e.pageX
        // 溢出修正
        if (offsetX < 0) {
          offsetX = 0
        } else if (offsetX > progressWidth) {
          offsetX = progressWidth
        }
        this.setProWidth(offsetX)
      }
      document.onmouseup = u_e => {
        // 复原状态
        if (state) {
          this.audio.play()
        }
        document.onmousemove = null
        document.onmouseup = null
        setTimeout(() => {
          this.allowProClick = true
        }, 200)
      }
    }
  }
})
</script>

<style scoped lang='scss'>
.Player {
  .audio {
    display: none;
  }
  .progress {
    width: 100%;
    height: 4px;
    background-color: rgba(255, 255, 255, 0.4);
    border-radius: 2px;
    cursor: pointer;
    .pointer {
      height: 100%;
      background-color: rgba(255, 255, 255, 0.8);
      position: relative;
      border-radius: 2px;
      .drag {
        position: absolute;
        height: 8px;
        width: 8px;
        border-radius: 4px;
        background-color: #fff;
        top: -2px;
        right: -4px;
        box-shadow: -2px 0px 12px 2px rgba(0, 0, 0, 0.5);
        &:hover {
          background-color: $color2;
        }
      }
    }
  }
  .controller {
    display: flex;
    justify-content: space-between;
    .center {
      width: 170px;
      display: flex;
      justify-content: space-between;
      padding-top: 20px;
    }
    :deep() {
      .svg_icon {
        fill: $color1;
        font-size: 40px;
        cursor: pointer;
        &:hover {
          fill: $color2;
        }
      }
    }
  }
}
</style>