import { getNetworkInfo, getAccountInfo, getRecentTransactions, getBalance } from '../src/web3.js';
const { Connection, PublicKey } = require('@solana/web3.js');

const root = document.querySelector(':root');
let netRPC = 'https://api.mainnet-beta.solana.com';

// сделать видимой секцию Info Table и Transactions
const infoTable = document.querySelector(".info");
const transactions = document.querySelector(".transactions");
const footer = document.querySelector(".footer");

async function displaySections(walletAddress) {
    // Подключаемся к Solana devnet
    let connection;
    
    connection = new Connection(netRPC, 'confirmed');
    
    // Создаем PublicKey из адреса кошелька
    const publicKey = new PublicKey(walletAddress);


    document.querySelector(".info__item").innerHTML = await getNetworkInfo(connection);
    document.querySelector(".info__item-account").innerHTML = await getAccountInfo(connection, publicKey) + '<br>' + await getBalance(connection, publicKey);
    
    const recentTransactions = await getRecentTransactions(connection, publicKey);
    
    for (let item of document.querySelectorAll(".transactions__item")) {
        item.remove();
    }

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

const devnetBtn = document.querySelector(".header__devnet-btn");
let isDevnet = false;

devnetBtn.onclick = () => {
    isDevnet = !isDevnet;
    console.debug("Change isDevnet to " + isDevnet);
    
    // devnet colors
    const devnetColor = '#f2aff7';
    const devnetColorHover = '#f2d2f4';
    const mainnetColor = '#80e2da';
    const mainnetColorHover = '#82f6ec';

    if (isDevnet)
    {
        devnetBtn.innerText = 'DevNET';
        root.style.setProperty('--net-btn-color', devnetColor);
        root.style.setProperty('--net-btn-hover-color', devnetColorHover);
        netRPC = 'https://api.devnet.solana.com';
    }
    else
    {
        devnetBtn.innerText = 'MainNET';
        root.style.setProperty('--net-btn-color', mainnetColor);
        root.style.setProperty('--net-btn-hover-color', mainnetColorHover);
        netRPC = 'https://api.mainnet-beta.solana.com';
    }
}


// Если транзакций 0, используй эту функцию, чтобы добавить надпись на пустой блок
const transactionsEmpty = document.querySelector(".transaction__block-empty");
const transactionsItem = document.querySelector(".transactions__item");

function displayTransactionsEmpty() {
    transactionsEmpty.style.display = "block";
    transactionsItem.style.display = "none";
}