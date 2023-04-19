// DOM utils

export function id(id) {
  return document.getElementById(id)
}

// download

export function downloadURL(url) {
  window.location.assign(url)
}

// asynchronous URL constructor

const OSU_HOSTNAME = 'osu.ppy.sh'
export async function parseURL(text) {
  return new URL(text)
}

// clipboard

function readClipboard (el) {
  window.navigator.clipboard.readText()
  .then((content) => parseURL(content))
  .then((url) => {
    // 检查 osu! 域名
    if (url.hostname === OSU_HOSTNAME) {
      el.value = url
      el.focus()
    }
  })
}

export function initializeClipboardAccess(el) {
  if ('readText' in window.navigator.clipboard) {
    readClipboard(el)
  }
  else {
    console.debug('[read-clipboard]: 该浏览器无法使用 Clipboard API: readText()')
  }
}

// osu! URL utils

/*
 * osu! 谱面链接的 path 部分
 *
 * https://osu.ppy.sh/b/1097543                      来自 osu! 客户端
 * https://osu.ppy.sh/s/516494                       来自 osu! 客户端
 * https://osu.ppy.sh/beatmaps/1097543?mode=osu      个人页面分数链接
 * https://osu.ppy.sh/beatmapsets/516494#osu/1097543 谱面信息页面
 * (是 MISATO - Necro Fantasia 不用好奇了)
 */
let reOsuPathname = /^\/(?<type>\w+)\/(?<id>\d+)$/

export function tryParseOsuURL(input) {
  // 解析 URL
  let url
  try {
    url = new URL(input)
  }
  catch(error) {
    return null
  }
  
  // 检查域名
  if (url.hostname !== OSU_HOSTNAME) { return null }

  // 检查路径
  let match = reOsuPathname.exec(url.pathname)
  if (match !== null) {
    // 取成员
    let { type, id } = match.groups
    // 返回
    return { type, id }
  }
  else{
    return null
  }
}
