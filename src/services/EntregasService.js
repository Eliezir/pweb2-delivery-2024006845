import { AppError } from "../utils/AppError.js";

export class EntregasService {
  constructor(entregasRepository) {
    this.entregasRepository = entregasRepository;
  }

  criar(descricao, origem, destino) {
    if (origem === destino)
      throw new AppError("A origem e o destino não podem ser iguais.", 400);

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

  listar(status) {
    return status
      ? this.entregasRepository.listarPorStatus(status)
      : this.entregasRepository.listar();
  }
}
