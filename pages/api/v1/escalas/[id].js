import database from "@infra/database";

export default async function handler(request, response) {
  const { id } = request.query; // Obtém o ID da URL

  if (request.method === "DELETE") {
    try {
      if (!id) {
        return response.status(400).json({ error: "ID não fornecido" });
      }

      // Exclui o registro da tabela escalas
      await database.query({
        text: `
          DELETE FROM escalas WHERE id = $1
        `,
        values: [id],
      });

      return response
        .status(200)
        .json({ message: "Registro excluído com sucesso" });
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: "Erro ao excluir registro" });
    }
  }

  return response.status(405).json({ error: "Método não permitido" });
}
