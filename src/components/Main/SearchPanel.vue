<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useUXStore } from '@/stores/ux'
import SearchIcon from './SearchIcon'
import { getBackendStatus, initlizeClipboardAccess } from './SearchPanelUtils'
import { cache } from '@/utils/api'

const uxStore = useUXStore()

const inputElement = ref(null) // template ref
const disabled = ref(true)
const searchInput = ref('')
const feedback = ref('')

onMounted(() => {
  getBackendStatus(inputElement, disabled)
    .then(() => {
      // 如果我想 focus，得想让 input 能用
      nextTick(() => {
        inputElement.value.focus()
        initlizeClipboardAccess(searchInput)
      })
    })
})

// 处理搜索
let reURLBeatmapSets = /^\/beatmapsets\/(?<sid>\d+)$/
let reURLShort = /^\/(?<type>\w+)\/(?<id>\d+)$/
let rePureId = /^\d+$/
function handleSearch() {
  let input = searchInput.value

  // URL 的情况
  try {
    let inputURL = new URL(input)

    if (inputURL.hostname !== 'osu.ppy.sh') {
      return
    }

    let pathname = inputURL.pathname
    let match = null

    // /beatmapsets/:sid
    if ((match = reURLBeatmapSets.exec(pathname)) !== null) {
      let { sid } = match.groups
      return DownloadBeatmap('s', sid);
    }
    
    // /:type/:id
    if ((match = reURLShort.exec(pathname)) !== null) {
      let { type, id } = match.groups
      return DownloadBeatmap(type, id)
    }

  } catch (error) {
    if (!(error instanceof TypeError)) {
      throw error
    }
    // 替代写法，可能太秀了
    // error instanceof TypeError || (() => {throw error})()
  }

  // 纯数字的情况
  let match = null
  if (match = rePureId.test(input)) {
    return DownloadBeatmap('s', input)
  }
}

function DownloadBeatmap(type, id) {
  let request = {
    verify: new Date().getTime()
  }

  // 参数检查
  switch(type) {
    case 's':
      request.beatmapsetid = id
      break;
    case 'b':
      request.beatmapid = id
      break;
    default:
      return
  }

  // 正在获取铺面信息
  // 正在缓存谱面

  // Necro Fantasia 516494
  cache(request)
    .then((response) => {
      let res = response.data
      let desulifeURL = new URL('https://om1.desu.life')

      switch (res.code) {
        case 200:
        case 201:
          desulifeURL.pathname = res.message.replaceAll('\\', '/')
          window.location.assign(desulifeURL.href)
          break;
        case 202:
          // 已经在缓存
          console.debug(response)
          break;
        case 403:
          // 获取谱面失败
          break;
        default:
          // 未知错误
          break;
      }
    })
    .catch(() => {
      // 缓存谱面超时，稍后再试
    })
}

</script>

<template>
  <div class="search-panel">
    <div class="input-group">
      <label class="input-main" :class="{active: uxStore.focus}">
        <SearchIcon size="1em" color="#b2b2b2" />
        <input
          v-model="searchInput"
          ref="inputElement"
          @focus="uxStore.updateFocus(true)"
          @blur="uxStore.updateFocus(false)"
          @keydown.enter.prevent="handleSearch"
          :disabled="disabled"
          type="text"
          placeholder="在此输入链接或者谱面sid" />
      </label>
      <button
      :disabled="disabled"
        @click="handleSearch"
      >下载</button>
    </div>
    <p> {{ feedback }} </p>
  </div>
</template>

<style lang="scss" scoped>
.search-panel {
  display: flex;
}

// 表单组
.input-group {
  --color--primary: #6495ed;

  --font-size: 16px;
  --height: calc(var(--font-size) * 2.7);
  --radius: calc(var(--height) / 2);

  display: flex;
  min-width: 36em;

  border-radius: var(--radius);
  box-shadow: 0 .5em 1em rgba(0, 0, 0, .2);
}

@media screen and (max-width: 767px) {
  .input-group {
    --font-size: 14px;
    min-width: 0;
  }
}

// 文本框及其修饰
.input-main {
  display: flex;
  align-items: center;

  padding: 0 1em;
  height: var(--height);
  flex: 1 0.5;

  background-color: #00000080;
  font-size: var(--font-size);

  border-top-left-radius: var(--radius);
  border-bottom-left-radius: var(--radius);

  border: 1px solid transparent;
  &:hover,
  &.active {
    border: 1px solid var(--color--primary);
  }
  transition: border .25s;

  input {
    margin-left: 0.5em;
    flex: 1;

    color: #fff;
    caret-color: var(--color--primary);
    font-size: inherit;

    // 清掉原本的样式
    appearance: none;
    background-color: transparent;
    outline: none;
    border: none;
  }
}

// 按钮
button {
  color: #fff;
  background-color: var(--color--primary);

  padding: 0 1.5em;
  border-top-right-radius: var(--radius);
  border-bottom-right-radius: var(--radius);

  font-size: var(--font-size);
  cursor: pointer;

  // 清掉原本的样式
  appearance: none;
  outline: none;
  border: none;

  transition: filter .25s;

  &:hover {
    filter: brightness(1.1);
  }
}
</style>
