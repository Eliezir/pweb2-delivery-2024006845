import { AppError } from '../utils/AppError.js';

export class MotoristasController {
  constructor(motoristasService) {
    this.motoristasService = motoristasService;
  }

  async criar(req, res) {
    const { nome, cpf, placaVeiculo } = req.body;

    try {
      await this.motoristasService.criar(nome, cpf, placaVeiculo);
    } catch (err) {
      if (err instanceof AppError && err.statusCode < 500) {
        return res.status(err.statusCode).render('motoristas/novo', {
          titulo: 'Novo Motorista',
          dados: req.body,
          erros: [err.message],
        });
      }
      throw err;
    }

    req.flash('sucesso', 'Motorista cadastrado com sucesso!');
    return res.redirect('/motoristas');
  }

  async listar(_req, res) {
    const motoristas = await this.motoristasService.listar();
    return res.render('motoristas/index', { titulo: 'Motoristas', motoristas });
  }

  async formNovo(_req, res) {
    return res.render('motoristas/novo', { titulo: 'Novo Motorista', dados: {}, erros: [] });
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
