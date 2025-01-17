const path = require('path')
const root = path.resolve(__dirname, '../')
const resolveApp = relativePath => path.resolve(root, relativePath)

module.exports = {
  appPath: root,
  appDist: resolveApp('dist'),
  appDistStatics: resolveApp('dist/statics'),
  appDll: resolveApp('dll'),
  appVendorConfigs: resolveApp('build/vendorConfigs.js'),
  appTemplate: resolveApp('src/html/index.html'),
  appEntry: resolveApp('src/index.js'),
  appSrc: resolveApp('src'),
  appStatics: resolveApp('src/statics'),
  appApis: resolveApp('src/apis'),
  appImages: resolveApp('src/images'),
  appAssets: resolveApp('src/assets'),
  appComponents: resolveApp('src/components'),
  appViews: resolveApp('src/views'),
  appUtils: resolveApp('src/utils'),
  appNodeModules: resolveApp('node_modules'),
}
