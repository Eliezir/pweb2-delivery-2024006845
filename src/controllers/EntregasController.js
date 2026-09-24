export class EntregasController {
  constructor(entregasService) {
    this.entregasService = entregasService;
  }

  criar(req, res) {
    const { descricao, origem, destino } = req.body;

    const entrega = this.entregasService.criar(descricao, origem, destino);

    return res.status(201).json(entrega);
  }

  listar(_req, res) {
    const entregas = this.entregasService.listar();
    return res.json(entregas);
  }

}