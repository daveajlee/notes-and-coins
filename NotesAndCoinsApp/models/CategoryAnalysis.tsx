export class CategoryAnalysis {
    name: string;
    colour: string;
    incomeTotal: number;
    expenseTotal: number;
    count: number;

    constructor(name: string, colour: string, incomeTotal: number, expenseTotal: number, count: number) {
        this.name = name;
        this.colour = colour;
        this.incomeTotal = incomeTotal;
        this.expenseTotal = expenseTotal;
        this.count = count;
    }
}