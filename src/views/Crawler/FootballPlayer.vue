<template>
  <div class="page-container">
	<!--工具栏-->
	<div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
		<el-form :inline="true" :model="filters" :size="size">
			<el-form-item>
				<el-input v-model="filters.teamName" placeholder="球队名称"></el-input>
			</el-form-item>		
			<el-form-item>
				<el-input v-model="filters.footballPlayerName" placeholder="球员名称"></el-input>
			</el-form-item>		
			<el-form-item>
				<el-input v-model="filters.footballPlayerType" placeholder="球员类型"></el-input>
			</el-form-item>							
			<el-form-item>
				<kt-button :label="$t('action.search')" perms="ROLE_FOOTBALL_PLAYER_LIST" type="primary" @click="findPage()"/>
			</el-form-item>
		</el-form>
	</div>
	<!--表格内容栏-->
	<!--表格栏-->
	<el-table :data="pageResult" :highlight-current-row="true" @selection-change="selectionChange"
		v-loading="loading" :element-loading-text="$t('action.loading')" :border="false" :stripe="true"
		:show-overflow-tooltip="true" align="left" size="mini" style="width:100%;" >
	<el-table-column type="index" width="60" label="序号"></el-table-column>
	<el-table-column prop="teamName" label="球队名称"></el-table-column>
	<el-table-column prop="footballPlayerName" label="球员名称"></el-table-column>
	<el-table-column prop="footballPlayerType" label="球员类型"></el-table-column>
	<el-table-column :label="$t('action.operation')" width="320" fixed="right" header-align="center" align="center">
		<template slot-scope="scope">
		<kt-button :label="$t('action.view')" perms="ROLE_FOOTBALL_PLAYER_VIEW" :size="size" @click="handleView(scope.row)" />
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
			<el-form-item label="球队别名" prop="footballPlayerName">
				<el-input v-model="dataForm.footballPlayerName" auto-complete="off" :readonly="viewFlag"></el-input>
			</el-form-item>			
			<el-form-item label="球员类型" prop="footballPlayerType">
				<el-input v-model="dataForm.footballPlayerType" auto-complete="off" :readonly="viewFlag"></el-input>
			</el-form-item>		
			<el-form-item label="雷达Id" prop="entityId">
				<el-input v-model="dataForm.entityId" auto-complete="off" :readonly="viewFlag"></el-input>
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
import { isBlank } from "@/utils/stringUtil"
import { isObjectValueEqual } from "@/utils/objectUtil"
import { mapActions } from 'vuex'
export default {
	components:{
		KtButton
	},
	data() {				
		return {
			size: 'small',
			filters: {
				teamName: '',
				footballPlayerName: '',
				footballPlayerType: '',
				footballTeamId: ''
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
				footballPlayerId: '',
				footballPlayerName: '',
				footballTeamId: '',
				footballPlayerType: '',
				entityId: '',
				teamName: '',
				activeFlag: false
			}
		}
	},
	methods: {
		//将vuex中定义的方法映射过来
		...mapActions(['setPlayerListDataAsyn','setPlayerQueryParamsAsyn']),
		// 获取分页数据
		findPage: function () {
			this.loading = true;
			let param = {pageNum:this.pageRequest.pageNum,pageSize:this.pageRequest.pageSize,teamName:this.filters.teamName,
			footballPlayerName:this.filters.footballPlayerName,footballPlayerType:this.filters.footballPlayerType,
			footballTeamId:this.filters.footballTeamId};
			let queryParams = this.$store.state.footballPlayer.queryParams;
			if(null == queryParams){
				this.findPageCommon(param);
			}else{
				//如果查询参数不为空，并且相同就不重复发起查询
				if(isObjectValueEqual(param,queryParams)){
					this.loading = false;
					this.pageResult = this.$store.state.footballPlayer.pageResult;
					this.total = this.$store.state.footballPlayer.total;
				}else{
					this.findPageCommon(param);
				}
			}
		},
		initTableData: function () {
			let queryParams = this.$store.state.footballPlayer.queryParams;
			if(null != queryParams){
				this.pageResult = this.$store.state.footballPlayer.pageResult;
				this.total = this.$store.state.footballPlayer.total;
				//把参数也给设置上
				this.initParams(queryParams);
			}
		},
		initParams: function (queryParams) {
			this.filters.teamName = queryParams.teamName;
			this.filters.footballPlayerName = queryParams.footballPlayerName;
			this.filters.footballPlayerType = queryParams.footballPlayerType;
		},
		findPageCommon: function (param) {
			this.$api.footballPlayer.findPage(param).then((res) => {
				this.loading = false;
				this.pageResult = res.data.list;
				this.total= res.data.total;
				//将数据保存到vuex
				this.setPlayerListDataAsyn(res);
				this.setPlayerQueryParamsAsyn(param);
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
			this.$api.footballPlayer.find({footballPlayerId:row.footballPlayerId}).then(res => {
				Object.assign(_this.dataForm, res.data);
			});	
		},
		handleParams: function () {
			let footballTeamId = this.$route.query.footballTeamId;
			if(!isBlank(footballTeamId)){
				this.filters.footballTeamId = footballTeamId;
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