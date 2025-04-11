import { useState } from "react";
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

  const addRecord = () => {
    if (editIndex !== null) {
      const updated = [...records];
      updated[editIndex] = form;
      setRecords(updated);
      setEditIndex(null);
    } else {
      setRecords([...records, form]);
    }
    setForm({ nome: "", data: "", turno: "", status: "Presente" });
  };

  const editRecord = (index) => {
    setForm(records[index]);
    setEditIndex(index);
  };

  const cancelEdit = () => {
    setForm({ nome: "", data: "", turno: "", status: "Presente" });
    setEditIndex(null);
  };

  const deleteRecord = (index) => {
    if (window.confirm("Tem certeza que deseja excluir este registro?")) {
      const updated = [...records];
      updated.splice(index, 1);
      setRecords(updated);
    }
  };

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
          <div key={index} className="card">
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
              Data: {r.data} — Comentário: {r.turno}
              <br />
              <span className="statusBadge">
                Status: <strong>{r.status}</strong>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
