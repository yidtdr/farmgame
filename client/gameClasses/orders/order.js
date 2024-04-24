export default class Order{
    constructor(inventory)
    {
        this._info = {
            cost: 0,
            items: {}
        }
        this.genRandomOrder(inventory);
    }
    genRandomOrder(inventory)
    {
        let i = Math.floor(Math.random() * (5)+1); //от 1 до 5 предметов в заказе
        let keys = Object.keys(inventory);
        for (let index = 0; index < i; index++) {
            let quantity = Math.floor(Math.random() * 11 + 1); // можно изменить взависимости от сложности предмета 
            this._info.items[keys[Math.floor(Math.random() * keys.length)]] = quantity;
            this._info.cost += Math.floor(Math.random() * (100)+1); // можно изменить взависимости от сложности предмета 
        }
    }
}