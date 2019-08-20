export const basic = {
  input: {
    component: 'el-input',
    attrs: {
      placeholder: '请输入',
      clearable: true
    }
  },
  select: {
    component: 'g-select', // 自定义组件,为了在el-select添加options能够生成el-options节点
    attrs: {
      placeholder: '请选择',
      clearable: true
    }
  },
  date: {
    component: 'el-date-picker',
    attrs: {
      placeholder: '选择日期',
      clearable: true,
      type: 'date'
    }
  },
  'date-range': {
    component: 'el-date-picker',
    attrs: {
      placeholder: '选择日期',
      clearable: true,
      type: 'daterange',
      'range-separator': '至',
      'start-placeholder': '开始日期',
      'end-placeholder': '结束日期'
    }
  },
  radio: {
    component: 'g-radio-group', // 自定义组件,为了在el-radio-group添加options能够生成el-radio节点
    value: [],
    attrs: {
      placeholder: '选择',
      clearable: true
    }
  },
  checkbox: {
    component: 'el-checkbox'
  },
  'checkbox-group': {
    component: 'g-checkbox-group' // 自定义组件
  },
  cascader: {
    component: 'el-cascader',
    attrs: {
      placeholder: '请选择',
      clearable: true
    }
  },
  'area-cascader': {
    component: 'g-area-cascader',
    attrs: {
      placeholder: '请选择地区',
      clearable: true
    }
  },
  textarea: {
    component: 'el-input',
    attrs: {
      type: 'textarea'
    }
  }
}
