// src/components/App.js
import { useState } from "react";
import * as XLSX from "xlsx";

const dadosIniciais = [
  {
    nome: "Ana Souza",
    data: "2025-04-09",
    turno: "Manhã",
    status: "Presente",
    vt: true,
    bancoHoras: 2,
  },
];

const statusOptions = [
  "Presente",
  "Atestado",
  "Folga",
  "Faltou",
  "Suspenso",
  "Banco",
];

export default function App() {
  const [dados, setDados] = useState(dadosIniciais);
  const [filtro, setFiltro] = useState("");
  const [form, setForm] = useState({
    nome: "",
    data: "",
    turno: "",
    status: "Presente",
  });

  const getColor = (status) =>
    ({
      Presente: "#22c55e",
      Atestado: "#0ea5e9",
      Folga: "#eab308",
      Faltou: "#ef4444",
      Suspenso: "#a855f7",
      Banco: "#06b6d4",
    })[status] || "#d1d5db";

  const getBancoHoras = (status) =>
    ({
      Presente: 2,
      Atestado: 0,
      Folga: -1,
      Faltou: -8,
      Suspenso: 0,
      Banco: 1,
    })[status] || 0;

  const dadosFiltrados = filtro
    ? dados.filter((d) => d.status === filtro)
    : dados;

  const excluir = (index) => {
    const novos = [...dados];
    novos.splice(index, 1);
    setDados(novos);
  };

  const exportarExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Escala");
    XLSX.writeFile(workbook, "escala_folga.xlsx");
  };

  const handleAddRecord = () => {
    if (!form.nome || !form.data || !form.turno)
      return alert("Preencha todos os campos!");

    const novo = {
      ...form,
      vt: true,
      bancoHoras: getBancoHoras(form.status),
    };
    setDados([...dados, novo]);
    setForm({ nome: "", data: "", turno: "", status: "Presente" });
  };

  return (
    <div style={{ padding: "1rem", fontFamily: "Arial" }}>
      <h1>Escala Inteligente de Folga</h1>

      {/* Filtros */}
      <section style={{ marginBottom: "1rem" }}>
        <select value={filtro} onChange={(e) => setFiltro(e.target.value)}>
          <option value="">Filtrar Status</option>
          {statusOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <button onClick={exportarExcel} style={{ marginLeft: "1rem" }}>
          Exportar Excel
        </button>
      </section>

      {/* Formulário */}
      <form
        className="input-group"
        style={{
          display: "flex",
          gap: "0.5rem",
          flexWrap: "wrap",
          marginBottom: "1rem",
        }}
        onSubmit={(e) => {
          e.preventDefault();
          handleAddRecord();
        }}
      >
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
          placeholder="Turno"
          value={form.turno}
          onChange={(e) => setForm({ ...form, turno: e.target.value })}
        />
        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          {statusOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <button type="submit">Adicionar Registro</button>
      </form>

      {/* Lista de registros */}
      <div id="recordsContainer">
        {dadosFiltrados.map((item, index) => (
          <div
            key={index}
            style={{
              borderLeft: `5px solid ${getColor(item.status)}`,
              padding: "1rem",
              marginBottom: "0.5rem",
              backgroundColor: "#f9f9f9",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div>
                <strong>{item.nome}</strong>
              </div>
              <div>
                {item.data} — {item.turno} — {item.status}
              </div>
            </div>
            <div>
              <div>VT: {item.vt ? "✅" : "❌"}</div>
              <div>
                BH: {item.bancoHoras >= 0 ? "+" : ""}
                {item.bancoHoras}h
              </div>
              <button onClick={() => excluir(index)} style={{ color: "red" }}>
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
