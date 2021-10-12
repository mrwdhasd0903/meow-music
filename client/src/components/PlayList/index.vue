<template>
  <div class="list_warp">
    <div
      v-for="(url,index) in list"
      :key="url"
      class="list_item"
      :class="{curr:index === playIndex}"
    >
      <span class="box" :class="{select:selectList[index]}" @click="select(index)" />
      <span class="index">{{index+1}}</span>
      <Svg
        :name="(index === playIndex) && playState==1 ?'stop':'play'"
        @click="play(index,index === playIndex)"
      />
      <span class="name">{{formatter(url)}}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'PlayList',
  props: {
    list: {
      type: Array,
      default: () => []
    },
    playIndex: {
      type: Number,
      default: -1
    },
    playState: {
      type: Number,
      default: 0
    }
  },
  components: {},
  data() {
    return {
      selectList: []
    }
  },
  computed: {},
  methods: {
    select(index) {
      const isSelect = this.selectList[index]
      if (isSelect) {
        this.selectList[index] = 0
      } else {
        this.selectList[index] = 1
      }
    },
    formatter(path) {
      const arrs = path.split('/')
      const names = arrs[arrs.length - 1].split('.')
      names.pop()
      return names.join('.')
    },
    play(index, isPlay) {
      if (isPlay) {
        this.$emit('pause')
      } else {
        this.$emit('play', index)
      }
    }
  },
  mounted() {},
  emits: ['pause', 'play']
})
</script>

<style scoped lang='scss'>
.list_warp {
  height: 750px;
  overflow: auto;
}
.list_item {
  height: 50px;
  cursor: default;
  padding: 0 30px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  .box {
    width: 15px;
    height: 15px;
    border: 2px solid $color1;
    border-radius: 2px;
    margin-right: 30px;
    display: inline-block;
    opacity: 0.5;
    cursor: pointer;
    position: relative;
    transition: opacity .2s ease;
    &:hover {
      opacity: 1;
    }
    &.select::before {
      content: '';
      display: block;
      position: absolute;
      width: 8px;
      height: 15px;
      border: 3px solid $color1;
      border-top: 0;
      border-left: 0;
      top: -8px;
      left: 1px;
      transform: rotate(40deg);
      border-radius: 0 0 4px 0 ;
    }
  }
  :deep(.svg_icon_play) {
    fill: $color1;
    margin-right: 30px;
    cursor: pointer;
    transform: translateY(-1px);
    &:hover {
      fill: $color2;
    }
  }
  &.curr {
    color: $color2;
    :deep(.svg_icon_stop) {
      fill: $color2;
      margin-right: 27px;
      margin-left: -3px;
      font-size: 20px;
      cursor: pointer;
    }
    :deep(.svg_icon_play) {
      fill: $color2;
    }
  }
  &:hover {
    background-color: rgba(200, 200, 200, 0.1);
  }
  .index {
    display: inline-block;
    width: 50px;
  }
}
</style>