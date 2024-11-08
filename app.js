const studentList = document.querySelector('#lista-aluno');

// Exibe a informação de um aluno
function displayStudentInfo(data) {
    const item = document.createElement('li');
    item.setAttribute('data-id', data.id);

    const fields = [
        `Nome do aluno: ${data.nome}`,
        `Código do aluno: ${data.cod_aluno}`,
        `Turma: ${data.turma}`,
        `CPF: ${data.cpf}`,
        `RG: ${data.rg}`,
        `Tel. Aluno: ${data.telefone_aluno}`,
        `Tel. Responsável: ${data.telefone_responsavel}`,
        `Email: ${data.email}`,
        `Data de nascimento: ${data.data_nascimento}`
    ];

    fields.forEach(text => {
        const span = document.createElement('span');
        span.textContent = text;
        item.appendChild(span);
    });

    // Adiciona o botão de exclusão ao item
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Excluir';
    deleteButton.addEventListener('click', () => {
        deleteStudent(data.cod_aluno, item); // Passa o código do aluno e o item a ser removido
    });
    item.appendChild(deleteButton);

    studentList.appendChild(item);
}

// Função para excluir aluno
function deleteStudent(studentCode, listItem) {
    db.collection('BD3-NoSQL-Firestore').get().then(snapshot => {
        const docToDelete = snapshot.docs.find(doc => doc.data().cod_aluno === studentCode);

        if (docToDelete) {
            // Exclui o aluno no Firestore
            db.collection('BD3-NoSQL-Firestore').doc(docToDelete.id).delete().then(() => {
                alert('Aluno deletado');
                listItem.remove(); // Remove o item da lista sem recarregar a página
            });
        } else {
            alert('Aluno não encontrado');
        }
    });
}

// Exibe todos os alunos ao carregar a página
db.collection('BD3-NoSQL-Firestore').get().then(snapshot => {
    snapshot.docs.forEach(doc => displayStudentInfo(doc.data()));
});

// Cadastro de aluno
document.querySelector('#add-student-form').addEventListener('submit', (event) => {
    event.preventDefault();

    const form = event.target;
    const docRef = db.collection('BD3-NoSQL-Firestore').doc();
    const newStudent = {
        cod_aluno: docRef.id,
        nome: form.nome.value,
        turma: form.turma.value,
        cpf: form.cpf.value,
        rg: form.rg.value,
        telefone_aluno: form.telefone_aluno.value,
        telefone_responsavel: form.telefone_responsavel.value,
        email: form.email.value,
        data_nascimento: new Date(form.data_nasc.value),
    };

    docRef.set(newStudent).then(() => {
        form.reset();
        window.location.reload(); // Recarrega a página para atualizar a lista
    });
});
