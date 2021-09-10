<template>
  <div class="Volume">
    <div class="volume_warp">
      <div class="volume_setting">
        <div class="vol_progress" @click="progressClick">
          <div class="vol_pointer" @click.stop="pointerClick" :style="{height:currVol+'%'}">
            <div class="drag" @click.stop />
          </div>
        </div>
      </div>
      <Svg name="volume" @click="svgClick" />
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
      currVol: 80,
      chacheVol: 80
    }
  },
  props: {
    set: {
      type: Function,
      default: null
    }
  },
  computed: {
    currProgress() {
      return this.currVol / 100
    }
  },
  watch: {
    currVol(value) {
      this.set(value / 100)
    }
  },
  methods: {
    // 进度点击
    progressClick(e) {
      this.currVol = ((80 - e.offsetY) / 80) * 100
    },
    // 进度点击 - 子集部分
    pointerClick(e) {
      this.currVol = ((80 * this.currProgress - e.offsetY) / 80) * 100
    },
    svgClick() {
      if (this.currVol) {
        this.chacheVol = this.currVol
        this.currVol = 0
      } else {
        this.currVol = this.chacheVol || 80
      }
    }
  },
  mounted() {}
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
      &.svg_icon_volume {
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

  .vol_progress {
    height: 80%;
    width: 5px;
    background-color: rgba(255, 255, 255, 0.4);
    margin: 10px auto;
    border-radius: 4px;
    display: flex;
    align-items: flex-end;
    cursor: pointer;
  }
  .vol_pointer {
    width: 100%;
    background-color: rgba(255, 255, 255, 0.8);
    position: relative;
    border-radius: 4px;
    .drag {
      position: absolute;
      height: 9px;
      width: 9px;
      border-radius: 4px;
      background-color: #fff;
      top: -5px;
      left: -2px;
      box-shadow: 0px 2px 12px 2px rgba(0, 0, 0, 0.5);
      &:hover {
        background-color: $color2;
      }
    }
  }
}
</style>