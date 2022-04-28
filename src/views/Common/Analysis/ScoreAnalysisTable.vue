<template>
	<el-table :data="teamScoreList" :highlight-current-row="true"
		:v-loading="loadingFlag" :element-loading-text="$t('action.loading')" :border="false" :stripe="true"
		:show-overflow-tooltip="true" align="left" size="mini" style="width:100%;" >
	<el-table-column type="index" width="50" label="序号" align="center"></el-table-column>
	<el-table-column prop="footballLeagueMatchName" width="140" label="赛事" align="center"></el-table-column>
	<el-table-column prop="matchDate" width="90" label="时间" :formatter="dateFormat" align="center"></el-table-column>
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
	<el-table-column label="结果" align="center" width="50">
		<template slot-scope="scope">
			<el-link type="danger" v-if="scope.row.homeScore - scope.row.awayScore > 0">胜</el-link>
			<el-link type="success" v-else-if="scope.row.homeScore - scope.row.awayScore < 0">负</el-link>
			<el-link type="primary" v-else-if="scope.row.homeScore - scope.row.awayScore == 0">平</el-link>			
		</template>
	</el-table-column>
	</el-table>	
</template>

<script>
import { formatDate } from "@/utils/datetime";
export default {
  name: 'ScoreAnalysisTable',
  props:{
    teamScoreList: {
      type: Array,
      default: []
    },
	loadingFlag: {
      type: Boolean,
      default: false
    }     
  },
  data() {
    return {    
    };
  },
  methods: {	
	// 时间格式化
	dateFormat: function (row, column, cellValue, index){
		return formatDate(row[column.property])
	},
  },
  watch: {
  },
  mounted() {
  },
  updated(){
  }
};
</script>

<style scoped lang="scss">

</style>