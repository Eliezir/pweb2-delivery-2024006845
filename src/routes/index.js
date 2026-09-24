import { Router } from "express";
import { Database } from "../database/Database.js";
import { EntregasController } from "../controllers/EntregasController.js";
import { EntregasService } from "../services/EntregasService.js";
import { EntregasRepository } from "../repositories/EntregasRepository.js";

export function criarRotas() {
  const router = Router();

  const database = new Database();
  const entregasRepository = new EntregasRepository(database);
  const entregasService = new EntregasService(entregasRepository);
  const entregasController = new EntregasController(entregasService);

  router.post("/entregas", (req, res) => {
    return entregasController.criar(req, res);
  });

  return router;
}
