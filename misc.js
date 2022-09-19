function cleanErrors() {
    document.getElementById('errorMsg').innerHTML = null;
}

async function placeBet() {
    let maxBet = await getMaxBet();
    let currentBid = document.getElementById('bidAmount').value;
    let currentBidWei = Web3.utils.toWei(currentBid, 'ether');
    let bidValid = parseInt(currentBidWei) <= parseInt(maxBet);
    let winBalance = await getWinBalanceByAddress();
    let winBalanceZero = winBalance == 0;
    if (bidValid && winBalanceZero) {
        cleanErrors();
        let bet0 = document.getElementById('radio0').checked;

        let account = await getCurrentAccount();

            window.contract.methods.placeBet((bet0) ? 0 : 1)
            .send({ from: account, value: currentBidWei })
            .on('transactionHash', function(hash){
                console.log('hash')
                document.getElementById("loader").style.display = 'block';
                document.getElementById("betAmountSelect").style.display = 'none';
                document.getElementById("placeBetBtn").style.display = 'none';
                lookForPendingAndRefresh();
            })
            .on('receipt', function(receipt) {
                console.log('receipt')
                //lookForPendingAndRefresh();
            })
            .on('error', function(error){
                console.log('error')
                refreshWinBalance();
            })
    } else {
        await refreshMaxBet();
        await refreshWinBalance();
        document.getElementById('errorMsg').innerHTML = (winBalanceZero) ? 'This bet exceed max possible bet' : 'First withdraw/double win_balance';
    }
}

async function placeDoubleBet() {
    let maxBet = await getMaxBet();
    let currentBidWei = await getWinBalanceByAddress()
    bidValid = currentBidWei < parseInt(maxBet);
    let winBalanceZero = currentBidWei == 0;
    if (bidValid && !winBalanceZero) {
        cleanErrors();
        let bet0 = document.getElementById('radio0').checked;

        let account = await getCurrentAccount();

        window.contract.methods.doubleBet((bet0) ? 0 : 1)
        .send({ from: account })
        .on('transactionHash', function(hash){
            console.log('hash')
            document.getElementById("loader").style.display = 'block';
            document.getElementById("doubleBetBtn").style.display = 'none';
            document.getElementById("withdrawBtn").style.display = 'none';
            lookForPendingAndRefresh();
        })
        .on('receipt', function(receipt) {
            console.log('receipt')
            //lookForPendingAndRefresh();
        })
        .on('error', function(error){
            console.log('error')
            refreshWinBalance();
        })


    } else {
        if (!bidValid) await refreshMaxBet();
        await refreshWinBalance();
        document.getElementById('errorMsg').innerHTML = (winBalanceZero) ? 'You need win_balance to double bet' : 'This bet exceed max possible bet, please withdraw';
    }
}

async function lookForPendingAndRefresh() {
    console.log('lookForPendingAndRefresh')
    getLastBet().then(lastBet => {
        console.log(lastBet.status)
        if (lastBet.amount != '0' && lastBet.status == '0') {
            refreshLastBet();
        } else {
            //lookForPendingAndRefresh();
            setTimeout(() => {lookForPendingAndRefresh()}, 500); 
        }
    })
}

async function withdraw() {
    let winBalace = await getWinBalanceByAddress()
    if (winBalace > 0) {
        cleanErrors();
        withdrawWinBalance().then(res =>{
            refreshWinBalance().then(res2 => {
                setBetAmount(1)
            })
        })
    }
}

function updateInfo(elementId, value) {
    const element = document.getElementById(elementId);
    element.innerHTML = value;
}

function reverseArr(input) {
    var ret = new Array;
    for (var i = input.length - 1; i >= 0; i--) {
        ret.push(input[i]);
    }
    return ret;
}

