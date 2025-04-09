// app.js
let dados = [
  {
    nome: "Ana Souza",
    data: "2025-04-09",
    turno: "Manhã",
    status: "Presente",
    vt: true,
    bancoHoras: 2,
  },
  {
    nome: "João Lima",
    data: "2025-04-09",
    turno: "Tarde",
    status: "Atestado",
    vt: false,
    bancoHoras: 0,
  },
  {
    nome: "Maria Dias",
    data: "2025-04-09",
    turno: "Noite",
    status: "Folga",
    vt: false,
    bancoHoras: -1,
  },
  {
    nome: "Lucas Melo",
    data: "2025-04-09",
    turno: "Manhã",
    status: "Faltou",
    vt: false,
    bancoHoras: -8,
  },
];

function renderRecords(filteredData = dados) {
  const container = document.getElementById("recordsContainer");
  container.innerHTML = "";

  filteredData.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "card";
    card.style.borderLeftColor = getColor(item.status);

    const content = `
            <div class="card-header">
                <div>
                    <div>${item.nome}</div>
                    <div class="card-details">
                        ${item.data} — ${item.turno} — ${item.status}
                    </div>
                </div>
                <div>
                    <div>VT: ${item.vt ? "✅" : "❌"}</div>
                    <div>BH: ${item.bancoHoras >= 0 ? "+" : ""}${
      item.bancoHoras
    }h</div>
                    <button class="danger" onclick="deleteRecord(${index})">Excluir</button>
                </div>
            </div>
        `;

    card.innerHTML = content;
    container.appendChild(card);
  });
}

function addRecord() {
  const novoItem = {
    nome: document.getElementById("nome").value,
    data: document.getElementById("data").value,
    turno: document.getElementById("turno").value,
    status: document.getElementById("status").value,
    vt: document.getElementById("status").value === "Presente",
    bancoHoras: getBancoHoras(document.getElementById("status").value),
  };

  dados.push(novoItem);
  clearForm();
  applyFilter();
}

function deleteRecord(index) {
  dados.splice(index, 1);
  applyFilter();
}

function applyFilter() {
  const filterValue = document.getElementById("statusFilter").value;
  const filtered = filterValue
    ? dados.filter((item) => item.status === filterValue)
    : dados;
  renderRecords(filtered);
}

function exportToExcel() {
  const worksheet = XLSX.utils.json_to_sheet(dados);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Escala");
  XLSX.writeFile(workbook, "escala_folga.xlsx");
}

function getColor(status) {
  const colors = {
    Presente: "#22c55e",
    Atestado: "#0ea5e9",
    Folga: "#eab308",
    Faltou: "#ef4444",
    Suspenso: "#a855f7",
    Banco: "#06b6d4",
  };
  return colors[status] || "#d1d5db";
}

function getBancoHoras(status) {
  const horas = {
    Presente: 2,
    Atestado: 0,
    Folga: -1,
    Faltou: -8,
    Suspenso: 0,
    Banco: 1,
  };
  return horas[status] || 0;
}

function clearForm() {
  document.getElementById("nome").value = "";
  document.getElementById("data").value = "";
  document.getElementById("turno").value = "";
  document.getElementById("status").value = "Folga";
}

document.getElementById("statusFilter").addEventListener("change", applyFilter);
renderRecords();
