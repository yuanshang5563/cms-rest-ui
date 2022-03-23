<template>
  <el-table :data="tableData" style="width: 100%" :row-class-name="tableRowClassName">
    <el-table-column prop="crawlerName" label="爬虫名称"> </el-table-column>
    <el-table-column :label="$t('action.operation')" width="320" fixed="right" header-align="center" align="center">
    <template slot-scope="scope">
		<kt-button :label="scope.row.crawlerName" :perms="scope.row.crawPerms" :size="size" type="danger " @click="selectCrawler(scope.row)"/>
    </template>
	</el-table-column>
  </el-table>
</template>

<script>
import KtButton from "@/views/Core/KtButton"
export default {
  components:{
		KtButton
	},
  data() {
    return {
      size: 'small',
      tableData: [
        {
          crawlerName: "赛季爬虫",
          handleMethod: "seasonCrawler",
          crawPerms: "ROLE_FOOTBALL_SEASON_CRAW"
        },
        {
          crawlerName: "类别爬虫",
          handleMethod: "seasonCategoryCrawler",
          crawPerms: "ROLE_FOOTBALL_SEASON_CATE_CRAW"
        },
        {
          crawlerName: "轮数爬虫",
          handleMethod: "seasonRoundCrawler",
          crawPerms: "ROLE_FOOTBALL_SEASON_ROUND_CRAW"
        },
        {
          crawlerName: "比分爬虫",
          handleMethod: "scoreCrawler",
          crawPerms: "ROLE_FOOTBALL_SCORE_CRAW"
        },
        {
          crawlerName: "详情爬虫",
          handleMethod: "scoreDetailCrawler",
          crawPerms: "ROLE_FOOTBALL_SCORE_DETAIL_CRAW"
        }
      ],
    };
  },
  methods: {
    tableRowClassName: function({ row, rowIndex }) {
      if (rowIndex%2 === 0) {
        return "success-row";
      } 
      return "warning-row";
    },
  selectCrawler: function (row) {
    this.$confirm('此操作将开始所有'+row.crawlerName+'数据爬取，短时间内请勿重复开启, 是否继续?', '提示', {
        type: 'warning'
    }).then(() => {
      let handleMethod = row.handleMethod;
      switch(handleMethod){
        case 'seasonCrawler':
          this.startSeasonCrawler();
          break;
        case 'seasonCategoryCrawler':
          this.startSeasonCategoryCrawler();
          break;
        case 'seasonRoundCrawler':
          this.startSeasonRoundCrawler();
          break;
        case 'scoreCrawler':
          this.startScoreCrawler();
          break;
        case 'scoreDetailCrawler':
          this.startScoreDetailCrawler();
          break;
      }
    }).catch(() => {
        this.$message({ype: 'info',message: '已取消爬取'});          
    });
	},
  startSeasonCrawler:function(){
        this.$api.footballCrawlerManage.handleSeasonCrawler().then(res => {
          this.resCommonFun(res);
      });
  },
  startSeasonCategoryCrawler:function(){
        this.$api.footballCrawlerManage.handleSeasonCategoryCrawler().then(res => {
          this.resCommonFun(res);
      });
  },  
  startSeasonRoundCrawler:function(){
        this.$api.footballCrawlerManage.handleSeasonRoundCrawler().then(res => {
          this.resCommonFun(res);
      });
  },  
  startScoreCrawler:function(){
        this.$api.footballCrawlerManage.handleScoreCrawler().then(res => {
          this.resCommonFun(res);
      });
  },  
  startScoreDetailCrawler:function(){
        this.$api.footballCrawlerManage.handleScoreDetailCrawler().then(res => {
          this.resCommonFun(res);
      });
  },        
  resCommonFun: function(res){
    if(res.code == 500){
      this.$message.error(res.msg);
    }else{
      this.$message({message: res.msg,type: 'success' });
    }    
  }
  }
};
</script>

<style scoped>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>