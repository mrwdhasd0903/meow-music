<template>
  <svg :class="svgClass" :style="{ fill: color }">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps({
  name: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: ''
  }
})
const iconName = computed(() => `#icon_${props.name}`)
const svgClass = computed(() => {
  if (props.name) return `svg_icon svg_icon_${props.name}`
  return 'svg_icon'
})
</script>

<style scoped>
.svg_icon {
  width: 1em;
  height: 1em;
  vertical-align: middle;
}
</style>