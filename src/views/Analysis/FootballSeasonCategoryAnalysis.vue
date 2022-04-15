<template>
  <div class="page-container">
	<div style="width: 100%;">
		<el-row>
		  <el-col :span="12">
			  <h1 v-if="leagueMatch != null" style="float:left;">{{leagueMatch.footballLeagueMatchName}}</h1>
		  </el-col>
		  <el-col :span="12">
			<el-form  :model="filters">
			<el-select v-model="filters.footballSeasonId" placeholder="请选择" style="float:right;width:80px;" @change="seasonChange">
				<el-option v-for="season in this.seasonList" :key="season.footballSeasonId" :label="season.footballSeasonName" :value="season.footballSeasonId"></el-option>
			</el-select>  
			</el-form>			  
		  </el-col>
		</el-row>
		<el-row>
		  <el-col :span="24">
			  <h4 v-if="leagueMatch != null" style="float:left;">所属国家:{{leagueMatch.regionName}}</h4>
		  </el-col>
		</el-row>
		<el-row>
		  <el-col :span="24">
			  <el-divider></el-divider>
		  </el-col>
		</el-row>
		<el-row>
		  <el-col :span="24">
			  <button type="button" class="btn-category" v-for="category in this.seasonCategoryList" :id="category.footballSeasonCategoryId" :key="category.footballSeasonCategoryId" @click="categoryButtonClick(category)">{{category.footballSeasonCategoryName}}</button>
		  </el-col>
		</el-row>
		<el-row>
		  <el-col :span="24">
			&nbsp;	  
		  </el-col>
		</el-row>		
		<el-row v-if="seasonCategory != null && seasonCategory.roundCount != null && seasonCategory.roundCount > 1" align="left">
			<el-col :span="24">
				<button type="button" class="btn-round"  v-for="round in seasonCategory.roundCount" :id="'roundBtn'+round" :key="round" @click="roundButtonClick(round)">第{{round}}轮</button>
			</el-col>
		</el-row>
		<el-row>
		  <el-col :span="24">
			&nbsp;
		  </el-col>
		</el-row>
	</div>
	<!--表格内容栏-->
	<!--表格栏-->
	<el-table :data="scoreList" :highlight-current-row="true"
		v-loading="loading" :element-loading-text="$t('action.loading')" :border="false" :stripe="false"
		:show-overflow-tooltip="true" align="left" size="mini" style="width:100%;" >
	<el-table-column type="index" width="60" label="序号" align="center"></el-table-column>
	<el-table-column prop="round" label="轮次" align="center"></el-table-column>
	<el-table-column prop="matchDate" label="时间" :formatter="dateFormat" align="center"></el-table-column>
	<el-table-column prop="homeFootballTeamName" label="主队" align="center"></el-table-column>
	<el-table-column label="比分" align="center">
		<el-table-column prop="homeScore" align="center"></el-table-column>
		<el-table-column prop="awayScore" align="center"></el-table-column>
	</el-table-column>
	<el-table-column label="半场比分" align="center">
		<el-table-column prop="halfHomeScore" align="center"></el-table-column>
		<el-table-column prop="halfAwayScore" align="center"></el-table-column>
	</el-table-column>	
	<el-table-column prop="awayFootballTeamName" label="客队" align="center"></el-table-column>

	<el-table-column :label="$t('action.operation')" width="600" fixed="right" header-align="center" align="center">
		<template slot-scope="scope">
			<kt-button :label="$t('action.view')" perms="ROLE_FOOTBALL_LEAGUE_MATCH_VIEW" :size="size" @click="handleView(scope.row)" />
		</template>		
	</el-table-column>
	
	</el-table>
  </div>
</template>

