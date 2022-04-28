<template>
  <div class="page-container">
	<div style="width: 100%;">
	</div>
	<!--表格内容栏-->
	<!--表格栏-->
	<el-row>
	  <el-col :span="24">
		  <el-tag type="info" style="width:100%">历史交锋</el-tag>
	  </el-col>
	</el-row>	
	<el-row>
	  <el-col :span="24" align="left">
		  <el-form :inline="true" :model="filters" :size="size">
			<font style="color:red;">全部赛事</font>&nbsp;&nbsp;&nbsp;&nbsp;
			<el-form-item label="">
				<el-select v-model="filters.homeAndAwayTeamScoreLastNum" placeholder="请选择" style="width:85px;" @change="changeHomeAndAwayTeamScoreList">
					<el-option v-for="item in lastNumSelectOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-checkbox-group v-model="filters.homeAndAwayFootballLeagueMatchIds" size="small" @change="changeHomeAndAwayTeamScoreList">
					<el-checkbox-button v-for="leagueMatch in footballLeagueMatches" :label="leagueMatch.footballLeagueMatchId" :key="leagueMatch.footballLeagueMatchId">{{leagueMatch.footballLeagueMatchName}}</el-checkbox-button>
				</el-checkbox-group>
			</el-form-item>
		  </el-form>
	  </el-col>
	</el-row>
	<el-row>
	  <el-col :span="24">
		<el-table :data="homeAndAwayTeamScoreList" :highlight-current-row="true"
			v-loading="loading" :element-loading-text="$t('action.loading')" :border="false" :stripe="true"
			:show-overflow-tooltip="true" align="left" size="mini" style="width:100%;" >
		<el-table-column type="index" width="60" label="序号" align="center"></el-table-column>
		<el-table-column prop="footballLeagueMatchName" label="赛事" align="center"></el-table-column>
		<el-table-column prop="matchDate" label="时间" :formatter="dateFormat" align="center"></el-table-column>
		<el-table-column prop="homeFootballTeamName" label="主队" align="center"></el-table-column>
		<el-table-column label="比分" align="center">
			<el-table-column prop="homeScore" label="主队" align="center"></el-table-column>
			<el-table-column prop="awayScore" label="客队" align="center"></el-table-column>
		</el-table-column>
		<el-table-column label="半场比分" align="center">
			<el-table-column prop="halfHomeScore" label="主队" align="center"></el-table-column>
			<el-table-column prop="halfAwayScore" label="客队" align="center"></el-table-column>
		</el-table-column>	
		<el-table-column prop="awayFootballTeamName" label="客队" align="center"></el-table-column>
		<el-table-column label="结果" align="center">
			<template slot-scope="scope">
				<el-link type="danger" v-if="scope.row.homeScore - scope.row.awayScore > 0">胜</el-link>
				<el-link type="success" v-else-if="scope.row.homeScore - scope.row.awayScore < 0">负</el-link>
				<el-link type="primary" v-else-if="scope.row.homeScore - scope.row.awayScore == 0">平</el-link>			
			</template>
		</el-table-column>
		</el-table>		  
	  </el-col>
	</el-row>
	<el-row align="center">
	  <el-col :span="24">
		  <scores-info-bar :teamScoreList="homeAndAwayTeamScoreList" :teamName="homeTeamName"></scores-info-bar>
	  </el-col>
	</el-row>
	<el-row>
	  <el-col :span="24">
		  <el-tag type="info" style="width:100%">近期战绩</el-tag>
	  </el-col>
	</el-row>
	<el-row>
	  <el-col :span="12" align="left">
		  <el-form :inline="true" :model="filters" :size="size">
			<font style="color:red;">{{homeTeamName}}</font>&nbsp;&nbsp;&nbsp;&nbsp;
			<el-form-item label="">
				<el-select v-model="filters.homeTeamScoreLastNum" placeholder="请选择" style="width:85px;" @change="changeHomeTeamScoreList">
					<el-option v-for="item in lastNumSelectOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-select v-model="filters.homeFootballLeagueMatchId" placeholder="全部" style="width:140px;" @change="changeHomeTeamScoreList">
					<el-option v-for="leagueMatch in footballLeagueMatches" :key="leagueMatch.footballLeagueMatchId" :label="leagueMatch.footballLeagueMatchName" :value="leagueMatch.footballLeagueMatchId"></el-option>
				</el-select>				
			</el-form-item>
		  </el-form>
	  </el-col>
	  <el-col :span="12" align="left">
		  <el-form :inline="true" :model="filters" :size="size">
			<font style="color:red;font-size:16px;">{{awayTeamName}}</font>&nbsp;&nbsp;&nbsp;&nbsp;
			<el-form-item label="">
				<el-select v-model="filters.awayTeamScoreLastNum" placeholder="请选择" style="width:85px;" @change="changeAwayTeamScoreList">
					<el-option v-for="item in lastNumSelectOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-select v-model="filters.awayFootballLeagueMatchId" placeholder="全部" style="width:140px;" @change="changeAwayTeamScoreList">
					<el-option v-for="leagueMatch in footballLeagueMatches" :key="leagueMatch.footballLeagueMatchId" :label="leagueMatch.footballLeagueMatchName" :value="leagueMatch.footballLeagueMatchId"></el-option>
				</el-select>				
			</el-form-item>
		  </el-form>		  
	  </el-col>	  
	</el-row>
	<el-row>
	  <el-col :span="12">
		<score-analysis-table :teamScoreList="homeTeamScoreList" :loadingFlag="homeLoading"></score-analysis-table>
		<div v-if="homeTeamScoreList.length > 0">
		<score-trend-line-chart :scoreList="homeTeamScoreList"></score-trend-line-chart>
		<scores-info-bar :teamScoreList="homeTeamScoreList" :teamName="homeTeamName"></scores-info-bar>
		</div>
	  </el-col>
	  <el-col :span="12">
		<score-analysis-table :teamScoreList="awayTeamScoreList" :loadingFlag="awayLoading"></score-analysis-table>
		<div v-if="awayTeamScoreList.length > 0">
		<score-trend-line-chart :scoreList="awayTeamScoreList"></score-trend-line-chart>
		<scores-info-bar :teamScoreList="awayTeamScoreList" :teamName="awayTeamName"></scores-info-bar>
		</div>
	  </el-col>
	</el-row>
  </div>
