const API = 'http://localhost:3000/api';

function loadTasks() {
    fetch(`${API}/tasks`)
        .then(res => res.json())
        .then(tasks => {
            const taskList = document.getElementById('taskList');
            taskList.innerHTML = '';
            tasks.forEach(tasks => {
                const li = document.createElement('li');
                li.textContent = tasks.title;
                taskList.appendChild(li);
            });
        });
}

loadTasks();

function addTask(){
    const input = document.getElementById('taskInput');
    const title = input.value.trim(); //reducing unwanted space in fornt and back
    if(!title)
    {
        alert('Please enter a task !');
        return;
    }
    fetch(`${API}/tasks` , {
        method : 'POST',
        headers : {'Content-Type' : 'application/json'},
        body : JSON.stringify({title : title })
    })
        .then(res => res.json())
        .then(() => {
            input.value = '';
            loadTasks();
        });


}