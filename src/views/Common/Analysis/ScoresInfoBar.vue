<template>
    <div>
		  近<el-link type="danger" style="font-size:18px;">{{teamScoreList.length}}</el-link>场交锋,
		  <el-link type="danger" style="font-size:16px;" >{{teamName}}</el-link>
		  胜<el-link type="danger" style="font-size:16px;">{{teamScoreWinTotal}}</el-link>场,
		  平<el-link type="primary" style="font-size:16px;">{{teamScoreDrawTotal}}</el-link>场,
		  负<el-link type="success" style="font-size:16px;">{{teamScoreLostTotal}}</el-link>场, 
		  胜率<el-link type="danger" style="font-size:16px;">{{teamScoreWinPercent}}%</el-link>
    </div>
</template>

<script>
import { accDiv } from "@/utils/mathUtil";
export default {
  name: 'ScoresInfoBar',
  props:{
    teamScoreList: {
      type: Array,
      default: []
    },
    teamName: {
      type: String,
      default: ''
    }      
  },
  data() {
    let _self = this
    return {    
			teamScoreWinTotal: 0,
			teamScoreDrawTotal: 0,
			teamScoreLostTotal: 0,
			teamScoreWinPercent: 0.00,
    };
  },
  methods: {
		computeTeamScoreFields: function () {
			this.teamScoreWinTotal = 0;
			this.teamScoreDrawTotal = 0;
			this.teamScoreLostTotal = 0;
			this.teamScoreWinPercent = 0.00;
			if(this.teamScoreList.length > 0){
				for (let i = 0, len = this.teamScoreList.length; i < len; i++) {
					let score = this.teamScoreList[i];
					if(score.homeScore - score.awayScore > 0){
						this.teamScoreWinTotal = this.teamScoreWinTotal + 1;
					} else if(score.homeScore - score.awayScore < 0){
						this.teamScoreDrawTotal = this.teamScoreDrawTotal + 1;
					} else {
						this.teamScoreLostTotal = this.teamScoreLostTotal + 1;
					}
				}
				this.teamScoreWinPercent = accDiv(this.teamScoreWinTotal,this.teamScoreList.length,2) * 100;					
			}			
		},	
  },
  watch: {
    teamScoreList(newList,oldList){
      this.computeTeamScoreFields();
    }
  },
  mounted() {
  },updated(){
	}
};
</script>

<style scoped lang="scss">

</style>