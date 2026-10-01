import { AppError } from "../utils/AppError.js";

export class MotoristasService {
  constructor(motoristasRepository, entregasRepository) {
    this.motoristasRepository = motoristasRepository;
    this.entregasRepository = entregasRepository;
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

  listar() {
    return this.motoristasRepository.listarTodos();
  }

  listarEntregas(id, status) {
    const motorista = this.buscarPorId(id);
    return this.entregasRepository.listarTodos({
      motoristaId: motorista.id,
      status,
    });
  }

  
  buscarPorId(id) {
    const motorista = this.motoristasRepository.buscarPorId(id);
    if (!motorista) throw new AppError("Motorista não encontrado", 404);
    return motorista;
  }
}
