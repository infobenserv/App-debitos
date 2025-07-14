// Salvar cliente no localStorage
function salvarCliente(event) {
  event.preventDefault();
  const nome = document.getElementById("nomeCliente").value.trim();
  const telefone = document.getElementById("telefoneCliente").value.trim();

  if (!nome) {
    alert("Digite o nome do cliente.");
    return;
  }

  const clientes = JSON.parse(localStorage.getItem("clientes")) || [];
  clientes.push({ nome, telefone });
  localStorage.setItem("clientes", JSON.stringify(clientes));

  document.getElementById("nomeCliente").value = "";
  document.getElementById("telefoneCliente").value = "";

  listarClientes();
}

// Listar clientes na página
function listarClientes() {
  const lista = document.getElementById("listaClientes");
  if (!lista) return;

  const clientes = JSON.parse(localStorage.getItem("clientes")) || [];

  lista.innerHTML = "";
  clientes.forEach((cliente, index) => {
    const li = document.createElement("li");
    li.innerHTML = `${cliente.nome} - ${cliente.telefone}
  <button onclick="excluirCliente(${index})" style="margin-left:10px; background-color:red; color:white;">Excluir</button>`;
    lista.appendChild(li);
  });
}

document.addEventListener("DOMContentLoaded", listarClientes);

// Carregar clientes no <select> da página de débitos
function carregarClientes() {
  const select = document.getElementById("clienteSelecionado");
  if (!select) return;

  const clientes = JSON.parse(localStorage.getItem("clientes")) || [];

  clientes.forEach(cliente => {
    const option = document.createElement("option");
    option.value = cliente.nome;
    option.textContent = cliente.nome;
    select.appendChild(option);
  });
}

// Salvar débito no localStorage
function salvarDebito(event) {
  event.preventDefault();

  const cliente = document.getElementById("clienteSelecionado").value;
  const valor = parseFloat(document.getElementById("valorDebito").value);
  const data = document.getElementById("dataDebito").value;
  const descricao = document.getElementById("descricaoDebito").value;

  if (!cliente || !valor || !data || !descricao) {
    alert("Preencha todos os campos!");
    return;
  }

  const debitos = JSON.parse(localStorage.getItem("debitos")) || [];
  debitos.push({ cliente, valor, data, descricao, status: "pendente" });
  localStorage.setItem("debitos", JSON.stringify(debitos));

  document.getElementById("valorDebito").value = "";
  document.getElementById("dataDebito").value = "";
  document.getElementById("descricaoDebito").value = "";

  listarDebitosPorCliente();
}

