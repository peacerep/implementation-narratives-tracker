<template>
  <trackerHeader />

  <div class="country-layout">
    <el-container>
        <el-header>
            <countryHeader :title="title" />
        </el-header>

      <el-container>
        <el-aside width="435px">

        <asideFilter
            v-for="(filters, i) in filterList"
            :key = "i"
            :allOptions="filters.value"
            :title="filters.title"
            :allAgt="allAgt"
            @changeDisplayList="changeDisplayList"
        />
        </el-aside>

        <el-divider direction="vertical"></el-divider>

        <el-main>
            <docList 
                :dataListDisplayed="dataListDisplayed.slice(sizePerPage*(currentPage-1),sizePerPage*currentPage)"
                :title="title" />
            
            <!-- page split -->
            <div class="paginationClass">
            <el-pagination
                :page-size="sizePerPage"
                :total="this.dataListDisplayed.length"
                hide-on-single-page
                @current-change="currentChange"
            ></el-pagination>
            </div>

        </el-main>

      </el-container>
    </el-container>
  </div>

  <trackerFooter />
</template>

<script>
import { useRoute } from 'vue-router'

import trackerHeader from '@/components/trackerHeader.vue'
import trackerFooter from '@/components/trackerFooter.vue'
import asideFilter from '@/components/asideFilter.vue'
import countryHeader from '@/components/countryHeader.vue'
import docList from '@/components/docList.vue'

// 导入数据
import countries from '@/data/countries.json'

export default ({
    components: {
        trackerHeader, trackerFooter, asideFilter, countryHeader, docList
    },

    data() {
        return{
            title: this.countryName,
            dataListDisplayed: this.agreementList,

            //父组件传data给filter
            allAgt: this.agreementList,
            allOptions: this.topicOptions,

            filterList: [
                {
                    title: 'topics',
                    value: this.topicOptions
                },
                {
                    title: 'dates',
                    value: this.yearOptions
                }
            ],

            //page split
            sizePerPage: 6,
            currentPage: 1
        }
    },

    methods: {
        changeDisplayList(newList) {
            this.dataListDisplayed = newList
        },

        currentChange(current) {
            this.currentPage = current
        }
    },

    setup() {
        //pass in country title through route
        const $route = useRoute()
        let countryName = $route.query.title
        let data = {}
        let agreementList = []

        //初始化本页需要的数据
        for (let country of countries.countries) {
            if (country.name == countryName) {
                data = country
            }
        }

        //得到所有agreement
        let topic = ''
        let topicOptions = []
        let agtName = ''
        let agtID = ''
        let yearOptions = []
        // let agtTimeExact = ''

        let agtList = []
        for (let item of data.topics) {
                topic = item.text
                topicOptions.push(topic)

                for (let agt of item.agreements){
                    agtName = agt.name
                    agtID = agt.id
                    let agtTime = ''
                    
                    // decide if this agt is in the list
                    if (agtList.includes(agtName) == false){
                        agtList.push(agtName)
                        
                        // get agt time
                        let tmp = agt.date.toString()
                        let YEAR = tmp.slice(0,4)
                        let MONTH = tmp.slice(4,6)
                        let DAY = tmp.slice(6,8)
                        agtTime = YEAR + '-' + MONTH + '-' + DAY

                        if(yearOptions.includes(YEAR) == false){
                            yearOptions.push(YEAR)
                        }
                        agreementList.push({'agt': agtName, 'id': agtID, 'date': agtTime, 'year': YEAR, "topics": [topic]})
                    }
                    else {
                        for (let subAgt of agreementList) {
                            if (subAgt.agt == agtName) {
                                subAgt.topics.push(topic)
                            }
                        }                        
                    }
                }
            }
        return {
            countryName, data, agreementList, topicOptions, yearOptions
        }
    }
})
</script>

<style scoped>
.el-main{
    /* height: 100vh; */
    /* overflow:auto; */
    background-color: burlywood;
}
.country-layout .el-header {
  background-color: #D9D9D9;
  padding: 10px 20px;
  height: auto;
}

.country-layout .el-main {
    padding-left: 40px;
    padding-right: 60px;
    background-color: white;
    display: block;
    text-align: left;
  
}

.country-layout .el-aside {
  background-color: white;
}


.paginationClass {
    position: relative;
    bottom: 0;
    text-align: center;
}

.el-row {
    margin-left: 50px;
    margin-bottom: 10px;
    align-items: flex-start;
}

.el-col {
    column-rule: 4px dotted rgb(79, 185, 227);
    border-radius: 4px;
    align-items: flex-start;
  
}

.el-divider--vertical{
  display:inline-block;
  width:1px;
  height: 100vh;
  margin:0 8px;
  vertical-align:middle;
  position:relative;
}

</style>
