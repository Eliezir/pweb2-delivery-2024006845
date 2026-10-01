import { Router } from "express";

export function criarRotasMotoristas(motoristasController) {
  const router = Router();

  router.post("/", (req, res) => {
    return motoristasController.criar(req, res);
  });

  router.get("/", (req, res) => {
    return motoristasController.listar(req, res);
  });

  router.get("/:id", (req, res) => {
    return motoristasController.buscarPorId(req, res);
  });

    router.get("/:id/entregas", (req, res) => {
    return motoristasController.listarEntregas(req, res);
  });

  return router;
}
