<template>
  <div class="player">
    <Trees :data="state.dirData" @add="addToPalyer"></Trees>
    <div>
      <audio @ended="next" controls="controls" autoplay :key="currSrc">
        <source :src="currSrc" />
      </audio>
      <div>
        <div @click="next">下一首</div>
        <div @click="last">上一首</div>
      </div>
      <div v-for="(url,index) in state.playList" :key="url">
        {{url}}
        <span v-if="index===state.currPlay">*</span>
      </div>
    </div>
  </div>
  <MaskBack />
</template>

<script lang="ts">
import { defineComponent, reactive, ref, computed } from 'vue'
import { getDir } from '@/api/muisc'
import Trees from '@/components/Trees/index.vue'
import MaskBack from '@/components/MaskBack/index.vue'
export default defineComponent({
  name: 'App',
  components: { Trees, MaskBack },
  setup() {
    const playUrl = 'http://localhost:7777/getFile?path='
    const state = reactive({ dirData: {}, playList: [], currPlay: -1 })
    const currSrc = computed(() => {
      if (state.currPlay > -1) {
        const url = state.playList[state.currPlay]
        if (url) {
          return playUrl + state.playList[state.currPlay]
        } else {
          state.currPlay = -1
          return ''
        }
      } else {
        return ''
      }
    })
    function addToPalyer(path) {
      state.playList.push(path)
      if (state.currPlay == -1) {
        state.currPlay = 0
      }
    }
    function next() {
      state.currPlay++
      if (state.currPlay >= state.playList.length) {
        state.currPlay = 0
      }
    }
    function last() {
      state.currPlay--
      if (state.currPlay < 0) {
        state.currPlay = 0
      }
    }
    getDir().then(({ data }) => {
      state.dirData = data
    })
    return {
      state,
      currSrc,
      addToPalyer,
      next,
      last
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
