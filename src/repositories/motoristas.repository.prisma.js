import { prisma } from "../config/database.js";

/**
 * Repositório de Motoristas (persistência com Prisma + SQLite).
 *
 * Mesmo contrato (IMotoristasRepository) da versão em memória, agora assíncrono:
 *   listarTodos()     → Promise<Motorista[]>
 *   buscarPorId(id)   → Promise<Motorista | null>
 *   buscarPorCpf(cpf) → Promise<Motorista | null>
 *   criar(dados)      → Promise<Motorista>
 */
export class MotoristasRepositoryPrisma {
  /**
   * Persiste um novo motorista. O id é gerado pelo banco.
   * @param {Omit<Motorista, "id">} dados
   * @returns {Promise<Motorista>} O motorista criado (com id).
   */
  async criar(dados) {
    return prisma.motorista.create({ data: dados });
  }

  /**
   * Busca um motorista pelo CPF.
   * @param {string} cpf
   * @returns {Promise<Motorista|null>} O motorista, ou null se não existir.
   */
  async buscarPorCpf(cpf) {
    return prisma.motorista.findUnique({ where: { cpf } });
  }

  /**
   * Lista todos os motoristas.
   * @returns {Promise<Motorista[]>}
   */
  async listarTodos() {
    return prisma.motorista.findMany({ orderBy: { id: "asc" } });
  }

  /**
   * Busca um motorista pelo id.
   * @param {number} id
   * @returns {Promise<Motorista|null>} O motorista, ou null se não existir.
   */
  async buscarPorId(id) {
    return prisma.motorista.findUnique({ where: { id } });
  }
}
