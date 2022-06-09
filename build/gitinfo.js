import { spawnSync } from 'child_process'

export function getGitInfo () {
  // spawn 启动进程获取信息

  // commit 信息
  const procCommitInfo = spawnSync('git', [
    'show',
    '--no-patch',
    '--format=%H%d | %s',
    'HEAD'
  ])
  let commitInfo = procCommitInfo.stdout.toString().trim('\n')

  // 工作区是不是干净的
  const procCheckWorkspace = spawnSync('git', [
    'status',
    '--porcelain'
  ])
  let checkWorkspace = procCheckWorkspace.stdout.toString().trimEnd('\n') === ''

  return `commit ${commitInfo}${checkWorkspace ? '' : ' | modified'}`
}