/* async function refreshHistory() {
    let history = await getHistory()
    if (history.length > 0) {
        let tbodyRef = document.getElementById('historyTable').getElementsByTagName('tbody')[0];
        tbodyRef.innerHTML = null;
        reverseArr(history).forEach(el => {

            // Insert a row at the end of table
            let newRow = tbodyRef.insertRow();

            newRow.style.color = (el.status == 1) ? 'green' : 'red'

            // Insert a cell at the end of the row
            let newCell = newRow.insertCell();

            // Append a text node to the cell
            let etherValue = Web3.utils.fromWei(el.amount, 'ether')
            let status = (el.status == 1) ? 'W' : 'L';
            let time = new Date(el.timestamp * 1e3).toISOString()
            let bet = (el.bet == 0) ? 'Testa' : 'Croce'

            //let newText = document.createTextNode('Address: ' + el.addr + ', Amount: ' + etherValue + ' ETH' + ', Bet: ' + el.bet + ', Status: ' + status);
            let newText = document.createTextNode('Amount: ' + etherValue + ' ETH' + ', Bet: ' + bet + ', Status: ' + status + ', Time: ' + time);

            newCell.appendChild(newText);


        })
    }
} */

/* async function refreshHistoryByAddress() {
    let history = await getHistoryByAddress()
    let amount = 0;
    if (history.length > 0) {
        history.forEach(el => {
            amount = (el.status == 1) ? amount + parseInt(el.amount) : amount - parseInt(el.amount);
        })
    }
} */

