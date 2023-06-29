import { requestBeatmap, DOWNLOAD_STATUS_ERROR, DOWNLOAD_STATUS_BUFFERED, DOWNLOAD_STATUS_BUFFERING, DOWNLOAD_STATUS_NOTEXIST } from "./api.js"
import { id, tryParseOsuURL, initializeClipboardAccess, downloadURL } from "./utility.js"

let el_input = id('input')
let el_successCheck = id('success-check')

function hint(type) {
  switch(type) {
    case 'buffering':
      // 黄色指示正在缓存
      el_input.classList.add('buffering')
      break;
    case 'error':
      // 红色指示出现错误
      el_input.classList.add('error')
      break;
    default:
      console.error('hint(): unknown hint type')
  }
}

// 清理指示
function unhint() {
  el_input.classList.remove('buffering', 'error')
}

function successAnimation() {
  el_input.animate([
    { borderColor: '#6495ed', outlineColor: 'rgba(100, 149, 237, 0.3)', offset: 0.25 }
  ], {
    easing: 'ease',
    duration: 2500
  }).play()
 
  el_successCheck.classList.add('animation')
}

el_successCheck.addEventListener('animationend', ()=>{
  el_successCheck.classList.remove('animation')
})

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
            successAnimation()
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
  else {
    // TODO: 真的有人觉得一定是 bid 吗？
    hint('error')
  }
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
