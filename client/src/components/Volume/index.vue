<template>
  <div class="Volume" ref="el">
    <div class="volume_warp">
      <div class="volume_setting">
        <div class="vol_slot" @click.stop="slotClick"></div>
        <div class="vol_progress" :style="{height:value+'%'}"></div>
        <div class="vol_slider" ref="slider" :style="{bottom:value+'%'}"></div>
      </div>
      <Svg :name="svgName" class="vol_svg" @click="svgClick" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'Volume',
  components: {},
  data() {
    return {
      value: 80,
      cacheValue: 0
    }
  },
  props: {
    set: {
      type: Function,
      default: null
    }
  },
  computed: {
    el() {
      return this.$refs.el
    },
    svgName() {
      if (this.value > 40) {
        return 'vol_10'
      } else if (this.value > 0) {
        return 'vol_5'
      } else {
        return 'vol_0'
      }
    }
  },
  watch: {},
  methods: {
    //进度条槽位点击
    slotClick(event) {
      this.setValue(80 - event.offsetY)
    },
    //音量图标点击 - 切换
    svgClick() {
      if (this.value) {
        this.cacheValue = this.value
        this.setValue(0)
      } else {
        if (this.cacheValue == 0) {
          this.cacheValue = 80
        }
        this.setValue(this.cacheValue)
      }
    },
    //
    setValue(value) {
      if (value < 0) {
        this.value = 0
      } else if (value > 80) {
        this.value = 80
      } else {
        this.value = value
      }
      this.set(this.value / 80)
    }
  },
  mounted() {
    this.$refs.slider.onmousedown = e => {
      document.onmousemove = m_e => {
        const a = m_e.pageY - (this.el.offsetTop - 80)
        this.setValue(80 - a)
      }
      document.onmouseup = u_e => {
        document.onmousemove = null
        document.onmouseup = null
      }
    }
  }
})
</script>

<style scoped lang='scss'>
.Volume {
  position: relative;
  margin-top: 10px;
  .volume_warp {
    height: 50px;
    padding-top: 20px;
    :deep(.svg_icon) {
      &.vol_svg {
        font-size: 25px;
      }
    }
    &:hover {
      .volume_setting {
        height: 100px;
        top: -90px;
        opacity: 1;
      }
    }
  }

  .volume_setting {
    width: 25px;
    height: 0px;
    background-color: rgba(100, 100, 100, 0.7);
    position: absolute;
    left: 0;
    opacity: 0;
    top: 10px;
    border-radius: 5px;
    transition: all 0.2s ease;
  }

  .vol_slot {
    height: 80%;
    width: 5px;
    background-color: rgba(255, 255, 255, 0.4);
    border-radius: 4px;
    display: flex;
    align-items: flex-end;
    cursor: pointer;
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 3;
  }
  .vol_progress {
    width: 5px;
    border-radius: 4px;
    background-color: rgba(255, 255, 255, 0.8);
    position: absolute;
    bottom: 10px;
    left: 10px;
    z-index: 2;
  }
  .vol_slider {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    position: absolute;
    left: 8px;
    background-color: #fff;
    transform: translateY(-6px);
    z-index: 4;
    cursor: pointer;
  }
}
</style>