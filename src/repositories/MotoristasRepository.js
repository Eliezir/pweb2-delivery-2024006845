/**
 * @typedef {Object} Motorista
 * @property {number} id
 * @property {string} nome
 * @property {string} cpf                Único entre os motoristas.
 * @property {string|null} placaVeiculo  Opcional.
 * @property {"ATIVO"|"INATIVO"} status
 */

/**
 * Repositório de Motoristas (persistência em memória).
 *
 * Contrato (IMotoristasRepository) — os services dependem SÓ destes métodos:
 *   listarTodos()     → Motorista[]
 *   buscarPorId(id)   → Motorista | null
 *   buscarPorCpf(cpf) → Motorista | null
 *   criar(dados)      → Motorista
 */
export class MotoristasRepository {
  constructor(database) {
    this.database = database;
  }

  /**
   * Persiste um novo motorista. O id é gerado pelo repository.
   * @param {Omit<Motorista, "id">} dados
   * @returns {Motorista} O motorista criado (com id).
   */
  criar(dados) {
    const motorista = {
      id: this.database.proximoId(),
      ...dados,
    };

    this.database.motoristas.push(motorista);
    return motorista;
  }

  /**
   * Busca um motorista pelo CPF.
   * @param {string} cpf
   * @returns {Motorista|null} O motorista, ou null se não existir.
   */
  buscarPorCpf(cpf) {
    return (
      this.database.motoristas.find((motorista) => motorista.cpf === cpf) ||
      null
    );
  }

  /**
   * Lista todos os motoristas.
   * @returns {Motorista[]}
   */
  listarTodos() {
    return this.database.motoristas;
  }

  /**
   * Busca um motorista pelo id.
   * @param {number} id
   * @returns {Motorista|null} O motorista, ou null se não existir.
   */
  buscarPorId(id) {
    return (
      this.database.motoristas.find((motorista) => motorista.id === id) ||
      null
    );
  }
}
