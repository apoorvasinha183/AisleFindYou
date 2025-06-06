// client/app/page.tsx (Upgraded for Quantity)
'use client';

import { useState, FormEvent } from 'react';

// Define the type for an item in our grocery list state
interface GroceryItem {
  name: string;
  quantity: number;
}

export default function Home() {
  const [newItemName, setNewItemName] = useState('');
  const [newItemQty, setNewItemQty] = useState(1);
  const [groceryList, setGroceryList] = useState<GroceryItem[]>([]);
  const [result, setResult] = useState('');

  const handleAddItem = (event: FormEvent) => {
    event.preventDefault();
    const itemName = newItemName.trim().toLowerCase();
    if (!itemName) return;

    // Check if item already exists in the list
    const existingItem = groceryList.find(item => item.name === itemName);

    if (existingItem) {
      // If item exists, just update its quantity
      const updatedList = groceryList.map(item =>
        item.name === itemName
          ? { ...item, quantity: item.quantity + newItemQty }
          : item
      );
      setGroceryList(updatedList);
    } else {
      // If item is new, add it to the list
      setGroceryList([...groceryList, { name: itemName, quantity: newItemQty }]);
    }

    // Reset input fields
    setNewItemName('');
    setNewItemQty(1);
  };

  const handleRemoveItem = (indexToRemove: number) => {
    setGroceryList(groceryList.filter((_, index) => index !== indexToRemove));
  };

  const handleCalculate = async () => {
    if (groceryList.length === 0) return;
    setResult('Calculating...');

    try {
      // The body of the request now perfectly matches what the backend expects
      const response = await fetch('http://localhost:8000/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: groceryList }),
      });
      const data = await response.json();
      const resultText = `The cheapest store is ${data.store_name} with a total cost of $${data.total_cost.toFixed(2)}`;
      setResult(resultText);
    } catch (error) {
      console.error('Failed to calculate:', error);
      setResult('Could not get a result. Is the backend running?');
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-6 md:p-12 bg-gray-900 text-white">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-extrabold mb-2">AisleFindYou</h1>
          <p className="text-lg text-gray-400">Add items and quantities to find the best deal.</p>
        </div>
        <form onSubmit={handleAddItem} className="flex gap-2 mb-6 items-center">
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="e.g., milk"
            className="flex-grow p-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            value={newItemQty}
            onChange={(e) => setNewItemQty(parseInt(e.target.value, 10))}
            min="1"
            className="w-20 p-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md transition-colors">
            Add
          </button>
        </form>
        <div className="bg-gray-800 rounded-lg p-6 min-h-[200px]">
          <h2 className="text-2xl font-bold mb-4">Your Grocery List</h2>
          {groceryList.length === 0 ? (
            <p className="text-gray-500">Your list is empty. Add items above.</p>
          ) : (
            <ul className="space-y-2">
              {groceryList.map((item, index) => (
                <li key={index} className="flex justify-between items-center bg-gray-700/50 p-2 rounded-md">
                  <span className="text-lg capitalize">{item.name} <span className="text-sm text-gray-400 font-mono">(Qty: {item.quantity})</span></span>
                  <button onClick={() => handleRemoveItem(index)} className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-1 px-2 rounded-full" aria-label={`Remove ${item.name}`}>✕</button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="mt-6 text-center">
          <button onClick={handleCalculate} disabled={groceryList.length === 0} className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed">
            Find Cheapest Store
          </button>
        </div>
        {result && (
          <div className="mt-8 text-center bg-blue-900/50 border border-blue-700 p-6 rounded-lg">
            <h3 className="text-2xl font-bold">Result:</h3>
            <p className="text-xl mt-2">{result}</p>
          </div>
        )}
      </div>
    </main>
  );
}