<template>
<div>
  <v-chart :option="option" style="height:200px;"></v-chart>
</div>
</template>

<script>
export default {  
  name: 'ScoreTrendLineChart',
  props:{
    scoreList: {
      type: Array,
      default: []
    }    
  },
  data() {
    return {
    }
  },
  methods: {
  },
  computed:{
      option() {
        let _self = this;
          return{
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },			
            tooltip: {
              trigger: 'axis',
              triggerOn: 'mousemove',
              formatter: function(params, ticket, callback){
                if(params && params.length > 0){
                  let param = params[0];
                  return param.axisValue;
                }
                return '';
              }
            },			
            xAxis: {
              type: 'category',
              data: _self.scoreList.map(score => score.homeFootballTeamName +'vs'
              + score.awayFootballTeamName  + '<br/>' +score.homeScore + ':' + score.awayScore),
              boundaryGap: false,
              show: false			
            },
            yAxis: {
              type: 'category',
              data: ['','负','平','胜'],
              boundaryGap: false,
              splitLine: {
                show: true,
                //网格线
                lineStyle: {
                type: 'solid', //设置网格线类型 dotted：虚线 solid:实线
                  width: 1,
                }
              }					
            },
            series: [{
              data: _self.scoreList.map(score => {
                if(score.homeScore - score.awayScore > 0){
                  return '胜';
                }else if(score.homeScore - score.awayScore < 0){
                  return '负';
                }else{
                  return '平';
                }
                      }),
              type: 'line',
              areaStyle: {}
            }]
        };
      }	
  },
  mounted() {
  }
}
</script>

<style scoped lang="scss">

</style>