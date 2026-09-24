export class EntregasRepository {
  constructor(database) {
    this.database = database;
  }

  criar(dados) {
    const entrega = { id: this.database.proximoId(), ...dados };
    this.database.entregas.push(entrega);
    return entrega;
  }


  buscarDuplicataPorStatus(dados, statusPermitidos) {
    return this.database.entregas.find(
      (entrega) =>
        entrega.descricao === dados.descricao &&
        entrega.origem === dados.origem &&
        entrega.destino === dados.destino &&
        statusPermitidos.includes(entrega.status)
    );
  }

  listar() {
    return this.database.entregas;
  }

  listarPorStatus(status) {
    return this.database.entregas.filter(
      (entrega) => entrega.status === status,
    );
  }

  buscarPorId(id) {
    return this.database.entregas.find((entrega) => entrega.id === id);
  }
}
