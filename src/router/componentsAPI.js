import Home from '../views/home/layout.vue'

export default {
  path: '/componentsAPI',
  name: 'componentsAPI',
  bname: '组件',
  component: Home,
  children: [
    {
      path: '/componentsAPI/tableAPI',
      name: 'tableAPI',
      bname: '表格组件',
      component: () =>
        import('@/components/table/tableAPI.vue')
    }
  ]
}
