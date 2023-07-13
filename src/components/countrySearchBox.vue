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
        // 调用 callback 返回建议列表的数据
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


<style scoped>
/deep/ .el-autocomplete{
  /* width: 500px; */
  display: flex;
}

/* .fk {
  width: 100%;
  height: 80%;
  position: absolute;
  top: 70%;
  left: 50%;
  transform: translate(-50%, -50%);
} */
.fk >>> .el-input-group {
  width: 60%;
}

.fk >>> .el-input__inner {
  background-color: rgba(140, 165, 165, 0.4);
  font-weight: bold;
  color: #fff;
  border-radius: 20px;
  box-shadow: 1.5px 1px 1px #667f8a;
}
.fk >>> .el-input__inner:focus {
  border-color: #b3b896;
}
.fk /deep/ .el-input__icon {
  color: #617202;
}
.fk /deep/ .el-input__inner::placeholder {
  color: #e6e6e6;
}
div /deep/ .el-autocomplete-suggestion {
  background-color: rgba(135, 165, 165, 0.6);
}

/* 去掉下拉框的顶部小三角箭头 ，看着像一个箭头，其实是两个重叠在一起的箭头*/
div /deep/.el-popper .popper__arrow,
div /deep/.el-popper .popper__arrow::after {
  display: none;
}

</style>
