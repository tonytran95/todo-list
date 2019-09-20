import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getTime } from 'date-fns';
import { List } from './modules/lists.js';
import { Task } from './modules/tasks.js';

Storage.prototype.getLists = function() {
    return JSON.parse(localStorage.lists);
};

Storage.prototype.save = function(lists) {
    this.lists = JSON.stringify(lists);
}

//localStorage.clear();

const controller = (() => {
    let lists = (localStorage.lists) ? localStorage.getLists() : [];
    if (lists.length === 0) lists.push(new List("New List...", new Date()));

    const drawLists = () => {
        const listsDiv = document.querySelector('.todo-lists');
        listsDiv.innerHTML = '';
        lists.forEach((list) => {
            const listDiv = document.createElement('div');
            const listId = lists.indexOf(list);
            listDiv.classList.add('todo-list');
            if (listId === 0) {
                listDiv.classList.add('active');
                drawTasks(list);
            }
            listDiv.textContent = list.name;
            listDiv.setAttribute('data-id', listId);
            listDiv.addEventListener('click', () => {
                const activeList = document.querySelector('.todo-list.active');
                activeList.classList.remove('active');
                listDiv.classList.add('active');
                drawTasks(lists[listId]);
            });
            listsDiv.appendChild(listDiv);
        });
    };

    const drawTasks = (list) => {
        const tasksDiv = document.querySelector('.todo-tasks');
        tasksDiv.innerHTML = '';
        list.tasks.forEach((task) => {
            const taskDiv = document.createElement('div');
            taskDiv.classList.add('todo-task');
            taskDiv.textContent = task.description;
            tasksDiv.appendChild(taskDiv);
        });
    };

    const newListButton = document.querySelector('.todo-btn-new-list');
    newListButton.addEventListener('click', () => {
        const newList = new List("New List...", new Date());
        lists.push(newList);
        localStorage.save(lists);
        drawLists();
    });

    const newTaskButton = document.querySelector('.todo-btn-new-task');
    newTaskButton.addEventListener('click', () => {
        const activeList = document.querySelector('.todo-list.active');
        const newTask = new Task("New Task...", new Date());
        lists[activeList.dataset.id].tasks.push(newTask);
        localStorage.save(lists);
        drawTasks(lists[activeList.dataset.id]);
    });

    const clearButton = document.querySelector('.todo-btn-clear');
    clearButton.addEventListener('click', () => {
        lists = [];
        lists.push(new List("New List...", new Date()));
        localStorage.clear();
        localStorage.save(lists);
        drawLists();
    });

    drawLists();
})();
