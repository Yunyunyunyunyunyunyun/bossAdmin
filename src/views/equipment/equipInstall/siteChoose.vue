<template>
  <el-dialog
    title="地图"
    :visible.sync="mapDialogObj.dialogVisible"
    width="600px"
  >
    <div class="map-container">
      <div id="map" ref="map" class="map"></div>
      <div class="search">
        <el-input
          id="suggestId"
          v-model="searchKeyword"
          placeholder="请输入关键字"
          suffix-icon="el-icon-search"
          clearable
        >
        </el-input>
      </div>
    </div>
    <span slot="footer" class="dialog-footer footer">
      <el-button type="primary" @click="confirmChoose">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: '',
  props: {
    mapDialogObj: {
      type: Object,
      default: () => {
        return {
          dialogVisible: false
        }
      }
    }
  },
  data () {
    return {
      searchKeyword: '',
      position: '',
      map: null,
      ac: null
    }
  },
  mounted () {
  },
  methods: {
    addEvents () {
    },
    initMap () {
      this.searchKeyword = ''
      this.map = new BMap.Map('map', { enableMapClick: false })
      var point = new BMap.Point(116.331398, 39.897445) // 默认南京
      this.map.centerAndZoom(point, 12) // 初始化地图,设置城市和地图级别
      this.map.enableScrollWheelZoom(true)
      this.getLocation()
    },
    getLocation () { // 定位
      var LocalCity = new BMap.LocalCity()
      LocalCity.get((result) => {
        this.map.setCenter(result.name)
        this.search(result.name)
      })
    },
    search (name) {
      var self = this
      if (this.ac === null) {
        this.ac = new BMap.Autocomplete({ // 建立一个自动完成的对象
          'input': 'suggestId',
          'location': name
        })
      }
      this.ac.addEventListener('onconfirm', function (e) { // 鼠标点击下拉列表后的事件
        var _value = e.item.value
        var myValue = _value.province + _value.city + _value.district + _value.street + _value.business
        self.searchKeyword = myValue
        self.setPlace(myValue)
      })
    },
    setPlace (myValue) { // 定位到点
      var self = this
      this.map.clearOverlays()
      var local = new BMap.LocalSearch(
        self.map,
        {
          onSearchComplete: function () {
            var pp = local.getResults().getPoi(0).point // 获取第一个智能搜索的结果
            self.position = pp
            self.map.centerAndZoom(pp, 18)
            var marker = new BMap.Marker(pp)
            self.map.addOverlay(marker) // 添加标注
            marker.addEventListener('click', function (target) {
              self.position = target.point
            })
          }
        }
      )
      local.search(myValue)
    },
    confirmChoose () {
      this.mapDialogObj.dialogVisible = false
      this.$emit('getPosition', this.position)
    }
  }
}
</script>

<style lang="stylus" scoped>
.map-container
  position relative
  .map
    width 554px
    height 348px
    touch-action none
  .search
    width 180px
    position absolute
    top 24px
    left 18px
</style>
