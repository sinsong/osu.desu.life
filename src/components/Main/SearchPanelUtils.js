import { time } from '@/utils/api'

// 读取剪切板
function readClipboard (searchInput) {
  window.navigator.clipboard.readText()
    .then((content) => {
      searchInput.value = content
      console.log(`[read-clipboard]: 完成自动填充 "${content}" 夸我！`)
    })
    .catch((err) => {
      console.debug(`[read-clipboard]: 读取失败 ${err}`)
    })
}

export function initlizeClipboardAccess (searchInput) {
  // 读取剪切板
  if ('readText' in window.navigator.clipboard) {
    readClipboard(searchInput)

    // 网页获得焦点时自动填充
    window.addEventListener('focus', () => {
      readClipboard(searchInput)
    })
  } else {
    console.log('该浏览器无法使用 Clipboard API: readText()')
  }
}

// 获取后端状态
export async function getBackendStatus (inputElement, disabled) {
  try {
    const response = await time()
    console.log('[getBackendStatus]: 获取 API 状态 ...')

    const res = response.data
    if (res.code === 200) {
      console.log('[getBackendStatus]: API 状态正常')
      disabled.value = false
    } else {
      // TODO: 显示这句话：后端状态异常
      console.log('[getBackendStatus]: API 状态异常')
      disabled.value = true
    }
  } catch (err) {
    console.log('[getBackendStatus]: 获取失败，API 状态异常')
    disabled.value = true
    console.log(err)
  }
}
