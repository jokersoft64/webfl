async function getCurrentAccount() {
    //const accounts = await window.web3.eth.getAccounts();
    const accounts = await web3.eth.getAccounts();
    return accounts[0];
}

async function getHistory() {
    return await window.contract.methods.getHistory().call();
}

async function getHistoryByAddress() {
    let account = await getCurrentAccount();
    return await window.contract.methods.getHistoryByAddress().call({from: account});
}

async function getMaxBet() {
    return await window.contract.methods.maxBet().call();
}

async function getLastBet() {
    let account = await getCurrentAccount();
    return await window.contract.methods.getLastBet().call({from: account});
}

async function getGameStatus() {
    return await window.contract.methods.gameStatus().call();
}

async function getWinBalanceByAddress() {
    let account = await getCurrentAccount();
    return await window.contract.methods.getWinBalanceByAddress().call({from: account});
}

async function withdrawWinBalance() {
    let account = await getCurrentAccount();
    return await window.contract.methods.withdrawWinBalance().send({from: account});
}

async function doubleBet(bet0) {
    let account = await getCurrentAccount();
    return await window.contract.methods.doubleBet((bet0) ? 0 : 1).send({from: account});
}

