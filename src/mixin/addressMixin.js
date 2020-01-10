export  default {
  data(){
    return{
      provinceOptions: [],//省
      cityOptions: [],//市
      districtOptions: [],//区/县
      townOptions: [],//乡/镇/街道
      villageOptions: [],//村/小区
    }
  },
  methods:{
    //获取可用的省
    getAlreadyProvice(){
      return this.$request.get(`${this.$apiList.location}/province`)
    },
    //获取根据省获取可用的市ss
    getCityByProvice(code){
      this.createInfo.cityCode = ''
      this.detailInfo.cityCode = ''
      this.createInfo.districtCode = ''
      this.detailInfo.districtCode = ''
      this.createInfo.townCode = ''
      this.detailInfo.townCode = ''
      this.createInfo.villageCode = ''
      this.detailInfo.villageCode = ''
      this.$request.get(`${this.$apiList.location}/province/${code}/city`).then(res=>{
        this.cityOptions = res.data.data
      })
    },
    //获取根据市获取可用的区/县
    getDistrictByCity(code){
      this.createInfo.districtCode = ''
      this.detailInfo.districtCode = ''
      this.createInfo.townCode = ''
      this.detailInfo.townCode = ''
      this.createInfo.villageCode = ''
      this.detailInfo.villageCode = ''
      this.$request.get(`${this.$apiList.location}/province/city/${code}/district`).then(res=>{
        this.districtOptions = res.data.data
      })
    },
    //获取根据区/县获取可用的乡/镇/街道
    getTownByDistrict(code){
      this.createInfo.townCode = ''
      this.detailInfo.townCode = ''
      this.createInfo.villageCode = ''
      this.detailInfo.villageCode = ''
      this.$request.get(`${this.$apiList.location}/province/city/district/${code}/town`).then(res=>{
        this.townOptions = res.data.data
      })
    },
    //获取根据乡/镇/街道获取可用的村/小区
    getVillageByTown(code){
      this.createInfo.villageCode = ''
      this.detailInfo.villageCode = ''
      this.$request.get(`${this.$apiList.location}/province/city/district/town/${code}/village`).then(res=>{
        this.villageOptions = res.data.data
      })
    },
    /**
     * @param datas:过滤数据源
     * */
    formatFormDatas(datas){
      let data = this._funs.copyObject(datas)
      for (let i in  this.provinceOptions){
        if (this.provinceOptions[i].locationCode===data.provinceCode){
          data.provinceName = this.provinceOptions[i].locationName
          break;
        }
      }
      for (let i in  this.cityOptions){
        if (this.cityOptions[i].locationCode===data.cityCode){
          data.cityName = this.cityOptions[i].locationName
          break;
        }
      }
      for (let i in  this.districtOptions){
        if (this.districtOptions[i].locationCode===data.districtCode){
          data.districtName = this.districtOptions[i].locationName
          break;
        }
      }
      for (let i in  this.townOptions){
        if (this.townOptions[i].locationCode===data.townCode){
          data.townName = this.townOptions[i].locationName
          break;
        }
      }
      for (let i in  this.villageOptions){
        if (this.villageOptions[i].locationCode===data.villageCode){
          data.villageName = this.villageOptions[i].locationName
          break;
        }
      }
      return data
    },
    /**
     * @param detail:详情承接对象
     * */
    getAddressInfoByDetail(detail){
      const cDate = this._funs.copyObject(detail)
      if (cDate.provinceCode){
        this.getCityByProvice(cDate.provinceCode)
        detail.provinceCode = cDate.provinceCode
      }
      if (cDate.cityCode){
        this.getDistrictByCity(cDate.cityCode)
        detail.cityCode = cDate.cityCode
      }
      if (cDate.districtCode){
        this.getTownByDistrict(cDate.districtCode)
        detail.districtCode = cDate.districtCode
      }
      if (cDate.townCode){
        this.getVillageByTown(cDate.townCode)
        detail.townCode = cDate.townCode
      }
      detail.villageCode = cDate.villageCode
    },
  }
}
