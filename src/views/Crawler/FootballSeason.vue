<template>
  <div class="page-container">
	<!--工具栏-->
	<div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
		<el-form :inline="true" :model="filters" :size="size">
			<el-form-item>
				<el-input v-model="filters.footballSeasonName" placeholder="赛季名称"></el-input>
				<el-input v-model="filters.leagueMatchId" type="hidden"></el-input>
			</el-form-item>			
			<el-form-item>
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
	<el-table-column prop="footballLeagueMatchName" label="联赛名称" sortable="true"></el-table-column>
	<el-table-column prop="footballSeasonName" label="赛季名称" sortable="true"></el-table-column>
	<el-table-column prop="footballSeasonUrl" label="赛季URL" sortable="true" width="220"></el-table-column>
	<el-table-column prop="seasonBeginDate" label="赛季开始时间" sortable="true" :formatter="dateFormat"></el-table-column>
	<el-table-column prop="seasonEndDate" label="赛季结束时间" sortable="true" :formatter="dateFormat"></el-table-column>
	<el-table-column :label="$t('action.operation')" width="320" fixed="right" header-align="center" align="center">
		<template slot-scope="scope">
		<kt-button :label="$t('action.view')" perms="ROLE_FOOTBALL_SEASON_VIEW" :size="size" @click="handleView(scope.row)" />
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
import { formatDate } from "@/utils/datetime"
export default {
	components:{
		KtButton
	},
	data() {				
		return {
			labelWidth: '20%',
			size: 'small',
			filters: {
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
		// 获取分页数据
		findPage: function (data) {
			this.loading = true;
			let param = {pageNum:this.pageRequest.pageNum,pageSize:this.pageRequest.pageSize,footballSeasonName:this.filters.footballSeasonName,
			leagueMatchId:this.filters.leagueMatchId};
			this.$api.footballSeason.findPage(param).then((res) => {
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
			this.$api.footballSeason.find({footballSeasonId:row.footballSeasonId}).then(res => {
				Object.assign(_this.dataForm, res.data);
			});	
		},
		// 打开该联赛的赛季管理界面
		handleSeasonCateMan: function (row) {
			this.$router.push({name:'',params:{}});
		},
		// 时间格式化
		dateFormat: function (row, column, cellValue, index){
			return formatDate(row[column.property])
		}
	},
	computed: {
	},	
	mounted() {
		let leagueMatchId = this.$route.query.leagueMatchId;
		if(null != leagueMatchId && leagueMatchId.length > 0){
			this.filters.leagueMatchId = leagueMatchId;
		}
		this.findPage();
	}
}
</script>

<style scoped>

</style>