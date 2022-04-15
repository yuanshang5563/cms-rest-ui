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
				<kt-button :label="$t('action.search')" perms="ROLE_FOOTBALL_LEAGUE_MATCH_ANALYSIS_LIST" type="primary" @click="findPage()"/>
			</el-form-item>
		</el-form>
	</div>
	<!--表格内容栏-->
	<!--表格栏-->
	<el-table :data="pageResult" :highlight-current-row="true" 
		v-loading="loading" :element-loading-text="$t('action.loading')" :border="false" :stripe="true"
		:show-overflow-tooltip="true" align="left" size="mini" style="width:100%;" >
	<el-table-column type="index" width="60" label="序号"></el-table-column>
	<el-table-column prop="footballLeagueMatchName" label="联赛名称"></el-table-column>
	<el-table-column prop="regionName" label="联赛地区"></el-table-column>
	<el-table-column :label="$t('action.operation')" width="600" fixed="right" header-align="center" align="center">
		<template slot-scope="scope">
			<kt-button :label="$t('analysis.analysis')" perms="ROLE_FOOTBALL_SEASON_CATEGORY_ANALYSIS_LIST" :size="size" @click="handleSeasonCategoryAnalysis(scope.row)" />
		</template>		
	</el-table-column>
	</el-table>
	<!--分页栏-->
	<div class="toolbar" style="padding:10px;">
	<el-pagination layout="total, prev, pager, next, jumper" @current-change="refreshPageRequest" 
		:current-page="pageRequest.pageNum" :page-size="pageRequest.pageSize" :total="total" style="float:right;">
	</el-pagination>
	</div>
  </div>
</template>

<script>
import KtButton from "@/views/Core/KtButton"
import { isObjectValueEqual } from "@/utils/objectUtil"
import { isContains } from "@/utils/stringUtil"
import { mapActions } from 'vuex'
export default {
	components:{
		KtButton
	},
	data() {				
		return {
			size: 'small',
			filters: {
				footballLeagueMatchName: '',
				regionName: ''
			},
			pageRequest: { pageNum: 1, pageSize: 10 },
			total: 0,
			pageResult: [],
			loading: false, //加载标志
		}
	},
	methods: {
		//将vuex中定义的方法映射过来
		...mapActions(['setLeagueMatchAnalysisDataAsyn','setLeagueMatchAnalysisParamsAsyn']),
		// 获取分页数据
		findPage: function () {
			this.loading = true;
			let param = {pageNum:this.pageRequest.pageNum,pageSize:this.pageRequest.pageSize,footballLeagueMatchName:this.filters.footballLeagueMatchName,
			regionName:this.filters.regionName};
			let queryParams = this.$store.state.footballLeagueMatchAnalysis.queryParams;
			if(null == queryParams){
				this.findPageCommon(param);
			}else{
				//如果查询参数不为空，并且相同就不重复发起查询
				if(isObjectValueEqual(param,queryParams)){
					this.loading = false;
					this.pageResult = this.$store.state.footballLeagueMatchAnalysis.pageResult;
					this.total = this.$store.state.footballLeagueMatchAnalysis.total;
				}else{
					this.findPageCommon(param);
				}
			}
		},
		initTableData: function () {
			let queryParams = this.$store.state.footballLeagueMatchAnalysis.queryParams;
			if(null != queryParams){
				this.pageResult = this.$store.state.footballLeagueMatchAnalysis.pageResult;
				this.total = this.$store.state.footballLeagueMatchAnalysis.total;
				//把参数也给设置上
				this.initParams(queryParams);
			}
		},
		initParams: function (queryParams) {
			this.filters.footballLeagueMatchName = queryParams.footballLeagueMatchName;
			this.filters.regionName = queryParams.regionName;
		},
		findPageCommon: function (param) {
			this.$api.footballLeagueMatchAnalysis.findPage(param).then((res) => {
				this.loading = false;
				this.pageResult = res.data.list;
				this.total= res.data.total;
				//将数据保存到vuex
				this.setLeagueMatchAnalysisDataAsyn(res);
				this.setLeagueMatchAnalysisParamsAsyn(param);
			})
		},	
		// 换页刷新
		refreshPageRequest: function (pageNum) {
			this.pageRequest.pageNum = pageNum
			this.findPage()
		},
		// 打开该比分数据分析界面
		handleSeasonCategoryAnalysis: function (row) {
			this.$router.push({path:'FootballSeasonCategoryAnalysis',query:{footballLeagueMatchId:row.footballLeagueMatchId}});
		}		
	},
	computed: {
	},	
	mounted() {
		//this.findPage();
		this.initTableData();
	}
}
</script>

<style scoped>

</style>