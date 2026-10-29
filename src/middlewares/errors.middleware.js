import { AppError } from '../utils/AppError.js';

export const naoEncontrado = (req, res) => {
  res.status(404).render('erros/404', {
    titulo: 'Página não encontrada',
    mensagem: `A página "${req.path}" não existe.`,
  });
};

export const middlewareDeErros = (err, _req, res, next) => {
  if (res.headersSent) return next(err);

  if (err instanceof AppError) {
    if (err.statusCode === 404) {
      return res.status(404).render('erros/404', {
        titulo: 'Não encontrado',
        mensagem: err.message,
      });
    }

    return res.status(err.statusCode).render('erros/erro', {
      titulo: 'Erro',
      codigo: err.statusCode,
      mensagem: err.message,
    });
  }

  console.error(err);
  res.status(500).render('erros/erro', {
    titulo: 'Erro interno',
    codigo: 500,
    mensagem: 'Ocorreu um erro inesperado. Tente novamente.',
  });
};
