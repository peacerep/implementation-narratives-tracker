<template>

<div class="common-layout">
    <el-container>
      <el-aside width="300px">
        <h3>Filter Year</h3>
          <el-checkbox
            v-model="checkAll"
            :indeterminate="isIndeterminate"
            @change="handleCheckAllChange"
            >Check all</el-checkbox
          >

          <el-checkbox-group
            v-model="checkedTopics"
            @change="handleCheckedtopicsChange"
          >
          <el-checkbox 
              v-for="topic in topics" 
              :key="topic" 
              :label="topic"
              style="display: block; padding-top: 0px; margin-right:30px;">
              {{topic}}
          </el-checkbox>

        </el-checkbox-group>
        
      </el-aside>

      <el-divider direction="vertical"></el-divider>
      <el-main>
        <div class='doc-list' v-for='agreement in dataListDisplayed' :key='agreement'>
          <h4>{{ agreement.agt}}</h4>
          <p>{{ agreement.date}}</p>
          </div>
      </el-main>
    </el-container>
  </div>

</template>

<script>
  export default {
    // props: [metadata],
    data() {
      return {
        checkAll: false,
        checkedTopics: this.topicOptions,
        topics: this.topicOptions,
        isIndeterminate: true,

        //filter list
        dataListDisplayed: this.listDemo
      };
    },

    methods: {
      handleCheckAllChange(val) {
        this.checkedTopics = val ? this.topicOptions : [];
        this.isIndeterminate = false;
      },
      handleCheckedtopicsChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.topics.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.topics.length;
        console.log(this.checkedTopics, "CHECKED");
        //checkedTopics 选中的话题

        //generate filter list
        let tmpArr = [];
        for (let topic of this.checkedTopics) {
          for (let agtObj of this.listDemo) {
            if ( agtObj.topics.includes(topic) && !tmpArr.includes(agtObj)){
              tmpArr.push(agtObj)
            }
          }
        }
        this.dataListDisplayed = tmpArr
      }      
    },
    
    setup() {
      let listDemo = [
            {"agt": "agt1", "date": "2000-01-01", "topics":["human rights"]},
            {"agt": "agt2", "date": "2001-01-01", "topics":["human rights", "ceasefires"]},
            {"agt": "agt3", "date": "2002-01-01", "topics":["ceasefires"]},
            {"agt": "agt4", "date": "2012-01-01", "topics":["human rights", "ceasefires"]}
        ];

      
       let dateOptions = [];
       let topicOptions = [];
       let agtList = [];

        for (let i = 0; i < listDemo.length; i++) {
            
            dateOptions.push(listDemo[i].date);
            agtList.push(listDemo[i].agt);

            let topics = listDemo[i].topics;
            for (let j = 0; j < topics.length; j++){
                // console.log(topics[j]);
                if (topicOptions.includes(topics[j]) == false) {
                    topicOptions.push(topics[j])
                }
            }
            // console.log(topicOptions);
        }
        console.log(agtList, 'AGREMENT');
        console.log(dateOptions, 'DATES')

        return {
        listDemo, dateOptions, topicOptions, agtList
      }

    }
  };
</script>

<style scoped>
h3 {
    font-size: 16px;
    text-align: left;
    padding-top: 20px;
    margin-left: 60px;
    margin-bottom: 0px;
}

h4 {
    text-align: left;
    font-size:18px;
    font-weight: 500;
    padding: 0px;
    margin: 0px;
}

p {
    text-align: left;
}

.el-checkbox-group {
    text-align: left;
}

.el-checkbox {
    display: block; 
    padding-top: 20px;
    margin-left: 60px;
    margin-right: 25px;
    width: 200px;
    padding-left: 0px;
    text-align: left;
}

.el-divider--vertical{
  display:inline-block;
  width:2px;
  height:30em;
  margin:0 8px;
  vertical-align:middle;
  position:relative;
}

.el-main {
  padding-top: 40px;
  padding-left: 50px;
}

.doc-list {
  margin-bottom: 40px;
}
</style>