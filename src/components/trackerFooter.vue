<template>
    <el-footer>
        <p>Footer</p>
        <el-button @click="home">Home</el-button>
    </el-footer>
    
</template>

<script>


export default ({
    methods: {
        home(){
            this.$router.push('/');
        }
    }
})
</script>


<style scoped>
.el-footer {
    padding: 30px;
    height: 150px;
    background-color: #FAFAFA;
}
</style>