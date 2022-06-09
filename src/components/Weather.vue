<template>
  <div>
    <div class="block has-text-centered">
      <div class="columns">
        <div class="column is-2 has-text-centre">
          <img width="84" height="84" :src="currentDay['condition']['icon']" />
        </div>

        <div class="column is-1 heading_div_upper">
          <h1
            v-if="showC"
            class="title heading_div mt-4 is-1"
            style="margin-left: auto"
          >
            {{ currentDay["temp_c"] }}
          </h1>
          <h1
            v-else-if="showF"
            class="title heading_div mt-4 is-1"
            style="margin-left: auto"
          >
            {{ currentDay["temp_f"] }}
          </h1>
        </div>
        <div
          class="column is-2 mt-4 pl-0 title has-text-left"
          style="float: right"
        >
          <span class="title"
            ><a :class="{ display: showC }" v-on:click="displayC">˚C</a></span
          >
          <span class="title has-text-grey-light">|</span>
          <span class="title"
            ><a :class="{ display: showF }" v-on:click="displayF">˚F</a></span
          >
        </div>

        <div class="column has-text-left ml-6 pl-6 m-2 has-text-grey">
          <p>Feelslike: {{ currentDay["feelslike_c"] }}˚C</p>
          <p>Precipitation: {{ currentDay["precip_mm"] }} mm</p>
          <p>Humidity: {{ currentDay["humidity"] }}</p>
          <p>Wind: {{ currentDay["wind_kph"] }} kph</p>
        </div>
        <div class="column m-2" style="line-height: 1.2">
          <p class="is-size-5">
            {{ location["name"] }},{{ location["region"] }},{{
              location["country"]
            }}
          </p>
          <p class="is-size-5">{{ moment().format("dddd, h:mm a") }}</p>
          <p class="is-size-5">{{ currentDay["condition"]["text"] }}</p>
        </div>
      </div>

      <div class="column">
        <line-chart
          v-if="loaded"
          :styles="myStyles"
          :data="dataChart"
          :options="{ responsive: true, maintainAspectRatio: false }"
        />
      </div>

      <div v-if="showC" class="columns">
        <div class="column" v-for="day in forecast" v-bind:key="day.id">
          <p class="day-name" style="color: rgb(51, 51, 51)">
            {{ moment(day["date"]).format("dddd") }}
          </p>
          <p>
            <img
              width="80"
              height="80"
              :src="day['day']['condition']['icon']"
            />
          </p>
          <span class="high-temp" style="color: rgb(51, 51, 51)"
            >{{ day["day"]["maxtemp_c"] }}˚
          </span>
          <span class="low-temp" style="color: rgb(158, 158, 158)"
            >{{ day["day"]["mintemp_c"] }}˚</span
          >
        </div>
      </div>
      <div v-else-if="showF" class="columns">
        <div class="column" v-for="day in forecast" v-bind:key="day.id">
          <p class="day-name" style="color: rgb(51, 51, 51)">
            {{ moment(day["date"]).format("dddd") }}
          </p>
          <p>
            <img
              width="80"
              height="80"
              :src="day['day']['condition']['icon']"
            />
          </p>
          <span class="high-temp" style="color: rgb(51, 51, 51)"
            >{{ day["day"]["maxtemp_f"] }}˚
          </span>
          <span class="low-temp" style="color: rgb(158, 158, 158)"
            >{{ day["day"]["mintemp_f"] }}˚</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";

import VueAxios from "vue-axios";
import axios from "axios";
import LineChart from "./LineChart";
import ChartDataLabels from "chartjs-plugin-datalabels";
Vue.use(VueAxios, axios);
Chart.plugins.register(ChartDataLabels);
var moment = require("moment");

export default {
  name: "Weather",
  components: {
    LineChart,
  },

  data() {
    return {
      showC: true,
      showF: false,
      moment: moment,
      city: null,
      location: [],
      currentDay: [],
      forecast: [],
      dataC: [],
      dataF: [],
      dataChart: [],
      loaded: false,
      myStyles: {
        height: "300px",
        position: "relative",
      },
    };
  },

  methods: {
    displayC() {
      this.showC = true;
      this.showF = false;
      this.dataChart = this.dataC;
      console.log("displayC", this.dataChart);
    },

    displayF() {
      this.showF = true;
      this.showC = false;
      this.dataChart = this.dataF;
      console.log("displayF", this.dataChart);
    },
    getWeather() {
      this.$getLocation().then((coordinates) => {
        this.latlong = coordinates.lat + "," + coordinates.lng;
        axios
          .get(
            "https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=" +
              coordinates.lat +
              "&lon=" +
              coordinates.lng
          )
          .then((res) => {
            console.log("getlocation", res.data.address.city);
            this.city = res.data.address.city;
            var hours = [
              0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
              19, 20, 21, 22, 23,
            ];

            var options = {
              method: "GET",
              url: "https://weatherapi-com.p.rapidapi.com/forecast.json",
              params: { q: this.city, days: "3" },
              headers: {
                "x-rapidapi-key":
                  "e29863a71fmshf46a4567718ab32p13d591jsn553837c60955",
                "x-rapidapi-host": "weatherapi-com.p.rapidapi.com",
              },
            };
            axios
              .request(options)
              .then((res) => {
                //   console.log(res.data);
                this.location = res.data.location;
                this.currentDay = res.data.current;
                this.forecast = res.data.forecast.forecastday;
                for (var d in hours) {
                  this.dataC.push(this.forecast[0].hour[d].temp_c);
                  this.dataF.push(this.forecast[0].hour[d].temp_f);
                }
                this.dataChart = this.dataC;
                this.loaded = true;
                console.log("Data C ", this.dataC);
                console.log("Data f ", this.dataF);
                console.log("Initial Chart Data ", this.dataChart);
              })
              .catch((error) => {
                console.error(error);
              });
          });
      });
    },
  },

  mounted() {
    this.loaded = false;
    // this.getLocation();
    this.getWeather();
    // console.log("after getweather");
  },
};
</script>

<style scoped>
.display {
  color: black;
}
.heading_div {
  display: inline-flex;
}
.heading_div_upper {
  /* display: inline-flex; */
  width: 20px;
}
</style>