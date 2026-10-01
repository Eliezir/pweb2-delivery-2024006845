export class MotoristasRepository {
  constructor(database) {
    this.database = database;
  }

  criar(dados) {
    const motorista = {
      id: this.database.proximoId(),
      ...dados,
    };

    this.database.motoristas.push(motorista);
    return motorista;
  }

  buscarPorCpf(cpf) {
    return this.database.motoristas.find((motorista) => motorista.cpf === cpf) || null;
  }
}
