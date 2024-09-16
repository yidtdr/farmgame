const tonweb = new window.TonWeb();

const WALLET_ADRESS = "UQAr2S7H-w148h9N97NI17bqSW8v9TLV8V7Scp60KiM4fewU";
const TELEGRAM_ID = "1770661619"

const availibleDeals = JSON.parse(`{
    "Deal_test_1": {
        "name": "Deal_test_1",
        "tonPrice": 500000,
        "reward": {
            "token": 2000000001,
            "boosters": [
                {
                    "boosterType": "WorkSpeed",
                    "percentage": 20,
                    "time": 100
                }
            ]
        }
    },
    "Deal_test_2": {
        "name": "Deal_test_2",
        "reward": {
            "token": 2000000001,
            "boosters": [
                {
                    "boosterType": "WorkSpeed",
                    "percentage": 20,
                    "time": 100
                },
                {
                    "boosterType": "WorkSpeed",
                    "percentage": 50,
                    "time": 1000
                }
            ]
        }
    },
    "Deal_test_3": {
        "name": "Deal_test_3",
        "tonPrice": 500000,
        "reward": {
            "token": 2000000001,
            "boosters": [
                {
                    "boosterType": "OrderItems",
                    "percentage": 80,
                    "time": 100
                },
                {
                    "boosterType": "OrderMoney",
                    "percentage": 200,
                    "time": 100
                },
                {
                    "boosterType": "GrowSpeed",
                    "percentage": 200,
                    "time": 100
                }
            ]
        }
    }
}`)

class PayMenu {
    constructor() {
        this.walletDisconnected();

        this.tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
            manifestUrl: 'https://www.jsonkeeper.com/b/TE7Z',
            buttonRootId: "ton-connect-button"
        });

        this.tonConnectUI.onStatusChange((wallet) => {
            if (wallet) {
                this.walletConnected();
            }
            else
            {
                this.walletDisconnected();
            }
        })

        document.getElementById('open-connect').onclick = () => {
            document.getElementById("payment-wrap").style.display = 'flex';
        }
    }

    drawPayMenu() {
        document.getElementById("deals-wrap").style.display = "none";
        document.getElementById("payment-wrap").style.display = "flex";
    }

    walletConnected() {
        document.getElementById("ton-amount").style.display = "flex";
        document.getElementById("proceed-to-buy").style.display = "flex";
        document.getElementById("proceed-to-buy").onclick = async () => {
            const amount = parseInt(document.getElementById("ton-amount").value);
            await this.purchaseTon(amount);
        }
    }

    walletDisconnected() {
        document.getElementById("ton-amount").style.display = "none";
        document.getElementById("proceed-to-buy").style.display = "none";
    }

    async generatePayload(amount) {
        let a = new tonweb.boc.Cell();
        a.bits.writeUint(0, 32);
        a.bits.writeString(`${amount}`);
        let payload = tonweb.utils.bytesToBase64(await a.toBoc());
        return payload
    }

    async purchaseTon(amount) {

        // VERIFY AMOUNT PLS

        var payload = await this.generatePayload(TELEGRAM_ID);

        const transaction = {
            validUntil: Math.floor(Date.now() / 1000) + 60, // 60 sec
            messages: [
                {
                    address: WALLET_ADRESS,
                    amount: `${amount}`,
                    payload: `${payload}`
                }
            ]
        }
        
        try {
            const result = await this.tonConnectUI.sendTransaction(transaction);
            const someTxData = await myAppExplorerService.getTransaction(result.boc);
            console.log('Transaction successful:', someTxData);
        } catch (e) {
            console.error('Transaction failed:', e);
        }
    }
}

const pm = new PayMenu();

class DealsMenu
{
    constructor() {
        document.getElementById("open-deals").onclick = () => {
            document.getElementById("deals-wrap").style.display = 'flex';
        }

        document.getElementById("close-deals").onclick = () => {
            document.getElementById("deals-wrap").style.display = "none";
        }

        document.getElementById("buy-usdt").onclick = () => {
            document.getElementById("deals-wrap").style.display = "none";
            pm.drawPayMenu();
        }

        document.getElementById("buy-ton").onclick = () => {
            document.getElementById("deals-wrap").style.display = "none";
            pm.drawPayMenu();
        }

        this.drawDealsMenu();
    }

    drawDealsMenu() {
        const dealsWrap = document.getElementById("deals-list");

        for (const dealKey in availibleDeals) {
            const deal = availibleDeals[dealKey];

            const dealDiv = document.createElement("div");
            dealDiv.className = "deal";
            
            let dealContent = `<h3>${deal.name}</h3>`;
            
            if (deal.tonPrice) {
                dealContent += `<p>Price: ${deal.tonPrice} TON</p>`;
            }

            dealContent += `<p>Token: ${deal.reward.token}</p>`;
            dealContent += `<h4>Boosters:</h4><ul>`;

            for (const booster of deal.reward.boosters) {
                dealContent += `<li>Type: ${booster.boosterType}, Percentage: ${booster.percentage}%, Time: ${booster.time}s</li>`;
            }

            dealContent += `</ul>`;

            dealDiv.innerHTML = dealContent;
            dealsWrap.appendChild(dealDiv);
        }
    }
}

export const dealmenu = new DealsMenu();