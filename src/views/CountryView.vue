<template>
  <!-- <trackerHeader /> -->

  <div class="country-layout">
    <el-container>
        <el-header>
            <div class="breadcrumb">
                <el-link class="country-title" @click="home">Home</el-link>
                <el-icon><CaretRight /></el-icon>
                <el-link class="country-title">{{ this.title }} Agreements</el-link>
            </div>
            <countryHeader :title="title" />
        </el-header>

      <el-container>
        <!-- <el-aside width="435px">

        <asideFilter
            v-for="(filters, i) in filterList"
            :key = "i"
            :allOptions="filters.value"
            :title="filters.title"
            :allAgt="allAgt"
            @changeDisplayList="changeDisplayList"
        />
        </el-aside> -->

        <!-- <el-divider direction="vertical"></el-divider> -->

        <el-main>
            <div style="display: flex; flex-direction: row; align-items: center;">
                <p style="padding: 0px 10px;">Sort by:</p>
                <el-radio-group 
                    v-model="reverse" 
                    @change="reverseList()"
                    class="radio-group">
                    <el-radio label="1">Newest</el-radio>
                    <el-radio label="2">Oldest</el-radio>
                </el-radio-group>
            </div>
            
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

  <!-- <trackerFooter /> -->
</template>

<script>
import { useRoute } from 'vue-router'

// import trackerHeader from '@/components/trackerHeader.vue'
// import trackerFooter from '@/components/trackerFooter.vue'
// import asideFilter from '@/components/asideFilter.vue'
import countryHeader from '@/components/countryHeader.vue'
import docList from '@/components/docList.vue'

// 导入数据
import countries from '@/data/countries.json'

export default ({
    components: {
        countryHeader, docList
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
                    title: 'agreements by topics',
                    value: this.topicOptions
                },
                {
                    title: 'agreements by years',
                    value: this.yearOptions
                }
            ],

            //page split
            sizePerPage: 6,
            currentPage: 1,

            //sort by date
            reverse: '1'
        }
    },

    methods: {
        changeDisplayList(newList) {
            this.dataListDisplayed = newList
        },

        currentChange(current) {
            this.currentPage = current
        },

        home(){
            this.$router.push('/');
        },

        reverseList() {
            if(this.reverse) {
                this.dataListDisplayed = this.dataListDisplayed.reverse()
            }
        },
    },

    mounted() {
        this.reverseList()
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
  background-color: #F1F1F1;
  padding: 10px 6%;
  margin: 0px 0%;
  height: auto;
  /* border-bottom: 2px solid black; */
}

.country-layout .el-main {
    /* padding-left: 40px;
    padding-right: 60px; */
    padding: 0px 5%;
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

.country-title {
    font-size: 16px;
    font-weight: medium;
    margin: 0px 5px;
}

.breadcrumb {
    display: flex; 
    flex-direction: row; 
    align-items: center;
    margin: 10px 0px;
}

.current-page {
    font-style: italic;
}

</style>
