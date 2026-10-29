import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";
import {
  validarNovoMotorista,
  verificarValidacao,
} from "../middlewares/validacao.middleware.js";

export function criarRotasMotoristas(motoristasController) {
  const router = Router();

  router.param("id", (_req, _res, next, id) => {
    if (!Number.isInteger(Number(id))) {
      return next(new AppError("Motorista não encontrado", 404));
    }
    next();
  });

  router.post(
    "/",
    validarNovoMotorista,
    verificarValidacao("motoristas/novo", "Novo Motorista"),
    asyncHandler((req, res) => motoristasController.criar(req, res)),
  );

  router.get(
    "/",
    asyncHandler((req, res) => motoristasController.listar(req, res)),
  );

  router.get(
    "/novo",
    asyncHandler((req, res) => motoristasController.formNovo(req, res)),
  );

  router.get(
    "/:id",
    asyncHandler((req, res) => motoristasController.buscarPorId(req, res)),
  );

  router.get(
    "/:id/entregas",
    asyncHandler((req, res) => motoristasController.listarEntregas(req, res)),
  );

  return router;
}
