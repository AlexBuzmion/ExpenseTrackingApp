import { format } from 'date-fns';
import { categories } from '@/store/expenseListStore';
import uuid from 'react-native-uuid';

type ExpenseEntry = {
    id: string;
    name: string;
    date: string;
    category: string;
    subcategory: string;
    subtotal: number;
    hst: number;
    total: number;
    creationDate: string;
};

const getRandomElement = <T>(array: T[]): T => {
    return array[Math.floor(Math.random() * array.length)];
};

const getRandomDate = (): string => {
    const end = new Date();
    const start = new Date();
    start.setFullYear(end.getFullYear() - 1);
    const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return format(randomDate, 'yyyy-MM-dd');
}

export const generateExampleExpenses = (count: number): ExpenseEntry[] => { // Return ExpenseEntry[]
    const exampleExpenses: ExpenseEntry[] = [];
    const categoryKeys = Object.keys(categories);

    for (let i = 0; i < count; i++) {
        const category = getRandomElement(categoryKeys);
        const subcategory = getRandomElement(categories[category] || []);
        const subtotal = parseFloat((Math.random() * 100).toFixed(2));
        const hst = parseFloat((subtotal * 0.13).toFixed(2));
        const total = parseFloat((subtotal + hst).toFixed(2));
        const date = getRandomDate();

        exampleExpenses.push({
            id: uuid.v4() as string, // Generate the ID here
            name: `Example Expense ${i + 1}`,
            date: date,
            category: category,
            subcategory: subcategory,
            subtotal: subtotal,
            hst: hst,
            total: total,
            creationDate: new Date().toISOString(),
        });
    }

    return exampleExpenses;
};