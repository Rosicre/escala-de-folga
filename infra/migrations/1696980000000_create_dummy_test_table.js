exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("dummy_test_table", {
    id: "id",
    created_at: {
      type: "timestamp",
      default: pgm.func("current_timestamp"),
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("dummy_test_table");
};
