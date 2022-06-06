<script setup>
import SearchPanel from '@/components/Main/SearchPanel.vue'
import Footer from '@/components/Layout/Footer.vue'
</script>

<template>
  <div class="container">
    <div class="flex-center grow">
      <SearchPanel />
    </div>
    <Footer />
  </div>
</template>

<style>
.container {
  height: 100vh;

  display: flex;
  flex-direction: column;
}

.flex-center {
  /* 弹性盒子居中 */
  display: flex;
  justify-content: center;
  align-items: center;
}

.grow {
  /* 填充剩余空间 */
  flex: 1;
}
</style>
