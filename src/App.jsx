import React, { useState } from "react";

function App() {
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    reporter: "",
    problem: "",
    restored: false,
    address: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/maintenance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert("Manutenção registrada com sucesso!");
        setFormData({
          date: "",
          time: "",
          reporter: "",
          problem: "",
          restored: false,
          address: "",
        });
      } else {
        alert("Erro ao registrar manutenção.");
      }
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  return (
    <div>
      <h1>Registro de Manutenção de Semáforos</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Data:
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Hora:
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Quem relatou:
          <select
            name="reporter"
            value={formData.reporter}
            onChange={handleChange}
            required
          >
            <option value="">Selecione</option>
            <option value="Agente de Trânsito">Agente de Trânsito</option>
            <option value="Cidadão">Cidadão</option>
          </select>
        </label>
        <br />
        <label>
          Problema:
          <select
            name="problem"
            value={formData.problem}
            onChange={handleChange}
            required
          >
            <option value="">Selecione</option>
            <option value="Em flash">Em flash</option>
            <option value="Desligado">Desligado</option>
          </select>
        </label>
        <br />
        <label>
          Funcionamento restabelecido:
          <input
            type="checkbox"
            name="restored"
            checked={formData.restored}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Endereço:
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
}

export default App;