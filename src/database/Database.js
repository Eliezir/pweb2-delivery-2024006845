export class Database {
    constructor() {
        this.entregas = [];
        this.motoristas = [];
        this.contadorId = 1;
    }

    proximoId() {
        return this.contadorId++;
    }
}

