<template>
  <el-cascader ref="crawlerCascader" :clearable="clearable" :filterable="filterable" :props="props" :placeholder="placeholder"  @change="handleChange" style="width:100%"></el-cascader>
</template>

<script>
import { isBlank } from "@/utils/stringUtil"
import { mapActions } from 'vuex'
export default {
  name: 'CrawlerCascader',
  props:{
    placeholder: {
      type: String,
      default: '请选择联赛或赛季或赛季类别'
    },
    //支持可删除
    clearable: {
      type: Boolean,
      default: true
    }, 
    //支持搜索
    filterable: {
      type: Boolean,
      default: true
    },
    //支持几级数据，默认支持三级(1,2,3)
    cascaderLevel: {
      type: Number,
      default: 3
    }     
  },
  data() {
    let _self = this
    return {    
      props: {
        emitPath: false,//只返回最后一级的Id
        lazy: true,
        checkStrictly: true,
        lazyLoad(node, resolve) {
          _self.loadCascaderData(node, resolve);
        },
      }
    };
  },
  methods: {
    //将vuex中定义的方法映射过来
		...mapActions(['setLeagueMatchesAsyn']),
    handleChange: function(value) {
        this.$emit('toChangeSelection',value)
    },
    loadCascaderData: function(node, resolve) {
      const level = node.level;
      let cascaderLevel = this.cascaderLevel;
      // 第一級
      if (level == 0) {
        let leagueMatches = this.$store.state.crawlerCascader.leagueMatches;
        let leafVal = node.level >= 2
        if (cascaderLevel == 1) {
          leafVal = "leaf";
        }
        if(null != leagueMatches){
            const nodes = leagueMatches.map((item, index) => ({
              value: "footballLeagueMatchId:"+item.id,
              label: item.name,
              leaf: leafVal,
            }));
            resolve(nodes);
        }else{
          // Ajax請求數據，填充選擇框
          this.$api.crawlerCascader.findLeagueMatchCascaderItem().then(response => {
            const nodes = response.data.map((item, index) => ({
              value: "footballLeagueMatchId:"+item.id,
              label: item.name,
              leaf: leafVal,
            }));
            this.setLeagueMatchesAsyn(response);
            resolve(nodes);
          });
        }
      }else if ((level == 1) && cascaderLevel >= 2) { // 第二級
        // Ajax請求數據，填充選擇框，傳遞上一級參數
        let leagueMatchId = node.data.value;
        if(!isBlank(leagueMatchId)){
          leagueMatchId = leagueMatchId.replace("footballLeagueMatchId:","")
        }
        let leafVal = node.level >= 2
        if (cascaderLevel == 2) {
          leafVal = "leaf";
        }
        this.$api.crawlerCascader.findSeasonCascaderItemByLeagueMatchId({footballLeagueMatchId: leagueMatchId}).then(response => {
          const nodes = response.data.map((item, index) => ({
            value: "footballSeasonId:"+item.id,
            label: item.name,
            leaf: leafVal,
          }));
          resolve(nodes);
        });
      }else if ((level == 2) && cascaderLevel >= 3) {// 第三級
        // Ajax請求數據，填充選擇框，傳遞上一級參數
        let seasonId = node.data.value;
        if(!isBlank(seasonId)){
          seasonId = seasonId.replace("footballSeasonId:","")
        }
        this.$api.crawlerCascader.findSeasonCascaderItemBySeasonId({footballSeasonId: seasonId}).then(response => {
          const nodes = response.data.map((item, index) => ({
            value: "footballSeasonCategoryId:"+item.id,
            label: item.name,
            leaf: 'leaf',
          }));
          resolve(nodes);
        });
      } 
    }    
  },
  mounted() {
  }
};
</script>

<style scoped lang="scss">

</style>