<template>
    <div class="inner-drawer">
    <h1>{{ title }}</h1>
    <div id="doc" v-html="document"></div>
    </div>
</template>

<script>
var tmp_id = -1;

export default ({
    props: ["id", "docDrawerOpen", "country"],

    data() {
        return {
            agt: '',
            title: '',
            document,
        }
    },

    methods: {
        do_highlight(id) {
            tmp_id = id
            let highlightQuerry = "div[id='doc'] a[id='" + tmp_id + "']"
            let selected = document.querySelector(`${highlightQuerry}`)
            selected.style.background = "yellow";
        },

        clear_highlight() {
            if (tmp_id > -1) {
                let clearQuerry = "div[id='doc'] a[id='" + tmp_id + "']"
                document.querySelector(`${clearQuerry}`).style.background = "white";
                tmp_id = -1
            }
        },

        force_scrolling(id) {
            setTimeout(function () {
                let scrollQuerry = "div[id='doc'] a[id='" + id + "']"
                let provisionElement = document.querySelector(`${scrollQuerry}`)
                provisionElement.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"})
            }, 300)
        }
    },

    created() {
        let countryName = this.country
        let countryFolderName = countryName.replace(/\s+/g, "_").toLowerCase();
        this.agt = this.$attrs.agtID
        this.title = this.$attrs.agtName
        
		// Synchronous request
        let xhr = new XMLHttpRequest();
        const url = './docsHtml/'+countryFolderName+'/agreements/'+this.agt+".html"
		xhr.open("GET", url, false);
		xhr.setRequestHeader('Content-type', 'text/html');
		xhr.send();
        this.document = xhr.response
    },

    mounted() { 
        this.do_highlight(this.id)
        this.force_scrolling(this.id)
    },

    watch: {
        'docDrawerOpen': function() {
            if ( this.docDrawerOpen ==  true) {
                this.clear_highlight()
                this.do_highlight(this.id)
                this.force_scrolling(this.id)
            }
        }
    }
})
</script>

<style scoped>
.inner-drawer {
    text-align: left;
}
</style>
