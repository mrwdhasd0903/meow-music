<template>
  <div class="player">
    <Trees :data="state.dirData" @add="addToPalyer" @addDir="addDirToPlayer"></Trees>
    <div class="player_panel">
      <PlayList @play="playInex" :list="state.playList" :playIndex="currPlay" />
      <Player :currSrc="state.currSrc" @next="next" @last="last" />
    </div>
  </div>
  <MaskBack />
</template>

<script lang="ts">
import { defineComponent, reactive, ref, computed, watch } from 'vue'
import { getDir, getFile } from '@/api/muisc'
import Trees from '@/components/Trees/index.vue'
import MaskBack from '@/components/MaskBack/index.vue'
import PlayList from '@/components/PlayList/index.vue'
import Player from '@/components/Player/index.vue'
export default defineComponent({
  name: 'App',
  components: { Trees, MaskBack, PlayList, Player },
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
    // 播放单曲
    function playInex(index) {
      currPlay.value = index
    }
    // 添加单曲
    function addToPalyer(path) {
      // 添加的是当前播放的 则不处理
      const currPlayPath = state.playList[currPlay.value]
      if (currPlayPath === path) return
      // 去重
      const findIndex = state.playList.findIndex(item => item === path)
      if (findIndex > -1) {
        state.playList.splice(findIndex, 1)
      }
      state.playList.push(path)
      // 当前索引修正
      const _currPlay = state.playList.findIndex(item => item === currPlayPath)
      if (_currPlay !== -1) {
        currPlay.value = _currPlay
      }

      // 列表为空时自动播放
      if (currPlay.value == -1) {
        currPlay.value = 0
      }
    }
    // 添加整个文件夹
    function addDirToPlayer(path) {
      let p = state.dirData
      const pathArr = path.split('/').filter(path => path)
      pathArr.forEach(path => {
        p = p[path]
      })
      const pickArr = []
      deepPick(p, path)
      pickArr.forEach(path => addToPalyer(path))

      function deepPick(data, path) {
        if (typeof data === 'object') {
          for (let name in data) {
            deepPick(data[name], path + '/' + name)
          }
        } else {
          if (data === true) {
            pickArr.push(path)
          }
        }
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
      addDirToPlayer,
      next,
      last,
      currPlay,
      playInex
    }
  }
})
</script>

<style scoped lang='scss'>
.player {
  position: absolute;
  z-index: 3;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  display: flex;
  .player_panel {
    width: calc(100% - 300px);
    padding: 40px 30px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
}
</style>
