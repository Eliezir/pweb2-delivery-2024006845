import { AppError } from "../utils/AppError.js";

export class MotoristasService {
  constructor(motoristasRepository) {
    this.motoristasRepository = motoristasRepository;
  }

  criar(nome, cpf, placaVeiculo) {
    if (!nome || !cpf)
      throw new AppError("Os campos nome e cpf são obrigatorios", 400);

    const motoristaExistente = this.motoristasRepository.buscarPorCpf(cpf);
    if (motoristaExistente)
      throw new AppError("Motorista com este CPF já existe.", 409);

    const novoMotorista = {
      nome,
      cpf,
      status: "ATIVO",
      placaVeiculo: placaVeiculo || null,
    };

    return this.motoristasRepository.criar(novoMotorista);
  }
}
