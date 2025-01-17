<template>
  <div class="graph-outer">
    <div ref="picture" class="picture"></div>
  </div>
</template>

<script>
import ForceLayout from './picture/picture.js'
import { sourceCiId, ciNodes, ciRltLines, lineNamekeyval } from './mock/index'
export default {
  mounted () {
    this.initGraph()
    this.initData(sourceCiId)
  },
  methods: {
    /** 实例化力学图 */
    initGraph () {
      this.forceDraw = new ForceLayout({
        pad: this.$refs.picture,
        // 点击节点
        clickNode: d => {},
        // 点击线
        clickLink: d => {},
        // 点击图的其他位置，清空操作
        cancelClick: () => {},
      })
    },

    /** 画图数据初始化 */
    initData (sourceCiId) {
      this.forceDraw.changeTipType({ sourceId: sourceCiId })
      this.forceDraw.start(ciNodes, ciRltLines, lineNamekeyval)
    },
  },
}
</script>

<style lang="less" scoped>
.graph-outer {
  height: calc(100vh - 80px);
  border: 3px solid palevioletred;
  .picture {
    width: 100%;
    height: 100%;
  }
}
</style>
