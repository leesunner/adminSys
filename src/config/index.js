// 字典管理
export default {
  // 用户性别
  dict_sex: [
    {
      key: 0,
      value: '男'
    }, {
      key: 1,
      value: '女'
    }, {
      key: 2,
      value: '未知'
    },
  ],
  // 用户状态
  dict_user_status: [
    {
      key: 0,
      value: '未知'
    }, {
      key: 1,
      value: '在职'
    }, {
      key: 2,
      value: '离职'
    }, {
      key: 3,
      value: '停职'
    }, {
      key: 4,
      value: '退休'
    }
  ],
  // 禁用状态
  dict_enabled_status: [
    {
      key: false,
      value: '禁用'
    }, {
      key: true,
      value: '启用'
    },
  ],
  // 翻页中每页显示的数据条数
  sizeArr: [30, 45, 60],

  // 短信发送状态
  dict_sms_status: [
    {
      key: 1,
      value: '成功'
    }, {
      key: 2,
      value: '失败'
    },
  ],

  //是否购买物料
  dict_isTrue: [
    {
      key: 0,
      value: '否'
    }, {
      key: 1,
      value: '是'
    }
  ],

  // 部门类型
  dict_dept_type: [
    {
      key: 0,
      value: '其它部门'
    }, {
      key: 1,
      value: '销售部门'
    }
  ],
  // 按钮请求方式
  dict_method_type: [
    {
      key: 0,
      value: 'GET'
    }, {
      key: 1,
      value: 'POST'
    }, {
      key: 2,
      value: 'PUT'
    }, {
      key: 3,
      value: 'DELETE'
    }, {
      key: 4,
      value: 'PATCH'
    }
  ],
  // 按钮类型
  dict_button_type: [
    {
      key: 1,
      value: '公共资源'
    }, {
      key: 2,
      value: '私有资源'
    }
  ],
  //用户来源
  dict_user_origin:[],
  //合资人
  dict_investor_list: [],
  /**
   * 按钮代码，buttonCode配置
   * key绑定在页面的按钮中（不要修改）,value跟用户给的值做绑定
   */
  buttonCode: {
    B_DELETE: 'B_DELETE',//基础的删除
    B_LIST: 'B_LIST',//基础的查看列表
    B_UPDATE: 'B_UPDATE',//基础的编辑
    B_CREATE: 'B_CREATE',//基础的创建
    B_DETAIL: 'B_DETAIL',//基础的查看详情
    B_EXPORT: 'B_EXPORT',//基础的导出

  },
  // 全国各省省会城市的经纬度
  geoCoordMap: {
    辽宁省: [123.429092, 41.796768],
    吉林省: [125.324501, 43.886841],
    黑龙江省: [126.642464, 45.756966],
    北京市: [116.405289, 39.904987],
    天津市: [117.190186, 39.125595],
    内蒙古: [111.751990, 40.841490],
    山西省: [112.549248, 37.857014],
    河北省: [114.502464, 38.045475],
    山东省: [117.000923, 36.675808],
    河南省: [113.665413, 34.757977],
    陕西省: [108.948021, 34.263161],
    湖北省: [114.298569, 30.584354],
    江苏省: [118.76741, 32.041546],
    安徽省: [117.283043, 31.861191],
    上海市: [121.472641, 31.231707],
    湖南省: [112.982277, 28.19409],
    江西省: [115.892151, 28.676493],
    浙江省: [120.15358, 30.287458],
    福建省: [119.306236, 26.075302],
    广东省: [113.28064, 23.125177],
    台湾省: [121.5200760, 25.0307240],
    海南省: [110.199890, 20.044220],
    广西省: [108.320007, 22.82402],
    重庆市: [106.504959, 29.533155],
    云南省: [102.71225, 25.040609],
    贵州省: [106.713478, 26.578342],
    四川省: [104.065735, 30.659462],
    甘肃省: [103.834170, 36.061380],
    青海省: [101.777820, 36.617290],
    西藏自治区: [91.11450, 29.644150],
    宁夏回族自治区: [106.232480, 38.486440],
    新疆维吾尔自治区: [87.616880, 43.826630],
    香港特別行政區: [114.165460, 22.275340],
    澳門特別行政區: [113.549130, 22.198750]
  }
}
