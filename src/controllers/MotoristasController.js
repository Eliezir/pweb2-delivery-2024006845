export class MotoristasController {
  constructor(motoristasService) {
    this.motoristasService = motoristasService;
  }

  async criar(req, res) {
    const { nome, cpf, placaVeiculo } = req.body;

    const motorista = await this.motoristasService.criar(nome, cpf, placaVeiculo);

    return res.status(201).json(motorista);
  }

  async listar(_req, res) {
    const motoristas = await this.motoristasService.listar();
    return res.json(motoristas);
  }

  async listarEntregas(req, res) {
    const id = Number(req.params.id);
    return res.json(
      await this.motoristasService.listarEntregas(id, req.query.status),
    );
  }

  async buscarPorId(req, res) {
    const id = Number(req.params.id);
    const motorista = await this.motoristasService.buscarPorId(id);
    return res.json(motorista);
  }
}
