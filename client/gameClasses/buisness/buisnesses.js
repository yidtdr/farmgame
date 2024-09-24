class Buisness{
    constructor(number)
    {
        this.cost = businessesProperties[number].cost
        this.income = businessesProperties[number].income
        this.maxCapacity = businessesProperties[number].maxCapacity
        this.unlocked = false
        this.invested = 0
        this.canClaim = false
        this.level = 1
        this.investmentTimeStamp = undefined
        this.timeToEnd = undefined
        this.canInvest = true
    }
    update(){
        this.timeToEnd = this.investmentTimeStamp && this.investmentTimeStamp > Date.now() ? this.investmentTimeStamp - Date.now() : 0
        if (this.investmentTimeStamp && this.timeToEnd == 0){
            this.canClaim = true
            this.canInvest = true
        }
    }
}

const businessesProperties = {
    1: {cost: 525, income: 0.018, maxCapacity: 2000},
    2: {cost: 1005, income: 0.035, maxCapacity: 2880},
    3: {cost: 1925, income: 0.067, maxCapacity: 4147},
    4: {cost: 3687, income: 0.128, maxCapacity: 5971},
    5: {cost: 7061, income: 0.246, maxCapacity: 8598}
}

const businesses = [];
for (let i = 1; i <= 5; i++) {
    businesses.push(new Buisness(i))
}
export default businesses