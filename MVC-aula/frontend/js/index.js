

async function loadedPosts () {
    try {
        const res = await fetch('/api/posts');
        const result = await res.json();

        if (result.sucess) {
            const posts = result.data;
            const ulPosts = document.querySelector('.posts');
        }
    } catch (erro) {

    }
}

document.addEventListener('DOMContentLoaded', loadedPosts)