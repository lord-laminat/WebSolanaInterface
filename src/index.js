import { getNetworkInfo, getAccountInfo, getRecentTransactions, getBalance } from '../src/web3.js';
const { Connection, PublicKey } = require('@solana/web3.js');


// сделать видимой секцию Info Table и Transactions
const infoTable = document.querySelector(".info");
const transactions = document.querySelector(".transactions");
const footer = document.querySelector(".footer");

async function displaySections(walletAddress) {
    // Подключаемся к Solana devnet
    const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

    // Создаем PublicKey из адреса кошелька
    const publicKey = new PublicKey(walletAddress);

    document.querySelector(".info__item").innerHTML = await getNetworkInfo(connection);
    document.querySelector(".info__item-account").innerHTML = await getAccountInfo(connection, publicKey) + '<br>' + await getBalance(connection, publicKey);
    
    const recentTransactions = await getRecentTransactions(connection, publicKey);

    if (recentTransactions.length != 0) {
        for (let arrayElement of recentTransactions) {
            document.querySelector(".transactions__block").insertAdjacentHTML("afterbegin", arrayElement);
        }
        transactions.style.display = "block";
    }

    infoTable.style.display = "block";
    footer.style.display = "block";
}


// кошелёк
const walletInput = document.querySelector(".wallet-input");
const walletBtn = document.querySelector(".wallet-btn");

walletBtn.onclick = () => {
    if (walletInput.value != "") {
        // Переменная со значением введённого кошелька
        const walletInputValue = walletInput.value;

        displaySections(walletInputValue);
    }
}


// Если транзакций 0, используй эту функцию, чтобы добавить надпись на пустой блок
const transactionsEmpty = document.querySelector(".transaction__block-empty");
const transactionsItem = document.querySelector(".transactions__item");

function displayTransactionsEmpty() {
    transactionsEmpty.style.display = "block";
    transactionsItem.style.display = "none";
}