<template> 
  <div class="container" :style="{'background':themeColor}" :class="$store.state.app.collapse?'menu-bar-collapse-width':'menu-bar-width'">
    <!-- 导航收缩 -->
    <span class="hamburger-container" :style="{'background':themeColor}">
      <hamburger :onClick="onCollapse" :isActive="collapse"></hamburger>
    </span>
    <!-- 导航菜单 -->
    <span class="nav-bar">
      <el-menu :default-active="activeIndex" class="el-menu-demo" 
          :background-color="themeColor" text-color="#fff" active-text-color="#ffd04b" mode="horizontal" @select="selectNavBar()">
        <el-menu-item index="1" @click="$router.push('/')"><i class="fa fa-home fa-lg"></i>  </el-menu-item>
      </el-menu>
    </span>
    <span class="tool-bar">
      <!-- 主题切换 -->
      <theme-picker class="theme-picker" :default="themeColor" @onThemeChange="onThemeChange"></theme-picker>
      <!-- 语言切换 -->
      <lang-selector class="lang-selector"></lang-selector>   
      <!-- 用户信息 -->
      <el-dropdown class="user-info-dropdown" trigger="click">
        <span class="el-dropdown-link"><img :src="this.userAvatar" /> {{userName}}</span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item divided @click.native="logout">{{$t("common.logout")}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </span>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import mock from "@/mock/index"
import Hamburger from "@/components/Hamburger"
import ThemePicker from "@/components/ThemePicker"
import LangSelector from "@/components/LangSelector"
export default {
  components:{
        Hamburger,
        ThemePicker,
        LangSelector
  },
  data() {
    return {
      userName: "Louis",
      userAvatar: "",
      activeIndex: '1',
      backupVisible: false
    }
  },
  methods: {
    openWindow(url) {
      window.open(url)
    },
    selectNavBar(key, keyPath) {
      console.log(key, keyPath)
    },
    // 折叠导航栏
    onCollapse: function() {
      this.$store.commit('onCollapse')
    },
    // 切换主题
    onThemeChange: function(themeColor) {
      this.$store.commit('setThemeColor', themeColor)
    },
    // 退出登录
    logout: function() {
      this.$confirm("确认退出吗?", "提示", {
        type: "warning"
      })
      .then(() => {
        sessionStorage.removeItem("username")
        this.$router.push("/login")
        this.$api.login.logout().then((res) => {
          }).catch(function(res) {
        })
      })
      .catch(() => {})
    }
  },
  mounted() {
    this.sysName = "CMS Platform"
    var username = sessionStorage.getItem("username")
    if (username) {
      this.userName = username
      this.userAvatar = require("@/assets/user.png")
    }
  },
  computed:{
    ...mapState({
      themeColor: state=>state.app.themeColor,
      collapse: state=>state.app.collapse
    })
  }
}
</script>

<style scoped lang="scss">
.container {
  position: absolute;
  left: 200px;
  right: 0px;
  height: 60px;
  line-height: 60px;
  .hamburger-container {
    width: 40px;
    float: left;
    border-color: rgba(238, 241, 241, 0.4);
    border-left-width: 1px;
    border-left-style: solid;
    border-right-width: 1px;
    border-right-style: solid;
    color: white;
  }
  .nav-bar {
    margin-left: auto;
    float: left;
    .el-menu {
      background: #0a463480;
    }
  }
  .tool-bar {
    float: right;
    .theme-picker {
      padding-right: 10px;
    }
    .lang-selector {
      padding-right: 10px;
      font-size: 15px;
      color: #fff;
      cursor: pointer;
    }
    .user-info-dropdown {
      font-size: 20px;
      padding-right: 20px;
      color: #fff;
      cursor: pointer;
      img {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        margin: 10px 0px 10px 10px;
        float: right;
      }
    }
  }
}
.menu-bar-width {
  left: 200px;
}
.menu-bar-collapse-width {
  left: 65px;
}
</style>