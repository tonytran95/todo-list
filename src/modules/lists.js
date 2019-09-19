function List(name, date) {
    this.name = name;
    this.date = date;
    this.lastChanged = date;
    this.tasks = [];
}

export { List };
