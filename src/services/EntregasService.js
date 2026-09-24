export class EntregasService {
  constructor(entregasRepository) {
    this.entregasRepository = entregasRepository;
  }

  criar(descricao, origem, destino) {
    const entrega = {
      descricao,
      origem,
      destino,
      status: "CRIADA",
      motoristaId: null,
      historico: [
        { data: new Date().toISOString(), descricao: "Entrega criada" },
      ],
    };

    return this.entregasRepository.criar(entrega);
  }
}
