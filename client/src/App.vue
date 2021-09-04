<template>
  <div class="player">
    <Trees :data="state.dirData" @add="addToPalyer"></Trees>
    <div>
      <audio @ended="next" controls="controls" autoplay :key="state.currSrc">
        <source :src="state.currSrc" />
      </audio>
      <div>
        <div @click="next">下一首</div>
        <div @click="last">上一首</div>
      </div>
      <div v-for="(url,index) in state.playList" :key="url">
        {{url}}
        <span v-if="index===currPlay">*</span>
      </div>
    </div>
  </div>
  <MaskBack />
</template>

<script lang="ts">
import { defineComponent, reactive, ref, computed, watch } from 'vue'
import { getDir, getFile } from '@/api/muisc'
import Trees from '@/components/Trees/index.vue'
import MaskBack from '@/components/MaskBack/index.vue'
export default defineComponent({
  name: 'App',
  components: { Trees, MaskBack },
  setup() {
    // 状态存储
    const state = reactive({
      dirData: {},
      playList: [],
      cacheMap: {},
      currSrc: ''
    })
    // 当前播放索引
    const currPlay = ref(-1)
    // 用于中断请求
    let controller = null
    // 是否加载中
    let isPending = false
    // 索引改变时
    watch(currPlay, () => {
      // 拿取path
      const path = state.playList[currPlay.value]
      if (path) {
        // 从缓存拿
        const src = state.cacheMap[path]
        // 如果还在请求中,就结束掉
        if (isPending) {
          controller.abort()
        }
        if (src) {
          state.currSrc = src
        } else {
          isPending = true
          controller = new AbortController()
          // 缓存没有就请求
          getFile(path, controller)
            .then(src => {
              if (!src) return
              state.currSrc = src
              // 放在缓存
              state.cacheMap[path] = src
            })
            .finally(() => {
              isPending = false
            })
        }
      }
    })
    // 添加单曲
    function addToPalyer(path) {
      // 添加的是当前播放的
      if (state.playList[currPlay.value] === path) return
      // 去重
      const findIndex = state.playList.findIndex(item => item === path)
      if (findIndex > -1) {
        state.playList.splice(findIndex, 1)
      }
      state.playList.push(path)
      // 列表为空时自动播放
      if (currPlay.value == -1) {
        currPlay.value = 0
      }
    }
    // 下一首
    function next() {
      currPlay.value++
      // 超出重置为0
      if (currPlay.value >= state.playList.length) {
        currPlay.value = 0
      }
    }
    // 上一首
    function last() {
      currPlay.value--
      // 最小为0
      if (currPlay.value < 0) {
        currPlay.value = 0
      }
    }
    getDir().then(({ data }) => {
      state.dirData = data
    })
    return {
      state,
      addToPalyer,
      next,
      last,
      currPlay
    }
  }
})
</script>

<style scoped>
.player {
  position: absolute;
  z-index: 3;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  display: flex;
}
</style>
