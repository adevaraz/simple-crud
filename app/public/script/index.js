const app = new Vue({
    el:'#content',
    data: {
        articles: [
            { title: "sum title", content: "sum content" }
        ],
        seen: false,
        add: false,
        edit: false,
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
            console.log(newTitle);
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

        editArticle: function (article) {
            this.titleVal = article.title;
            this.contentVal = article.content;
        },

        updateArticle:function (id, newTitle, newContent) {
            axios.put(`/article/${id}`, {title: newTitle, content: newContent}).then(() => {
                this.readAll();
                this.seen = false;
                this.edit = false;
                this.titleVal = "";
                this.contentVal = "";
            });
        },

        showNewForm: function () {
            this.seen = true;
            this.add = true;

            console.log(this.seen + this.add);
        },

        showEditForm: function () {
            this.seen = true;
            this.edit = true;

            this.titleVal = "";
            this.contentVal = "";
            console.log(this.seen + this.edit);
        }
    },
    created: function () {
        this.readAll();
    }
})