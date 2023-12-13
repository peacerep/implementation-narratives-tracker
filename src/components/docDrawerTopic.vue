<template>
    <div class="inner-drawer">
    <h1>{{ title }}</h1>
    <div id="doc" v-html="document"></div>
    </div>
</template>

<script>
var tmp_id = -1;

export default ({
    props: ["id", "docDrawerOpen", "country", "agtId", "agtName"],

    data() {
        return {
            agt: '',
            title: '',
            document,
        }
    },

    methods: {
        loadDocument() {
            this.agt = this.agtId;
            this.title = this.agtName;

            let countryName = this.country;
            let countryFolderName = countryName.replace(/\s+/g, "_").toLowerCase();

            let xhr = new XMLHttpRequest();
            const url = './docsHtml/'+countryFolderName+'/agreements/'+this.agt+".html";
            // console.log("docDrawer", url);
            xhr.open("GET", url, false);
            xhr.setRequestHeader('Content-type', 'text/html');
            xhr.send();
            this.document = xhr.response;
        },

        do_highlight(id) {
            // console.log("do highlight triggered")
            tmp_id = id
            let highlightQuerry = "div[id='doc'] a[id='" + tmp_id + "']"
            let selected = document.querySelector(`${highlightQuerry}`)
            selected.style.background = "yellow";
            // console.log("do highllight", selected)
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
        this.loadDocument()
    },

    mounted() {
        this.do_highlight(this.id)
        this.force_scrolling(this.id)
    },

    watch: {
        'docDrawerOpen': function() {
            if ( this.docDrawerOpen ==  true) {
                this.loadDocument()

                this.$nextTick(() => {
                    this.clear_highlight()
                    // console.log("data changed")
                    this.do_highlight(this.id)
                    this.force_scrolling(this.id)
                })
            }
        }
    }
})
</script>