function toggle() {

    let modalOpen = document.querySelector('#modal').classList.contains('active');

    if (modalOpen == false){

        document.querySelector('#modal').classList.add('active');
        document.querySelector('#error').classList.remove('visible');

    } else {
        document.querySelector('#modal').classList.remove('active');
        document.querySelector('#error').classList.remove('visible');
    }

};

const storage = {

    get(){

        return JSON.parse(localStorage.getItem("transactions-finansDev")) || []

    },

    set(transactions){

        localStorage.setItem("transactions-finansDev", JSON.stringify(transactions))

    }

}

const transactionCount = {

    all: storage.get(),

    add(transaction){
        transactionCount.all.push(transaction)

        app.reload()
    },

    remove(index) {

        transactionCount.all.splice(index, 1)

        app.reload()

    },

    incomes(){

        totalIncomes = 0;

        transactionCount.all.forEach((transaction) => {
            transaction.amount >= 0 ? totalIncomes += transaction.amount : totalIncomes = totalIncomes
        })

        return totalIncomes

    },

    expenses(){

        totalExpense = 0;

        transactionCount.all.forEach((transaction) => {
            transaction.amount < 0 ? totalExpense += transaction.amount : totalExpense = totalExpense
        })

        return totalExpense

    },

    total(){

        totalTotal = transactionCount.incomes() + transactionCount.expenses()

        return totalTotal

    }
};

const innerTable = {

    transactionContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index){

        const tr = document.createElement('tr');
        tr.innerHTML = innerTable.innerHTMLTransaction(transaction, index);
        tr.dataset.index = index

        innerTable.transactionContainer.appendChild(tr)

    },

    innerHTMLTransaction(transaction, index) {

        const cssClass = transaction.amount < 0 ? "expense" : "income"

        const amount = utils.formatCurrency(transaction.amount);

        const HTML = `
<td class="description">${transaction.description}</td>
<td class="${cssClass}">${amount}</td>
<td class="date">${transaction.date}</td>
<td class="remove-tr"> <img onclick="transactionCount.remove(${index})" src="img/minus.svg" alt="remover transação"> </td>
`

        return HTML

    },

    updateBalance() {
        document.querySelector('#total-income').innerHTML = utils.formatCurrency(transactionCount.incomes())
        document.querySelector('#total-expense').innerHTML = utils.formatCurrency(transactionCount.expenses())
        document.querySelector('#total-total').innerHTML = utils.formatCurrency(transactionCount.total())
    },

    clearTable() {

        innerTable.transactionContainer.innerHTML = ""

    }

}

const utils = {

    formatAmount(value){
        value = Number(value)*100

        return value
    },

    formatDate(value){

        const splitDate = value.split("-")

        value = `${splitDate[2]}/${splitDate[1]}/${splitDate[0]}`

        return value

    },

    formatCurrency(value){

        const signal = Number(value) < 0 ? '-' : ''

        value = String(value).replace(/\D/g, '');

        value = Number(value) / 100

        value = value.toLocaleString("pt-br", {
            style: "currency",
            currency: "BRL"
        })

        value = signal + value;

        return value
    }

}

const form = {

    description: document.querySelector('input#description'),

    amount: document.querySelector('input#amount'),

    date: document.querySelector('input#date'),

    getValues(){

        return {

            description: form.description.value,
            amount: form.amount.value,
            date: form.date.value,
        }

    },

    validateFlieds() {

        const {description, amount, date} = form.getValues()

        if(description.trim() === "" || amount.trim() === "" || date.trim() === ""){

            throw new Error("Por favor, preencha todos os campos")

        }

    },

    formatDatas(){

        let {description, amount, date} = form.getValues()

        amount = utils.formatAmount(amount);

        date = utils.formatDate(date);

        return {

            description,
            amount,
            date,

        }

    },

    saveTransaction(transaction){

        transactionCount.add(transaction)

    },

    clearForm() {

        form.description.value = ""
        form.amount.value = ""
        form.date.value = ""

    },

    submit(event){

        event.preventDefault()

        try{

            form.validateFlieds()

            const transaction = form.formatDatas()

            form.saveTransaction(transaction)

            form.clearForm()

            toggle()

            document.querySelector('#error').classList.remove('visible');

        } catch(error){

            document.querySelector('#error').classList.add('visible');

        }

    }

}

const app = {

    initialize() {

        transactionCount.all.forEach((transaction, index) =>{

            innerTable.addTransaction(transaction, index);

        })

        innerTable.updateBalance()

        storage.set(transactionCount.all)

    },

    reload() {

        innerTable.clearTable()
        app.initialize()
    }

}

const clearTable ={

    modal(){

        let modalOpen = document.querySelector('#modal-clean').classList.contains('active');

        if (modalOpen == false){

            document.querySelector('#modal-clean').classList.add('active');

        } else {
            document.querySelector('#modal-clean').classList.remove('active');
        }

    },

    clear(){

        transactionCount.all = []
        
        clearTable.modal()

        app.reload()

    }

}

app.initialize()
