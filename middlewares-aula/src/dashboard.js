document.addEventListener('DOMContentLoaded', async () => {
    try {
        const res = await fetch('/auth/user');

        const result = await res.json();

        document.getElementById('titleWelcome').textContent = result.user;
    } catch (error) {
        console.error(error.message);
        document.getElementById('message').textContent = 'Erro de conexão'; 
    }
});