const deleteBtn = document.querySelectorAll('.delete-btn');

deleteBtn.forEach((button) => {
    button.addEventListener('click', () => {
        const idUser = button.dataset.id;

        console.log(idUser);

        fetch(`/delete-newsletter/${idUser}`, {
            method: 'DELETE'
        }).then(res => {
            if (res.ok) {
                const divUser = button.closest('.newsletter-item');
                divUser.remove();
            } else {
                console.error('Erro ao deletar usuario');
            }
        }).catch (error => {
            console.error('Erro:', error);
        });
    });
});