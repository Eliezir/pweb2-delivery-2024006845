import { Router } from "express";

export function criarRotasMotoristas(motoristasController) {
  const router = Router();

  router.post("/", (req, res) => {
    return motoristasController.criar(req, res);
  });

  return router;
}