</template>

<script>
import KtButton from "@/views/Core/KtButton";
import ScoreTrendLineChart from "@/views/Common/Analysis/ScoreTrendLineChart";
import ScoresInfoBar from "@/views/Common/Analysis/ScoresInfoBar";
import ScoreAnalysisTable from "@/views/Common/Analysis/ScoreAnalysisTable";
import { isObjectValueEqual,objectValueEqual } from "@/utils/objectUtil";
import { isBlank,isContains } from "@/utils/stringUtil";
import { formatDate } from "@/utils/datetime";
import { mapActions } from 'vuex';
export default {
	name: 'FootballScoreAnalysis',
	components:{
		KtButton,
		ScoreTrendLineChart,
		ScoresInfoBar,
		ScoreAnalysisTable
	},
	data() {				
		return {
			size: 'small',
			filters: {
				footballScoreId: '',
				homeAndAwayFootballLeagueMatchIds: [],
				homeFootballLeagueMatchId: '',
				awayFootballLeagueMatchId: '',
				homeFootballTeamId: '',
				awayFootballTeamId: '',
				homeAndAwayTeamScoreLastNum: 10,
				homeTeamScoreLastNum: 10,
				awayTeamScoreLastNum: 10
			},
			homeAndAwayTeamScoreList: [],
			homeTeamScoreList: [],
			awayTeamScoreList: [],
			footballScore: null,	
			homeTeamName: '',		
			awayTeamName: '',
			loading: false, //加载标志
			homeLoading: false,
			awayLoading: false,
			lastNumSelectOptions: [{
				value: 5,
				label: '5场'
			},{
				value: 10,
				label: '10场'
			},{
				value: 15,
				label: '15场'
			},{
				value: 20,
				label: '20场'
			},{
				value: 30,
				label: '30场'
			}],
			footballLeagueMatches: []
		}
	},
	methods: {
		//将vuex中定义的方法映射过来
		...mapActions(['setScoreAnalysisForHomeAndAwayTeamScoreAsyn','setScoreAnalysisForHomeAndAwayTeamScoreParamsAsyn',
		'setScoreAnalysisForHomeTeamScoreAsyn','setScoreAnalysisForHomeTeamScoreParamsAsyn',
		'setScoreAnalysisForAwayTeamScoreAsyn','setScoreAnalysisForAwayTeamScoreParamsAsyn',
		'setScoreAnalysisForFootballScoreAsyn','setScoreAnalysisForFootballScoreParamsAsyn','setScoreAnalysisForFootballLeagueMatchesAsyn']),
		findFootballLeagueMatches: function (param) {
			let footballScoreQueryParams = this.$store.state.footballScoreAnalysis.footballScoreQueryParams;
			if(null == footballScoreQueryParams){
				this.findFootballLeagueMatchesCommon(param);
			}else{
				//如果查询参数不为空，并且相同就不重复发起查询
				if(isObjectValueEqual(param,footballScoreQueryParams)){
					this.footballLeagueMatches = this.$store.state.footballScoreAnalysis.footballLeagueMatches;
				}else{
					this.findFootballLeagueMatchesCommon(param);
				}
			}
		},
		findFootballLeagueMatchesCommon: function (param) {
			this.$api.footballScoreAnalysis.findFootballLeagueMatches(param).then((res) => {
				this.footballLeagueMatches = res.data;
				//将数据保存到vuex
				this.setScoreAnalysisForFootballLeagueMatchesAsyn(res.data);
			})
		},		
		findFootballScore: function (param) {
			let footballScoreQueryParams = this.$store.state.footballScoreAnalysis.footballScoreQueryParams;
			if(null == footballScoreQueryParams){
				this.findFootballScoreCommon(param);
			}else{
				//如果查询参数不为空，并且相同就不重复发起查询
				if(isObjectValueEqual(param,footballScoreQueryParams)){
					this.footballScore = this.$store.state.footballScoreAnalysis.footballScore;
					this.homeTeamName = this.footballScore.homeFootballTeamName;
					this.awayTeamName = this.footballScore.awayFootballTeamName;
					this.findHomeAndAwayTeamScoreListPre();
				}else{
					this.findFootballScoreCommon(param);
				}
			}
		},
		findFootballScoreCommon: function (param) {
			this.$api.footballScoreAnalysis.findFootballScore(param).then((res) => {
				this.footballScore = res.data;
				this.homeTeamName = this.footballScore.homeFootballTeamName;
				this.awayTeamName = this.footballScore.awayFootballTeamName;
				//将数据保存到vuex
				this.setScoreAnalysisForFootballScoreAsyn(res.data);
				this.setScoreAnalysisForFootballScoreParamsAsyn(param);
				this.findHomeAndAwayTeamScoreListPre();
			})
		},	
		findHomeAndAwayTeamScoreListPre: function(){
			this.filters.homeFootballTeamId = this.footballScore.homeFootballTeamId;
			this.filters.awayFootballTeamId = this.footballScore.awayFootballTeamId;
			let param = {homeFootballTeamId:this.filters.homeFootballTeamId,awayFootballTeamId:this.filters.awayFootballTeamId,lastNum:this.filters.homeAndAwayTeamScoreLastNum};
			this.findHomeAndAwayTeamScoreList(param);
			let homeParam = {homeFootballTeamId:this.filters.homeFootballTeamId,lastNum:this.filters.homeTeamScoreLastNum};
			this.findHomeTeamScoreList(homeParam);
			let awayParam = {awayFootballTeamId:this.filters.awayFootballTeamId,lastNum:this.filters.awayTeamScoreLastNum};
			this.findAwayTeamScoreList(awayParam);			
		},		
		findHomeAndAwayTeamScoreList: function (param) {
			this.loading = true;
			let homeAndAwayTeamScoreQueryParams = this.$store.state.footballScoreAnalysis.homeAndAwayTeamScoreQueryParams;
			if(null == homeAndAwayTeamScoreQueryParams){
				this.findHomeAndAwayTeamScoreListCommon(param);
			}else{
				//如果查询参数不为空，并且相同就不重复发起查询
				if(objectValueEqual(param,homeAndAwayTeamScoreQueryParams)){
					this.loading = false;
					this.homeAndAwayTeamScoreList = this.$store.state.footballScoreAnalysis.homeAndAwayTeamScoreList;
				}else{
					this.findHomeAndAwayTeamScoreListCommon(param);
				}
			}
		},
		findHomeAndAwayTeamScoreListCommon: function (param) {
			this.$api.footballScoreAnalysis.findScoreList(param).then((res) => {
				this.loading = false;
				this.homeAndAwayTeamScoreList = res.data;
				//将数据保存到vuex
				this.setScoreAnalysisForHomeAndAwayTeamScoreAsyn(res.data);
				this.setScoreAnalysisForHomeAndAwayTeamScoreParamsAsyn(param);
			})
		},
		findHomeTeamScoreList: function (param) {
			this.homeLoading = true;
			let homeTeamScoreQueryParams = this.$store.state.footballScoreAnalysis.homeTeamScoreQueryParams;
			if(null == homeTeamScoreQueryParams){
				this.findHomeTeamScoreListCommon(param);
			}else{
				//如果查询参数不为空，并且相同就不重复发起查询
				if(objectValueEqual(param,homeTeamScoreQueryParams)){
					this.homeLoading = false;
					this.homeTeamScoreList = this.$store.state.footballScoreAnalysis.homeTeamScoreList;
				}else{
					this.findHomeTeamScoreListCommon(param);
				}
			}
		},
		findHomeTeamScoreListCommon: function (param) {
			this.$api.footballScoreAnalysis.findScoreList(param).then((res) => {
				this.homeLoading = false;
				this.homeTeamScoreList = res.data;
				//将数据保存到vuex
				this.setScoreAnalysisForHomeTeamScoreAsyn(res.data);
				this.setScoreAnalysisForHomeTeamScoreParamsAsyn(param);
			})
		},	
		findAwayTeamScoreList: function (param) {
			this.awayLoading = true;
			let awayTeamScoreQueryParams = this.$store.state.footballScoreAnalysis.awayTeamScoreQueryParams;
			if(null == awayTeamScoreQueryParams){
				this.findAwayTeamScoreListCommon(param);
			}else{
				//如果查询参数不为空，并且相同就不重复发起查询
				if(objectValueEqual(param,awayTeamScoreQueryParams)){
					this.awayLoading = false;
					this.awayTeamScoreList = this.$store.state.footballScoreAnalysis.awayTeamScoreList;
				}else{
					this.findAwayTeamScoreListCommon(param);
				}
			}
		},
		findAwayTeamScoreListCommon: function (param) {
			this.$api.footballScoreAnalysis.findScoreList(param).then((res) => {
				this.awayLoading = false;
				this.awayTeamScoreList = res.data;
				//将数据保存到vuex
				this.setScoreAnalysisForAwayTeamScoreAsyn(res.data);
				this.setScoreAnalysisForAwayTeamScoreParamsAsyn(param);
			})
		},					
		initTableData: function () {
			this.footballScore = this.$store.state.footballScoreAnalysis.footballScore;
			this.homeAndAwayTeamScoreList = this.$store.state.footballScoreAnalysis.homeAndAwayTeamScoreList;
			this.footballLeagueMatches = this.$store.state.footballScoreAnalysis.footballLeagueMatches;
			this.homeTeamScoreList = this.$store.state.footballScoreAnalysis.homeTeamScoreList;
			this.awayTeamScoreList = this.$store.state.footballScoreAnalysis.awayTeamScoreList;
			//把参数也给设置上
			this.initParams();
		},
		initParams: function () {
			let footballScoreQueryParams = this.$store.state.footballScoreAnalysis.footballScoreQueryParams;
			if(null != footballScoreQueryParams){
				this.filters.footballScoreId = footballScoreQueryParams.footballScoreId;
			}			
			let homeAndAwayTeamScoreQueryParams = this.$store.state.footballScoreAnalysis.homeAndAwayTeamScoreQueryParams;
			if(null != homeAndAwayTeamScoreQueryParams){
				this.filters.homeFootballTeamId = homeAndAwayTeamScoreQueryParams.homeFootballTeamId;
				this.filters.awayFootballTeamId = homeAndAwayTeamScoreQueryParams.awayFootballTeamId;
				this.filters.homeAndAwayTeamScoreLastNum = homeAndAwayTeamScoreQueryParams.lastNum;
				let homeAndAwayFootballLeagueMatchIds = homeAndAwayTeamScoreQueryParams.homeAndAwayFootballLeagueMatchIds;
				if(homeAndAwayFootballLeagueMatchIds){
					this.filters.homeAndAwayFootballLeagueMatchIds = homeAndAwayFootballLeagueMatchIds;
				}
			}
			let homeTeamScoreQueryParams = this.$store.state.footballScoreAnalysis.homeTeamScoreQueryParams;
			if(null != homeTeamScoreQueryParams){
				this.filters.homeTeamScoreLastNum = homeTeamScoreQueryParams.lastNum;
				let homeFootballLeagueMatchId = homeAndAwayTeamScoreQueryParams.homeFootballLeagueMatchId;
				if(!isBlank(homeFootballLeagueMatchId)){
					this.filters.homeFootballLeagueMatchId = homeFootballLeagueMatchId;
				}
			}	
			let awayTeamScoreQueryParams = this.$store.state.footballScoreAnalysis.awayTeamScoreQueryParams;
			if(null != awayTeamScoreQueryParams){
				this.filters.awayTeamScoreLastNum = awayTeamScoreQueryParams.lastNum;
				let awayFootballLeagueMatchId = homeAndAwayTeamScoreQueryParams.awayFootballLeagueMatchId;
				if(!isBlank(awayFootballLeagueMatchId)){
					this.filters.awayFootballLeagueMatchId = awayFootballLeagueMatchId;
				}
			}		
		},				
		changeHomeAndAwayTeamScoreList: function () {
			let param = {homeFootballTeamId:this.filters.homeFootballTeamId,awayFootballTeamId:this.filters.awayFootballTeamId,
			lastNum:this.filters.homeAndAwayTeamScoreLastNum,footballLeagueMatchIds:this.filters.homeAndAwayFootballLeagueMatchIds};
			this.findHomeAndAwayTeamScoreList(param);
		},	
		changeHomeTeamScoreList: function () {
			let param = {homeFootballTeamId:this.filters.homeFootballTeamId,lastNum:this.filters.homeTeamScoreLastNum,
			footballLeagueMatchId:this.filters.homeFootballLeagueMatchId};;
			this.findHomeTeamScoreList(param);
		},	
		changeAwayTeamScoreList: function () {
			let param = {awayFootballTeamId:this.filters.awayFootballTeamId,lastNum:this.filters.awayTeamScoreLastNum,
			footballLeagueMatchId:this.filters.awayFootballLeagueMatchId};
			this.findAwayTeamScoreList(param);
		},						
		// 时间格式化
		dateFormat: function (row, column, cellValue, index){
			return formatDate(row[column.property])
		},
		handleParams: function () {
			let footballScoreId = this.$route.query.footballScoreId;
			this.filters.footballScoreId = footballScoreId;
			if(!isBlank(footballScoreId)){
				let footballScoreParam = {footballScoreId:this.filters.footballScoreId};
				this.findFootballScore(footballScoreParam);
				this.findFootballLeagueMatches(footballScoreParam);
			}else{
				this.initTableData();
			}	
		}				
	},
	computed: {
	},	
	mounted() {
		this.handleParams();
	},
	updated(){
	}
}
</script>

<style scoped>
</style>