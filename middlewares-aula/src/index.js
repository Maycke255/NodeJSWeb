document.getElementById('formLogin').addEventListener('submit', async (event) => {
    event.preventDefault();
    try {
        const username = document.getElementById('username-login').value; 
        const passwordNumber = document.getElementById('password-login').value;
        
        const password = passwordNumber.toString();
        const message = document.getElementById('message');
        console.log(username, password)

        const res = await fetch('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })  
        });

        const result = await res.json();
        message.textContent = result.message;

        if (result.success) {
            setTimeout(() => window.location.href = '/auth/dashboard', 2000);
        }
    } catch (error) {
        console.error(error.message);
        document.getElementById('message').textContent = 'Erro de conexão';
    }
});

document.getElementById('formRegister').addEventListener('submit', async (ev) => {
    ev.preventDefault()
    try {
        const username = document.getElementById('username-register').value; 
        const passwordNumber = document.getElementById('password-register').value;

        const password = passwordNumber.toString();
        const message = document.getElementById('message');

        const res = await fetch('/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const result = await res.json();
        message.textContent = result.message;

        if (result.success) {
            setTimeout(() => window.location.href = '/auth/dashboard', 2000);
        }
    } catch (error) {
        console.error(error.message);
        document.getElementById('message').textContent = 'Erro de conexão';
    }
});