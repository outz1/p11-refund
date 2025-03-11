const form = document.querySelector("form");
const amount = document.getElementById("amount");
const expense = document.getElementById("expense");
const category = document.getElementById("category");

// Seleção de elementos da lista
const expenseList = document.querySelector("ul")


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

    // Adiciona a categoria
    const expenseCategory = document.createElement("span")
    expenseCategory.textContent = newExpense.categoryName

    expenseInfo.append(expenseName, expenseCategory)  // Adicionar o nome e categoria na div

    expenseItem.append(expenseIcon, expenseInfo) // Adiciona info ao item

    expenseList.append(expenseItem) // Adiciona o item para a ul

  } catch (error) {
    alert("Não foi possível adicionar a despesa, atualize a página e tente novamente!")
    console.log(error)
  }
}