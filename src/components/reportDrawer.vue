<template>
    <div class="report-head">
        <h2>{{ this.report.name }}</h2>
        <div class="switch-container">
            <p>{{ this.allIDs.length }} segments highlighted  </p>
        <el-button-group v-show="nextLineVisible" class="button-wrapper">
            <el-button @click="force_scrolling(-1)"><el-icon><ArrowLeft /></el-icon>Previous</el-button>
            <el-button @click="force_scrolling(1)">Next<el-icon><ArrowRight /></el-icon></el-button>
        </el-button-group>
        </div>
    </div>

    <div class="inner-drawer">
        <div id="repo" v-html="reportText"></div>
    </div>
</template>

<script>
import { ArrowLeft } from '@element-plus/icons-vue';
let i = 0

export default ({
    props: ["report", "allIDs", "reportDrawerOpen"],
    components: { ArrowLeft },
    data() {
        return {
            tmpArr: [],
            currentIndex: 0,
            nextLineVisible: false,
            folderName:'',
            sortedIDs: []
        };
    },
    methods: {
        do_highlight(idList) {
            this.tmpArr = idList;
            for (let id of idList) {
                let highlightQuerry = "div[id='repo'] a[id='" + id + "']"
                let selected = document.querySelector(`${highlightQuerry}`)
                selected.style.background = "yellow";
            }
        },

        force_scrolling(dif) {
            let segNum = this.allIDs.length
            let arr = []
            let item = JSON.parse(JSON.stringify(this.allIDs))
            for ( let id of item ) {
                id = parseInt(id)
                arr.push(id)
            }
            arr.sort(function(a, b){return a - b})

            if ( i >= -1 && i < segNum-1) {
                i = i + dif
                if ( dif == -1 ) {
                    i = 0
                    this.$message('back to the top.')
                }
            }
            else {
                i = 0
                this.$message('back to the top.')
            }
            let scrollToId = arr[i]
            let scrollQuerry = "div[id='repo'] a[id='" + scrollToId + "']"
            let element = document.querySelector(`${scrollQuerry}`);
            element.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
        },

        show(idList) {
            if (idList.length > 1) {
                this.nextLineVisible = true
            }
            else {
                this.nextLineVisible = false
            } 
        },
        
        getReport() {
            // Synchronous request
            let xhr = new XMLHttpRequest();
            const url = "./docsHtml/" + this.folderName + "/reports/" + this.report.id + ".html";
            xhr.open("GET", url, false);
            xhr.setRequestHeader("Content-type", "text/html");
            xhr.send();
            this.reportText = xhr.response;
        },

        defaultScroll() {
            let arr = []
            let item = JSON.parse(JSON.stringify(this.allIDs))
            for ( let id of item ) {
                id = parseInt(id)
                arr.push(id)
            }
            arr.sort(function(a, b){return a - b})
            this.sortedIDs = arr
            let id = this.sortedIDs[0]

            let querryID = "div[id='repo'] a[id='" + id + "']"
            let element = document.querySelector(`${querryID}`)
            setTimeout(function() {
                element.scrollIntoView({ behavior: "auto", block: "center", inline: "nearest" })
            }, 100)
            
        }
    },

    created() {
        let countryName = document.querySelector('#drawer').innerText
        countryName = countryName.replace(" Agreements", "")
        let countryFolderName = countryName.replace(/\s+/g, "_").toLowerCase()
        this.folderName = countryFolderName
        this.getReport()
        this.show(this.allIDs)
    },

    mounted() {
        const that = this
        setTimeout(function() {
            that.do_highlight(that.allIDs)
            that.defaultScroll()
        }, 100)
    },

    watch: {
        "reportDrawerOpen": function () {
            if (this.reportDrawerOpen == true) {
                this.getReport()
                this.show(this.allIDs)
                i = 0
                const that = this
                setTimeout(function() {
                    that.do_highlight(that.allIDs);
                    that.defaultScroll()
                }, 50)
            }
        }
    }
})

</script>

<style scoped>
h2 {
    margin-bottom: 5px;
}
.inner-drawer {
    text-align: left;
    margin-top: 20px;
}

.paginationClass {
    position: relative;
    bottom: 0;
    text-align: center;
}

.report-head {
    text-align: left;
    background-color: white;
    position: sticky;
    top: 0px;
    border-bottom: 2px solid lightgray;
}

.switch-container {
    display: flex;
    align-items: center;
    flex-direction: row;   
}

.el-drawer__body {
    padding: 0px;
}

.button-wrapper {
    padding-left: 10px;
}
</style>