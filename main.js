const form = document.querySelector("form");
const amount = document.getElementById("amount");
const expense = document.getElementById("expense");
const category = document.getElementById("category");

// Seleção de elementos da lista
const expenseList = document.querySelector("ul")
const expensesTotal = document.querySelector("aside header h2")
const expensesQuantities = document.querySelector("aside header p span")

// Observa os dados do input
amount.oninput = () => {
  let value = amount.value.replace(/\D/g, "") // Remove tudo que não for número

  value = Number(value) / 100 // Transforma para centavos

  amount.value = formatCurrencyBRL(value) // Atualiza o valor do input
}

function formatCurrencyBRL (value) { //Formatação do valor para o real brasileiro
  value = value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })

  return value
}

form.onsubmit = (event) => { // Obtem os dados do formulário
  event.preventDefault()

  const newExpense = { // Objeto com os detalhes do formulario
    id: new Date().getTime(),
    expense: expense.value,
    categoryId: category.value,
    categoryName: category.options[category.selectedIndex].text,
    amount: amount.value,
    current_at: new Date(),

  }


  expenseAdd(newExpense) // Chama a função que irá adicionar o item na lista 
}

// Função para adicionar e detalhar cada item da lista
function expenseAdd(newExpense) { 
  try { // Montagem de Lista
    const expenseItem = document.createElement("li") // Cria item
    expenseItem.classList.add("expense") // Adiciona classe ao item

    const expenseIcon = document.createElement("img")
    
    expenseIcon.setAttribute("src", `./img/${newExpense.categoryId}.svg`) // Adiciona o icone da categoria com ajuda do ID que foi resgatado pelo "newExpense"
    
    expenseIcon.setAttribute("alt", newExpense.categoryName) // Recursos de alt para acessibilidade

    // Cria div para informações
    const expenseInfo = document.createElement("div") 
    expenseInfo.classList.add("expense-info")

    // Adiciona o nome da despesa - O "expense" veio da const newExpense que foi criada no form.onsubmit
    const expenseName = document.createElement("strong") 
    expenseName.textContent = newExpense.expense 
    
    // Valor da despesa

    const expenseAmount = document.createElement("span")
    expenseAmount.classList.add("expense-amount")
    expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount.toUpperCase().replace("R$", "")} `

    // Ícone de remoção
    const removeIcon = document.createElement("img")
    removeIcon.classList.add("remove-icon")
    removeIcon.setAttribute("src", `./img/remove.svg`)
    removeIcon.setAttribute("alt", `Remover item`)

    // Adiciona a categoria
    const expenseCategory = document.createElement("span")
    expenseCategory.textContent = newExpense.categoryName

    expenseInfo.append(expenseName, expenseCategory)  // Adicionar o nome e categoria na div

    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon) // Adiciona info ao item

    expenseList.append(expenseItem) // Adiciona o item para a ul

    formClear() // Limpa os campos do formulário

    updateTotals() // Atualiza o valor total

  } catch (error) {
    alert("Não foi possível adicionar a despesa, atualize a página e tente novamente!")
    console.log(error)
  }
}

// Função para atualizar o montante do valor da lista
function updateTotals() {
  try {
    const items = expenseList.children // Recupera os li da ul

    expensesQuantities.textContent = `${items.length} ${items.length > 1 ? "despesas": "despesa"}` 

    // Calcular o total de items
    let total = 0 

    // Analisar item por item
    for(let item = 0; item < items.length; item++) {
      const itemAmount = items[item].querySelector(".expense-amount")

      let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",", ".") // Remoção de caracteres não númericos e a troca de "," por "."

      value = parseFloat(value) //Converte para flutuante

      //Verificação de número válido
      if(isNaN(value)) {
        return alert("Não foi possível calcular o total. Atualize a página e tente novamente")
      }

      // ICREMENTAR O VALOR TOTAL
      total += Number(value)
    } 
    // Formatar o valor
    const symbolBRL = document.createElement("small")
    symbolBRL.textContent = "R$" // Adiciona o R$
    
    total = formatCurrencyBRL(total).toUpperCase().replace("R$", "") // REMOVE O R$ ANTERIOR
    
    // Limpeza do conteúdo HTML
    expensesTotal.innerHTML = ""

    expensesTotal.append(symbolBRL, total) // Pronto junta o símbolo e o valor formatado

  } catch (error) {
    alert("Não foi possível atualizar os totais, atualize a página e tente novamente!")
  }
}

// Evento para deletar algum item da lista
expenseList.addEventListener("click", function(event) {
  if (event.target.classList.contains("remove-icon")) {
    const item = event.target.closest(".expense")

    // Remove o item
    item.remove()
  }
  // Atualiza o total
  updateTotals()
})

// Limpar os campos do formulário para uma melhor UX
function formClear() {
  expense.value = ""
  category.value = ""
  amount.value = ""

  expense.focus() // Coloca o foco no input de amount
}

// Criar botão para gerar planilha
const downloadButton = document.createElement("button");
downloadButton.textContent = "Baixar Planilha";
downloadButton.id = "download-excel"; // Aplicando o ID para estilização via CSS
downloadButton.onclick = generateExcel;

document.querySelector("aside").appendChild(downloadButton);

// Função para gerar a planilha
function generateExcel() {
  const expenses = Array.from(expenseList.children).map((item) => {
    return {
      Nome: item.querySelector("strong").textContent,
      Categoria: item.querySelector(".expense-info span").textContent,
      Valor: item.querySelector(".expense-amount").textContent.replace("R$", "").trim(),
    };
  });

  if (expenses.length === 0) {
    alert("Nenhuma despesa cadastrada!");
    return;
  }

  // Organizar por categoria
  const groupedExpenses = {};
  expenses.forEach((expense) => {
    if (!groupedExpenses[expense.Categoria]) {
      groupedExpenses[expense.Categoria] = [];
    }
    groupedExpenses[expense.Categoria].push(expense);
  });

  // Criar estrutura para a planilha
  let sheetData = [];
  Object.keys(groupedExpenses).forEach((category) => {
    sheetData.push([category]); // Nome da categoria como cabeçalho
    sheetData = sheetData.concat(
      groupedExpenses[category].map((exp) => [exp.Nome, exp.Valor])
    );
    sheetData.push([]); // Linha vazia entre categorias
  });

  // Criar planilha e salvar
  const ws = XLSX.utils.aoa_to_sheet(sheetData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Despesas");
  XLSX.writeFile(wb, "despesas.xlsx");
}