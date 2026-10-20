import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";

export function criarRotasMotoristas(motoristasController) {
  const router = Router();

  router.post(
    "/",
    asyncHandler((req, res) => motoristasController.criar(req, res)),
  );

  router.get(
    "/",
    asyncHandler((req, res) => motoristasController.listar(req, res)),
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