<script>
import KtButton from "@/views/Core/KtButton"
import { isObjectValueEqual } from "@/utils/objectUtil"
import { isBlank,isContains } from "@/utils/stringUtil"
import { formatDate } from "@/utils/datetime"
import { mapActions } from 'vuex'
export default {
	components:{
		KtButton
	},
	data() {				
		return {
			size: 'small',
			filters: {
				footballLeagueMatchId: '',
				footballSeasonId: '',
				footballSeasonCategoryId: '',
				round: ''
			},
			leagueMatch: null,
			seasonCategory: null,
			seasonList: [],
			seasonCategoryList: [],
			scoreList: [],
			loading: false, //加载标志
			lastRoundClickBtnId: ''
		}
	},
	methods: {
		//将vuex中定义的方法映射过来
		...mapActions(['setSeasonCategoryAnalysisForSocreAsyn','setSeasonCategoryAnalysisForSocreParamsAsyn','setSeasonCategoryAnalysisForSeasonAsyn',
		'setSeasonCategoryAnalysisForSeasonParamsAsyn','setSeasonCategoryAnalysisForCategoryListAsyn','setSeasonCategoryAnalysisForCategoryListParamsAsyn',
		'setSeasonCategoryAnalysisForLeagueMatchAsyn','setSeasonCategoryAnalysisForSeasonCategoryAsyn']),
		//第一步根据联赛找到赛季列表
		findSeasonList: function (seasonParam) {
			let seasonQueryParams = this.$store.state.footballSeasonCategoryAnalysis.seasonQueryParams;
			if(null == seasonQueryParams){
				this.findSeasonListCommon(seasonParam);
			}else{
				//如果查询参数不为空，并且相同就不重复发起查询
				if(isObjectValueEqual(seasonParam,seasonQueryParams)){
					this.seasonList = this.$store.state.footballSeasonCategoryAnalysis.seasonList;
				}else{
					this.findSeasonListCommon(seasonParam);
				}
			}
		},	
		findSeasonListCommon: function (seasonParam) {
			this.$api.footballSeasonCategoryAnalysis.findSeasonList(seasonParam).then((res) => {
				this.seasonList = res.data;
				if(this.seasonList.length > 0){
					let lastestSeason = this.seasonList[0];
					let footballSeasonId = lastestSeason.footballSeasonId;
					if(!isBlank(footballSeasonId)){
						this.filters.footballSeasonId = footballSeasonId;
						let param = {footballSeasonId:this.filters.footballSeasonId};
						this.findSeasonCategoryList(param);
					}
					//将数据保存到vuex
					this.setSeasonCategoryAnalysisForSeasonAsyn(res);
					this.setSeasonCategoryAnalysisForSeasonParamsAsyn(seasonParam);					
				}
			})
		},				
		//第二步根据赛季找到赛季类别列表
		findSeasonCategoryList: function (categoryParam) {
			let seasonCategoryQueryParams = this.$store.state.footballSeasonCategoryAnalysis.seasonCategoryQueryParams;
			if(null == seasonCategoryQueryParams){
				this.findSeasonCategoryListCommon(categoryParam);
			}else{
				//如果查询参数不为空，并且相同就不重复发起查询
				if(isObjectValueEqual(categoryParam,seasonCategoryQueryParams)){
					this.seasonCategoryList = this.$store.state.footballSeasonCategoryAnalysis.seasonCategoryList;
				}else{
					this.findSeasonCategoryListCommon(categoryParam);
				}
			}
		},	
		findSeasonCategoryListCommon: function (categoryParam) {
			this.$api.footballSeasonCategoryAnalysis.findSeasonCategoryList(categoryParam).then((res) => {
				this.seasonCategoryList = res.data;
				if(this.seasonCategoryList.length > 0){
					let lastestSeasonCategory = this.seasonCategoryList[0];
					this.seasonCategory = this.seasonCategoryList[0];
					this.findScoreBySeasonCategory(lastestSeasonCategory);
					//将数据保存到vuex
					this.setSeasonCategoryAnalysisForCategoryListAsyn(res);
					this.setSeasonCategoryAnalysisForCategoryListParamsAsyn(categoryParam);
					this.setSeasonCategoryAnalysisForSeasonCategoryAsyn(lastestSeasonCategory);
				}					
			})
		},
		findScoreBySeasonCategory: function (category) {
			this.seasonCategory = category;
			let footballSeasonCategoryId = category.footballSeasonCategoryId;
			if(!isBlank(footballSeasonCategoryId)){
				this.filters.footballSeasonCategoryId = footballSeasonCategoryId;
				let param = {footballSeasonCategoryId:this.filters.footballSeasonCategoryId,round:this.filters.round};
				this.findScoreList(param);
				this.setSeasonCategoryAnalysisForSeasonCategoryAsyn(category);
			}
		},		
		//第三步，找到比分数据	
		findScoreList: function (param) {
			this.loading = true;
			let scoreQueryParams = this.$store.state.footballSeasonCategoryAnalysis.scoreQueryParams;
			if(null == scoreQueryParams){
				this.findScoreListCommon(param);
			}else{
				//如果查询参数不为空，并且相同就不重复发起查询
				if(isObjectValueEqual(param,scoreQueryParams)){
					this.loading = false;
					this.scoreList = this.$store.state.footballSeasonCategoryAnalysis.scoreList;
				}else{
					this.findScoreListCommon(param);
				}
			}
		},
		findScoreListCommon: function (param) {
			this.$api.footballSeasonCategoryAnalysis.findScoreList(param).then((res) => {
				this.loading = false;
				this.scoreList = res.data;
				//将数据保存到vuex
				this.setSeasonCategoryAnalysisForSocreAsyn(res);
				this.setSeasonCategoryAnalysisForSocreParamsAsyn(param);
			})
		},		
		initTableData: function () {
			let scoreQueryParams = this.$store.state.footballSeasonCategoryAnalysis.scoreQueryParams;
			if(null != scoreQueryParams){
				this.leagueMatch = this.$store.state.footballSeasonCategoryAnalysis.leagueMatch;
				this.seasonCategory = this.$store.state.footballSeasonCategoryAnalysis.seasonCategory;
				this.seasonList = this.$store.state.footballSeasonCategoryAnalysis.seasonList;
				this.seasonCategoryList = this.$store.state.footballSeasonCategoryAnalysis.seasonCategoryList;
				this.scoreList = this.$store.state.footballSeasonCategoryAnalysis.scoreList;
				//把参数也给设置上
				this.initParams();
			}
		},
		initParams: function () {
			let seasonQueryParams = this.$store.state.footballSeasonCategoryAnalysis.seasonQueryParams;
			this.filters.footballLeagueMatchId = seasonQueryParams.footballLeagueMatchId;
			let seasonCategoryQueryParams = this.$store.state.footballSeasonCategoryAnalysis.seasonCategoryQueryParams;
			this.filters.footballSeasonId = seasonCategoryQueryParams.footballSeasonId;
			let scoreQueryParams = this.$store.state.footballSeasonCategoryAnalysis.scoreQueryParams;
			this.filters.footballSeasonCategoryId = scoreQueryParams.footballSeasonCategoryId;
			this.filters.round = scoreQueryParams.round;
		},
		findLeagueMatch: function (seasonParam) {
			this.$api.footballSeasonCategoryAnalysis.findLeagueMatch(seasonParam).then((res) => {
				this.leagueMatch = res.data;
				//将数据保存到vuex
				this.setSeasonCategoryAnalysisForLeagueMatchAsyn(res.data);
			})
		},
		seasonChange: function () {
			let param = {footballSeasonId:this.filters.footballSeasonId};
			this.findSeasonCategoryList(param);
		},
		categoryButtonClick: function (category) {
			this.changeCategoryButtonClass(category.footballSeasonCategoryId);
			this.findScoreBySeasonCategory(category);
		},			
		//改变类别按钮样式
		changeCategoryButtonClass: function (categoryBtnId) {
			if(!isBlank(this.filters.footballSeasonCategoryId)){
				let clickBtn = document.getElementById(this.filters.footballSeasonCategoryId);
				clickBtn.className="btn-category";
			}
			let currentClickBtn = document.getElementById(categoryBtnId);
			if(currentClickBtn){
				currentClickBtn.className = "btn-category-clicked";
				this.filters.footballSeasonCategoryId = categoryBtnId;
			}
		},			
		//改变轮数按钮样式
		changeRoundButtonClass: function (round) {
			if(!isBlank(round)){
				if(!isBlank(this.lastRoundClickBtnId)){
					let clickBtn = document.getElementById(this.lastRoundClickBtnId);
					clickBtn.className="btn-round";
				}
				let cilckBtnId = 'roundBtn'+round;
				let currentClickBtn = document.getElementById(cilckBtnId);
				currentClickBtn.className = "btn-round-clicked";
				this.lastRoundClickBtnId = cilckBtnId;
			}
		},
		roundButtonClick: function (round) {
			this.changeRoundButtonClass(round);
			let param = {footballSeasonCategoryId:this.filters.footballSeasonCategoryId,round:round};
			this.findScoreList(param);
		},						
		// 时间格式化
		dateFormat: function (row, column, cellValue, index){
			return formatDate(row[column.property])
		},
		handleParams: function () {
			let footballLeagueMatchId = this.$route.query.footballLeagueMatchId;
			if(!isBlank(footballLeagueMatchId)){
				this.filters.footballLeagueMatchId = footballLeagueMatchId;
				let param = {footballLeagueMatchId:this.filters.footballLeagueMatchId};
				this.findLeagueMatch(param);
				this.findSeasonList(param);
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
		this.changeCategoryButtonClass(this.filters.footballSeasonCategoryId);
		this.changeRoundButtonClass(this.filters.round);
	}
}
</script>

<style scoped>
.btn-category{ 
	width:600px;
	height: 40px;
}
.btn-category-clicked{ 
	width:600px;
	height: 40px;
	color: blue;
}
.btn-round{ 
	width:240px;
	height: 40px;
}
.btn-round-clicked {
	width:240px;
	height: 40px;
	color: blue;
}
</style>