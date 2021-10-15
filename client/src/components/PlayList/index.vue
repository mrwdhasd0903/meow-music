<template>
  <div class="PlayList" ref="self">
    <div class="list_header">
      <span class="box" :class="'select_'+selectState" @click="headerBoxClick" />
      <div class="other">
        <div class="del_select" @click="delSelect" v-show="selectState">清空已选</div>
        <div class="del_all" @click="delAll">清空列表</div>
      </div>
    </div>
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
        <div class="other">
          <Svg name="del" @click="del(index)" v-show="index !== playIndex" />
        </div>
      </div>
      <div class="empty" v-show="!list.length">
        <Svg name="note_logo" />
        <p>空空如也，快去左侧添加歌曲吧 ~</p>
      </div>
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
  computed: {
    // 全选状态:  0-都没选 1-选了部分 2-全选
    selectState() {
      const selects = this.selectList.filter(i => i)
      if (selects.length === 0) return 0
      if (selects.length === this.list.length) return 2
      return 1
    }
  },
  methods: {
    // 单个选择
    select(index) {
      const isSelect = this.selectList[index]
      if (isSelect) {
        this.selectList[index] = 0
      } else {
        this.selectList[index] = 1
      }
    },
    // 全选点击
    headerBoxClick() {
      switch (this.selectState) {
        case 0:
          // 0 转 2
          this.list.forEach((_, i) => {
            this.selectList[i] = 1
          })
          break
        case 1:
        // 1 转 0
        case 2:
          // 2 转 0
          this.selectList = []
          break
      }
    },
    formatter(path) {
      const arrs = path.split('/')
      const names = arrs[arrs.length - 1].split('.')
      names.pop()
      return names.join('.')
    },
    /**
     * 删除1个
     */
    del(index) {
      this.$emit('delete', [index])
    },
    // 清空列表
    delAll() {
      this.$emit(
        'delete',
        this.list.map((_, index) => index)
      )
    },
    // 清空选择
    delSelect() {
      const arrIndex = []
      this.selectList.forEach((value, index) => {
        if (value) {
          arrIndex.push(index)
        }
      })
      this.selectList = []
      this.$emit('delete', arrIndex)
    },
    play(index, isPlay) {
      if (isPlay) {
        this.$emit('pause')
      } else {
        this.$emit('play', index)
      }
    },
    // 滚动到当前播放
    positioning() {
      const list_warp = this.$refs.self.childNodes[1]
      const list = list_warp.children
      for (let i = 0; i < list.length; i++) {
        if (list[i].className.indexOf('curr') !== -1) {
          const curr = list[i]
          list_warp.scrollTop = curr.offsetTop - 90
          return
        }
      }
    }
  },
  mounted() {},
  emits: ['pause', 'play', 'delete']
})
</script>

<style scoped lang='scss'>
.list_header {
  height: 40px;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 0 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .box {
    &.select_1::before {
      content: '';
      display: block;
      position: absolute;
      width: 7px;
      height: 7px;
      top: 2px;
      left: 2px;
      border-radius: 1px;
      background-color: $color1;
    }
  }
  .del_select,
  .del_all {
    padding: 4px 10px;
    border: 1px $color1 solid;
    color: $color1;
    cursor: pointer;
    border-radius: 2px;
    transition: all 0.2s ease;
    margin-left: 10px;
    opacity: 0.6;
    &:hover {
      opacity: 1;
      border-color: $color2;
      color: $color2;
    }
  }
  .other {
    display: flex;
    justify-content: flex-end;
  }
}
.list_warp {
  height: 750px;
  overflow: auto;
  .name {
    width: 500px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
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
  transition: opacity 0.2s ease;
  &:hover {
    opacity: 1;
  }
  &.select_2::before,
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
    border-radius: 0 0 4px 0;
  }
}
.list_item {
  height: 50px;
  cursor: default;
  padding: 0 30px;
  border-radius: 4px;
  display: flex;
  align-items: center;
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
    .other {
      .svg_icon_del {
        opacity: 0.4;
      }
    }
  }
  .index {
    display: inline-block;
    width: 50px;
  }
  .other {
    display: flex;
    justify-content: flex-end;
    width: calc(100% - 639px);
    .svg_icon_del {
      fill: $color1;
      font-size: 20px;
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.2s ease;
      &:hover {
        opacity: 1;
      }
    }
  }
}
.empty {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  opacity: 0.5;
  user-select: none;
  .svg_icon_note_logo {
    font-size: 90px;
    fill: $color1;
  }
}
</style>