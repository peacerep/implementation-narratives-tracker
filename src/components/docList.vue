<template>
    <div class='doc-list' v-for='agreement in dataListDisplayed' :key='agreement'>
        <hr />
        <el-link 
            class="agt-link" 
            @click="toAgtView(agreement)">{{ agreement.agt }}</el-link>
        <p>{{ agreement.date}}</p>
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
h3 {
    font-size: 24px;
    padding:0px 0px;
    margin:0px 0px;
}

p {
    font-size: 18px;
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
    font-size: 24px;
    padding:0px 0px;
    margin:0px 0px;
}

</style>