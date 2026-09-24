export class Database {
    constructor() {
        this.deliveries = [];
        this.idCounter = 1;
    }

    nextId() {
        return this.idCounter++;
    }
}

