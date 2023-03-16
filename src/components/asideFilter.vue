<template>
<h3>Filter {{ title }}</h3>

<el-checkbox
    v-model="checkAll"
    :indeterminate="isIndeterminate"
    @change="handleCheckAllChange"
    >Check all</el-checkbox
>

<el-checkbox-group
    v-model="checkedOptions"
    @change="handleCheckedOptionsChange"
>

<el-checkbox 
    v-for="option in options" 
    :key="option" 
    :label="option">
    {{option}}
</el-checkbox>

</el-checkbox-group>

</template>

<script>
  export default {
    props: {
      allOptions: Array,
      allAgt: Array,
      filterList:  Array,
      title: String
    },

    emits:["changeDisplayList"],

    data() {
      return {
        checkAll: true,
        checkedOptions: this.allOptions,
        options: this.allOptions, 
        isIndeterminate: true
      };
    },

    methods: {
      handleCheckAllChange(val) {
        this.checkedOptions = val ? this.topicOptions : []
        this.isIndeterminate = false

        let tmpArr = []
        if (this.checkAll == false) {
          tmpArr = []
          this.checkedOptions = []
          this.$emit('changeDisplayList', tmpArr)
        }
        else {
          tmpArr = this.allAgt
          this.checkedOptions = this.allOptions
          this.$emit('changeDisplayList', tmpArr)
        }
      },

      handleCheckedOptionsChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.options.length
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.options.length

        //generate filter list
        let tmpArr = []
        //对于选中列表循环每个选项
        for (let option of this.checkedOptions) {
          //对于这个选项，循环总表中每个agt
          for (let agtObj of this.allAgt) {
            //对该agt，如果topic有，如果year有，就推进列表，并保持不重不漏
              if ( (agtObj.topics.includes(option) || agtObj.year.includes(option)) && !tmpArr.includes(agtObj)){
              tmpArr.push(agtObj)
              }
        }
        }
        this.$emit('changeDisplayList', tmpArr)
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

.el-checkbox-group {
    text-align: left;
}

.el-checkbox {
    /* display: block;  */
    padding-top: 20px;
    margin-left: 60px;
    margin-right: 25px;
    width: 350px;
    padding-left: 0px;
    text-align: left;
}

.el-checkbox__label {
  display: inline-block;
  /* font-size: 12px; */
}

.el-checkbox, .el-checkbox__input {
  white-space: normal;
}

.el-divider--vertical{
  display:inline-block;
  width:1px;
  height:20em;
  margin:0 8px;
  vertical-align:middle;
  position:relative;
}
</style>