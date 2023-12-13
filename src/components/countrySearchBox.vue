<template>
  <el-autocomplete
        v-model="state1"
        :fetch-suggestions="querySearch"
        clearable
        placeholder="Select Country"
        @select="handleSelect"
      >
    
  <template #append>
        <el-button>
          <el-icon><Search /></el-icon>
        </el-button>
    </template>

  </el-autocomplete>
</template>

<script>
import { Search } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';

import countries from '@/data/countries.json'

export default {
    components: {Search},
    data() {
      return {
        restaurants: [],
        state1: '',
        selected: '',
        meta: {}
      };
    },

    methods: {
      querySearch(queryString, cb) {
        var restaurants = this.restaurants;
        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
        cb(results);
      },
      
      createFilter(queryString) {
        return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },

      loadAll() {
        return this.countryNameArr
      },

      handleSelect(item) {
        this.selected = item.value;
        this.$router.push({
          name:`country`,
          query: {
            title: `${this.selected}`
          }
        })


      }
    },

    mounted() {
      this.restaurants = this.loadAll();
    },

    setup() {
      const $router = useRouter();
      console.log($router, 'router');

      // find all countries from dataset
        let data = countries.countries;
        let countryNameArr = [];

        for(var i=0; i<data.length; i++){
            countryNameArr.push({"value": data[i].name})
        }

        return {
            data, countryNameArr
        }
    }
}
</script>
