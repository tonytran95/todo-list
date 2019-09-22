import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import octicons from 'octicons';
import { getTime } from 'date-fns';
import { List } from './modules/lists.js';
import { Task } from './modules/tasks.js';

Storage.prototype.getLists = function() {
    return JSON.parse(localStorage.lists);
};

Storage.prototype.save = function(lists) {
    this.lists = JSON.stringify(lists);
}

const controller = (() => {
    let lists = (localStorage.lists) ? localStorage.getLists() : [];

    const drawLists = (active = 0) => {
        if (lists.length === 0) lists.push(new List("New List...", new Date()));
        const listsDiv = document.querySelector('.todo-lists');
        listsDiv.innerHTML = '';
        lists.forEach((list) => {
            const listDiv = document.createElement('div');
            const listId = lists.indexOf(list);
            listDiv.classList.add('todo-list');
            if (listId === active) {
                listDiv.classList.add('active');
                drawTasks(list);
            }
            listDiv.setAttribute('data-id', listId);
            listDiv.addEventListener('click', () => {
                const activeList = document.querySelector('.todo-list.active');
                activeList.classList.remove('active');
                listDiv.classList.add('active');
                drawTasks(lists[listId]);
                $('#todo-sidebar').collapse('hide');
            });
            const listName = document.createElement('span');
            listName.classList.add('todo-list-name');
            listName.textContent = list.name;
            listDiv.appendChild(listName);
            const listDot = document.createElement('div');
            listDot.classList.add('todo-list-dot');
            listDot.innerHTML = octicons['primitive-dot'].toSVG({ 'width': 16, 'fill': 'currentColor' });
            listDiv.appendChild(listDot);
            listsDiv.appendChild(listDiv);
        });
    };

    const drawTasks = (list = lists[0]) => {
        const listName = document.querySelector('.todo-content-name');
        listName.textContent = list.name;
        const tasksDiv = document.querySelector('.todo-tasks');
        tasksDiv.innerHTML = '';
        list.tasks.forEach((task) => {
            const taskDiv = document.createElement('div');
            taskDiv.classList.add('todo-task');
            const taskId = list.tasks.indexOf(task);
            taskDiv.setAttribute('data-id', taskId);
            const taskDetailsDiv = document.createElement('div');
            taskDetailsDiv.classList.add('todo-task-details');
            const taskCheckbox = document.createElement('button');
            taskCheckbox.classList.add('btn', 'todo-task-checkbox');
            if (task.checked) {
                taskCheckbox.classList.add('btn-checked');
            } else {
                taskCheckbox.classList.add('btn-unchecked');
            }
            taskCheckbox.innerHTML = octicons.check.toSVG({ 'fill': 'white' });
            taskCheckbox.addEventListener('click', () => {
                if (task.checked) {
                    taskCheckbox.classList.remove('btn-checked');
                    taskCheckbox.classList.add('btn-unchecked');
                } else {
                    taskCheckbox.classList.remove('btn-unchecked');
                    taskCheckbox.classList.add('btn-checked');
                }
                task.checked = !task.checked;
                localStorage.save(lists);
            });
            const taskDescription = document.createElement('span');
            taskDescription.classList.add('todo-task-description');
            taskDescription.textContent = task.description;
            const taskButtonsDiv = document.createElement('div');
            taskButtonsDiv.classList.add('todo-task-buttons');
            const taskCopyButton = document.createElement('button');
            taskCopyButton.classList.add('btn', 'btn-light', 'd-none', 'd-sm-block', 'todo-task-btn-copy');
            taskCopyButton.type = 'button';
            taskCopyButton.innerHTML = octicons.clippy.toSVG();
            taskCopyButton.addEventListener('click', () => {
                const selection = window.getSelection();
                const range = document.createRange();
                range.selectNode(taskDescription);
                selection.removeAllRanges();
                selection.addRange(range);
                document.execCommand("copy");
                selection.removeAllRanges();
            });
            const editTaskButton = document.createElement('button');
            editTaskButton.classList.add('btn', 'btn-light', 'todo-task-edit-task');
            editTaskButton.type = 'button';
            editTaskButton.setAttribute('data-toggle', 'modal');
            editTaskButton.setAttribute('data-target', '#editTaskModal');
            editTaskButton.innerHTML = octicons.pencil.toSVG();
            editTaskButton.addEventListener('click', () => {
                taskDiv.classList.add('active');
                document.getElementById('editTaskDescription').placeholder = task.description;
            });
            taskButtonsDiv.appendChild(taskCopyButton);
            taskButtonsDiv.appendChild(editTaskButton);
            taskDiv.appendChild(taskCheckbox);
            taskDiv.appendChild(taskDescription);
            taskDiv.appendChild(taskButtonsDiv);
            tasksDiv.appendChild(taskDiv);
        });
    };

    const editListButton = document.querySelector('.todo-btn-edit-list');
    editListButton.innerHTML = octicons.gear.toSVG({ 'fill': 'currentColor' });
    editListButton.addEventListener('click', () => {
        const activeList = document.querySelector('.todo-list.active');
        const listName = lists[activeList.dataset.id].name;
        const nameInput = document.getElementById('editListName');
        nameInput.placeholder = listName;
    });

    const newListButton = document.querySelector('.todo-btn-list');
    newListButton.innerHTML += octicons.plus.toSVG({ 'fill': 'currentColor' });
    const newTaskButton = document.querySelector('.todo-btn-task');
    newTaskButton.innerHTML = octicons.plus.toSVG({ 'fill': 'currentColor' });

    const saveEdittedListButton = document.querySelector('.todo-btn-save-editted-list');
    saveEdittedListButton.addEventListener('click', () => {
        const activeList = document.querySelector('.todo-list.active');
        let newListName = document.getElementById('editListName').value;
        const validCheck = newListName.replace(/\s*/, '');
        if (validCheck !== '') {
            lists[activeList.dataset.id].name = newListName;
            localStorage.save(lists);
            drawLists(parseInt(activeList.dataset.id));
        }
        document.getElementById('editListName').value = '';
    });

    const saveEdittedTaskButton = document.querySelector('.todo-btn-save-editted-task');
    saveEdittedTaskButton.addEventListener('click', () => {
        const activeList = document.querySelector('.todo-list.active');
        const activeTask = document.querySelector('.todo-task.active');
        let newTaskDescription = document.getElementById('editTaskDescription').value;
        const validCheck = newTaskDescription.replace(/\s*/, '');
        if (validCheck !== '') {
            lists[activeList.dataset.id].tasks[activeTask.dataset.id].description = newTaskDescription;
            localStorage.save(lists);
            drawTasks(lists[activeList.dataset.id]);
        }
        document.getElementById('editTaskDescription').value = '';
    });

    const saveListButton = document.querySelector('.todo-btn-save-list');
    saveListButton.addEventListener('click', () => {
        const activeList = document.querySelector('.todo-list.active');
        let newListName = document.getElementById('listName').value;
        const validCheck = newListName.replace(/\s*/, '');
        if (validCheck === '') newListName = "New List...";
        const newList = new List(newListName, new Date());
        lists.push(newList);
        localStorage.save(lists);
        document.getElementById('listName').value = '';
        drawLists(lists.length - 1);
        drawTasks(lists[lists.length - 1]);
        $('#todo-sidebar').collapse('hide');
    });

    const saveTaskButton = document.querySelector('.todo-btn-save-task');
    saveTaskButton.addEventListener('click', () => {
        const activeList = document.querySelector('.todo-list.active');
        let newTaskDescription = document.getElementById('taskDescription').value;
        const validCheck = newTaskDescription.replace(/\s*/, '');
        if (validCheck === '') newTaskDescription = "New Task...";
        const newTask = new Task(newTaskDescription, new Date());
        lists[activeList.dataset.id].tasks.push(newTask);
        localStorage.save(lists);
        document.getElementById('taskDescription').value = '';
        drawTasks(lists[activeList.dataset.id]);
    });

    const deleteListButton = document.querySelector('.todo-btn-delete-list');
    deleteListButton.addEventListener('click', () => {
        const activeList = document.querySelector('.todo-list.active');
        lists.splice(activeList.dataset.id, 1);
        localStorage.save(lists);
        drawLists();
        drawTasks();
    });
    const deleteTaskButton = document.querySelector('.todo-btn-delete-task');
    deleteTaskButton.addEventListener('click', () => {
        const activeList = document.querySelector('.todo-list.active');
        const activeTask = document.querySelector('.todo-task.active');
        lists[activeList.dataset.id].tasks.splice(activeTask.dataset.id, 1);
        localStorage.save(lists);
        drawTasks();
    });

    const todoToggler = document.querySelector('.todo-toggler');
    todoToggler.addEventListener('click', () => {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    });

    drawLists();
})();

$(document).ready(function() {
    $('#listModal').on('shown.bs.modal', function() {
        $('#listName').focus();
    });
    $('#listName').on('keyup', function(event) {
        if (event.keyCode === 13) document.querySelector('.todo-btn-save-list').click();
    });
    $('#taskModal').on('shown.bs.modal', function() {
        $('#taskDescription').focus();
    })
    $('#taskDescription').on('keyup', function(event) {
        if (event.keyCode === 13) document.querySelector('.todo-btn-save-task').click();
    });
    $('#editListModal').on('shown.bs.modal', function() {
        $('#editListName').focus();
    })
    $('#editListName').on('keyup', function(event) {
        if (event.keyCode === 13) document.querySelector('.todo-btn-save-editted-list').click();
    });
    $('#editTaskModal').on('shown.bs.modal', function() {
        $('#editTaskDescription').focus();
    })
    $('#editTaskDescription').on('keyup', function(event) {
        if (event.keyCode === 13) document.querySelector('.todo-btn-save-editted-task').click();
    });
    $('#editTaskModal').on('hidden.bs.modal', function() {
        const activeTask = document.querySelector('.todo-task.active');
        if (activeTask) activeTask.classList.remove('active');
    });
});
