import database from "@infra/database";

export default async function handler(request, response) {
  console.log("Método recebido:", request.method);

  switch (request.method) {
    case "GET":
      try {
        console.log("Buscando registros no banco de dados...");
        const result = await database.query({
          text: `
            SELECT id, nome, descricao AS turno, data, status, created_at, updated_at
            FROM escalas
            ORDER BY created_at DESC
          `,
        });

        console.log("Registros encontrados:", result.rows.length);
        return response.status(200).json(result.rows);
      } catch (error) {
        console.error("Erro ao buscar registros:", error);
        return response.status(500).json({ error: "Erro ao buscar registros" });
      }

    case "POST":
      try {
        const { nome, data, turno, status } = request.body;
        console.log("Inserindo novo registro:", { nome, data, turno, status });

        const result = await database.query({
          text: `
            INSERT INTO escalas (nome, descricao, data, status, created_at, updated_at)
            VALUES ($1, $2, $3, $4, NOW(), NOW())
            RETURNING id, nome, descricao AS turno, data, status, created_at, updated_at
          `,
          values: [nome, turno, data, status],
        });

        const newRecord = result.rows[0];
        console.log("Registro criado com sucesso:", newRecord);
        return response.status(201).json(newRecord);
      } catch (error) {
        console.error("Erro ao criar escala:", error);
        return response.status(500).json({ error: "Erro ao criar escala" });
      }

    case "PUT":
      try {
        const { id, nome, data, turno, status } = request.body;
        console.log("Atualizando registro:", { id, nome, data, turno, status });

        const result = await database.query({
          text: `
            UPDATE escalas
            SET nome = $1, descricao = $2, data = $3, status = $4, updated_at = NOW()
            WHERE id = $5
            RETURNING id, nome, descricao AS turno, data, status, created_at, updated_at
          `,
          values: [nome, turno, data, status, id],
        });

        if (result.rowCount === 0) {
          return response
            .status(404)
            .json({ error: "Registro não encontrado" });
        }

        const updatedRecord = result.rows[0];
        return response.status(200).json(updatedRecord);
      } catch (error) {
        console.error("Erro ao atualizar escala:", error);
        return response.status(500).json({ error: "Erro ao atualizar escala" });
      }

    default:
      console.warn("Método não permitido:", request.method);
      return response.status(405).json({ error: "Método não permitido" });
  }
}
