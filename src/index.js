import { getTime } from 'date-fns';
import { List } from './modules/lists.js';
import { Task } from './modules/tasks.js';

Storage.prototype.getLists = function() {
    return JSON.parse(localStorage.lists);
};

Storage.prototype.setLists = function(lists) {
    this.lists = JSON.stringify(lists);
}

localStorage.clear();

const controller = (() => {
    const container = document.querySelector('#container');
    const lists = (localStorage.lists) ? localStorage.getLists() : [];
    if (lists.length === 0) lists.push(new List("New List...", new Date()));
    lists.forEach((list) => {
        const listDiv = document.createElement('div');
        listDiv.textContent = list.name;
        list.tasks.forEach((task) => {
            const taskDiv = document.createElement('div');
            taskDiv.textContent = task.description;
            listDiv.appendChild(taskDiv);
        });
        container.appendChild(listDiv);
    });
    const newListButton = document.createElement('button');
    newListButton.textContent = "New List";
    newListButton.addEventListener('click', () => {
        const newList = new List("New List...", new Date());
        lists.push(newList);
        const newListDiv = document.createElement('div');
        newListDiv.textContent = newList.name;
        container.appendChild(newListDiv);
        localStorage.setLists(lists);
    });
    container.appendChild(newListButton);
})();
