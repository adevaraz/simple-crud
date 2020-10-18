const app = new Vue({
    el:'#content',
    data: {
        articles: [
            { title: "sum title", content: "sum content" }
        ],
        seen: false,
        add: false,
        edit: false,
        idVal: -1,
        titleVal: "",
        contentVal: ""
    },
    methods: {
        readAll: function () {
            axios.get('/article').then((response) => {
                this.articles = response.data;
            });
        },

        createArticle: function (newTitle, newContent) {
            axios.post('/article', {title: newTitle, content: newContent}).then(() => {
                this.readAll();
                this.seen = false;
                this.add = false;
                this.titleVal = "";
                this.contentVal = "";
            });
        },

        deleteArticle: function (id) {
            axios.delete(`/article/${id}`).then(() => {
                this.readAll();
            })
        },

        updateArticle:function (id, newTitle, newContent) {
            console.log(id);
            axios.put(`/article/${id}`, {title: newTitle, content: newContent}).then(() => {
                this.readAll();
                this.seen = false;
                this.edit = false;
                this.idVal = -1;
                this.titleVal = "";
                this.contentVal = "";
            });
        },

        showNewForm: function () {
            this.seen = true;
            this.add = true;
        },

        showEditForm: function (article) {
            this.seen = true;
            this.edit = true;

            this.idVal = article.id;
            this.titleVal = article.title;
            this.contentVal = article.content;
        }
    },
    created: function () {
        this.readAll();
    }
})