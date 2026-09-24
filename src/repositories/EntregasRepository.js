
export class EntregasRepository {
    constructor(database) {
        this.database = database;
    }

    criar(entrega) {
        entrega.id = this.database.proximoId();
        this.database.entregas.push(entrega);
        return entrega;
    }
}