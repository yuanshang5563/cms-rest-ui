<template>
  <div class="page-container">
	<!--工具栏-->
	<div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;width:1400px;">
		<el-form :model="filters" :size="size">
			<el-row>
				<el-col :span="8">		
				<el-form-item>
					<crawler-cascader :cascaderLevel="3" @toChangeSelection="filtersCascasderCurrentChangeHandle"></crawler-cascader>
				</el-form-item>	
				</el-col>	
				<el-col :span="4">		
				<el-form-item>
					<el-input v-model="filters.teamName" placeholder="球队名称"></el-input>
				</el-form-item>	
				</el-col>
				<el-col :span="4">	
				<el-form-item>
					<el-input v-model="filters.country" placeholder="所属国家"></el-input>
				</el-form-item>	
				</el-col>
				<el-col :span="3">				
				<el-form-item>
					<kt-button :label="$t('action.search')" perms="ROLE_FOOTBALL_TEAM_LIST" type="primary" @click="findPage()"/>
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
	<el-table-column prop="teamName" label="球队名称"></el-table-column>
	<el-table-column prop="teamOtherName" label="球队别名"></el-table-column>
	<el-table-column prop="country" label="所属国家"></el-table-column>
	<el-table-column :label="$t('action.operation')" width="320" fixed="right" header-align="center" align="center">
		<template slot-scope="scope">
		<kt-button :label="$t('crawler.playerMng')" perms="ROLE_FOOTBALL_PLAYER_LIST" :size="size" @click="handlePlayerMan(scope.row)" />
		<kt-button :label="$t('action.view')" perms="ROLE_FOOTBALL_TEAM_VIEW" :size="size" @click="handleView(scope.row)" />
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
			<el-form-item label="球队名称" prop="teamName">
				<el-input v-model="dataForm.teamName" auto-complete="off" :readonly="viewFlag"></el-input>
			</el-form-item>
			<el-form-item label="球队别名" prop="teamOtherName">
				<el-input v-model="dataForm.teamOtherName" auto-complete="off" :readonly="viewFlag"></el-input>
			</el-form-item>			
			<el-form-item label="所属国家" prop="country">
				<el-input v-model="dataForm.country" auto-complete="off" :readonly="viewFlag"></el-input>
			</el-form-item>	
			<el-form-item label="球队介绍" prop="teamComment">
				<el-input type="textarea" :rows="6"  v-model="dataForm.teamComment" auto-complete="off" :readonly="viewFlag"></el-input>
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
				teamName: '',
				country: '',
				cascaderId: '',
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
				footballTeamId: '',
				teamName: '',
				teamOtherName: '',
				teamComment: '',
				country: ''
			}
		}
	},
	methods: {
		//将vuex中定义的方法映射过来
		...mapActions(['setTeamListDataAsyn','setTeamQueryParamsAsyn']),
		// 获取分页数据
		findPage: function () {
			this.loading = true;
			let param = {pageNum:this.pageRequest.pageNum,pageSize:this.pageRequest.pageSize,
			teamName:this.filters.teamName,country:this.filters.country,
			footballLeagueMatchId:this.filters.footballLeagueMatchId,footballSeasonId:this.filters.footballSeasonId,
			footballSeasonCategoryId:this.filters.footballSeasonCategoryId,cascaderId:this.filters.cascaderId};
			let queryParams = this.$store.state.footballTeam.queryParams;
			if(null == queryParams){
				this.findPageCommon(param);
			}else{
				//如果查询参数不为空，并且相同就不重复发起查询
				if(isObjectValueEqual(param,queryParams)){
					this.loading = false;
					this.pageResult = this.$store.state.footballTeam.pageResult;
					this.total = this.$store.state.footballTeam.total;
				}else{
					this.findPageCommon(param);
				}
			}
		},
		initTableData: function () {
			let queryParams = this.$store.state.footballTeam.queryParams;
			if(null != queryParams){
				this.pageResult = this.$store.state.footballTeam.pageResult;
				this.total = this.$store.state.footballTeam.total;
				//把参数也给设置上
				this.initParams(queryParams);
			}
		},
		initParams: function (queryParams) {
			this.filters.teamName = queryParams.teamName;
			this.filters.country = queryParams.country;
			this.filters.footballLeagueMatchId = queryParams.footballLeagueMatchId;
			this.filters.footballSeasonId = queryParams.footballSeasonId;
			this.filters.footballSeasonCategoryId = queryParams.footballSeasonCategoryId;
		},
		findPageCommon: function (param) {
			this.$api.footballTeam.findPage(param).then((res) => {
				this.loading = false;
				this.pageResult = res.data.list;
				this.total= res.data.total;
				//将数据保存到vuex
				this.setTeamListDataAsyn(res);
				this.setTeamQueryParamsAsyn(param);
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
			this.$api.footballTeam.find({footballTeamId:row.footballTeamId}).then(res => {
				Object.assign(_this.dataForm, res.data);
			});	
		},
		// 打开该球队的球员管理界面
		handlePlayerMan: function (row) {
			this.$router.push({path:'FootballPlayer',query:{footballTeamId:row.footballTeamId}});
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