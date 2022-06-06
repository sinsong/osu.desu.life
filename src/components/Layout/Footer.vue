<template>
  <footer>
    <a href="https://info.desu.life/">资讯站</a> |
    <a href="https://mail.desu.life/">邮箱</a> |
    <a href="http://beian.miit.gov.cn/">陕ICP备2021013528号-2</a>
    <br />
    Copyright 2020-现在 <a href="https://desu.life/">desu.life</a>
  </footer>
</template>

<style lang="scss">
footer {
  --footer-color: #ffffffd1;

  padding: 0.5em 1em;

  text-align: center;

  color: var(--footer-color);

  a {
    color: var(--footer-color);
    text-decoration: none;
    transition: color .25s;

    &:hover {
      color: #fff;
    }
  }
}
</style>
