// Базовый скрипт для взаимодействия с Solana
// Установите необходимые зависимости:
// npm install @solana/web3.js

const { Connection, PublicKey, Keypair, LAMPORTS_PER_SOL } = require('@solana/web3.js');

// Функция для проверки баланса кошелька
async function getBalance(connection, publicKey) {
  try {
    // Получаем баланс
    const balance = await connection.getBalance(publicKey);

    // Конвертируем ламports в SOL (1 SOL = 1,000,000,000 lamports)
    const solBalance = balance / LAMPORTS_PER_SOL;

    const outputData = `Баланс: ${solBalance} SOL`;

    return outputData;
  } catch (error) {
    console.error('Ошибка при проверке баланса:', error);
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
      outputData = `Владелец: ${accountInfo.owner.toString()}<br>Исполняемый: ${accountInfo.executable}<br>Размер данных: ${accountInfo.data.length} байт`;
      //console.log('Информация об аккаунте:');
      //console.log(`Владелец: ${accountInfo.owner.toString()}`);
      //console.log(`Исполняемый: ${accountInfo.executable}`);
      //console.log(`Размер данных: ${accountInfo.data.length} байт`);
    } else {
      outputData = 'Аккаунт не найден или не содержит данных';
    }

    return outputData;
  } catch (error) {
    console.error('Ошибка при получении информации об аккаунте:', error);
    return null;
  }
}

// Функция для создания нового кошелька
// function createNewWallet() {
//   // Генерируем новую ключевую пару
//   const newWallet = Keypair.generate();

//   console.log('Создан новый кошелек:');
//   console.log(`Публичный ключ (адрес): ${newWallet.publicKey.toString()}`);
//   console.log(`Приватный ключ: [${Buffer.from(newWallet.secretKey).toString('hex')}]`);

//   return newWallet;
// }

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
              <span class="transactions__description">Транзакция ${index + 1}: </span>
            </p>
            <p class="transactions__value">
              <span class="transactions__description">Сигнатура: </span>
              ${tx.signature}
            </p>
            <p class="transactions__value">
              <span class="transactions__description">Время: </span>
              ${tx.timestamp}
            </p>
            <p class="transactions__value">
              <span class="transactions__description">Статус: </span>
              ${tx.successful ? 'Успешно' : 'В обработке'}
            </p>
          </div>
        `;
      transactionsArray.push(transactionBlock);
    });
    
    return transactionsArray.reverse();
  } catch (error) {
    console.error('Ошибка при получении транзакций:', error);
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

    const a = await connection.get

    /*
    - Версия Solana
        - Высота блокчейна
        - Текущий слот
        - Хеш текущего блока
        - Текущая эпоха
        - Комиссия за транзакцию
    */

    const outputData = `Версия: ${version['solana-core']}<br>Высота блокчейна: ${blockHeight}<br>Текущий слот: ${slot}<br>Текущий хеш блока: ${blockhash.blockhash}`;

    return outputData;
  } catch (error) {
    console.error('Ошибка при получении информации о сети:', error);
    return null;
  }
}

// Пример использования (исправленный, без запроса airdrop)
// async function main() {
//   try {
//     console.log('===== ДЕМОНСТРАЦИЯ РАБОТЫ С SOLANA =====');

//     // Получаем информацию о сети
//     console.log('\n1. Получение информации о сети:');
//     await getNetworkInfo();

//     // Создаем новый кошелек
//     console.log('\n2. Создание нового кошелька:');
//     const wallet = createNewWallet();
//     const walletAddress = wallet.publicKey.toString();

//     // Получаем информацию об аккаунте
//     console.log('\n3. Получение информации об аккаунте:');
//     await getAccountInfo(walletAddress);

//     // Проверяем баланс
//     console.log('\n4. Проверка баланса:');
//     await getBalance(walletAddress);

//     // Получаем последние транзакции
//     console.log('\n5. Получение последних транзакций:');
//     await getRecentTransactions(walletAddress);

//     console.log('\n===== ДЕМОНСТРАЦИЯ ЗАВЕРШЕНА =====');
//   } catch (error) {
//     console.error('Произошла ошибка в основном процессе:', error);
//   }
// }

// Экспортируем функции для использования в других модулях
module.exports = {
  getBalance,
  getAccountInfo,
  getRecentTransactions,
  getNetworkInfo
};

//main();