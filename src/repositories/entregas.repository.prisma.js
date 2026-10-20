import { prisma } from "../config/database.js";

/**
 * @typedef {Object} Entrega
 * @property {number} id
 * @property {string} descricao
 * @property {string} origem
 * @property {string} destino
 * @property {"CRIADA"|"EM_TRANSITO"|"ENTREGUE"|"CANCELADA"} status
 * @property {number|null} motoristaId  Preenchido quando há atribuição.
 * @property {{ data: string, descricao: string }[]} historico
 */

// Eventos sempre vêm em ordem de criação.
const incluirHistorico = { historico: { orderBy: { id: "asc" } } };

const paraEvento = (evento) => ({
  data: new Date(evento.data),
  descricao: evento.descricao,
});

// Converte o registro do Prisma para o formato do contrato (historico como
// array de { data (ISO), descricao }, sem ids internos dos eventos).
const paraEntrega = (registro) => {
  if (!registro) return null;
  const { historico, ...campos } = registro;
  return {
    ...campos,
    historico: historico.map((evento) => ({
      data: evento.data.toISOString(),
      descricao: evento.descricao,
    })),
  };
};

/**
 * Repositório de Entregas (persistência com Prisma + SQLite).
 *
 * Mesmo contrato (IEntregasRepository) da versão em memória, agora assíncrono:
 *   listarTodos(filtros?) → Promise<Entrega[]>
 *   buscarPorId(id)       → Promise<Entrega | null>
 *   criar(dados)          → Promise<Entrega>
 *   atualizar(id, dados)  → Promise<Entrega | null>
 */
export class EntregasRepositoryPrisma {
  /**
   * Persiste uma nova entrega e os eventos do seu histórico.
   * @param {Omit<Entrega, "id">} dados
   * @returns {Promise<Entrega>} A entrega criada (com id).
   */
  async criar(dados) {
    const { historico = [], ...campos } = dados;
    const registro = await prisma.entrega.create({
      data: { ...campos, historico: { create: historico.map(paraEvento) } },
      include: incluirHistorico,
    });
    return paraEntrega(registro);
  }

  /**
   * Lista as entregas. Filtros ausentes são ignorados; os presentes são
   * combinados (AND).
   * @param {{ status?: string, motoristaId?: number }} [filtros]
   * @returns {Promise<Entrega[]>}
   */
  async listarTodos(filtros = {}) {
    const where = {};
    if (filtros.status !== undefined) where.status = filtros.status;
    if (filtros.motoristaId !== undefined)
      where.motoristaId = filtros.motoristaId;

    const registros = await prisma.entrega.findMany({
      where,
      include: incluirHistorico,
      orderBy: { id: "asc" },
    });
    return registros.map(paraEntrega);
  }

  /**
   * Busca uma entrega pelo id.
   * @param {number} id
   * @returns {Promise<Entrega|null>} A entrega, ou null se não existir.
   */
  async buscarPorId(id) {
    const registro = await prisma.entrega.findUnique({
      where: { id },
      include: incluirHistorico,
    });
    return paraEntrega(registro);
  }

  /**
   * Atualiza só os campos informados (os demais são mantidos). Os eventos do
   * histórico que ainda não foram gravados são criados; os existentes nunca
   * são recriados.
   * @param {number} id
   * @param {Partial<Omit<Entrega, "id">>} dados
   * @returns {Promise<Entrega|null>} A entrega atualizada, ou null se não existir.
   */
  async atualizar(id, dados) {
    const { id: _ignorado, historico, ...campos } = dados;

    const registro = await prisma.$transaction(async (tx) => {
      const existente = await tx.entrega.findUnique({
        where: { id },
        include: { _count: { select: { historico: true } } },
      });
      if (!existente) return null;

      const novos = (historico ?? []).slice(existente._count.historico);

      return tx.entrega.update({
        where: { id },
        data: { ...campos, historico: { create: novos.map(paraEvento) } },
        include: incluirHistorico,
      });
    });

    return paraEntrega(registro);
  }
}
