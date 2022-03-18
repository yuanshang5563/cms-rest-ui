<template>
  <div class="container" style="width:99%;margin-top:-25px;">
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
	<el-table-column prop="footballLeagueMatchName" label="联赛名称" sortable="true"></el-table-column>
	<el-table-column prop="regionName" label="联赛地区" sortable="true"></el-table-column>
	<el-table-column prop="footballLeagueMatchLevel" label="联赛级别" sortable="true"></el-table-column>
	<el-table-column prop="leagueMatchUrl" label="联赛URL" sortable="true" width="220"></el-table-column>
	<el-table-column :label="$t('action.operation')" width="320" fixed="right" header-align="center" align="center">
		<template slot-scope="scope">
		<kt-button :label="$t('action.view')" perms="ROLE_FOOTBALL_LEAGUE_MATCH_VIEW" :size="size" @click="handleView(scope.row)" />
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