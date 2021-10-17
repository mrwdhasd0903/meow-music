<template>
  <div class="Trees" :class="{full:full}">
    <div class="search_warp">
      <input
        placeholder="查找歌曲..."
        class="input"
        type="text"
        :value="searchValue"
        @input="searchChange"
      />
      <div class="broom_btn">
        <Svg name="broom" @click="broomClick" />
      </div>
    </div>
    <div class="tree_item">
      <div class="tree_heder">
        <Svg name="arrow" :class="{arrow_shrink:display}" @click.stop="shrink()" />
        <div class="name">所有音乐</div>
        <div class="operation">
          <Svg name="add" @click="addDir('')" />
        </div>
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
    },
    full: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      display: true,
      searchValue: ''
    }
  },
  provide() {
    return {
      add: this.add,
      addDir: this.addDir,
      getSearchValue: () => this.searchValue
    }
  },
  methods: {
    broomClick() {
      this.searchValue = ""
    },
    searchChange(e) {
      this.searchValue = e.target.value
    },
    shrink() {
      this.display = !this.display
    },
    add(path) {
      this.$emit('add', path)
    },
    addDir(path) {
      this.$emit('addDir', path)
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
.Trees {
  position: relative;
  z-index: 1;
  height: calc(100vh - 100px);
  margin: auto 0;
  overflow-y: auto;
  width: 300px;
  overflow-x: hidden;
  padding: 20px 30px;
  padding-top: 40px;
  transition: width 0.2s ease;
  &.full {
    width: 100%;
  }
  .search_warp {
    width: calc(100% - 50px);
    height: 30px;
    background-color: rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    padding-left: 10px;
    border-radius: 4px;
    overflow: hidden;
    .input {
      width: calc(100% - 30px);
      border: 0;
      outline: none;
      background-color: rgba(0, 0, 0, 0);
      color: $color1;
    }
    .broom_btn {
      width: 30px;
      height: 100%;
      cursor: pointer;
      background-color: rgba(255, 255, 255, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      fill: $color1;
      font-size: 20px;
      opacity: 0.6;
      &:hover {
        opacity: 0.8;
      }
    }
  }
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