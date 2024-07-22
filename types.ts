export interface Transaction{
    id: number;
    category_id :number;
    amount: number;
    date : number;
    description : string;
    type : "Expense" | "Income";
}