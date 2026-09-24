export class EntregasRepository {
  constructor(database) {
    this.database = database;
  }

  criar(dados) {
    const entrega = { id: this.database.proximoId(), ...dados };
    this.database.entregas.push(entrega );
    return entrega;
  }

  listar() {
    return this.database.entregas;
  }

  listarPorStatus(status) {
    return this.database.entregas.filter(entrega => entrega.status === status);
  }

  buscarPorId(id) {
    return this.database.entregas.find(entrega => entrega.id === id);
  }
}