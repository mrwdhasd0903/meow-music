<template>
  <div class="PlayMode">
    <Svg :name="svgName" @click="svgClick" class="mode_svg" />
    <div class="mode_tip">{{meanList[currMode]}}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PlayMode',
  components: {},
  data() {
    return {
      modeList: ['DEFAULT', 'RANDOM', 'SINGLE'],
      svgList: ['mode_default', 'mode_random', 'mode_single'],
      meanList: ['顺序播放', '随机播放', '单曲循环'],
      currMode: 0
    }
  },
  computed: {
    svgName() {
      return this.svgList[this.currMode]
    }
  },
  methods: {
    svgClick() {
      this.currMode++
      this.currMode = this.currMode % this.modeList.length
      this.$emit('modeChange', this.modeList[this.currMode])
    }
  },
  mounted() {
    this.$emit('modeChange', this.modeList[this.currMode])
  },
  emits: ['modeChange']
})
</script>

<style scoped lang='scss'>
.PlayMode {
  margin-top: 20px;
  position: relative;
  .mode_tip {
    position: absolute;
    left: 80%;
    top: 0;
    font-size: 14px;
    width: 80px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 6px;
    transition: all 0.2s;
    user-select: none;
    opacity: 0;
  }
  &:hover {
    .mode_tip {
      opacity: 1;
      left: calc(100% + 6px);
      &:hover {
        left: 80%;
        opacity: 0;
      }
    }
  }
  .svg_icon {
    &.mode_svg {
      font-size: 30px !important;
    }
  }
}
</style>