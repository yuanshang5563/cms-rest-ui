<template>
  <el-submenu v-if="menu.children && menu.children.length >= 1" :index="menu.coreMenuId + ''">
    <template slot="title">
      <i :class="menu.icon" ></i>
      <span slot="title">{{menu.menuName}}</span>
    </template>
    <MenuTree v-for="item in menu.children" :key="item.coreMenuId" :menu="item"></MenuTree>
  </el-submenu>
  <el-menu-item v-else :index="menu.coreMenuId + ''" @click="handleRoute(menu)">
    <i :class="menu.icon"></i>
    <span slot="title">{{menu.menuName}}</span>
  </el-menu-item>
</template>

<script>
import { getIFrameUrl, getIFramePath } from '@/utils/iframe'
export default {
  name: 'MenuTree',
  props: {
    menu: {
      type: Object,
      required: true
    }
  },
  methods: {
    handleRoute (menu) {
    // 如果是嵌套页面，转换成iframe的path
    let path = getIFramePath(menu.menuUrl)
    if(!path) {
      path = menu.menuUrl
    }
    // 通过菜单URL跳转至指定路由
    this.$router.push("/");
    this.$router.push(path);
    //sessionStorage.setItem
    //this.$router.push({path:path,query:{queryType:"all"}});
    }
  }
}
</script>

<style scoped lang="scss">
// .el-submenu, .el-menu-item {
//   background-color: #3c4b5a44;
// }
</style>