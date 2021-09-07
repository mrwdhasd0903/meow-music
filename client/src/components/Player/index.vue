<template>
  <audio
    @ended="next"
    @timeupdate="playing"
    @canplay="getInitData"
    controls="controls"
    autoplay
    ref="audio"
  />
  <div>
    <div @click="next">下一首</div>
    <div @click="last">上一首</div>
    <div>{{duration}}</div>
    <div>{{currDuration}}</div>
    <div>{{progress}}</div>
    <div class="progress" ref="progress" @click="progressClick">
      <div class="pointer" :style="{width:(progress * 100 )+'%'}">
        <div class="draw"></div>
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
      currDuration: 0
    }
  },
  watch: {
    currSrc(src) {
      this.audio.src = src
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
    },
    last() {
      this.$emit('last')
    },
    // 获取初始化数据
    getInitData() {
      const { duration } = this.audio
      this.duration = duration
    },
    playing() {
      const { currentTime } = this.audio
      this.currDuration = currentTime
    },
    progressClick(e) {
      const pro = e.offsetX / this.$refs.progress.clientWidth
      const _currDuration = pro * this.duration
      this.audio.currentTime = _currDuration
    }
  },
  mounted() {}
})
</script>

<style scoped lang='scss'>
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
</style>