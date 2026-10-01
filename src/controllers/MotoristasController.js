export class MotoristasController {
  constructor(motoristasService) {
    this.motoristasService = motoristasService;
  }

  criar(req, res) {
    const { nome, cpf, placaVeiculo } = req.body;

    const motorista = this.motoristasService.criar(nome, cpf, placaVeiculo);

    return res.status(201).json(motorista);
  }

  listar(_req, res) {
    const motoristas = this.motoristasService.listar();
    return res.json(motoristas);
  }

  listarEntregas(req, res) {
    const id = Number(req.params.id);
    return res.json(
      this.motoristasService.listarEntregas(id, req.query.status),
    );
  }

  buscarPorId(req, res) {
    const id = Number(req.params.id);
    const motorista = this.motoristasService.buscarPorId(id);
    return res.json(motorista);
  }
}
