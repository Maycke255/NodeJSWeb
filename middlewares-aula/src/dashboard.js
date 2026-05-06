// Logout com fetch POST (mude rota pra POST)
document.getElementById('logoutBtn').addEventListener('click', async () => {
    try {
        await fetch('/auth/logout', { method: 'POST' });
        window.location.href = '/index';
    } catch (e) { console.error(e); }
});

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const res = await fetch('/auth/user');

        const result = await res.json();

        document.getElementById('titleWelcome').textContent =  `Bem-vindo, ${result.data || 'Visitante'}`;
    } catch (error) {
        console.error(error.message);
        document.getElementById('message').textContent = 'Erro de conexão'; 
    }
});