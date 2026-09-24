export class Database {
    constructor() {
        this.entregas = [];
        this.contadorId = 1;
    }

    proximoId() {
        return this.contadorId++;
    }
}

