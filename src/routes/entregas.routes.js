import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";
import {
  validarNovaEntrega,
  verificarValidacao,
} from "../middlewares/validacao.middleware.js";

export function criarRotasEntregas(entregasController) {
  const router = Router();

  router.param("id", (req, res, next, id) => {
    if (!Number.isInteger(Number(id))) {
      return next(new AppError("Entrega não encontrada", 404));
    }
    next();
  });

  router.post(
    "/",
    validarNovaEntrega,
    verificarValidacao("entregas/nova", "Nova Entrega"),
    asyncHandler((req, res) => entregasController.criar(req, res)),
  );

  router.get(
    "/",
    asyncHandler((req, res) => entregasController.listar(req, res)),
  );

  router.get(
    "/nova",
    asyncHandler((req, res) => entregasController.formNova(req, res)),
  );

  router.get(
    "/:id",
    asyncHandler((req, res) => entregasController.buscarPorId(req, res)),
  );

  router.patch(
    "/:id/avancar",
    asyncHandler((req, res) => entregasController.avancar(req, res)),
  );

  router.patch(
    "/:id/cancelar",
    asyncHandler((req, res) => entregasController.cancelar(req, res)),
  );

  router.get(
    "/:id/historico",
    asyncHandler((req, res) => entregasController.exibirHistorico(req, res)),
  );

  router.patch(
    "/:id/atribuir",
    asyncHandler((req, res) => entregasController.atribuir(req, res)),
  );

  return router;
}
