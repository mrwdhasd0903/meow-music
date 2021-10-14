<template>
  {{record}}
  <br/>
  {{currPlay}}
  <div class="player">
    <Trees :data="state.dirData" @add="addToPalyer" @addDir="addDirToPlayer"></Trees>
    <div class="player_panel">
      <PlayList
        @play="playInex"
        @pause="pause"
        @delete="del"
        :list="state.playList"
        :playIndex="currPlay"
        :playState="playState"
      />
      <Player
        ref="player"
        @modeChange="modeChange"
        @stateChange="stateChange"
        :currSrc="state.currSrc"
        @next="next"
        @last="last"
      />
    </div>
  </div>
  <MaskBack />
</template>

<script lang="ts">
import { defineComponent, reactive, ref, watch, getCurrentInstance } from 'vue'
import { getDir, getFile } from '@/api/music'
import Trees from '@/components/Trees/index.vue'
import MaskBack from '@/components/MaskBack/index.vue'
import PlayList from '@/components/PlayList/index.vue'
import Player from '@/components/Player/index.vue'
export default defineComponent({
  name: 'App',
  components: { Trees, MaskBack, PlayList, Player },
  setup() {
    const { proxy } = getCurrentInstance()
    // 状态存储
    const state = reactive({
      dirData: {},
      playList: [],
      cacheMap: {},
      currSrc: ''
    })
    // 播放状态 1 播放 0 暂停
    const playState = ref(0)
    // 播放索引记录
    const record = reactive([])
    // 当前播放索引
    const currPlay = ref(-1)
    // 播放模式
    const playMode = ref('')
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
          getFile(path, controller).then(src => {
            if (!src) return
            isPending = false
            state.currSrc = src
            // 放在缓存
            state.cacheMap[path] = src
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
      //播放策略
      switch (playMode.value) {
        case 'DEFAULT':
          currPlay.value++
          // 超出重置为0
          if (currPlay.value >= state.playList.length) {
            currPlay.value = 0
          }
          break
        case 'RANDOM':
          // 为了方便维护索引,所以不推索引,直接推path
          record.push(state.playList[currPlay.value])
          
          currPlay.value = rd(0, state.playList.length - 1, currPlay.value)
          break
        case 'SINGLE':
          proxy.$refs.player.resetProgress()
          break
      }
    }
    // 上一首
    function last() {
      // 播放策略
      switch (playMode.value) {
        case 'DEFAULT':
          currPlay.value--
          // 最小为0
          if (currPlay.value < 0) {
            currPlay.value = 0
            proxy.$refs.player.resetProgress()
          }
          break
        case 'RANDOM':
          if (record.length) {
            const path = record.pop()
            const index = state.playList.indexOf(path)
            currPlay.value = index
          } else proxy.$refs.player.resetProgress()
          break
        case 'SINGLE':
          proxy.$refs.player.resetProgress()
          break
      }
    }
    // 播放暂停
    function pause() {
      proxy.$refs.player.centerClick()
    }
    // 删除
    function del(indexArr) {
      // 记录当前的path
      const path = state.playList[currPlay.value]
      const list = [...state.playList]
      indexArr.forEach(index => {
        // 删除历史记录
        const delPath = list[index]
        const delIndexArr = findAllIndex(record, delPath)

        delIndexArr.forEach(delIndex => {
          record.splice(delIndex, 1)
        })

        list[index] = null
      })
      state.playList = list.filter(i => i)
      // 恢复index
      const index = state.playList.indexOf(path)
      currPlay.value = index
    }
    function modeChange(mode) {
      playMode.value = mode
    }
    function stateChange(state) {
      playState.value = state
    }
    /**
     * 两数之间随机数
     * n:起始
     * m:结束
     * exclude:排除
     */
    function rd(n, m, exclude) {
      if (n >= m) return m
      const c = m - n
      let count
      while (true) {
        const res = Math.round(Math.random() * c + n)
        count++
        
        if (res !== exclude) {
          return res
        }
        // 防止死循环
        if (count > 50) {
          throw '随机数出错'
        }
      }
    }
    function findAllIndex(arr, value) {
      const indexArr = []
      for (let i = arr.length - 1; i >= 0; i--) {
        if (arr[i] === value) {
          indexArr.push(i)
        }
      }
      return indexArr
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
      pause,
      currPlay,
      playInex,
      modeChange,
      stateChange,
      playState,
      del,
      record
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
