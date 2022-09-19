async function flipCoinAnimation(i) {
    coin.style.animation = "none";
    console.log(i)
    if(i == 1){
        setTimeout(function(){
            coin.style.animation = "spin-tails 3s forwards";
        }, 100);
    } else {
        setTimeout(function(){
            coin.style.animation = "spin-heads 3s forwards";
        }, 100);
    }
};