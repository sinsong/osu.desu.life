import { spawnSync } from 'child_process'

export function getGitInfo () {
  // 启动进程获取信息
  const proc = spawnSync('git', [
    'show',
    '--no-patch',
    '--format=%H%d | %s',
    'HEAD'
  ])

  return proc.stdout.toString().trim('\n')
}
