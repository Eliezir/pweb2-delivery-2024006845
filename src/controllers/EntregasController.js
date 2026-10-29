import { AppError } from '../utils/AppError.js';

export class EntregasController {
  constructor(entregasService, motoristasService) {
    this.entregasService = entregasService;
    this.motoristasService = motoristasService;
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
    const motoristas = await this.motoristasService.listar();
    return res.render('entregas/detalhe', {
      titulo: `Entrega #${entrega.id}`,
      entrega,
      motoristas,
    });
  }

  // Executa uma ação de estado, avisa com flash e volta para o detalhe (PRG).
  async executarAcao(req, res, acao, mensagem) {
    const id = Number(req.params.id);

    try {
      await acao(id);
      req.flash('sucesso', mensagem);
    } catch (err) {
      // Erro de regra (ex.: 422): mostra como mensagem na tela.
      if (!(err instanceof AppError) || err.statusCode >= 500) throw err;
      req.flash('erro', err.message);
    }

    return res.redirect(`/entregas/${id}`);
  }

  async avancar(req, res) {
    return this.executarAcao(
      req,
      res,
      (id) => this.entregasService.avancar(id),
      'Status da entrega atualizado.',
    );
  }

  async cancelar(req, res) {
    return this.executarAcao(
      req,
      res,
      (id) => this.entregasService.cancelar(id),
      'Entrega cancelada.',
    );
  }

  async exibirHistorico(req, res) {
    const id = Number(req.params.id);
    const historico = await this.entregasService.exibirHistorico(id);
    return res.json(historico);
  }

  async atribuir(req, res) {
    return this.executarAcao(
      req,
      res,
      (id) => this.entregasService.atribuir(id, req.body.motoristaId),
      'Motorista atribuído com sucesso.',
    );
  }
}
