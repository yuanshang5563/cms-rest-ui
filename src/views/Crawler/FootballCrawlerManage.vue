<template>
  <div class="page-container">
    <el-descriptions title="总爬虫管理操作说明" style="width: 100%" border :column="1">
      <el-descriptions-item label="操作步骤">
        <el-steps align-center :active="tableData.length" direction="horizontal">
          <el-step v-for="item in tableData" :title="item.crawlerName" :key="item.crawlerName" :description="item.desc"></el-step>
        </el-steps>
      </el-descriptions-item>
      <el-descriptions-item label="特别说明">
        <ul>
          <li style="color: red">
            由于该页面的爬虫都是爬取网站的全部数据，所有运行时间特别长，已经爬取的数据尽量避免重复爬取。
          </li>
        </ul>
      </el-descriptions-item>
    </el-descriptions>
    <el-table :data="tableData" style="width: 100%" :border="false" :stripe="true">
      <el-table-column prop="crawlerName" label="爬虫名称"> </el-table-column>
      <el-table-column :label="$t('action.operation')" width="320" fixed="right" header-align="center" align="center">
        <template slot-scope="scope">
          <kt-button :label="scope.row.crawlerName" :perms="scope.row.crawPerms" :size="size" type="danger " @click="selectCrawler(scope.row)" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import KtButton from "@/views/Core/KtButton";
export default {
  components: {
    KtButton,
  },
  data() {
    return {
      size: "small",
      tableData: [
        {
          crawlerName: "联赛爬虫",
          handleMethod: "leagueMatchCrawler",
          crawPerms: "ROLE_FOOTBALL_LEAGUE_MATCH_CRAW",
          desc: "第一步，先爬取所有联赛",
        },
        {
          crawlerName: "赛季爬虫",
          handleMethod: "seasonCrawler",
          crawPerms: "ROLE_FOOTBALL_SEASON_CRAW",
          desc: "第二步，爬取所有赛季",
        },
        {
          crawlerName: "类别爬虫",
          handleMethod: "seasonCategoryCrawler",
          crawPerms: "ROLE_FOOTBALL_SEASON_CATE_CRAW",
          desc: "第三步，爬取所有赛季类别",
        },
        {
          crawlerName: "轮数爬虫",
          handleMethod: "seasonRoundCrawler",
          crawPerms: "ROLE_FOOTBALL_SEASON_ROUND_CRAW",
          desc: "第四步，爬取所有赛季类别的轮数",
        },
        {
          crawlerName: "积分爬虫",
          handleMethod: "integralCrawler",
          crawPerms: "ROLE_FOOTBALL_INTEGRAL_CRAW",
          desc: "第五步，爬取所有赛季的积分数据",
        },        
        {
          crawlerName: "比分爬虫",
          handleMethod: "scoreCrawler",
          crawPerms: "ROLE_FOOTBALL_SCORE_CRAW",
          desc: "第六步，爬取所有赛季的比分数据",
        },
        {
          crawlerName: "详情爬虫",
          handleMethod: "scoreDetailCrawler",
          crawPerms: "ROLE_FOOTBALL_SCORE_DETAIL_CRAW",
          desc: "第七步，爬取所有赛季的比分详情数据",
        },
      ],
    };
  },
  methods: {
    selectCrawler: function (row) {
      this.$confirm(
        "此操作将开始所有" +
          row.crawlerName +
          "数据爬取，短时间内请勿重复开启, 是否继续?",
        "提示",
        {
          type: "warning",
        }
      ).then(() => {
          let handleMethod = row.handleMethod;
          switch (handleMethod) {
            case "leagueMatchCrawler":
              this.startLeagueMatchCrawler();
              break;
            case "seasonCrawler":
              this.startSeasonCrawler();
              break;
            case "seasonCategoryCrawler":
              this.startSeasonCategoryCrawler();
              break;
            case "seasonRoundCrawler":
              this.startSeasonRoundCrawler();
              break;
            case "integralCrawler":
              this.startIntegralCrawler();
              break;              
            case "scoreCrawler":
              this.startScoreCrawler();
              break;
            case "scoreDetailCrawler":
              this.startScoreDetailCrawler();
              break;
          }
        }).catch(() => {
          this.$message({ ype: "info", message: "已取消爬取" });
        });
    },
    startLeagueMatchCrawler: function () {
        this.$api.footballCrawlerManage.handleLeagueMatchCrawler().then((res) => {
        this.resCommonFun(res);
      });
    },
    startSeasonCrawler: function () {
      this.$api.footballCrawlerManage.handleSeasonCrawler().then((res) => {
        this.resCommonFun(res);
      });
    },
    startSeasonCategoryCrawler: function () {
        this.$api.footballCrawlerManage.handleSeasonCategoryCrawler().then((res) => {
          this.resCommonFun(res);
        });
    },
    startSeasonRoundCrawler: function () {
      this.$api.footballCrawlerManage.handleSeasonRoundCrawler().then((res) => {
        this.resCommonFun(res);
      });
    },
    startIntegralCrawler: function () {
      this.$api.footballCrawlerManage.handleIntegralCrawler().then((res) => {
        //this.resCommonFun(res);
      });
      this.$message({ message: "爬虫已经在后台启动，请勿重复启动", type: "success" });
    },   
    startScoreCrawler: function () {
      this.$api.footballCrawlerManage.handleScoreCrawler().then((res) => {
        this.resCommonFun(res);
      });
    },
    startScoreDetailCrawler: function () {
      this.$api.footballCrawlerManage.handleScoreDetailCrawler().then((res) => {
        this.resCommonFun(res);
      });
    },
    resCommonFun: function (res) {
      if (res.code == 500) {
        this.$message.error(res.msg);
      } else {
        this.$message({ message: res.msg, type: "success" });
      }
    },
  },
};
</script>

<style scoped>
</style>