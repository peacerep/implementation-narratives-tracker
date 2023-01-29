<template>
    <div class='doc-list' v-for='agreement in dataListDisplayed' :key='agreement'>
        <hr />
        <el-link 
            class="agt-link" 
            @click="toAgtView(agreement)">{{ agreement.agt }}</el-link>
        <p class="agt-time">{{ agreement.date}}</p>
    </div>
</template>

<script>
export default ({

    props: ["dataListDisplayed", "title"],

    data() {
        return {
            country:  this.title,
        }
    },

    methods: {
        toAgtView(agreement) {
            this.$router.push({
                name: `agreement`,
                query: {
                    title: `${this.country}`,
                    id: `${agreement.id}`,
                    agtName: `${agreement.agt}`,
                    agtDate: `${agreement.date}`
                }
            })
            // console.log(agreement.agt)
        }
    },

    setup () {
       
    }
})
</script>

<style scoped>
.agt-time {
    font-size: 1em;
    padding:0px 0px;
    margin:5px 0px;
}

.doc-list {
    margin: 50px 0px;
}

.title {
    padding: 5px 0px;
}

.agt-link {
    font-size: 1.2em;
    padding:0px 0px;
    margin:0px 0px;
}

</style>