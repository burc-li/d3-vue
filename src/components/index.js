/**
   * @name 自动化注入
   * directory: 要查找的文件路径
   * useSubdirectories: 是否查找子目录
   * regExp: 要匹配文件的正则
   */
const requireContext = require.context(
  './',
  true,
  /index.vue$/,
)

export default Vue => {
  const componentModules = requireContext.keys().map(requireContext)
  componentModules.forEach(({ default: componentItem }) => {
    Vue.component(componentItem.name, componentItem)
  })
}
