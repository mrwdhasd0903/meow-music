<template>
  <div class="list_warp">
    <div
      v-for="(url,index) in list"
      :key="url"
      class="list_item"
      :class="{curr:index === playIndex}"
    >
      <span class="index">{{index+1}}</span>
      <Svg name="play" @click="play(index)" />
      <span class="name">{{formatter(url)}}</span>
    </div>
  </div>
</template>

<script>
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
    }
  },
  components: {},
  data() {
    return {}
  },
  computed: {},
  methods: {
    formatter(path) {
      const arrs = path.split('/')
      const names = arrs[arrs.length - 1].split('.')
      names.pop()
      return names.join('.')
    },
    play(index) {
      this.$emit('play', index)
    }
  },
  mounted() {}
})
</script>

<style scoped lang='scss'>
.list_warp {
  height: 700px;
  overflow: auto;
}
.list_item {
  height: 50px;
  line-height: 50px;
  cursor: default;
  padding: 0 30px;
  border-radius: 4px;
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
    :deep(.svg_icon_play) {
      fill: $color2;
      cursor: default;
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