function pingRandomManager() {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", "https://random-manager-sheesh.herokuapp.com/", true ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

let isWaitingPendingBet = false;
let pendingCount = 0;
async function refreshLastBet() {
    console.log('refresh')
    let lastBet = await getLastBet();
    if (lastBet.amount != '0') {
        if (document.getElementById("lastBet").innerHTML == '') refreshLastBetStatus(false, lastBet);
        console.log('PENDING: ' + (lastBet.status == '0'))
        if (lastBet.status == '0') {
            pendingCount++;
            if (pendingCount > 14) {
                console.log('pingo')
                try {
                    pingRandomManager();
                } catch {console.log}
                pendingCount = 0;
            }
            console.log('Rileggo info in 2000ms');
            console.log(pendingCount)
            isWaitingPendingBet = true;
            await refreshLastBetStatus(false, lastBet)
            setTimeout(() => {
                refreshLastBet()
            }, 5000);
        } else if (isWaitingPendingBet) {
            isWaitingPendingBet = false;
            await refreshLastBetStatus(true, lastBet);
        }
    } else {
        let lastBetInfos = 'No previous bet avaible';
        updateInfo('lastBet', lastBetInfos);
    }
}

async function refreshMaxBet() {
    let maxBet = await getMaxBet();    
    maxBetStr = Web3.utils.fromWei(maxBet, 'ether');
    if (maxBetStr.length > 6) maxBetStr = maxBetStr.substring(0, 6)
    updateInfo('maxBet', `Max Bet: ${maxBetStr} BNB`);
}

async function refreshGameStatus() {
    let gameStatus = await getGameStatus();
    updateInfo('gameStatus', `Game Status: ${(gameStatus == 1) ? 'OPEN' : 'CLOSED'}`);
}

async function refreshWinBalance() {
    let winBalance = await getWinBalanceByAddress();
    setCorrectViewByWinBalance(winBalance == 0);
    if (winBalance > 0) {
        document.getElementById("winBalance").style.display = 'inline-block';
        updateInfo('winBalance', `${Web3.utils.fromWei(winBalance, 'ether')} BNB`);
        setBetAmount(0);
    } else {
        document.getElementById("winBalance").style.display = 'none';
        updateInfo('winBalance', '');
        setBetAmount(1);
    }
}

function refreshAll() {
    refreshMaxBet();
}

async function refreshLastBetStatus(flipCoin, lastBet) {
    if (flipCoin) {     
        pendingCount = 0;
        console.log('flippo')
        console.log(lastBet.status)
        console.log(lastBet.bet)
        document.getElementById("loader").style.display = 'none';
        await flipCoinAnimation((lastBet.status == '1') ? lastBet.bet : (lastBet.bet == 1) ? 0 : 1)
    }
    setTimeout(() => {
        let status;
        switch (lastBet.status) {
            case '0':
                status = 'PENDING';
                break;
            case '1':
                status = 'YOU WON';
                break;
            case '2':
                status = 'YOU LOOSE';
                break;
        }
        let bet = (lastBet.bet == 0) ? 'Heads' : 'Tails'
        let etherValue = Web3.utils.fromWei(lastBet.amount, 'ether');
        let lastBetInfos = etherValue + ' BNB, ' + bet + ', ' + status;
        document.getElementById('lastBetTable').style.backgroundColor = (lastBet.status == '0') ? 'yellow' : (lastBet.status == '1') ? 'green' : (lastBet.status == '2') ? 'red' : 'transparent';
        updateInfo('lastBet', lastBetInfos);
        refreshWinBalance();
    }, (flipCoin) ? 5000 : 0);

}

function setCorrectViewByWalletConnected(walletConnected) {
    if (walletConnected) {
        document.getElementById("container-disconnected").style.display = 'none';
        document.getElementById("container-connected").style.display = 'block';
    }
}

async function setCorrectViewByWinBalance(winBalanceZero) {
    let lastBet = await getLastBet();
    let isPendingBet = (lastBet.amount != '0' && lastBet.status == '0');
    if (isPendingBet) {
        document.getElementById("loader").style.display = 'block';
        document.getElementById("betAmountSelect").style.display = 'none';
        document.getElementById("placeBetBtn").style.display = 'none';
        document.getElementById("doubleBetBtn").style.display = 'none';
        document.getElementById("withdrawBtn").style.display = 'none';
    } else {
        document.getElementById("loader").style.display = 'none';
        if (winBalanceZero) {
            document.getElementById("betAmountSelect").style.display = 'block';
            document.getElementById("placeBetBtn").style.display = 'inline-block';
            document.getElementById("doubleBetBtn").style.display = 'none';
            document.getElementById("withdrawBtn").style.display = 'none';
        } else {
            document.getElementById("betAmountSelect").style.display = 'none';
            document.getElementById("placeBetBtn").style.display = 'none';
            document.getElementById("doubleBetBtn").style.display = 'inline-block';
            document.getElementById("withdrawBtn").style.display = 'inline-block';
        }
    }
}

bidBudgets = ['0.01', '0.03', '0.05', '0.1', '0.2', '0.5', '1']
function setBetAmount(bidBudget) {
    let bidAmount = bidBudgets[bidBudget - 1];

        var els = document.getElementsByClassName("bidAmountBtn");
        elcounter = 0;
            Array.prototype.forEach.call(els, function(el) {
                if (elcounter == bidBudget) {
                    el.classList.add("bidAmountBtnSelected");
                    el.classList.remove("bidAmountBtnUnselected");   
                } else {
                    el.classList.remove("bidAmountBtnSelected");
                    el.classList.add("bidAmountBtnUnselected");
                } 
                elcounter++;
            });
            document.getElementById("bidAmount").value = bidAmount;
}

function onOffBidAmounts(enable) {
    var els = document.getElementsByClassName("bidAmountBtn");
    elcounter = 0;
        Array.prototype.forEach.call(els, function(el) {
            if (enable) {
                el.disabled = false;  
            } else if (elcounter > 0) {
                el.disabled = true;
                el.classList.remove("bidAmountBtnSelected");
                el.classList.add("bidAmountBtnUnselected");
            }
            elcounter++;
        });
}


function showLastBet() {
    let status = document.getElementById("lastBetTable").style.display;
    if (status == 'none') {
        document.getElementById("lastBetTable").style.display = 'table';
    } else {
        document.getElementById("lastBetTable").style.display = 'none';
    }
}

function prettyAddr(addr) {
    let firstChars = addr.substring(0, 4)
    let lastChars = addr.substring(addr.length-4, addr.length)
    return firstChars + '...' + lastChars
}

async function showLeaderboard() {
    document.getElementById("modalTitle").innerHTML = 'leaderboard';
    document.getElementById("modal").style.display = 'block';
    document.getElementById("loaderModal").style.display = 'block';

    getHistory().then(res => {
        const uniqueArr = [... new Set(res.map(data => data.addr))];
            let finalArray = [];
            uniqueArr.forEach(addr => {
                finalArray.push({'addr':addr,'totalBet': 0, 'totalWin': 0});
            });

            res.forEach(bet => {
                finalArray.forEach(bettor => {
                    if (bet.addr == bettor.addr) {
                        betAmountInEth = Web3.utils.fromWei(bet.amount, 'ether');
                        betAmountInEthFloat = parseFloat(betAmountInEth);
                        
                        bettor.totalBet += betAmountInEthFloat;
        
                        /* if (bet.status == "1") {
                            bettor.totalWin += betAmountInEthFloat;
                        } else {
                            bettor.totalWin -= betAmountInEthFloat;       
                        } */
                    }
                })
            })
        
            finalArray.sort((a,b) => (a.totalBet < b.totalBet) ? 1 : ((b.totalBet < a.totalBet) ? -1 : 0));
            

            document.getElementById("loaderModal").style.display = 'none';  

            //injecting table

            tbl = document.getElementById('leaderboard-table-body');
            
            tbl.innerHTML = '';
            leaderboardCounter = 1;
            getCurrentAccount().then(account => { 
                currentAddress = account;
                finalArray.forEach(el => {
                    if (el.totalBet != 0) {
                        let address = (el.addr == currentAddress) ? 'you' : prettyAddr(el.addr)
                        const tr = tbl.insertRow();
                        const tdAddr = tr.insertCell();
                        tdAddr.appendChild(document.createTextNode(`${leaderboardCounter}. ${address}`));
                        const tdTotalBet = tr.insertCell();
                        tdTotalBet.appendChild(document.createTextNode(`${el.totalBet.toFixed(2)}`));
                        /* const tdTotalWin = tr.insertCell();
                        tdTotalWin.appendChild(document.createTextNode(`${el.totalWin.toFixed(4)}`)); */
                        leaderboardCounter ++;
                    }
                })

            })

            document.getElementById("leaderboard-table").style.display = 'table';  
        })
}

async function showHistory() {
            document.getElementById("modalTitle").innerHTML = 'my_matches';
            document.getElementById("modal").style.display = 'block';
            document.getElementById("loaderModal").style.display = 'block';

            getHistoryByAddress().then(res => {
                let finalArray = reverseArr(res);
        
                document.getElementById("loaderModal").style.display = 'none';  
        
                //injecting table
        
                tbl = document.getElementById('p-history-table-body');
        
                tbl.innerHTML = '';
        
                finalArray.forEach(el => {
                        let amount = parseFloat(Web3.utils.fromWei(el.amount, 'ether')).toFixed(2) + ' BNB'
                        let status = (el.status == 1) ? 'Win' : 'Loose';
                        let bet = (el.bet == '0') ? 'Heads' : 'Tails';
        
                        date = new Date(el.timestamp * 1000);
        
                        let dataStr = date.getDate() + '/' + (date.getMonth()+1) + '/' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
        
                        const tr = tbl.insertRow();
                        const tdStatus = tr.insertCell();
                        tdStatus.appendChild(document.createTextNode(`${status}`));
                        const tdBet = tr.insertCell();
                        tdBet.appendChild(document.createTextNode(`${bet}`));
                        const tdAmount = tr.insertCell();
                        tdAmount.appendChild(document.createTextNode(`${amount}`));
                        const tdTimestamp = tr.insertCell();
                        tdTimestamp.appendChild(document.createTextNode(`${dataStr}`));
                })
        
                document.getElementById("p-history-table").style.display = 'table';  
            })    
}

var groupBy = function(xs, key) {
    return xs.reduce(function(rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };
  function getFields(input, field) {
      var output = [];
      for (var i=0; i < input.length ; ++i)
          output.push(input[i][field]);
      return output;
  }
  function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

async function showPublicHistory() {
    document.getElementById("modalTitle").innerHTML = 'history';
    document.getElementById("modal").style.display = 'block';
    document.getElementById("loaderModal").style.display = 'block';

    getHistoryByAddress().then(res => {
        let finalArray = reverseArr(res);
        getHistory().then(res => {
            report = [];
            let groupByAddress = groupBy(res, 'addr');
        
            var getAddressArray = getFields(res, "addr");
            let addressList = getAddressArray.filter(onlyUnique)
            addressList.forEach(_address => {
                address = groupByAddress[_address]
                arr = [];
                let lastReport
                address.forEach(el => { 
                    let betReport = {'addr':el.addr, 'amount':[el.amount], 'status':el.status, 'timestamp':el.timestamp};
                    let lastReportDouble;
                    if (lastReport) {
                        lastReportDouble = parseInt(lastReport.amount) * 2;
                    }
                    if (arr.length == 0 || lastReport.status == '2' || betReport.amount != lastReportDouble) {
                        arr.push(betReport);
                    } else {
                        arr[arr.length -1].amount.push(betReport.amount[0]);
                        arr[arr.length -1].timestamp = betReport.timestamp;
                        arr[arr.length -1].status = betReport.status;
                    }
                    lastReport = betReport;
                })
                report.push(...arr);
            })
            finalArray = report.sort((a,b) => (a.timestamp < b.timestamp) ? 1 : ((b.timestamp < a.timestamp) ? -1 : 0));

                    //injecting table

            let currentAddress;
            tbl = document.getElementById('history-table-body');

            tbl.innerHTML = '';
            
            getCurrentAccount().then(account => {
                currentAddress = account;

                finalArray.forEach(el => {
                    date = new Date(el.timestamp * 1000);
                    let hours = '0' + date.getHours();
                    if (hours.length == 3) {
                        hours = hours.substring(1);
                    }
                    let minutes = '0' + date.getMinutes();
                    if (minutes.length == 3) {
                        minutes = minutes.substring(1);
                    }
                    let seconds = '0' + date.getSeconds();
                    if (seconds.length == 3) {
                        seconds = seconds.substring(1);
                    }
                    let dateStr =  date.getDate() + '/' + (date.getMonth()+1) + '/' + date.getFullYear() + ' ' +   hours + ':' + minutes + ':' + seconds
                    let address = (el.addr == currentAddress) ? 'you' : prettyAddr(el.addr)
                    let status = (el.status == 1) ? 'W' : 'L'
                    const tr = tbl.insertRow();
                    const tdAddress = tr.insertCell();
                    tdAddress.appendChild(document.createTextNode(`${address}`));
                    const tdAmount = tr.insertCell();
                    let amountData = '';
                    let doubleCount = 0;
                    el.amount.forEach(am => {
                        let betInEth = Web3.utils.fromWei(String(am), 'ether')
                        let amount = parseFloat(betInEth).toFixed(2)
                        if (amountData == '') {
                            amountData = amount;
                        } else {
                            doubleCount ++;
                        }
                    })
                    if (doubleCount > 0) {
                        amountData += ' (x' + (doubleCount + 1) + ')';
                    }
                    tdAmount.appendChild(document.createTextNode(`${amountData}`));
                    const tdResult = tr.insertCell();
                    tdResult.appendChild(document.createTextNode(`${status}`)); 
                    const tdDate = tr.insertCell();
                    tdDate.appendChild(document.createTextNode(`${dateStr}`)); 
            })
    
            document.getElementById("loaderModal").style.display = 'none';  
            document.getElementById("history-table").style.display = 'table';
            })          
        })  
    })    
}
     

function closeModal() {
    document.getElementById("history-table").style.display = 'none'; 
    //document.getElementById("p-history-table").style.display = 'none';
    document.getElementById("leaderboard-table").style.display = 'none'; 
    document.getElementById("modal").style.display = 'none';
}


  
