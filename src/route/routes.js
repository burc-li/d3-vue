/**
 * @name 自定义的路由对象
 */

export default () => {
  return [
    {
      path: '/',
      redirect: '/force',
    },
    {
      path: '/force',
      component: () => import('@/views/Force/index.vue'),
      name: 'force',
    },
  ]
}
