const API = 'http://localhost:3000/api';

function login() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    if(!username || !password)
    {
        document.getElementById('message').textContent = "Please fill up all the field !";
        return;
    }
    fetch(`${API}/auth/login` , {
        method : 'POST',
        headers : {'Content-type' : 'application/json'},
        body : JSON.stringify({username, password})

    })
        .then(res => res.json())
        .then(data => {
            if(data.token)
            {
                localStorage.setItem('token',data.token);
                document.getElementById('authSection').style.display = 'none';
                document.getElementById('taskSection').style.display = 'block';
                document.getElementById('loginUsername').value = '';
                document.getElementById('loginPassword').value = '';
                loadTasks();
            }
            else
            {
                document.getElementById('message').textContent = data.error;
            }
        });
}

function register()
{
    const username = document.getElementById('regUsername').value.trim();
    const password = document.getElementById('regPassword').value.trim();
    if(!username || !password)
    {
        document.getElementById('message').textContent = 'Please fill up all the field !'
        return;
    }
    fetch(`${API}/auth/register`, {
        method : 'POST',
        headers : {'Content-type' : 'application/json'},
        body : JSON.stringify({username, password})
    })
        .then(res => res.json())
        .then(data => {
            if(data.message) {
                document.getElementById('message').textContent = 'Registration Successful ! please login.';
                document.getElementById('regUsername').value ='';
                document.getElementById('regPassword').value ='';
                showLogin();

            }
            else
            {
                document.getElementById('message').textContent = data.error;
            }
        });


}

function showLogin() {
    document.getElementById('loginForm').style.display = 'block'; //show
    document.getElementById('registerForm').style.display = 'none'; //hide    
}

function showRegister() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
}

function logout() {
    localStorage.removeItem('token');
    document.getElementById('taskSection').style.display = 'none';
    document.getElementById('authSection').style.display = 'block';
}

function loadTasks() {
    fetch(`${API}/tasks` , {
       headers : { 
            'Authorization' : `Bearer ${localStorage.getItem('token')}`
        }
    })
        .then(res => res.json())
        .then(tasks => {
            const taskList = document.getElementById('taskList');
            taskList.innerHTML = '';
            tasks.forEach(tasks => {
                const li = document.createElement('li');
                li.textContent = tasks.title;

                if(tasks.done)
                {
                    li.style.textDecoration = 'line-through';
                }

                const doneBtn = document.createElement('button');
                doneBtn.textContent = 'Done';
                doneBtn.className = 'done-btn';
                doneBtn.onclick = () => markDone(tasks.id);

                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Delete';
                deleteBtn.className = 'delete-btn';
                deleteBtn.onclick = () => deleteTask(tasks.id); 

                li.appendChild(doneBtn);
                li.appendChild(deleteBtn);
                taskList.appendChild(li);
            });
        });
}

function addTask(){
    const input = document.getElementById('taskInput');
    const title = input.value.trim(); 
    if(!title)
    {
        alert('Please enter a task !');
        return;
    }
    fetch(`${API}/tasks` , {
        method : 'POST',
        headers : {'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${localStorage.getItem('token')}`},
        body : JSON.stringify({title : title })
    })
        .then(res => res.json())
        .then(() => {
            input.value = '';
            loadTasks();
        });
        

}

function deleteTask(id){
        fetch(`${API}/tasks/${id}`, {
            method : 'DELETE',
            headers: {
                'Authorization' : `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => res.json())
        .then(() => {
            loadTasks();
        });
}

function markDone(id){
    fetch(`${API}/tasks/${id}` , {
        method : 'PUT',
        headers : {
             'Authorization' : `Bearer ${localStorage.getItem('token')}`
        }
    })
        .then(res => res.json())
        .then(() => {
            loadTasks();
        });
}