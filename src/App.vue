<script setup>
import { onMounted } from 'vue'
import { useUXStore } from '@/stores/ux'
import Main from '@/components/Main/Main.vue'

const uxStore = useUXStore()

onMounted(() => {
  console.log('[app]: %cliteral%c 重写的镜像页 | 反馈 https://github.com/sinsong/osu.desu.life/issues',
    'color:#6495ed',
    ''
  )
  console.log(`[app]: ${__BUILD_INFO__}`)
})
</script>

<template>
  <div class="bg" :class="{focus: uxStore.focus}"></div>
  <Main />
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  color: #fff;
  background-color: #000;

  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "\5FAE\8F6F\96C5\9ED1", sans-serif;
  font-size: 14px;

  /* overflow: hidden; */

  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 移动端适配？ */
@media screen and (max-width: 767px) {
  body {
    font-size: 12px;
  }
}

/* 背景 */

.bg {
  /* fixed 的居中 */
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  z-index: -1;

  background-image: url("@/assets/backgrounds/bg.webp");
  background-size: cover;
  background-position: center 0;
  background-repeat: no-repeat;

  transition: filter .25s, transform .25s;
}

.focus {
  filter: brightness(0.8);
  transform: scale(1.1);
}
</style>
