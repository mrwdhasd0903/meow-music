<template>
  <div class="mask_back"></div>
  <div class="back"></div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'MaskBack'
})
</script>

<style scoped>
.mask_back {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 2;
}
.back {
  background-image: url('@/image/index_background.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50%;
  filter: blur(65px);
  background-color: #969696;
  opacity: 0.6;
  transform: translateZ(0);
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
}
</style>