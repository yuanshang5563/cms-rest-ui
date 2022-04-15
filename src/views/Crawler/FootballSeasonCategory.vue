<template>
  <div class="page-container">
	<!--工具栏-->
	<div style="float:left;padding-top:10px;padding-left:15px;width:100%">
		<el-form :model="filters">
			<el-row>
				<el-col :span="7">
				<el-form-item>
					<match-season-category-cascader :cascaderLevel="2" @toChangeSelection="filtersCascasderCurrentChangeHandle"></match-season-category-cascader>
				</el-form-item>	
				</el-col>
				<el-col :span="1">&nbsp;</el-col>
				<el-col :span="5">		
				<el-form-item>
					<el-input v-model="filters.footballSeasonName" placeholder="赛季名称"></el-input>
				</el-form-item>
				</el-col>
				<el-col :span="1">&nbsp;</el-col>
				<el-col :span="5">	
				<el-form-item>
					<el-input v-model="filters.footballSeasonCategoryName" placeholder="赛季类别名称"></el-input>
				</el-form-item>
				</el-col>
				<el-col :span="1">&nbsp;</el-col>
				<el-col :span="2">	
				<el-form-item>
					<kt-button :label="$t('crawler.changeCraw')" perms="ROLE_FOOTBALL_SEASON_CATEGORY_LIST" type="primary" @click="changeCrawlerOrManage()"/>
				</el-form-item>
				</el-col>
				<el-col :span="2">
				<el-form-item>
					<kt-button :label="$t('action.search')" perms="ROLE_FOOTBALL_SEASON_CATEGORY_LIST" type="primary" @click="findPage()"/>
				</el-form-item>
				</el-col>
			</el-row>
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
	<el-table-column prop="footballSeasonCategoryName" label="赛季类别名称"></el-table-column>
	<el-table-column prop="footballSeasonCategoryUrl" label="赛季类别URL"></el-table-column>
	<el-table-column prop="roundCount" label="赛季类别总轮数"></el-table-column>
	<el-table-column :label="$t('action.operation')" width="320" fixed="right" header-align="center" align="center">
		<template slot-scope="scope">
		<div v-if="show">	
		<kt-button :label="$t('action.view')" perms="ROLE_FOOTBALL_SEASON_CATEGORY_VIEW" :size="size" @click="handleView(scope.row)" />
		<kt-button :label="$t('crawler.teamMng')" perms="ROLE_FOOTBALL_TEAM_LIST" :size="size" @click="handleTeamMan(scope.row)" />
		<kt-button :label="$t('crawler.scoreMng')" perms="ROLE_FOOTBALL_SCORE_LIST" :size="size" @click="handleScoreMan(scope.row)" />
		</div>
		<div v-if="!show">
		<kt-button :label="$t('crawler.scoreCraw')" perms="ROLE_FOOTBALL_SCORE_CRAW_BY_SEASON_CATEGORY" :size="size" @click="startScoreCrawler(scope.row)" />
		<kt-button :label="$t('crawler.scoreDetailCraw')" perms="ROLE_FOOTBALL_SCORE_DETAIL_CRAW_BY_SEASON_CATEGORY" :size="size" @click="startScoreDetailCrawler(scope.row)" />					
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
			<el-form-item label="赛季类别名称" prop="footballSeasonCategoryName" :label-width="labelWidth">
				<el-input v-model="dataForm.footballSeasonCategoryName" auto-complete="off" :readonly="viewFlag"></el-input>
			</el-form-item>			
			<el-form-item label="赛季类别URL" prop="footballSeasonCategoryUrl" :label-width="labelWidth">
				<el-input v-model="dataForm.footballSeasonCategoryUrl" auto-complete="off" :readonly="viewFlag"></el-input>
			</el-form-item>
			<el-form-item label="赛季类别总轮数" prop="roundCount" :label-width="labelWidth">
				<el-input v-model="dataForm.roundCount" auto-complete="off" :readonly="viewFlag"></el-input>
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
import MatchSeasonCategoryCascader from "@/views/Common/MatchSeasonCategoryCascader"
import { isBlank } from "@/utils/stringUtil"
import { isObjectValueEqual } from "@/utils/objectUtil"
import { mapActions } from 'vuex'
export default {
	components:{
		KtButton,
		MatchSeasonCategoryCascader
	},
	data() {				
		return {
			show: true,//该列是否显示
			labelWidth: '20%',
			size: 'small',
			filters: {
				cascaderId: '',
				footballSeasonCategoryName: '',
				footballSeasonId: '',
				footballSeasonName :'',
				footballLeagueMatchId: ''
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
				footballSeasonCategoryId: '',
				footballSeasonCategoryName: '',
				footballSeasonCategoryUrl: '',
				footballSeasonId: '',
				roundCount: 0,
				footballSeasonName: '',
				footballLeagueMatchName: ''
			}
		}
	},
	methods: {
		//将vuex中定义的方法映射过来
		...mapActions(['setSeasonCategoryListDataAsyn','setSeasonCategoryQueryParamsAsyn','setSeasonCategoryShowAsyn']),
		// 获取分页数据
		findPage: function () {
			this.loading = true;
			let param = {pageNum:this.pageRequest.pageNum,pageSize:this.pageRequest.pageSize,footballSeasonName:this.filters.footballSeasonName,
			footballSeasonId:this.filters.footballSeasonId,footballSeasonCategoryName:this.filters.footballSeasonCategoryName,
			footballLeagueMatchId:this.filters.footballLeagueMatchId,cascaderId:this.filters.cascaderId};
			let queryParams = this.$store.state.footballSeasonCategory.queryParams;
			if(null == queryParams){
				this.findPageCommon(param);
			}else{
				//如果查询参数不为空，并且相同就不重复发起查询
				if(isObjectValueEqual(param,queryParams)){
					this.loading = false;
					this.pageResult = this.$store.state.footballSeasonCategory.pageResult;
					this.total = this.$store.state.footballSeasonCategory.total;
					this.show = this.$store.state.footballSeasonCategory.show;
				}else{
					this.findPageCommon(param);
				}
			}
		},
		initTableData: function () {
			let queryParams = this.$store.state.footballSeasonCategory.queryParams;
			if(null != queryParams){
				this.pageResult = this.$store.state.footballSeasonCategory.pageResult;
				this.total = this.$store.state.footballSeasonCategory.total;
				//把参数也给设置上
				this.initParams(queryParams);
			}
			this.show = this.$store.state.footballSeasonCategory.show;
		},
		initParams: function (queryParams) {
			this.filters.footballSeasonName = queryParams.footballSeasonName;
			this.filters.footballSeasonId = queryParams.footballSeasonId;
			this.filters.footballSeasonCategoryName = queryParams.footballSeasonCategoryName;
			this.filters.footballLeagueMatchId = queryParams.footballLeagueMatchId;
		},
		findPageCommon: function (param) {
			this.$api.footballSeasonCategory.findPage(param).then((res) => {
				this.loading = false;
				this.pageResult = res.data.list;
				this.total= res.data.total;
				//将数据保存到vuex
				this.setSeasonCategoryListDataAsyn(res);
				this.setSeasonCategoryQueryParamsAsyn(param);
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
			this.$api.footballSeasonCategory.find({footballSeasonCategoryId:row.footballSeasonCategoryId}).then(res => {
				Object.assign(_this.dataForm, res.data);
			});	
		},
		// 打开该联赛的球队管理界面
		handleTeamMan: function (row) {
			this.$router.push({path:'FootballTeam',query:{leagueMatchId:row.footballLeagueMatchId}});
		},			
		// 打开该比赛的数据列表
		handleScoreMan: function (row) {
			this.$router.push({path:'FootballScore',query:{footballSeasonCategoryId:row.footballSeasonCategoryId}});
		},			
		//切换列表的按钮
		changeCrawlerOrManage: function () {
			let showVal = this.show;
			this.show = !showVal;
			this.setSeasonCategoryShowAsyn(this.show);
		},	
		// CASCADER选中
      	filtersCascasderCurrentChangeHandle (data) {
        	this.filters.cascaderId = data;
		},			
		startScoreCrawler:function(row){
			this.$api.footballSeasonCategory.handleScoreCrawler({footballSeasonCategoryId:row.footballSeasonCategoryId}).then(res => {
				this.resCommonFun(res);
			});
		},  
		startScoreDetailCrawler:function(row){
			this.$api.footballSeasonCategory.handleScoreDetailCrawler({footballSeasonCategoryId:row.footballSeasonCategoryId}).then(res => {
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
			let routerFlag = false;
			let footballSeasonId = this.$route.query.footballSeasonId;
			if(!isBlank(footballSeasonId)){
				this.filters.footballSeasonId = footballSeasonId;
				this.filters.footballLeagueMatchId = '';
				routerFlag = true;
			}
			let leagueMatchId = this.$route.query.leagueMatchId;
			if(!isBlank(leagueMatchId)){
				//如果路由传过来联赛Id,那么需要清除赛季的Id
				this.filters.footballLeagueMatchId = leagueMatchId;
				this.filters.footballSeasonId = '';
				routerFlag = true;
			}
			if(routerFlag){
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