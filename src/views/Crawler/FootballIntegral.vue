<template>
  <div class="page-container">
	<!--工具栏-->
	<div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;width:1200px;">
		<el-form :model="filters">
			<el-row>
				<el-col :span="12">		
				<el-form-item>
					<crawler-cascader :cascaderLevel="3" @toChangeSelection="filtersCascasderCurrentChangeHandle"></crawler-cascader>
				</el-form-item>	
				</el-col>
				<el-col :span="3">						
				<el-form-item>
					<kt-button :label="$t('action.search')" perms="ROLE_FOOTBALL_INTEGRAL_LIST" type="primary" @click="findPage()"/>
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
	<el-table-column prop="footballLeagueMatchName" label="联赛"></el-table-column>
	<el-table-column prop="footballSeasonName" label="赛季"></el-table-column>
	<el-table-column prop="footballSeasonCategoryName" label="赛季类别"></el-table-column>
	<el-table-column prop="teamName" label="球队"></el-table-column>
	<el-table-column prop="playedTotal" label="总场次"></el-table-column>
	<el-table-column prop="winTotal" label="胜"></el-table-column>
	<el-table-column prop="drawTotal" label="平"></el-table-column>
	<el-table-column prop="lostTotal" label="负"></el-table-column>
	<el-table-column prop="goalTotal" label="进球"></el-table-column>
	<el-table-column prop="fumbleTotal" label="失球"></el-table-column>
	<el-table-column prop="differenceTotal" label="净胜球"></el-table-column>
	<el-table-column prop="goalPerPlayed" label="场均进球"></el-table-column>
	<el-table-column prop="fumblePerPlayed" label="场均失球"></el-table-column>
	<el-table-column prop="winPerPlayed" label="场均净胜"></el-table-column>
	<el-table-column prop="integralTotal" label="积分"></el-table-column>
	<el-table-column :label="$t('action.operation')" fixed="right" header-align="center" align="center">
		<template slot-scope="scope">
		<kt-button :label="$t('action.view')" perms="ROLE_FOOTBALL_INTEGRAL_VIEW" :size="size" @click="handleView(scope.row)" />
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
			<el-row>
				<el-col :span="24">
				<el-form-item label="联赛名称" prop="footballLeagueMatchName">
					<el-input v-model="dataForm.footballLeagueMatchName" auto-complete="off" :readonly="viewFlag"></el-input>
				</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="12">
				<el-form-item label="赛季名称" prop="footballSeasonName">
					<el-input v-model="dataForm.footballSeasonName" auto-complete="off" :readonly="viewFlag"></el-input>
				</el-form-item>
				</el-col>				
				<el-col :span="12">	
				<el-form-item label="赛季类别" prop="footballSeasonCategoryName">
					<el-input v-model="dataForm.footballSeasonCategoryName" auto-complete="off" :readonly="viewFlag"></el-input>
				</el-form-item>		
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="12">
				<el-form-item label="球队" prop="teamName">
					<el-input v-model="dataForm.teamName" auto-complete="off" :readonly="viewFlag"></el-input>
				</el-form-item>	
				</el-col>				
			  <el-col :span="12">
				<el-form-item label="总场次" prop="playedTotal">
					<el-input v-model="dataForm.playedTotal" auto-complete="off" :readonly="viewFlag"></el-input>
				</el-form-item>					  
			  </el-col>
			</el-row>
			<el-row>
				<el-col :span="8">
				<el-form-item label="胜" prop="winTotal">
					<el-input v-model="dataForm.winTotal" auto-complete="off" :readonly="viewFlag"></el-input>
				</el-form-item>	
				</el-col>
				<el-col :span="8">
				<el-form-item label="平" prop="drawTotal">
					<el-input v-model="dataForm.drawTotal" auto-complete="off" :readonly="viewFlag"></el-input>
				</el-form-item>	
				</el-col>
				<el-col :span="8">
				<el-form-item label="负" prop="lostTotal">
					<el-input v-model="dataForm.lostTotal" auto-complete="off" :readonly="viewFlag"></el-input>
				</el-form-item>	
				</el-col>								
			</el-row>	
			<el-row>
				<el-col :span="8">
				<el-form-item label="进球" prop="goalTotal">
					<el-input v-model="dataForm.goalTotal" auto-complete="off" :readonly="viewFlag"></el-input>
				</el-form-item>	
				</el-col>
				<el-col :span="8">
				<el-form-item label="失球" prop="fumbleTotal">
					<el-input v-model="dataForm.fumbleTotal" auto-complete="off" :readonly="viewFlag"></el-input>
				</el-form-item>	
				</el-col>
				<el-col :span="8">
				<el-form-item label="净胜球" prop="differenceTotal">
					<el-input v-model="dataForm.differenceTotal" auto-complete="off" :readonly="viewFlag"></el-input>
				</el-form-item>	
				</el-col>								
			</el-row>
			<el-row>
				<el-col :span="8">
				<el-form-item label="场均进球" prop="goalPerPlayed">
					<el-input v-model="dataForm.goalPerPlayed" auto-complete="off" :readonly="viewFlag"></el-input>
				</el-form-item>	
				</el-col>
				<el-col :span="8">
				<el-form-item label="场均失球" prop="fumblePerPlayed">
					<el-input v-model="dataForm.fumblePerPlayed" auto-complete="off" :readonly="viewFlag"></el-input>
				</el-form-item>	
				</el-col>
				<el-col :span="8">
				<el-form-item label="场均净胜" prop="winPerPlayed">
					<el-input v-model="dataForm.winPerPlayed" auto-complete="off" :readonly="viewFlag"></el-input>
				</el-form-item>	
				</el-col>								
			</el-row>	
			<el-row>
				<el-col :span="12">
				<el-form-item label="主胜" prop="winHome">
					<el-input v-model="dataForm.winHome" auto-complete="off" :readonly="viewFlag"></el-input>
				</el-form-item>	
				</el-col>
				<el-col :span="12">
				<el-form-item label="客胜" prop="winAway">
					<el-input v-model="dataForm.winAway" auto-complete="off" :readonly="viewFlag"></el-input>
				</el-form-item>	
				</el-col>								
			</el-row>
			<el-row>
				<el-col :span="12">
				<el-form-item label="主平" prop="drawHome">
					<el-input v-model="dataForm.drawHome" auto-complete="off" :readonly="viewFlag"></el-input>
				</el-form-item>	
				</el-col>
				<el-col :span="12">
				<el-form-item label="客平" prop="drawAway">
					<el-input v-model="dataForm.drawAway" auto-complete="off" :readonly="viewFlag"></el-input>
				</el-form-item>	
				</el-col>								
			</el-row>
			<el-row>
				<el-col :span="12">
				<el-form-item label="主负" prop="lostHome">
					<el-input v-model="dataForm.lostHome" auto-complete="off" :readonly="viewFlag"></el-input>
				</el-form-item>	
				</el-col>
				<el-col :span="12">
				<el-form-item label="客负" prop="lostAway">
					<el-input v-model="dataForm.lostAway" auto-complete="off" :readonly="viewFlag"></el-input>
				</el-form-item>	
				</el-col>								
			</el-row>
			<el-row>
				<el-col :span="12">
				<el-form-item label="主场进球" prop="goalHome">
					<el-input v-model="dataForm.goalHome" auto-complete="off" :readonly="viewFlag"></el-input>
				</el-form-item>	
				</el-col>
				<el-col :span="12">
				<el-form-item label="客场进球" prop="goalAway">
					<el-input v-model="dataForm.goalAway" auto-complete="off" :readonly="viewFlag"></el-input>
				</el-form-item>	
				</el-col>								
			</el-row>
			<el-row>
				<el-col :span="12">
				<el-form-item label="主场失球" prop="fumbleHome">
					<el-input v-model="dataForm.fumbleHome" auto-complete="off" :readonly="viewFlag"></el-input>
				</el-form-item>	
				</el-col>
				<el-col :span="12">
				<el-form-item label="客场失球" prop="fumbleAway">
					<el-input v-model="dataForm.fumbleAway" auto-complete="off" :readonly="viewFlag"></el-input>
				</el-form-item>	
				</el-col>								
			</el-row>	
			<el-row>
				<el-col :span="12">
				<el-form-item label="积分" prop="integralTotal">
					<el-input v-model="dataForm.integralTotal" auto-complete="off" :readonly="viewFlag"></el-input>
				</el-form-item>	
				</el-col>
				<el-col :span="12">
				<el-form-item label="雷达ID" prop="leiDataIntegralId">
					<el-input v-model="dataForm.leiDataIntegralId" auto-complete="off" :readonly="viewFlag"></el-input>
				</el-form-item>	
				</el-col>								
			</el-row>																														
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button :size="size" @click.native="dialogVisible = false">{{$t('action.cancel')}}</el-button>		
		</div>	
	</el-dialog>
  </div>
