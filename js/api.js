// api
const API_BASE = "https://osu.desu.life/api"
const APIKEY = "\x61\x73\x64\x66"
// endpoints
const API_DOWNLOAD = `${API_BASE}/download`

// download resposne
// {
//   "status": 0, // Number
//   "message": "",
//   "url": "" // 下载链接
// }
// download status
export const DOWNLOAD_STATUS_ERROR     = 0 // 错误
export const DOWNLOAD_STATUS_BUFFERING = 1 // 接受缓存
export const DOWNLOAD_STATUS_BUFFERED  = 2 // 缓存完毕 此时会给一个 url 协议
export const DOWNLOAD_STATUS_NOTEXIST  = 3 // 谱面不存在

export function requestBeatmap(type, id) {
  let query = { key: APIKEY }
  // beatmap_id or beatmapset_id
  switch(type) {
    case 'beatmapsets':
    case 's':
      query['beatmapset_id'] = id
      break;
    case 'beatmaps':
    case 'b':
      query['beatmap_id'] = id
      break;
    default:
      console.error('不可能发生的情况')
    }

  // build URL
  let urlQuery = new URLSearchParams(query)
  return fetch(`${API_DOWNLOAD}?${urlQuery}`,{
    method: 'GET',
    cache: 'no-store'
  })
}
