<template>
  <div class="page-container">
	<!--工具栏-->
	<div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
		<el-form :inline="true" :model="filters" :size="size">
			<el-form-item>
				<el-input v-model="filters.footballLeagueMatchName" placeholder="联赛名称"></el-input>
			</el-form-item>
			<el-form-item>
				<el-input v-model="filters.regionName" placeholder="联赛地区"></el-input>
			</el-form-item>	
			<el-form-item>
				<kt-button :label="$t('crawler.changeCraw')" perms="ROLE_FOOTBALL_LEAGUE_MATCH_LIST" type="primary" @click="changeCrawlerOrManage()"/>
			</el-form-item>						
			<el-form-item>
				<kt-button :label="$t('action.search')" perms="ROLE_FOOTBALL_LEAGUE_MATCH_LIST" type="primary" @click="findPage()"/>
			</el-form-item>
		</el-form>
	</div>
	<!--表格内容栏-->
	<!--表格栏-->
	<el-table :data="pageResult" :highlight-current-row="true" @selection-change="selectionChange"
		v-loading="loading" :element-loading-text="$t('action.loading')" :border="false" :stripe="true"
		:show-overflow-tooltip="true" align="left" size="mini" style="width:100%;" >
	<el-table-column type="index" width="60" label="序号"></el-table-column>
	<el-table-column prop="footballLeagueMatchName" label="联赛名称"></el-table-column>
	<el-table-column prop="regionName" label="联赛地区"></el-table-column>
	<el-table-column prop="footballLeagueMatchLevel" label="联赛级别"></el-table-column>
	<el-table-column prop="leagueMatchUrl" label="联赛URL" width="220"></el-table-column>
	<el-table-column :label="$t('action.operation')" width="520" fixed="right" header-align="center" align="center">
		<template slot-scope="scope">
		<div v-if="show">
		<kt-button :label="$t('action.view')" perms="ROLE_FOOTBALL_LEAGUE_MATCH_VIEW" :size="size" @click="handleView(scope.row)" />
		<kt-button :label="$t('crawler.seasonMng')" perms="ROLE_FOOTBALL_SEASON_LIST" :size="size" @click="handleSeasonMan(scope.row)" />
		<kt-button :label="$t('crawler.seasonCateMng')" perms="ROLE_FOOTBALL_SEASON_CATEGORY_LIST" :size="size" @click="handleSeasonCateMan(scope.row)" />
		</div>
		<div v-if="!show">
		<kt-button :label="$t('crawler.seasonCraw')" perms="ROLE_FOOTBALL_SEASON_CRAW_BY_LEAGUE_MATCH" :size="size" @click="startSeasonCrawler(scope.row)" />
		<kt-button :label="$t('crawler.seasonCateCraw')" perms="ROLE_FOOTBALL_SEASON_CATE_CRAW_BY_LEAGUE_MATCH" :size="size" @click="startSeasonCategoryCrawler(scope.row)" />
		<kt-button :label="$t('crawler.roundCraw')" perms="ROLE_FOOTBALL_SEASON_ROUND_CRAW_BY_LEAGUE_MATCH" :size="size" @click="startSeasonRoundCrawler(scope.row)" />
		<kt-button :label="$t('crawler.scoreCraw')" perms="ROLE_FOOTBALL_SCORE_CRAW_BY_LEAGUE_MATCH" :size="size" @click="startScoreCrawler(scope.row)" />
		<kt-button :label="$t('crawler.scoreDetailCraw')" perms="ROLE_FOOTBALL_SCORE_DETAIL_CRAW_BY_LEAGUE_MATCH" :size="size" @click="startScoreDetailCrawler(scope.row)" />
		</div>
		</template>		
	</el-table-column>
	</el-table>
	<!--分页栏-->
	<div class="toolbar" style="padding:10px;">
	<el-pagination layout="total, prev, pager, next, jumper" @current-change="refreshPageRequest" 
		:current-page="pageRequest.pageNum" :page-size="pageRequest.pageSize" :total="total" style="float:right;">
	</el-pagination>
	</div>
	<!--新增编辑界面-->
	<el-dialog :title="dialogTitle" width="40%" :visible.sync="dialogVisible" :close-on-click-modal="false">
		<el-form :model="dataForm" label-width="80px" ref="dataForm" :size="size" label-position="right">
			<el-form-item label="联赛名称" prop="footballLeagueMatchName">
				<el-input v-model="dataForm.footballLeagueMatchName" auto-complete="off" :readonly="viewFlag"></el-input>
			</el-form-item>
			<el-form-item label="联赛地区" prop="regionName">
				<el-input v-model="dataForm.regionName" auto-complete="off" :readonly="viewFlag"></el-input>
			</el-form-item>	
			<el-form-item label="联赛级别" prop="footballLeagueMatchLevel">
				<el-input v-model="dataForm.footballLeagueMatchLevel" auto-complete="off" :readonly="viewFlag"></el-input>
			</el-form-item>
			<el-form-item label="联赛URL" prop="leagueMatchUrl">
				<el-input v-model="dataForm.leagueMatchUrl" auto-complete="off" :readonly="viewFlag"></el-input>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button :size="size" @click.native="dialogVisible = false">{{$t('action.cancel')}}</el-button>		
		</div>	
	</el-dialog>
  </div>
