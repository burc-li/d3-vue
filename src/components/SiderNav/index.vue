<template>
  <Sider class="sider-nav-wrap">
    <Menu active-name="1-2" theme="dark" width="auto" :open-names="['1']">
      <MenuItem name="0" to="/force">
        <Icon type="ios-navigate"></Icon>
        力学图
      </MenuItem>
    </Menu>
  </Sider>
</template>

<script>
export default {
  name: 'SiderNav',
  data () {
    return {}
  },
  computed: {},
  methods: {},
}
</script>

<style rel="stylesheet/less" lang="less" scoped>
.sider-nav-wrap {
  height: calc(100vh - 65px);
  overflow: auto;
}
</style>
