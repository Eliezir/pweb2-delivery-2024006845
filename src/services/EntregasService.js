import { AppError } from "../utils/AppError.js";

export class EntregasService {
  constructor(entregasRepository, motoristasRepository) {
    this.entregasRepository = entregasRepository;
    this.motoristasRepository = motoristasRepository;
  }

  criar(descricao, origem, destino) {
    if (!descricao || !origem || !destino)
      throw new AppError("Todos os campos são obrigatórios.", 400);

    if (origem === destino)
      throw new AppError("A origem e o destino não podem ser iguais.", 400);

      const duplicada = this.entregasRepository
        .listarTodos()
        .some(
          (entrega) =>
            entrega.descricao === descricao &&
            entrega.origem === origem &&
            entrega.destino === destino &&
            ["CRIADA", "EM_TRANSITO"].includes(entrega.status),
        );
      if (duplicada)
        throw new AppError("Já existe uma entrega com os mesmos dados.", 409);

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
    return this.entregasRepository.listarTodos({ status });
  }
  buscarPorId(id) {
    const entrega = this.entregasRepository.buscarPorId(id);
    if (!entrega) throw new AppError("Entrega não encontrada", 404);
    return entrega;
  }

  avancar(id) {
    const entrega = this.buscarPorId(id);

    const proximoStatus = {
      CRIADA: "EM_TRANSITO",
      EM_TRANSITO: "ENTREGUE",
    }[entrega.status];

    if (!proximoStatus) throw new AppError("transição de status inválida", 422);

    entrega.status = proximoStatus;
    entrega.historico.push({
      data: new Date().toISOString(),
      descricao: `Status alterado para ${entrega.status}`,
    });

    return this.entregasRepository.atualizar(id, entrega);
  }

  cancelar(id) {
    const entrega = this.buscarPorId(id);

    if (entrega.status === "ENTREGUE" || entrega.status === "CANCELADA")
      throw new AppError(
        "Não é possível cancelar uma entrega já entregue ou cancelada",
        422,
      );

    entrega.status = "CANCELADA";
    entrega.historico.push({
      data: new Date().toISOString(),
      descricao: "Entrega cancelada",
    });

    return this.entregasRepository.atualizar(id, entrega);
  }

  exibirHistorico(id) {
    const entrega = this.buscarPorId(id);
    return entrega.historico;
  }

  atribuir(id, motoristaId) {
    const entrega = this.buscarPorId(id);

    if (!motoristaId)
      throw new AppError("O campo motoristaId é obrigatório.", 400);

    const motorista = this.motoristasRepository.buscarPorId(
      Number(motoristaId),
    );
    if (!motorista) throw new AppError("Motorista não encontrado", 404);

    if (entrega.status !== "CRIADA")
      throw new AppError(
        "Só é possível atribuir motorista a entregas CRIADAS",
        422,
      );

    if (motorista.status !== "ATIVO")
      throw new AppError("Não é possível atribuir um motorista INATIVO", 422);

    entrega.motoristaId = motorista.id;
    entrega.historico.push({
      data: new Date().toISOString(),
      descricao: `Motorista ${motorista.nome} atribuído`,
    });

    return this.entregasRepository.atualizar(id, entrega);
  }
}
