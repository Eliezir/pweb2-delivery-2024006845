export class MotoristasController {
  constructor(motoristasService) {
    this.motoristasService = motoristasService;
  }

  criar(req, res) {
    const { nome, cpf, placaVeiculo } = req.body;

    const motorista = this.motoristasService.criar(nome, cpf, placaVeiculo);

    return res.status(201).json(motorista);
  }
}