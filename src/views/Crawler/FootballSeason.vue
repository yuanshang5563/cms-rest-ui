<template>
  <div class="page-container">
	<!--工具栏-->
	<div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
		<el-form :inline="true" :model="filters" :size="size">
			<el-form-item>
				<crawler-cascader :cascaderLevel="1" @toChangeSelection="filtersCascasderCurrentChangeHandle"></crawler-cascader>
			</el-form-item>			
			<el-form-item>
				<el-input v-model="filters.footballSeasonName" placeholder="赛季名称"></el-input>
			</el-form-item>			
			<el-form-item>
				<kt-button :label="$t('crawler.changeCraw')" perms="ROLE_FOOTBALL_SEASON_LIST" type="primary" @click="changeCrawlerOrManage()"/>
				<kt-button :label="$t('action.search')" perms="ROLE_FOOTBALL_SEASON_LIST" type="primary" @click="findPage()"/>
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
	<el-table-column prop="footballSeasonName" label="赛季名称"></el-table-column>
	<el-table-column prop="footballSeasonUrl" label="赛季URL" width="220"></el-table-column>
	<el-table-column prop="seasonBeginDate" label="赛季开始时间" :formatter="dateFormat"></el-table-column>
	<el-table-column prop="seasonEndDate" label="赛季结束时间" :formatter="dateFormat"></el-table-column>
	<el-table-column :label="$t('action.operation')" width="500" fixed="right" header-align="center" align="center">
		<template slot-scope="scope">
		<div v-if="show">
		<kt-button :label="$t('action.view')" perms="ROLE_FOOTBALL_SEASON_VIEW" :size="size" @click="handleView(scope.row)" />
		<kt-button :label="$t('crawler.seasonCateMng')" perms="ROLE_FOOTBALL_SEASON_CATEGORY_LIST" :size="size" @click="handleSeasonCateMan(scope.row)" />
		<kt-button :label="$t('crawler.integralMng')" perms="ROLE_FOOTBALL_INTEGRAL_LIST" :size="size" @click="handleIntegralMan(scope.row)" />
		<kt-button :label="$t('crawler.teamMng')" perms="ROLE_FOOTBALL_TEAM_LIST" :size="size" @click="handleTeamMan(scope.row)" />
		<kt-button :label="$t('crawler.scoreMng')" perms="ROLE_FOOTBALL_SCORE_LIST" :size="size" @click="handleScoreMan(scope.row)" />
		</div>
		<div v-if="!show">
		<kt-button :label="$t('crawler.integralCraw')" perms="ROLE_FOOTBALL_INTEGRAL_CRAW_BY_SEASON" :size="size" @click="startIntegralCrawler(scope.row)" />
		<kt-button :label="$t('crawler.scoreCraw')" perms="ROLE_FOOTBALL_SCORE_CRAW_BY_SEASON" :size="size" @click="startScoreCrawler(scope.row)" />
		<kt-button :label="$t('crawler.scoreDetailCraw')" perms="ROLE_FOOTBALL_SCORE_DETAIL_CRAW_BY_SEASON" :size="size" @click="startScoreDetailCrawler(scope.row)" />			
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
			<el-form-item label="联赛名称" prop="footballLeagueMatchName" :label-width="labelWidth">
				<el-input v-model="dataForm.footballLeagueMatchName" auto-complete="off" :readonly="viewFlag"></el-input>
			</el-form-item>
			<el-form-item label="赛季名称" prop="footballSeasonName" :label-width="labelWidth">
				<el-input v-model="dataForm.footballSeasonName" auto-complete="off" :readonly="viewFlag"></el-input>
			</el-form-item>	
			<el-form-item label="联赛URL" prop="footballSeasonUrl" :label-width="labelWidth">
				<el-input v-model="dataForm.footballSeasonUrl" auto-complete="off" :readonly="viewFlag"></el-input>
			</el-form-item>
			<el-form-item label="赛季开始时间" prop="seasonBeginDate" :label-width="labelWidth" v-show="viewFlag">
				<el-date-picker v-model="dataForm.seasonBeginDate" type="date" auto-complete="off" style="width:100%" :readonly="true"></el-date-picker>
			</el-form-item>
			<el-form-item label="赛季结束时间" prop="seasonEndDate" :label-width="labelWidth" v-show="viewFlag">
				<el-date-picker v-model="dataForm.seasonEndDate" type="date" auto-complete="off" style="width:100%" :readonly="true"></el-date-picker>
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
import CrawlerCascader from "@/views/Crawler/CrawlerCascader"
import { formatDate } from "@/utils/datetime"
import { isBlank,isContains } from "@/utils/stringUtil"
import { isObjectValueEqual } from "@/utils/objectUtil"
import { mapActions } from 'vuex'
export default {
	components:{
		KtButton,
		CrawlerCascader
	},
	data() {				
		return {
			show: true,//该列是否显示
			labelWidth: '20%',
			size: 'small',
			filters: {
				cascaderId: '',
				footballSeasonName: '',
				leagueMatchId: ''
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
				footballSeasonId: '',
				footballSeasonName: '',
				footballLeagueMatchId: '',
				footballLeagueMatchName: '',
				footballSeasonUrl: '',
				seasonBeginDate: null,
				seasonEndDate : null
			}
		}
	},
	methods: {
		//将vuex中定义的方法映射过来
		...mapActions(['setSeasonListDataAsyn','setSeasonQueryParamsAsyn','setSeasonShowAsyn']),
		// 获取分页数据
		findPage: function () {
			this.loading = true;
			let param = {pageNum:this.pageRequest.pageNum,pageSize:this.pageRequest.pageSize,footballSeasonName:this.filters.footballSeasonName,
			leagueMatchId:this.filters.leagueMatchId,cascaderId:this.filters.cascaderId};
			let queryParams = this.$store.state.footballSeason.queryParams;
			if(null == queryParams){
				this.findPageCommon(param);
			}else{
				//如果查询参数不为空，并且相同就不重复发起查询
				if(isObjectValueEqual(param,queryParams)){
					this.loading = false;
					this.pageResult = this.$store.state.footballSeason.pageResult;
					this.total = this.$store.state.footballSeason.total;
					this.show = this.$store.state.footballSeason.show;
				}else{
					this.findPageCommon(param);
				}
			}
		},
		initTableData: function () {
			let queryParams = this.$store.state.footballSeason.queryParams;
			if(null != queryParams){
				this.pageResult = this.$store.state.footballSeason.pageResult;
				this.total = this.$store.state.footballSeason.total;
				//把参数也给设置上
				this.initParams(queryParams);
			}
			this.show = this.$store.state.footballSeason.show;
		},
		initParams: function (queryParams) {
			this.filters.footballSeasonName = queryParams.footballSeasonName;
			this.filters.leagueMatchId = queryParams.leagueMatchId;
		},
		findPageCommon: function (param) {
			this.$api.footballSeason.findPage(param).then((res) => {
				this.loading = false;
				this.pageResult = res.data.list;
				this.total= res.data.total;
				//将数据保存到vuex
				this.setSeasonListDataAsyn(res);
				this.setSeasonQueryParamsAsyn(param);
			})
		},
		// 选择切换
		selectionChange: function (selections) {
			this.selections = selections
		},	
		// CASCADER选中
      	filtersCascasderCurrentChangeHandle (data) {
        	this.filters.cascaderId = data;
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
			this.$api.footballSeason.find({footballSeasonId:row.footballSeasonId}).then(res => {
				Object.assign(_this.dataForm, res.data);
			});	
		},
		// 时间格式化
		dateFormat: function (row, column, cellValue, index){
			return formatDate(row[column.property])
		},
		// 打开该赛季的赛季类别管理界面
		handleSeasonCateMan: function (row) {
			this.$router.push({path:'FootballSeasonCategory',query:{footballSeasonId:row.footballSeasonId}});
		},
		// 打开该赛季的积分管理界面
		handleIntegralMan: function (row) {
			let leagueMatchName = row.footballLeagueMatchName;
			if(isContains(leagueMatchName,"杯")){
				this.$message({message: "杯赛没有积分数据",type: 'warning' });
			}else{
				this.$router.push({path:'FootballIntegral',query:{leagueMatchId:row.footballLeagueMatchId}});
			}
		},	
		// 打开该联赛的球队管理界面
		handleTeamMan: function (row) {
			this.$router.push({path:'FootballTeam',query:{leagueMatchId:row.footballLeagueMatchId}});
		},			
		// 打开该比赛的数据列表
		handleScoreMan: function (row) {
			this.$router.push({path:'FootballScore',query:{footballSeasonId:row.footballSeasonId}});
		},			
		//切换列表的按钮
		changeCrawlerOrManage: function () {
			let showVal = this.show;
			this.show = !showVal;
			this.setSeasonShowAsyn(this.show);
		},		
		startIntegralCrawler:function(row){
			this.$api.footballSeason.handleIntegralCrawler({footballSeasonId:row.footballSeasonId}).then(res => {
				this.resCommonFun(res);
			});
		},  			
		startScoreCrawler:function(row){
			this.$api.footballSeason.handleScoreCrawler({footballSeasonId:row.footballSeasonId}).then(res => {
				this.resCommonFun(res);
			});
		},  
		startScoreDetailCrawler:function(row){
			this.$api.footballSeason.handleScoreDetailCrawler({footballSeasonId:row.footballSeasonId}).then(res => {
				this.resCommonFun(res);
			});
		},        
		resCommonFun: function(res){
			if(res.code == 500){
			this.$message.error(res.msg);
			}else{
			this.$message({message: res.msg,type: 'success' });
			}    
		},
		handleParams: function(){
			let leagueMatchId = this.$route.query.leagueMatchId;
			if(!isBlank(leagueMatchId)){
				this.filters.leagueMatchId = leagueMatchId;
				this.findPage();
			}else{
				this.initTableData();
			}
		}		
	},
	computed: {
	},	
	mounted() {
		this.handleParams();
	}
}
</script>

<style scoped>

</style>