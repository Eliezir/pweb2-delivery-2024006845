import { Router } from "express";
import { EntregasController } from "../controllers/EntregasController.js";
import { EntregasService } from "../services/EntregasService.js";
import { EntregasRepositoryPrisma } from "../repositories/entregas.repository.prisma.js";
import { criarRotasEntregas } from "./entregas.routes.js";
import { criarRotasMotoristas } from "./motoristas.routes.js";
import { MotoristasController } from "../controllers/MotoristasController.js";
import { MotoristasService } from "../services/MotoristasService.js";
import { MotoristasRepositoryPrisma } from "../repositories/motoristas.repository.prisma.js";

export function criarRotas() {
  const router = Router();

  const entregasRepository = new EntregasRepositoryPrisma();
  const motoristasRepository = new MotoristasRepositoryPrisma();
  const entregasService = new EntregasService(entregasRepository, motoristasRepository);
  const motoristasService = new MotoristasService(motoristasRepository, entregasRepository);
  const entregasController = new EntregasController(entregasService, motoristasService);
  const motoristasController = new MotoristasController(motoristasService);

  router.use("/entregas", criarRotasEntregas(entregasController));
  router.use("/motoristas", criarRotasMotoristas(motoristasController));

  return router;
}
