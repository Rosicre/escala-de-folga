import { useState, useEffect } from "react";
import * as XLSX from "xlsx";

export default function Home() {
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({
    nome: "",
    data: "",
    turno: "",
    status: "Presente",
  });
  const [editIndex, setEditIndex] = useState(null);

  // Função para formatar a data (DD/MM/YYYY)
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"; // Caso a data seja nula ou vazia
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Mês começa em 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Função para carregar registros do backend
  const fetchRecords = async () => {
    try {
      const response = await fetch("/api/v1/escalas");
      if (!response.ok) {
        throw new Error("Erro ao carregar registros");
      }
      const data = await response.json();
      setRecords(data);
    } catch (error) {
      console.error(error);
      alert(
        "Erro ao carregar registros. Verifique o console para mais detalhes.",
      );
    }
  };

  // Carrega os registros ao iniciar o componente
  useEffect(() => {
    fetchRecords();
  }, []);

  // Função para adicionar ou salvar um registro
  const addRecord = async () => {
    try {
      if (!form.nome || !form.data || !form.turno || !form.status) {
        alert("Preencha todos os campos antes de salvar.");
        return;
      }

      if (editIndex !== null) {
        const recordToUpdate = records[editIndex];

        const response = await fetch("/api/v1/escalas", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, id: recordToUpdate.id }),
        });

        if (!response.ok) {
          throw new Error("Erro ao atualizar o registro");
        }

        const updated = await response.json();
        const updatedRecords = [...records];
        updatedRecords[editIndex] = updated;
        setRecords(updatedRecords);

        console.log("Registro atualizado:", updated);
      } else {
        const response = await fetch("/api/v1/escalas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

        if (!response.ok) {
          throw new Error("Erro ao salvar o registro");
        }

        const data = await response.json();
        console.log("Registro salvo:", data);
        setRecords([...records, data]);
      }

      // Limpa o formulário
      setForm({ nome: "", data: "", turno: "", status: "Presente" });
      setEditIndex(null);
    } catch (error) {
      console.error(error);
      alert(
        "Erro ao salvar o registro. Verifique o console para mais detalhes.",
      );
    }
  };

  // Função para editar um registro existente
  const editRecord = (index) => {
    setForm(records[index]);
    setEditIndex(index);
  };

  // Função para cancelar a edição
  const cancelEdit = () => {
    setForm({ nome: "", data: "", turno: "", status: "Presente" });
    setEditIndex(null);
  };

  // Função para excluir um registro
  const deleteRecord = async (index) => {
    if (window.confirm("Tem certeza que deseja excluir este registro?")) {
      try {
        const recordId = records[index].id;

        // Exclui o registro no backend
        const response = await fetch(`/api/v1/escalas/${recordId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Erro ao excluir o registro");
        }

        // Remove o registro da lista local
        const updated = [...records];
        updated.splice(index, 1);
        setRecords(updated);
      } catch (error) {
        console.error(error);
        alert(
          "Erro ao excluir o registro. Verifique o console para mais detalhes.",
        );
      }
    }
  };

  // Função para exportar os registros para Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(records);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Escala");
    XLSX.writeFile(wb, "escala.xlsx");
  };

  return (
    <div className="container">
      <header>
        <h1>Escala Inteligente de Folga</h1>
      </header>

      <section className="filters">
        <button className="primary" onClick={exportToExcel}>
          Exportar Excel
        </button>
      </section>

      <form className="inputGroup" onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          placeholder="Nome"
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
        />
        <input
          type="date"
          value={form.data}
          onChange={(e) => setForm({ ...form, data: e.target.value })}
        />
        <input
          type="text"
          placeholder="Descrição"
          value={form.turno}
          onChange={(e) => setForm({ ...form, turno: e.target.value })}
        />
        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          <option value="Presente">Presente</option>
          <option value="Atestado">Atestado</option>
          <option value="Folga">Folga</option>
          <option value="Faltou">Faltou</option>
          <option value="Suspenso">Suspenso</option>
          <option value="Banco">Banco</option>
          <option value="Férias">Férias</option>
        </select>
        <button type="button" className="primary" onClick={addRecord}>
          {editIndex !== null ? "Salvar Edição" : "Adicionar Registro"}
        </button>
        {editIndex !== null && (
          <button type="button" onClick={cancelEdit}>
            Cancelar Edição
          </button>
        )}
      </form>

      <div id="recordsContainer">
        {records.map((r, index) => (
          <div key={r.id} className="card">
            <div className="cardHeader">
              <strong>{r.nome}</strong>
              <div
                style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
              >
                <button
                  className="deleteBtn"
                  onClick={() => deleteRecord(index)}
                  title="Excluir registro"
                >
                  Excluir
                </button>
                <button
                  className="deleteBtn"
                  onClick={() => editRecord(index)}
                  title="Editar registro"
                  style={{ color: "#0070f3" }}
                >
                  Editar
                </button>
              </div>
            </div>
            <div className="cardDetails">
              Data: {formatDate(r.data)} — Comentário: {r.turno || "N/A"}
              <br />
              <span className="statusBadge">
                Status: <strong>{r.status || "N/A"}</strong>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
