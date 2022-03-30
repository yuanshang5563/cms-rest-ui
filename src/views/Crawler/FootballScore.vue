<template>
  <div class="page-container">
	<!--工具栏-->
	<div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;width:1200px;">
		<el-form :model="filters">
			<el-col :span="7">		
			<el-form-item>
				<crawler-cascader :cascaderLevel="3" @toChangeSelection="filtersCascasderCurrentChangeHandle"></crawler-cascader>
			</el-form-item>	
			</el-col>
			<el-col :span="3">			
			<el-form-item>
				<el-input v-model="filters.round" placeholder="轮数"></el-input>
			</el-form-item>
			</el-col>
			<el-col :span="2">						
			<el-form-item>
				<kt-button :label="$t('action.search')" perms="ROLE_FOOTBALL_SCORE_LIST" type="primary" @click="findPage()"/>
			</el-form-item>
			</el-col>
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
	<el-table-column prop="footballSeasonCategoryName" label="赛季类别"></el-table-column>
	<el-table-column prop="matchDate" label="比赛日期" :formatter="dateFormat"></el-table-column>
	<el-table-column prop="homeFootballTeamName" label="主队名称"></el-table-column>
	<el-table-column label="全场比分">
		<template slot-scope="scope">
			<span style="color:red"> {{scope.row.homeScore}}:{{scope.row.awayScore}}</span>
		</template>
	</el-table-column>
	<el-table-column label="半场比分">
		<template slot-scope="scope">
			<span style="color:blue"> {{scope.row.halfHomeScore}}:{{scope.row.halfAwayScore}}</span>
		</template>
	</el-table-column>
	<el-table-column prop="awayFootballTeamName" label="客队名称"></el-table-column>
	<el-table-column prop="round" label="轮次"></el-table-column>
	<el-table-column :label="$t('action.operation')" width="320" fixed="right" header-align="center" align="center">
		<template slot-scope="scope">
		<kt-button :label="$t('action.view')" perms="ROLE_FOOTBALL_SCORE_VIEW" :size="size" @click="handleView(scope.row)" />
		<kt-button :label="$t('crawler.scoreDetailMng')" perms="ROLE_FOOTBALL_SCORE_DETAIL_LIST" :size="size" @click="handleScoreDetailMan(scope.row)" />
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
			<el-form-item label="赛季名称" prop="footballSeasonName">
				<el-input v-model="dataForm.footballSeasonName" auto-complete="off" :readonly="viewFlag"></el-input>
			</el-form-item>			
			<el-form-item label="赛季类别" prop="footballSeasonCategoryName">
				<el-input v-model="dataForm.footballSeasonCategoryName" auto-complete="off" :readonly="viewFlag"></el-input>
			</el-form-item>	
			<el-form-item label="比赛日期" prop="matchDate">
				<el-date-picker v-model="dataForm.matchDate" type="date" auto-complete="off" style="width:100%" :readonly="viewFlag"></el-date-picker>
			</el-form-item>			
			<el-form-item label="主队名称" prop="homeFootballTeamName">
				<el-input v-model="dataForm.homeFootballTeamName" auto-complete="off" :readonly="viewFlag"></el-input>
			</el-form-item>	
			<el-form-item label="全场比分">
				<el-input v-model="dataForm.totalScore" auto-complete="off" :readonly="viewFlag"></el-input>
			</el-form-item>
			<el-form-item label="半场比分">
				<el-input v-model="dataForm.halfScore" auto-complete="off" :readonly="viewFlag"></el-input>
			</el-form-item>	
			<el-form-item label="客队名称" prop="awayFootballTeamName">
				<el-input v-model="dataForm.awayFootballTeamName" auto-complete="off" :readonly="viewFlag"></el-input>
			</el-form-item>						
			<el-form-item label="轮次" prop="round">
				<el-input v-model="dataForm.round" auto-complete="off" :readonly="viewFlag"></el-input>
			</el-form-item>	
			<el-form-item label="雷达ID" prop="leidataScoreId">
				<el-input v-model="dataForm.leidataScoreId" auto-complete="off" :readonly="viewFlag"></el-input>
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
import { isBlank } from "@/utils/stringUtil"
import { formatDate } from "@/utils/datetime"
import { isObjectValueEqual } from "@/utils/objectUtil"
import { mapActions } from 'vuex'
export default {
	components:{
		KtButton,
		CrawlerCascader
	},
	data() {				
		return {
			size: 'small',
			filters: {
				cascaderId: '',
				round: '',
				footballLeagueMatchId: '',
				footballSeasonId: '',
				footballSeasonCategoryId: ''
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
				footballScoreId: '',
				homeFootballTeamId: '',
				awayFootballTeamId: '',
				homeScore: 0,
				awayScore: 0,
				halfHomeScore: 0,
				halfAwayScore: 0,
				matchDate: null,
				footballLeagueMatchId: '',
				footballSeasonCategoryId: '',
				footballSeasonId: '',
				round: '',
				leidataScoreId: '',
				homeFootballTeamName: '',
				awayFootballTeamName: '',
				footballLeagueMatchName: '',
				footballSeasonName: '',
				footballSeasonCategoryName: '',
				totalScore: '',
				halfScore: ''
			}
		}
	},
	methods: {
		//将vuex中定义的方法映射过来
		...mapActions(['setScoreListDataAsyn','setScoreQueryParamsAsyn']),
		// 获取分页数据
		findPage: function () {
			this.loading = true;
			let param = {pageNum:this.pageRequest.pageNum,pageSize:this.pageRequest.pageSize,round:this.filters.round,
			footballLeagueMatchId:this.filters.footballLeagueMatchId,footballSeasonId:this.filters.footballSeasonId,
			footballSeasonCategoryId:this.filters.footballSeasonCategoryId,cascaderId:this.filters.cascaderId};
			let queryParams = this.$store.state.footballScore.queryParams;
			if(null == queryParams){
				this.findPageCommon(param);
			}else{
				//如果查询参数不为空，并且相同就不重复发起查询
				if(isObjectValueEqual(param,queryParams)){
					this.loading = false;
					this.pageResult = this.$store.state.footballScore.pageResult;
					this.total = this.$store.state.footballScore.total;
					this.show = this.$store.state.footballScore.show;
				}else{
					this.findPageCommon(param);
				}
			}
		},
		initTableData: function () {
			let queryParams = this.$store.state.footballScore.queryParams;
			if(null != queryParams){
				this.pageResult = this.$store.state.footballScore.pageResult;
				this.total = this.$store.state.footballScore.total;
				//把参数也给设置上
				this.initParams(queryParams);
			}
		},
		initParams: function (queryParams) {
			this.filters.round = queryParams.round;
			this.filters.footballLeagueMatchId = queryParams.footballLeagueMatchId;
			this.filters.footballSeasonId = queryParams.footballSeasonId;
			this.filters.footballSeasonCategoryId = queryParams.footballSeasonCategoryId;
		},
		findPageCommon: function (param) {
			this.$api.footballScore.findPage(param).then((res) => {
				this.loading = false;
				this.pageResult = res.data.list;
				this.total= res.data.total;
				//将数据保存到vuex
				this.setScoreListDataAsyn(res);
				this.setScoreQueryParamsAsyn(param);
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
			this.$api.footballScore.find({footballScoreId:row.footballScoreId}).then(res => {
				Object.assign(_this.dataForm, res.data);
				_this.dataForm.totalScore = _this.dataForm.homeScore+":"+_this.dataForm.awayScore;
				_this.dataForm.halfScore = _this.dataForm.halfHomeScore+":"+_this.dataForm.halfAwayScore;
			});	
		},
		// 时间格式化
		dateFormat: function (row, column, cellValue, index){
			return formatDate(row[column.property])
		},		
		// 打开该比赛的详情列表
		handleScoreDetailMan: function (row) {
			this.$router.push({path:'FootballScoreDetail',query:{footballScoreId:row.footballScoreId}});
		},
		handleParams: function () {
			let routerParamFalg = false;
			//先看路由传过来没有，哪个最小的有用哪个
			let footballSeasonCategoryId = this.$route.query.footballSeasonCategoryId;
			if(!isBlank(footballSeasonCategoryId)){
				//如果路由传过来联赛Id,那么需要清除赛季的Id
				this.filters.footballLeagueMatchId = '';
				this.filters.footballSeasonId = '';
				this.filters.footballSeasonCategoryId = footballSeasonCategoryId;
				routerParamFalg = true;
			}
			let footballSeasonId = this.$route.query.footballSeasonId;
			if(!isBlank(footballSeasonId)){
				this.filters.footballLeagueMatchId = '';
				this.filters.footballSeasonCategoryId = '';
				this.filters.footballSeasonId = footballSeasonId;
				routerParamFalg = true;
			}
			let leagueMatchId = this.$route.query.leagueMatchId;
			if(!isBlank(leagueMatchId)){
				this.filters.footballSeasonCategoryId = '';
				this.filters.footballSeasonId = '';
				this.filters.footballLeagueMatchId = leagueMatchId;
				routerParamFalg = true;
			}
			if(routerParamFalg){
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