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
                :dataListDisplayed="dataListDisplayed"
                :title="title" />
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
            ]
        }
    },

    methods: {
        changeDisplayList(newList) {
            this.dataListDisplayed = newList
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
                let topicTagList = []

                for (let [index, agt] of item.agreements.entries()){
                    agtName = agt.name
                    agtID = agt.id
                    let agtTime = ''
                    
                    //得到文件名后，判断agtList里是否已经有这个文件
                    if (agtList.includes(agtName) == false){
                        agtList.push(agtName)

                        //对这个文件添加话题表
                        topicTagList.push(topic)
                        //得到时间
                        let tmp = agt.date.toString()
                        let YEAR = tmp.slice(0,4)
                        let MONTH = tmp.slice(4,6)
                        let DAY = tmp.slice(6,8)
                        agtTime = YEAR + '-' + MONTH + '-' + DAY

                        if(yearOptions.includes(YEAR) == false){
                            yearOptions.push(YEAR)
                        }
                        
                        agreementList.push({'agt': agtName, 'id': agtID, 'date': agtTime, 'year': YEAR, "topics": topicTagList})
                    }
                    else {
                        //包含多个话题的文件，追加topics
                        agreementList[index].topics.push(topic)
                    }      
                }
                
            }
            console.log('列表', agreementList)
        return {
            countryName, data, agreementList, topicOptions, yearOptions
        }
    }
})
</script>

<style scoped>

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
  height:50em;
  margin:0 8px;
  vertical-align:middle;
  position:relative;
}

</style>