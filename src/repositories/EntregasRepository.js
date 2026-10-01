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

/**
 * Repositório de Entregas (persistência em memória).
 *
 * Contrato (IEntregasRepository) — os services dependem SÓ destes métodos:
 *   listarTodos(filtros?) → Entrega[]
 *   buscarPorId(id)       → Entrega | null
 *   criar(dados)          → Entrega
 *   atualizar(id, dados)  → Entrega | null
 */
export class EntregasRepository {
  constructor(database) {
    this.database = database;
  }

  /**
   * Persiste uma nova entrega. O id é gerado pelo repository.
   * @param {Omit<Entrega, "id">} dados
   * @returns {Entrega} A entrega criada (com id).
   */
  criar(dados) {
    const entrega = { id: this.database.proximoId(), ...dados };
    this.database.entregas.push(entrega);
    return entrega;
  }

  /**
   * Lista as entregas. Filtros ausentes são ignorados; os presentes são
   * combinados (AND).
   * @param {{ status?: string, motoristaId?: number }} [filtros]
   * @returns {Entrega[]}
   */
  listarTodos(filtros = {}) {
    return this.database.entregas.filter(
      (entrega) =>
        (filtros.status === undefined || entrega.status === filtros.status) &&
        (filtros.motoristaId === undefined ||
          entrega.motoristaId === filtros.motoristaId),
    );
  }

  /**
   * Busca uma entrega pelo id.
   * @param {number} id
   * @returns {Entrega|null} A entrega, ou null se não existir.
   */
  buscarPorId(id) {
    return this.database.entregas.find((entrega) => entrega.id === id) || null;
  }

  /**
   * Atualiza só os campos informados (os demais são mantidos).
   * @param {number} id
   * @param {Partial<Omit<Entrega, "id">>} dados
   * @returns {Entrega|null} A entrega atualizada, ou null se não existir.
   */
  atualizar(id, dados) {
    const index = this.database.entregas.findIndex(
      (entrega) => entrega.id === id,
    );
    if (index === -1) return null;

    this.database.entregas[index] = {
      ...this.database.entregas[index],
      ...dados,
      id,
    };
    return this.database.entregas[index];
  }
}
