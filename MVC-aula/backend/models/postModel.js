/* Vamos começar com o model, o model nada mais e que o mediador entre o banco de dados e o controller, e toda a controlleruração de méotodos e dados */

//Usando com métodos e classe
class PostModel {
    constructor() {
        this.posts = [

        ];
    }

    getAllPosts () {
        return this.posts;
    }

    getPostById (id) {
        return this.posts.find(post => post.id === id);
    }

    createPost (title, content) {
        const post = {
            id: Date.now().toString(),
            title: title,
            content: content,
            createdAt: new Date(),
            updatedAt: new Date()
        }
        return post;
    }

    savePost (post) {
        this.posts.unshift(post);
    }

    updatePost (id, updatedPost) {
        const index = this.posts.findIndex(post => post.id === id);
        this.posts[index] = { ...this.posts[index], ...updatedPost, updatedAt: new Date() }
    }

    deletePost (id) {
        this.posts = this.posts.filter(post => post.id !== id);
    }
}

module.exports = new PostModel();