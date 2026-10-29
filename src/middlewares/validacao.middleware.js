import { body, validationResult } from 'express-validator';

export const validarNovaEntrega = [
  body('descricao').trim().notEmpty().withMessage('A descrição é obrigatória.'),
  body('origem').trim().notEmpty().withMessage('A origem é obrigatória.'),
  body('destino').trim().notEmpty().withMessage('O destino é obrigatório.'),
];

export const verificarValidacao = (view, titulo) => (req, res, next) => {
  const resultado = validationResult(req);
  if (resultado.isEmpty()) return next();

  return res.status(400).render(view, {
    titulo,
    dados: req.body,
    erros: resultado.array().map((erro) => erro.msg),
  });
};
