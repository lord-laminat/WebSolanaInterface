// Базовый скрипт для взаимодействия с Solana
// Установите необходимые зависимости:
// npm install @solana/web3.js

const { LAMPORTS_PER_SOL } = require('@solana/web3.js');

// Функция для проверки баланса кошелька
async function getBalance(connection, publicKey) {
  try {
    // Получаем баланс
    const balance = await connection.getBalance(publicKey);

    // Конвертируем ламports в SOL (1 SOL = 1,000,000,000 lamports)
    const solBalance = balance / LAMPORTS_PER_SOL;

    const outputData = `Balance: ${solBalance} SOL`;

    return outputData;
  } catch (error) {
    console.error('Error checking the balance:', error);
    return 0;
  }
}

// Функция для получения информации об аккаунте
async function getAccountInfo(connection, publicKey) {
  try {
    // Получаем информацию об аккаунте
    const accountInfo = await connection.getAccountInfo(publicKey);

    let outputData = '';

    if (accountInfo) {
      outputData = `Owner: ${accountInfo.owner.toString()}<br>Executable: ${accountInfo.executable}<br>Data length: ${accountInfo.data.length} bytes`;
    } else {
      outputData = 'The account was not found or does not contain any data';
    }

    return outputData;
  } catch (error) {
    console.error('Error when receiving account information:', error);
    return null;
  }
}

// Функция для получения последних транзакций
async function getRecentTransactions(connection, publicKey, limit = 30) {
  try {
    // Получаем подписи последних транзакций
    const signatures = await connection.getSignaturesForAddress(publicKey, { limit });

    if (signatures.length === 0) {
      return [];
    }

    // Проходим по каждой подписи и получаем подробную информацию
    const transactionsInfo = await Promise.all(
      signatures.map(async (signatureInfo) => {
        const txInfo = await connection.getTransaction(signatureInfo.signature);
        return {
          signature: signatureInfo.signature,
          timestamp: new Date(signatureInfo.blockTime * 1000).toLocaleString(),
          successful: signatureInfo.confirmationStatus === 'finalized',
          details: txInfo
        };
      })
    );

    // Выводим информацию о транзакциях
    let transactionsArray = [];

    transactionsInfo.forEach((tx, index) => {

      const transactionBlock = `
          <div class="transactions__item">
            <p class="transactions__value">
              <span class="transactions__description">Transaction ${index + 1}: </span>
            </p>
            <p class="transactions__value">
              <span class="transactions__description">Signature: </span>
              ${tx.signature}
            </p>
            <p class="transactions__value">
              <span class="transactions__description">Time: </span>
              ${tx.timestamp}
            </p>
            <p class="transactions__value">
              <span class="transactions__description"Status: </span>
              ${tx.successful}
            </p>
          </div>
        `;
      transactionsArray.push(transactionBlock);
    });
    
    return transactionsArray.reverse();
  } catch (error) {
    console.error('Error when receiving transactions:', error);
    return [];
  }
}

// Получение информации о блокчейне Solana
async function getNetworkInfo(connection) {
  try {
    // Получаем версию
    const version = await connection.getVersion();

    // Получаем высоту блокчейна
    const blockHeight = await connection.getBlockHeight();

    // Получаем информацию о текущем слоте
    const slot = await connection.getSlot();

    // Получаем текущий хеш блока
    const blockhash = await connection.getLatestBlockhash();

    const outputData = `Net version: ${version['solana-core']}<br>Blockchain height: ${blockHeight}<br>Current slot: ${slot}<br>Current block hash: ${blockhash.blockhash}`;

    return outputData;
  } catch (error) {
    console.error('Error when receiving network information:', error);
    return null;
  }
}

// Экспортируем функции для использования в других модулях
module.exports = {
  getBalance,
  getAccountInfo,
  getRecentTransactions,
  getNetworkInfo
};
