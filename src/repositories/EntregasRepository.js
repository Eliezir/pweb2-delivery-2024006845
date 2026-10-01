export class EntregasRepository {
  constructor(database) {
    this.database = database;
  }

  criar(dados) {
    const entrega = { id: this.database.proximoId(), ...dados };
    this.database.entregas.push(entrega);
    return entrega;
  }

  listarTodos(filtros = {}) {
    return this.database.entregas.filter(
      (entrega) =>
        (filtros.status === undefined || entrega.status === filtros.status) &&
        (filtros.motoristaId === undefined ||
          entrega.motoristaId === filtros.motoristaId),
    );
  }

  buscarPorId(id) {
    return this.database.entregas.find((entrega) => entrega.id === id) || null;
  }

  atualizar(id, dados) {
    const index = this.database.entregas.findIndex(
      (entrega) => entrega.id === id,
    );
    if (index === -1) return null;

    this.database.entregas[index] = {
      ...this.database.entregas[index],
      ...dados,
      id,
    };
    return this.database.entregas[index];
  }
}
