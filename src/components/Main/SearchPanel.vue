<script setup>
import { ref, onMounted, nextTick } from 'vue';
import throttle from 'lodash.throttle'
import { useUXStore } from '@/stores/ux'
import SearchIcon from './SearchIcon'
import XIcon from './XIcon'
import { getBackendStatus, initlizeClipboardAccess } from './SearchPanelUtils'
import { cache } from '@/utils/api'

const uxStore = useUXStore()

const inputElement = ref(null) // template ref
const disabled = ref(true)
const searchInput = ref('')
const feedback = ref('')

onMounted(() => {
  getBackendStatus(disabled)
    .then(() => {
      // 如果我想 focus，得先让 input 能用
      nextTick(() => {
        inputElement.value.focus()
        initlizeClipboardAccess(searchInput, disabled)
      })
    })
})

// 使用节流函数降低更新频率
const doFeedback = throttle((message) => {
  feedback.value = message
}, 1000)

// 处理搜索

/*
 * 对于 osu! 的谱面链接来说
 * https://osu.ppy.sh/b/1097543                      来自 osu! 客户端
 * https://osu.ppy.sh/s/516494                       来自 osu! 客户端
 * https://osu.ppy.sh/beatmaps/1097543?mode=osu      个人页面分数链接
 * https://osu.ppy.sh/beatmapsets/516494#osu/1097543 谱面信息页面
 * (是 MISATO - Necro Fantasia 不用好奇了)
 * 
 * 那么答案只有一个！使用模式：/:type/:id
 * :type 可以是:
 *   "beatmapsets" -> sid
 *   "beatmaps"    -> bid
 *   "s" -> sid
 *   "b" -> bid
 * :id 依据 :type 确定是 bid 还是 sid
 */
let reOsuPathname = /^\/(?<type>\w+)\/(?<id>\d+)$/
let rePureId = /^\d+$/
function handleSearch() {
  let input = searchInput.value

  // URL 的情况
  try {
    // 尝试解析 URL
    let inputURL = new URL(input)
    // 限制域名
    if (inputURL.hostname !== 'osu.ppy.sh') { return }
    // 取出路径
    let pathname = inputURL.pathname

    // 进行匹配
    let match = null
    if ((match = reOsuPathname.exec(pathname)) !== null) {
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
    case 'beatmapsets':
    case 's':
      request.beatmapsetid = id
      break;
    case 'beatmaps':
    case 'b':
      request.beatmapid = id
      break;
    default:
      return
  }

  doFeedback('请求缓存谱面')
  doFeedback('正在缓存谱面')

  // Necro Fantasia 516494
  cache(request)
    .then((response) => {
      let res = response.data
      let desulifeURL = new URL('https://om1.desu.life')

      switch (res.code) {
        case 200:
        case 201:
          desulifeURL.pathname = res.message.replaceAll('\\', '/')
          doFeedback('缓存成功！开始下载谱面')
          window.location.assign(desulifeURL.href)
          break;
        case 202:
          doFeedback('谱面已被缓存')
          console.debug(response)
          break;
        case 403:
          doFeedback('获取谱面失败')
          break;
        default:
          doFeedback('未知错误')
          break;
      }
    })
    .catch(() => {
      doFeedback('缓存谱面失败，请稍后再试')
    })
}

function cleanInput() {
  searchInput.value = ''
  inputElement.value.focus()
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
        <Transition name="clean">
          <XIcon
            v-show="searchInput.length !== 0"
            @mousedown.prevent="cleanInput"
            size="1.2em"
            color="#fff" />
        </Transition>
      </label>
      <button
      :disabled="disabled"
        @click="handleSearch"
      >下载</button>
    </div>
    <div class="feedback-anchor">
      <p> {{ feedback }} </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.search-panel {
  display: flex;
  flex-direction: column;
}

// 使用 anchor 定位，绝对定位再移除流
// 应该不会对输入空间居中产生影响
.feedback-anchor {
  position: relative;
  p {
    position: absolute;
    margin-top: 0.5em;
    padding: 0 1em;
  }
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

  padding: 0 0.5em 0 1em;
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

// 清除按钮
.clean-enter-active,
.clean-leave-active {
  transition: opacity .125s ease, transform .125s ease;
}

.clean-enter-from,
.clean-leave-to {
  pointer-events: none;
  transform: translate(100%, 0);
  opacity: 0;
}
</style>
