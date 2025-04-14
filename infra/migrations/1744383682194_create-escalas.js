/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
exports.up = (pgm) => {
  pgm.createTable("escalas", {
    id: "id", // Coluna de ID autoincremental
    nome: {
      type: "varchar(255)", // Nome da escala
      notNull: true,
    },
    descricao: {
      type: "text", // Descrição da escala
      notNull: false, // Pode ser nulo
    },
    created_at: {
      type: "timestamp", // Data de criação
      default: pgm.func("current_timestamp"),
    },
    updated_at: {
      type: "timestamp", // Data de atualização
      default: pgm.func("current_timestamp"),
    },
  });
};

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
exports.down = (pgm) => {
  pgm.dropTable("escalas");
};
