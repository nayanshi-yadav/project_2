<script>
import { Line } from 'vue-chartjs'
var moment = require('moment');

export default {
  extends: Line,
  props: ["data","options"],
  mounted () {
    this.renderLineChart()
  },
  computed: {
    chartData: function() {
      return this.data;
    }
  },
  methods:{
    renderLineChart : function(){
      this.renderChart({
        labels: ['12 am','1 am','2 am','3 am','4 am','5 am','6 am','7 am','8 am','9 am','10 am','11 am','12 pm','1 pm','2 pm','3 pm','4 pm','5 pm','6 pm','7 pm','8 pm','9 pm','10 pm','11 pm'],
        datasets: [
        {
          label: moment().format('dddd'),
          borderColor: '#fccc2d', //'#fccc2d', //'#4f5e75',  //'#fccc2d',   #f0dc6c
          backgroundColor: '#fcee9f', //fcee9f',b6becc
          data: this.chartData,
          datalabels:{
            align: 'end',
            anchor: 'start'
          }
        },]
      },
      {
        plugins: {
          datalabels: {
            color: 'rgb(158, 158, 158)', //#696564
            font: {
              weight: 'bold'
            },
            //formatter: Math.round,
            padding: 6,
          }
        },
        layout:{
          padding:70,
          margin:{t: 25,},
        },
        scales: {
          xAxes: [{
            gridLines:{display:false}
          }],
          yAxes: [{
            gridLines:{display:false},
            ticks: {
            display:false,
            //suggestedMin: 25,
            //suggestedMax: 40,
            stepSize: 2
            }
          }]
        },
        legend:{display:false},
        responsive: true, 
        maintainAspectRatio: false
      })
    }
  },

  
  watch: {
    data: function() {
      this.renderLineChart();
    }
  }
}
</script>