// Listar débitos do cliente selecionado
function listarDebitosPorCliente() {
  const select = document.getElementById("clienteSelecionado");
  const lista = document.getElementById("listaDebitos");
  if (!select || !lista) return;

  const clienteSelecionado = select.value;
  const debitos = JSON.parse(localStorage.getItem("debitos")) || [];

  const filtrar = debitos.filter(d => d.cliente === clienteSelecionado);

  lista.innerHTML = "";

  filtrar.forEach((d, i) => {
    const li = document.createElement("li");
    li.innerHTML = `R$ ${d.valor.toFixed(2)} - ${d.data} - ${d.descricao} - Status: ${d.status}
  <button onclick="excluirDebito('${d.cliente}', ${i})" style="margin-left:10px; background-color:red; color:white;">Excluir</button>`;
    lista.appendChild(li);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  carregarClientes();
  listarDebitosPorCliente();
});

function mostrarCaixa() {
  const totalSpan = document.getElementById("totalCaixa");
  const lista = document.getElementById("listaCaixa");
  if (!totalSpan || !lista) return;

  const debitos = JSON.parse(localStorage.getItem("debitos")) || [];

  const pendentes = debitos.filter(d => d.status === "pendente");
  const total = pendentes.reduce((soma, d) => soma + parseFloat(d.valor), 0);

  totalSpan.textContent = total.toFixed(2);

  lista.innerHTML = "";
  pendentes.forEach(d => {
    const li = document.createElement("li");
    li.textContent = `${d.cliente}: R$ ${d.valor.toFixed(2)} - ${d.data} - ${d.descricao}`;
    lista.appendChild(li);
  });
}

document.addEventListener("DOMContentLoaded", mostrarCaixa);

function mostrarRecibos() {
  const lista = document.getElementById("listaRecibos");
  const reciboBox = document.getElementById("reciboGerado");
  if (!lista || !reciboBox) return;

  const debitos = JSON.parse(localStorage.getItem("debitos")) || [];
  const pendentes = debitos.filter(d => d.status === "pendente");

  lista.innerHTML = "";

  pendentes.forEach((d, index) => {
    const li = document.createElement("li");
    li.innerHTML = `${d.cliente} - R$ ${d.valor.toFixed(2)} - ${d.data} - ${d.descricao} 
      <button onclick="gerarRecibo(${index})">Marcar como Pago</button>`;
    lista.appendChild(li);
  });
}

function gerarRecibo(index) {
  const debitos = JSON.parse(localStorage.getItem("debitos")) || [];
  const reciboBox = document.getElementById("reciboGerado");

  const debito = debitos.filter(d => d.status === "pendente")[index];
  if (!debito) return;

  debito.status = "pago";
  localStorage.setItem("debitos", JSON.stringify(debitos));

  reciboBox.innerHTML = `
    <h2>Recibo</h2>
    <p>Recebemos de <strong>${debito.cliente}</strong> o valor de 
    <strong>R$ ${debito.valor.toFixed(2)}</strong> referente a 
    <em>${debito.descricao}</em> na data de <strong>${debito.data}</strong>.</p>
    <p>Status: Pago</p>
  `;

  mostrarRecibos();
}

document.addEventListener("DOMContentLoaded", mostrarRecibos);

function mostrarRelatorio() {
  const lista = document.getElementById("listaRelatorio");
  const totalGeral = document.getElementById("totalGeral");
  const totalPago = document.getElementById("totalPago");
  const totalPendente = document.getElementById("totalPendente");
  if (!lista || !totalGeral || !totalPago || !totalPendente) return;

  const debitos = JSON.parse(localStorage.getItem("debitos")) || [];

  let somaGeral = 0;
  let somaPago = 0;
  let somaPendente = 0;

  lista.innerHTML = "";

  debitos.forEach(d => {
    somaGeral += parseFloat(d.valor);
    if (d.status === "pago") {
      somaPago += parseFloat(d.valor);
    } else {
      somaPendente += parseFloat(d.valor);
    }

    const li = document.createElement("li");
    li.textContent = `${d.cliente} - R$ ${d.valor.toFixed(2)} - ${d.data} - ${d.descricao} - Status: ${d.status}`;
    lista.appendChild(li);
  });

  totalGeral.textContent = somaGeral.toFixed(2);
  totalPago.textContent = somaPago.toFixed(2);
  totalPendente.textContent = somaPendente.toFixed(2);
}

document.addEventListener("DOMContentLoaded", mostrarRelatorio);

// PDF temporário (alerta por enquanto)
function gerarPDF() {
  alert("A exportação em PDF será implementada em breve!");
}

async function gerarPDF() {
  const cliente = document.getElementById("filtroCliente").value;
  const debitos = JSON.parse(localStorage.getItem("debitos")) || [];

  const filtrados = cliente
    ? debitos.filter(d => d.cliente === cliente)
    : debitos;

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(14);
  doc.text(`Relatório de Débitos`, 10, 10);
  doc.setFontSize(11);
  doc.text(`Cliente: ${cliente || "Todos os Clientes"}`, 10, 20);

  let y = 30;
  filtrados.forEach((d, i) => {
    const texto = `• ${d.cliente} | R$ ${d.valor.toFixed(2)} | ${d.data} | ${d.descricao} | ${d.status}`;
    doc.text(texto, 10, y);
    y += 8;
    if (y > 280) {
      doc.addPage();
      y = 10;
    }
  });

  const nomeArquivo = cliente ? `relatorio-${cliente}.pdf` : "relatorio-todos.pdf";
  doc.save(nomeArquivo);
}

function exportarBackup() {
  const clientes = localStorage.getItem("clientes") || "[]";
  const debitos = localStorage.getItem("debitos") || "[]";
  const dados = {
    clientes: JSON.parse(clientes),
    debitos: JSON.parse(debitos)
  };

  const blob = new Blob([JSON.stringify(dados)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "backup-debitos.json";
  link.click();
}

function importarBackup() {
  const input = document.getElementById("importarArquivo");
  const file = input.files[0];
  if (!file) {
    alert("Selecione um arquivo JSON primeiro.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const dados = JSON.parse(e.target.result);
      if (dados.clientes && dados.debitos) {
        localStorage.setItem("clientes", JSON.stringify(dados.clientes));
        localStorage.setItem("debitos", JSON.stringify(dados.debitos));
        alert("Backup restaurado com sucesso!");
      } else {
        alert("Arquivo inválido.");
      }
    } catch (err) {
      alert("Erro ao ler o arquivo.");
    }
  };
  reader.readAsText(file);
}
function excluirDebito(cliente, indexLocal) {
  const debitos = JSON.parse(localStorage.getItem("debitos")) || [];
  const filtrados = debitos.filter(d => d.cliente === cliente);

  if (indexLocal >= 0 && indexLocal < filtrados.length) {
    const itemParaExcluir = filtrados[indexLocal];
    const indexGlobal = debitos.findIndex(d =>
      d.cliente === itemParaExcluir.cliente &&
      d.valor === itemParaExcluir.valor &&
      d.data === itemParaExcluir.data &&
      d.descricao === itemParaExcluir.descricao &&
      d.status === itemParaExcluir.status
    );

    if (indexGlobal !== -1) {
      debitos.splice(indexGlobal, 1);
      localStorage.setItem("debitos", JSON.stringify(debitos));
      listarDebitosPorCliente();
    }
  }
}
function excluirCliente(index) {
  const clientes = JSON.parse(localStorage.getItem("clientes")) || [];
  const clienteRemovido = clientes[index];

  if (confirm(`Deseja realmente excluir o cliente "${clienteRemovido.nome}"?`)) {
    clientes.splice(index, 1);
    localStorage.setItem("clientes", JSON.stringify(clientes));

    // Também remover os débitos relacionados a esse cliente
    let debitos = JSON.parse(localStorage.getItem("debitos")) || [];
    debitos = debitos.filter(d => d.cliente !== clienteRemovido.nome);
    localStorage.setItem("debitos", JSON.stringify(debitos));

    listarClientes();
  }
}

function mostrarRelatorio() {
  const lista = document.getElementById("listaRelatorio");
  const totalGeral = document.getElementById("totalGeral");
  const totalPago = document.getElementById("totalPago");
  const totalPendente = document.getElementById("totalPendente");
  const filtro = document.getElementById("filtroCliente");

  if (!lista || !totalGeral || !totalPago || !totalPendente || !filtro) return;

  const clienteSelecionado = filtro.value;
  const debitos = JSON.parse(localStorage.getItem("debitos")) || [];

  let somaGeral = 0;
  let somaPago = 0;
  let somaPendente = 0;

  const filtrados = clienteSelecionado
    ? debitos.filter(d => d.cliente === clienteSelecionado)
    : debitos;

  lista.innerHTML = "";

  filtrados.forEach(d => {
    somaGeral += parseFloat(d.valor);
    if (d.status === "pago") {
      somaPago += parseFloat(d.valor);
    } else {
      somaPendente += parseFloat(d.valor);
    }

    const li = document.createElement("li");
    li.textContent = `${d.cliente} - R$ ${d.valor.toFixed(2)} - ${d.data} - ${d.descricao} - Status: ${d.status}`;
    lista.appendChild(li);
  });

  totalGeral.textContent = somaGeral.toFixed(2);
  totalPago.textContent = somaPago.toFixed(2);
  totalPendente.textContent = somaPendente.toFixed(2);
}

function preencherClientesRelatorio() {
  const filtro = document.getElementById("filtroCliente");
  if (!filtro) return;

  const clientes = JSON.parse(localStorage.getItem("clientes")) || [];

  filtro.innerHTML = `<option value="">Todos os clientes</option>`;
  clientes.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.nome;
    opt.textContent = c.nome;
    filtro.appendChild(opt);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  preencherClientesRelatorio();
  mostrarRelatorio();
});