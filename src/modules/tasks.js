function Task(description, date) {
    this.description = description;
    this.date = date;
    this.lastChanged = date;
    this.checked = false;
}

export { Task };
