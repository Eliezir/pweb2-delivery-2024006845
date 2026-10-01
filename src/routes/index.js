import { Router } from "express";
import { Database } from "../database/Database.js";
import { EntregasController } from "../controllers/EntregasController.js";
import { EntregasService } from "../services/EntregasService.js";
import { EntregasRepository } from "../repositories/EntregasRepository.js";
import { criarRotasEntregas } from "./entregas.routes.js";
import { criarRotasMotoristas } from "./motoristas.routes.js";
import { MotoristasController } from "../controllers/MotoristasController.js";
import { MotoristasService } from "../services/MotoristasService.js";
import { MotoristasRepository } from "../repositories/MotoristasRepository.js";

export function criarRotas() {
  const router = Router();

  const database = new Database();
  const entregasRepository = new EntregasRepository(database);
  const entregasService = new EntregasService(entregasRepository);
  const entregasController = new EntregasController(entregasService);
  const motoristasRepository = new MotoristasRepository(database);
  const motoristasService = new MotoristasService(motoristasRepository, entregasRepository);
  const motoristasController = new MotoristasController(motoristasService);

  router.use("/entregas", criarRotasEntregas(entregasController));
  router.use("/motoristas", criarRotasMotoristas(motoristasController));

  return router;
}