</template>

<script>
import KtButton from "@/views/Core/KtButton"

export default {
	components:{
		KtButton
	},
	data() {				
		return {
			show: true,//该列是否显示
			size: 'small',
			filters: {
				footballLeagueMatchName: '',
				regionName: ''
			},
			pageRequest: { pageNum: 1, pageSize: 10 },
			total: 0,
			pageResult: [],
			loading: false, //加载标志
			dialogTitle: "", // 新增, 编辑，查看
			dialogVisible: false, // 新增编辑界面是否显示
			editLoading: false,
			viewFlag: false,//查看标志
			// 新增,编辑,查看的界面数据
			dataForm: {
				footballLeagueMatchId: '',
				footballLeagueMatchName: '',
				footballLeagueMatchLevel: '',
				regionName: '',
				leagueMatchUrl: ''
			}
		}
	},
	methods: {
		// 获取分页数据
		findPage: function (data) {
			this.loading = true;
			let param = {pageNum:this.pageRequest.pageNum,pageSize:this.pageRequest.pageSize,footballLeagueMatchName:this.filters.footballLeagueMatchName,
			regionName:this.filters.regionName};
			this.$api.footballLeagueMatch.findPage(param).then((res) => {
				this.loading = false;
				this.pageResult = res.data.list;
				this.total= res.data.total;
			})
		},
		// 选择切换
		selectionChange: function (selections) {
			this.selections = selections
		},		
		// 换页刷新
		refreshPageRequest: function (pageNum) {
			this.pageRequest.pageNum = pageNum
			this.findPage()
		},
		// 显示查看界面
		handleView: function (row) {
			this.dialogVisible = true
			this.dialogTitle = "查看"
			this.viewFlag = true;
			let _this = this;
			this.$api.footballLeagueMatch.find({footballLeagueMatchId:row.footballLeagueMatchId}).then(res => {
				Object.assign(_this.dataForm, res.data);
			});	
		},
		// 打开该联赛的赛季管理界面
		handleSeasonMan: function (row) {
			//this.$router.push({name:'赛季管理',params:{leagueMatchId:row.footballLeagueMatchId}});
			this.$router.push({path:'FootballSeason',query:{leagueMatchId:row.footballLeagueMatchId}});
		},
		// 打开该联赛的赛季类别管理界面
		handleSeasonCateMan: function (row) {
			this.$router.push({path:'FootballSeasonCategory',query:{leagueMatchId:row.footballLeagueMatchId}});
		},
		//切换列表的按钮
		changeCrawlerOrManage: function () {
			let showVal = this.show;
			this.show = !showVal;
		},
		startSeasonCrawler:function(row){
				this.$api.footballLeagueMatch.handleSeasonCrawler({footballLeagueMatchId:row.footballLeagueMatchId}).then(res => {
				this.resCommonFun(res);
			});
		},
		startSeasonCategoryCrawler:function(row){
				this.$api.footballLeagueMatch.handleSeasonCategoryCrawler({footballLeagueMatchId:row.footballLeagueMatchId}).then(res => {
				this.resCommonFun(res);
			});
		},  
		startSeasonRoundCrawler:function(row){
				this.$api.footballLeagueMatch.handleSeasonRoundCrawler({footballLeagueMatchId:row.footballLeagueMatchId}).then(res => {
				this.resCommonFun(res);
			});
		},  
		startScoreCrawler:function(row){
				this.$api.footballLeagueMatch.handleScoreCrawler({footballLeagueMatchId:row.footballLeagueMatchId}).then(res => {
				this.resCommonFun(res);
			});
		},  
		startScoreDetailCrawler:function(row){
				this.$api.footballLeagueMatch.handleScoreDetailCrawler({footballLeagueMatchId:row.footballLeagueMatchId}).then(res => {
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
	},
	computed: {
	},	
	mounted() {
		this.findPage();
	}
}
</script>

<style scoped>

</style>