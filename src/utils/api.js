import axios from 'axios'

// 请求对象
const request = axios.create({
  baseURL: 'https://api.desu.life',
  timeout: 6000
})

// -----------------------------------------------------------------------------

export function time () {
  return request.get('/time', {
    params: {
      verify: new Date().getTime()
    }
  })
}

export function download (params) {
  return request.get('/query', {
    params
  })
}

export function cache (params) {
  return request.get('/cache', {
    params,
    timeout: 24000
  })
}
