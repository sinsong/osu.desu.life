import { requestBeatmap, DOWNLOAD_STATUS_ERROR, DOWNLOAD_STATUS_BUFFERED, DOWNLOAD_STATUS_BUFFERING, DOWNLOAD_STATUS_NOTEXIST } from "./api.js"
import { id, tryParseOsuURL, initializeClipboardAccess, downloadURL } from "./utility.js"

let el_input = id('input')

function hint(type) {
  switch(type) {
    case 'buffering':
      // 黄色指示正在缓存
      el_input.style.borderColor = '#ffff00'
      el_input.style.outlineColor = '#ffff004d'
      break;
    case 'error':
      // 红色指示出现错误
      el_input.style.borderColor = '#ff0000'
      el_input.style.outlineColor = '#ff00004d'
      break;
  }
  
}

// 清理指示
function unhint() {
  el_input.style.borderColor = ''
  el_input.style.outlineColor = ''
}

function handleInput(input) {
  let urlResult = tryParseOsuURL(input)
  if (urlResult !== null) {
    let { type, id } = urlResult
    requestBeatmap(type, id)
      .then((response) => response.json())
      .then((res) => {
        switch(res.status) {
          case DOWNLOAD_STATUS_BUFFERING:
            hint('buffering')
            console.debug('缓冲中，稍后继续')
            // 加入回调
            setTimeout(()=>{
              handleInput(input)
            }, 3000)
            break
          case DOWNLOAD_STATUS_BUFFERED:
            unhint()
            el_input.value = ''
            downloadURL(res.url)
            break
          case DOWNLOAD_STATUS_ERROR:
          case DOWNLOAD_STATUS_NOTEXIST:
            hint('error')
            break
          }
      })
      .catch((err) => {
        console.error(`请求失败：${err}`)
      })
  }

  // TODO: 真的有人觉得一定是 bid 吗？
}

el_input.addEventListener('keypress', (ev) => {
  if(ev.key === 'Enter') {
    handleInput(el_input.value)
  }
})

// 修改输入清理指示
el_input.addEventListener('input', () => {
  unhint()
})

// 每次获取焦点读取剪切板
el_input.addEventListener('focus', () => {
  initializeClipboardAccess(el_input)
})

// 页面加载后

// initializeClipboardAccess(el_input) // 读取剪切板
el_input.focus() // 设置焦点