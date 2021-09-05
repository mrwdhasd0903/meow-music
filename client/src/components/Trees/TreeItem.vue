<template>
  <div class="tree_item" v-for="(value, key) in data" :key="key">
    <div class="tree_heder">
      <Svg
        name="arrow"
        v-if="value!==true"
        :class="{arrow_shrink:displays[key]}"
        @click.stop="shrink(key)"
      />
      <div class="name" :title="key" @click="getPath(basePath + '/' + key,value!==true)">{{key}}</div>
      <div class="operation" v-if="value!==true">
        <Svg name="add" @click="addDir(basePath + '/' + key)" />
      </div>
      <div class="operation" v-else>
        <Svg name="add" @click="add(basePath + '/' + key)" />
      </div>
    </div>
    <div v-if="value===true"></div>
    <template v-else>
      <div v-show="displays[key]">
        <TreeItem :basePath="basePath+'/'+key" :data="value" />
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
export default defineComponent({
  name: 'TreeItem',
  props: {
    data: {
      type: Object,
      default: {}
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  inject: ['getPath', 'add', 'addDir'],
  setup(props) {
    const displays = reactive({ ...props.data })
    for (let key in displays) {
      displays[key] = true
    }

    function shrink(key: String) {
      displays[key] = !displays[key]
    }
    return {
      displays,
      shrink
    }
  }
})
</script>

<style scoped lang='scss'>
</style>