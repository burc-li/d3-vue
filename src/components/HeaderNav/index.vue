<template>
  <div class="header-nav-warp">
    <Header>
      <Menu mode="horizontal" theme="dark" active-name="1">
        <div class="layout-logo">D3</div>
        <div class="layout-nav">
          <MenuItem name="1">
            <Icon type="ios-navigate"></Icon>
            Item 1
          </MenuItem>
          <MenuItem name="2">
            <Icon type="ios-keypad"></Icon>
            Item 2
          </MenuItem>
          <MenuItem name="3">
            <Icon type="ios-analytics"></Icon>
            Item 3
          </MenuItem>
          <MenuItem name="4">
            <Icon type="ios-paper"></Icon>
            Item 4
          </MenuItem>
        </div>
      </Menu>
    </Header>
  </div>
</template>

<script>
export default {
  name: 'HeaderNav',
  data () {
    return {}
  },
  computed: {},
  methods: {},
}
</script>

<style rel="stylesheet/less" lang="less" scoped>
.header-nav-warp {
  border-bottom: 1px solid #ccc;
  .layout-logo {
    width: 100px;
    height: 30px;
    line-height: 30px;
    color: #fff;
    text-align: center;
    background: #5b6270;
    border-radius: 3px;
    float: left;
    position: relative;
    top: 15px;
    left: 20px;
  }
  .layout-nav {
    width: 420px;
    margin: 0 auto;
    margin-right: 20px;
  }
}
</style>
