export class EntregasController {
  constructor(entregasService) {
    this.entregasService = entregasService;
  }

  criar(req, res) {
    const { descricao, origem, destino } = req.body;

    const entrega = this.entregasService.criar(descricao, origem, destino);

    return res.status(201).json(entrega);
  }

  listar(req, res) {
    const entregas = this.entregasService.listar(req.query.status);
    return res.json(entregas);
  }

  buscarPorId(req, res) {
    const id = Number(req.params.id);
    const entrega = this.entregasService.buscarPorId(id);
    return res.json(entrega);
  }
}
