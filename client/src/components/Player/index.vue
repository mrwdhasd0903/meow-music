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
      <div class="pointer" :style="{width:(progress * 100 )+'%'}">
        <div class="draw"></div>
      </div>
    </div>
    <div class="controller">
      <div class="center">
        <Svg name="c_last" @click="last" />
        <Svg :name="state?'c_play':'c_stop'" @click="centerClick" />
        <Svg name="c_next" @click="next" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'Player',
  emits: ['next', 'last'],
  props: {
    currSrc: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // 播放总时长
      duration: 0,
      // 当前已播放时长
      currDuration: 0,
      // 当前播放状态 0 暂停 1 播放
      state: 0
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
    progress() {
      if (this.duration === 0 || this.currDuration == 0) return 0
      return this.currDuration / this.duration
    },
    audio() {
      return this.$refs.audio
    }
  },
  methods: {
    next() {
      this.$emit('next')
      this.audio.pause()
    },
    last() {
      this.$emit('last')
      this.audio.pause()
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
      const pro = e.offsetX / this.$refs.progress.clientWidth
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
  mounted() {}
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
      .draw {
        position: absolute;
        height: 8px;
        width: 8px;
        border-radius: 4px;
        background-color: #fff;
        right: 0;
        top: -2px;
        right: -4px;
      }
    }
  }
  .controller {
    display: flex;
    justify-content: center;
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