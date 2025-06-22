// Espera o carregamento total da página antes de executar o script
document.addEventListener('DOMContentLoaded', () => {

    // Captura os elementos HTML que vamos manipular
    const taskInput = document.getElementById('task-input'); // Campo onde o usuário digita a tarefa
    const addTaskButton = document.getElementById('add-task-btn'); // Botão de adicionar tarefa
    const taskList = document.getElementById('task-list'); // Lista onde as tarefas serão exibidas
    const emptyImage = document.querySelector('.empty-image'); // Imagem que aparece quando não há tarefas
    const todosContainer = document.querySelector('.todos-container'); // Container das tarefas
    const progressBar = document.getElementById('progress'); // Barra de progresso
    const progressNumber = document.getElementById('numbers'); // Texto que mostra o número de tarefas concluídas e totais

    // Função para exibir ou ocultar a imagem de lista vazia
    const toggleEmptyState = () => {
        emptyImage.style.display = taskList.children.length === 0 ? 'block' : 'none';
        todosContainer.style.width = taskList.children.length > 0 ? '100%' : '50%';
    };

    // Função para atualizar a barra de progresso e o contador
    const updateProgress = (checkCompletion = true) => {
        const totalTasks = taskList.children.length; // Total de tarefas criadas
        const completedTasks = taskList.querySelectorAll('.checkbox:checked').length; // Quantas tarefas estão concluídas

        // Atualiza o tamanho da barra de progresso
        progressBar.style.width = totalTasks ? `${(completedTasks / totalTasks) * 100}%` : '0%';

        // Atualiza o número de tarefas concluídas e totais
        progressNumber.textContent = `${completedTasks} / ${totalTasks}`;
    };

    // Função para salvar as tarefas no localStorage
    const saveTaskToLocalStorage = () => {
        // Cria um array de objetos com texto e status das tarefas
        const tasks = Array.from(taskList.querySelectorAll('li')).map(li => ({
            text: li.querySelector('span').textContent,
            completed: li.querySelector('.checkbox').checked
        }));

        // Salva o array no localStorage em formato JSON
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    // Função para carregar as tarefas do localStorage
    const loadTasksFromLocalStorage = () => {
        // Recupera as tarefas ou cria um array vazio se não houver nada salvo
        const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];

        // Recria cada tarefa na tela
        savedTasks.forEach(({ text, completed }) => addTask(text, completed, false));

        // Atualiza o estado visual e o progresso
        toggleEmptyState();
        updateProgress();
    };

    // Função para adicionar uma nova tarefa
    const addTask = (text, completed = false, checkCompletion = true) => {
        // Se vier texto (carregado do localStorage), usa ele. Se não, pega o que está no input.
        const taskText = text || taskInput.value.trim();

        // Se o input estiver vazio, não faz nada
        if (!taskText) {
            return;
        }

        // Cria um novo item de lista (tarefa)
        const li = document.createElement('li');
        li.innerHTML = `
            <input type="checkbox" class="checkbox" ${completed ? 'checked' : ''}>
            <span>${taskText}</span>
            <div class="task-buttons">
                <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;

        const checkbox = li.querySelector('.checkbox');

        // Se a tarefa já estiver marcada como concluída
        if (completed) {
            li.classList.add('completed');
        }

        // Evento para marcar ou desmarcar a tarefa como concluída
        checkbox.addEventListener('change', () => {
            const isChecked = checkbox.checked;
            li.classList.toggle('completed', isChecked);
            updateProgress();
            saveTaskToLocalStorage();
        });

        // Evento para deletar a tarefa
        li.querySelector('.delete-btn').addEventListener('click', () => {
            li.remove();
            toggleEmptyState();
            updateProgress();
            saveTaskToLocalStorage();
        });

        // Adiciona a tarefa na lista
        taskList.appendChild(li);

        // Limpa o input
        taskInput.value = '';

        // Atualiza o estado visual e o progresso
        toggleEmptyState();
        updateProgress(checkCompletion);
        saveTaskToLocalStorage();
    };

    // Adiciona evento no botão de adicionar tarefa
    addTaskButton.addEventListener('click', (e) => {
        e.preventDefault(); // Previne o reload da página
        addTask(); // Chama a função para adicionar a tarefa
    });

    // Adiciona evento para permitir adicionar tarefa ao apertar Enter
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTask();
        }
    });

    // Carrega as tarefas salvas assim que a página abre
    loadTasksFromLocalStorage();
});
