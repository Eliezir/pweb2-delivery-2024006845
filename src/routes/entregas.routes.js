import { Router } from "express";

export function criarRotasEntregas(entregasController) {
  const router = Router();

  router.post("/", (req, res) => {
    return entregasController.criar(req, res);
  });

  router.get("/", (req, res) => {
    return entregasController.listar(req, res);
  });

  router.get("/:id", (req, res) => {
    return entregasController.buscarPorId(req, res);
  });

  router.patch("/:id/avancar", (req, res) => {
    return entregasController.avancar(req, res);
  });

  router.patch("/:id/cancelar", (req, res) => {
    return entregasController.cancelar(req, res);
  });

  router.get("/:id/historico", (req, res) => {
    return entregasController.exibirHistorico(req, res);
  });

  router.patch("/:id/atribuir", (req, res) => {
    return entregasController.atribuir(req, res);
  });

  return router;
}
