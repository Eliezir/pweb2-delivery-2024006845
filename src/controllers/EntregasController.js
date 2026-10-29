import { AppError } from '../utils/AppError.js';

export class EntregasController {
  constructor(entregasService) {
    this.entregasService = entregasService;
  }

  async criar(req, res) {
    const { descricao, origem, destino } = req.body;

    try {
      await this.entregasService.criar(descricao, origem, destino);
    } catch (err) {
      if (err instanceof AppError && err.statusCode < 500) {
        return res.status(err.statusCode).render('entregas/nova', {
          titulo: 'Nova Entrega',
          dados: req.body,
          erros: [err.message],
        });
      }
      throw err;
    }

    req.flash('sucesso', 'Entrega criada com sucesso!');
    return res.redirect('/entregas');
  }

  async listar(req, res) {
    const status = req.query.status || undefined;
    const entregas = await this.entregasService.listar(status);
    return res.render('entregas/index', { titulo: 'Entregas', entregas, status });
  }

  async formNova(_req, res) {
    return res.render('entregas/nova', { titulo: 'Nova Entrega', dados: {}, erros: [] });
  }

  async buscarPorId(req, res) {
    const id = Number(req.params.id);
    const entrega = await this.entregasService.buscarPorId(id);
    return res.json(entrega);
  }

  async avancar(req, res) {
    const id = Number(req.params.id);
    const entregaAtualizada = await this.entregasService.avancar(id);
    return res.json(entregaAtualizada);
  }

  async cancelar(req, res) {
    const id = Number(req.params.id);
    const entregaAtualizada = await this.entregasService.cancelar(id);
    return res.json(entregaAtualizada);
  }

  async exibirHistorico(req, res) {
    const id = Number(req.params.id);
    const historico = await this.entregasService.exibirHistorico(id);
    return res.json(historico);
  }

  async atribuir(req, res) {
    const id = Number(req.params.id);
    const entrega = await this.entregasService.atribuir(id, req.body.motoristaId);
    return res.json(entrega);
  }
}