</template>

<script>
import KtButton from "@/views/Core/KtButton";
import CrawlerCascader from "@/views/Crawler/CrawlerCascader";
import { isBlank } from "@/utils/stringUtil";
import { isObjectValueEqual } from "@/utils/objectUtil";
import { mapActions } from 'vuex';
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
				footballIntegralId: '',footballLeagueMatchId: '',footballSeasonId: '',footballSeasonCategoryId: '',
				footballTeamId: '',integralTotal: 0,goalTotal: 0,fumbleTotal: 0,differenceTotal: 0,playedTotal: 0,
				winTotal: 0,drawTotal: 0,lostTotal: 0,goalPerPlayed: 0.0,fumblePerPlayed: 0.0,winPerPlayed: 0.0,winHome: 0,
				winAway: 0,drawHome: 0,drawAway: 0,lostHome: 0,lostAway: 0,goalHome: 0,goalAway: 0,fumbleHome: 0,fumbleAway: 0,
				leiDataIntegralId: '',teamName: '',footballLeagueMatchName: '',footballSeasonName: '',footballSeasonCategoryName: ''
			}
		}
	},
	methods: {
		//将vuex中定义的方法映射过来
		...mapActions(['setIntegralListDataAsyn','setIntegralQueryParamsAsyn']),
		// 获取分页数据
		findPage: function () {
			this.loading = true;
			let param = {pageNum:this.pageRequest.pageNum,pageSize:this.pageRequest.pageSize,cascaderId:this.filters.cascaderId,
			footballLeagueMatchId:this.filters.footballLeagueMatchId,footballSeasonId:this.filters.footballSeasonId,
			footballSeasonCategoryId:this.filters.footballSeasonCategoryId};
			let queryParams = this.$store.state.footballIntegral.queryParams;
			if(null == queryParams){
				this.findPageCommon(param);
			}else{
				//如果查询参数不为空，并且相同就不重复发起查询
				if(isObjectValueEqual(param,queryParams)){
					this.loading = false;
					this.pageResult = this.$store.state.footballIntegral.pageResult;
					this.total = this.$store.state.footballIntegral.total;
				}else{
					this.findPageCommon(param);
				}
			}
		},
		initTableData: function () {
			let queryParams = this.$store.state.footballIntegral.queryParams;
			if(null != queryParams){
				this.pageResult = this.$store.state.footballIntegral.pageResult;
				this.total = this.$store.state.footballIntegral.total;
				//把参数也给设置上
				this.initParams(queryParams);
			}
		},
		initParams: function (queryParams) {
			this.filters.footballLeagueMatchId = queryParams.footballLeagueMatchId;
			this.filters.footballSeasonId = queryParams.footballSeasonId;
			this.filters.footballSeasonCategoryId = queryParams.footballSeasonCategoryId;
		},
		findPageCommon: function (param) {
			this.$api.footballIntegral.findPage(param).then((res) => {
				this.loading = false;
				this.pageResult = res.data.list;
				this.total= res.data.total;
				//将数据保存到vuex
				this.setIntegralListDataAsyn(res);
				this.setIntegralQueryParamsAsyn(param);
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
			this.$api.footballIntegral.find({footballIntegralId:row.footballIntegralId}).then(res => {
				Object.assign(_this.dataForm, res.data);
			});	
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