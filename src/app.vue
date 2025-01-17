<doc>
  @name: 根组件
</doc>

<template>
  <div id="app" class="layout">
    <Layout>
      <HeaderNav></HeaderNav>
      <Layout class="layout-has-sider">
        <SiderNav></SiderNav>
        <Layout class="layout-has-content">
          <Content>
            <transition mode="out-in" name="fade">
              <router-view v-if="isRouterAlive" />
            </transition>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  </div>
</template>
<script>
export default {
  components: {},
  provide () {
    return {
      reload: this.reload,
    }
  },
  data () {
    return {
      isRouterAlive: true,
    }
  },

  computed: {},

  methods: {},
}
</script>

<style rel="stylesheet/less" lang="less" scoped>
@import '~@/assets/styles/contanst.less';
#app {
  background: #f5f7f9;
  position: relative;
  overflow: hidden;
  .layout-has-sider{
    flex-direction: row;
    height: calc(100vh - 65px);
  }
  .layout-has-content{
    padding: 8px 12px;
  }
  .fade-enter {
    opacity: 0;
    transform: translateX(20px);
  }
  .fade-enter-active {
    transition: all 0.5s;
  }
  .fade-enter-to {
    opacity: 1;
  }
  .fade-leave {
    opacity: 1;
  }
  .fade-leave-active {
    transition: all 0.5s;
  }
  .fade-leave-to {
    opacity: 0;
    transform: translateX(20px);
  }
}
</style>
