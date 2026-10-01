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

  avancar(req, res) {
    const id = Number(req.params.id);
    const entregaAtualizada = this.entregasService.avancar(id);
    return res.json(entregaAtualizada);
  }

  cancelar(req, res) {
    const id = Number(req.params.id);
    const entregaAtualizada = this.entregasService.cancelar(id);
    return res.json(entregaAtualizada);
  }

  exibirHistorico(req, res) {
    const id = Number(req.params.id);
    const historico = this.entregasService.exibirHistorico(id);
    return res.json(historico);
  }

  atribuir(req, res) {
    const id = Number(req.params.id);
    const entrega = this.entregasService.atribuir(id, req.body.motoristaId);
    return res.json(entrega);
  }
}
