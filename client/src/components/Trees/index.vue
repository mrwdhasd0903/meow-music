<template>
  <div class="trees">
    <div class="tree_item">
      <div class="tree_heder">
        <Svg name="arrow" :class="{arrow_shrink:display}" @click.stop="shrink(key)" />
        <div class="name">所有音乐</div>
        <div class="operation" @click.stop="operation(key)"></div>
      </div>
      <!-- 
      文件夹: 收起\打开、播放、添加 
      歌曲：播放、添加、添加到下一首
      -->
      <template v-if="inited">
        <div v-show="display">
          <TreeItem :data="data" />
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, computed } from 'vue'
import TreeItem from './TreeItem.vue'
export default defineComponent({
  components: { TreeItem },
  props: {
    data: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      display: true
    }
  },
  provide() {
    return {
      getPath: this.emit,
      add: this.add
    }
  },
  methods: {
    emit(path, isDir) {
      this.$emit('pathClick', path, isDir)
    },
    shrink() {
      this.display = !this.display
    },
    add(path) {
      this.$emit('add', path)
    }
  },
  setup(props) {
    const _props = reactive(props)
    const inited = computed(() => {
      return !!Object.keys(_props.data).length
    })
    return {
      inited
    }
  }
})
</script>

<style scoped lang='scss'>
.trees {
  position: relative;
  z-index: 1;
  height: calc(100vh - 100px);
  margin: auto 0;
  overflow-y: auto;
  width: 300px;
  overflow-x: hidden;
  padding: 20px 30px;
  :deep(.svg_icon_add) {
    fill: $color1;
    width: 14px;
    height: 14px;
    &:hover {
      fill: $color2;
    }
  }
  :deep(.svg_icon_arrow) {
    fill: $color1;
    width: 23px;
    height: 23px;
    position: absolute;
    left: -23px;
    opacity: 0;
    padding: 5px;
    border-radius: 4px;
    &:hover {
      background-color: rgba(200, 200, 200, 0.1);
      fill: $color2;
    }
    &.arrow_shrink {
      transform: rotate(90deg);
    }
  }
  :deep(.tree_item) {
    padding-left: 20px;
    .tree_heder {
      position: relative;
      display: flex;
      height: 25px;
      padding: 0 6px;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      border-radius: 4px;
      &:hover {
        color: $color2;
        background-color: rgba(200, 200, 200, 0.1);
        .svg_icon_arrow {
          opacity: 1;
        }
      }
      .name {
        user-select: none;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
    }

    .operation {
      display: none;
    }
    .tree_heder:hover {
      .operation {
        display: inline-block;
      }
    }
  }

  & > .tree_item {
    padding-left: 0px;
  }
}
</style>