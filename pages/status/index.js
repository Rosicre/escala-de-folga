import useSWR from "swr";
import { useState } from "react";

async function fetchStaAPI(key) {
  try {
    const start = performance.now();
    const response = await fetch(key);

    if (!response.ok) {
      throw new Error(`Erro ao buscar dados: ${response.statusText}`);
    }

    const end = performance.now();
    const responseBody = await response.json();

    return {
      ...responseBody,
      latency: end - start,
    };
  } catch (error) {
    console.error("Erro ao buscar dados da API:", error);
    return null;
  }
}

export default function StatusPage() {
  const [activeTab, setActiveTab] = useState("database");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="status-container">
      <h1 className="status-header">Status do Sistema</h1>

      <div className="tabs">
        <button
          className={activeTab === "database" ? "activeTab" : ""}
          onClick={() => handleTabClick("database")}
        >
          Banco de Dados
        </button>
        <button
          className={activeTab === "latency" ? "activeTab" : ""}
          onClick={() => handleTabClick("latency")}
        >
          Latência
        </button>
        <button
          className={activeTab === "maxConnections" ? "activeTab" : ""}
          onClick={() => handleTabClick("maxConnections")}
        >
          Máximo de Conexões
        </button>
        <button
          className={activeTab === "openConnections" ? "activeTab" : ""}
          onClick={() => handleTabClick("openConnections")}
        >
          Conexões Abertas
        </button>
        <button
          className={activeTab === "all" ? "activeTab" : ""}
          onClick={() => handleTabClick("all")}
        >
          Todos
        </button>
      </div>

      <UpdatedAp activeTab={activeTab} />
    </div>
  );
}

function UpdatedAp({ activeTab }) {
  const { data, error, isValidating } = useSWR("/api/v1/status", fetchStaAPI, {
    refreshInterval: 2000,
  });

  const currentTime = new Date().toLocaleString();

  if (isValidating) {
    return (
      <div className="statusItem">
        <div className="loading"></div>
        <p>Carregando...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="statusItem">
        Não foi possível carregar as informações.
      </div>
    );
  }

  return (
    <div>
      <p className="timestamp">Atualizado em: {currentTime}</p>
      {activeTab === "database" && (
        <div className="infoGrid">
          <div>
            <span className="icon">📂</span>
            <p>Versão do Banco de Dados:</p>
            <h3>{data.dependencies.database.version}</h3>
          </div>
        </div>
      )}
      {activeTab === "latency" && (
        <div className="infoGrid">
          <div>
            <span className="icon">⚡</span>
            <p>Latência:</p>
            <h3>{data.latency.toFixed(2)} ms</h3>
          </div>
        </div>
      )}
      {activeTab === "maxConnections" && (
        <div className="infoGrid">
          <div>
            <span className="icon">🔗</span>
            <p>Máximo de Conexões:</p>
            <h3>{data.dependencies.database.max_connections}</h3>
          </div>
        </div>
      )}
      {activeTab === "openConnections" && (
        <div className="infoGrid">
          <div>
            <span className="icon">📶</span>
            <p>Conexões Abertas:</p>
            <h3>{data.dependencies.database.opened_connections}</h3>
          </div>
        </div>
      )}
      {activeTab === "all" && (
        <div className="infoGrid">
          <div>
            <span className="icon">📂</span>
            <p>Versão do Banco de Dados:</p>
            <h3>{data.dependencies.database.version}</h3>
          </div>
          <div>
            <span className="icon">🔗</span>
            <p>Máximo de Conexões:</p>
            <h3>{data.dependencies.database.max_connections}</h3>
          </div>
          <div>
            <span className="icon">📶</span>
            <p>Conexões Abertas:</p>
            <h3>{data.dependencies.database.opened_connections}</h3>
          </div>
          <div>
            <span className="icon">⚡</span>
            <p>Latência:</p>
            <h3>{data.latency.toFixed(2)} ms</h3>
          </div>
        </div>
      )}
    </div>
  );
}
