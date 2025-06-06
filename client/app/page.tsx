// client/app/page.tsx
'use client';

import { useState, FormEvent } from 'react';

export default function Home() {
  const [newItem, setNewItem] = useState('');
  const [groceryList, setGroceryList] = useState<string[]>([]);
  const [result, setResult] = useState('');

  const handleAddItem = (event: FormEvent) => {
    event.preventDefault();
    if (!newItem.trim()) return;

    // --- MODIFICATION: Prevent duplicate items ---
    if (groceryList.includes(newItem.trim().toLowerCase())) {
        alert("This item is already on your list.");
        setNewItem('');
        return;
    }

    setGroceryList([...groceryList, newItem.trim().toLowerCase()]);
    setNewItem('');
  };

  // --- NEW FUNCTION: handleRemoveItem ---
  // This function takes the index of the item we want to remove.
  const handleRemoveItem = (indexToRemove: number) => {
    // We use the .filter() method to create a NEW array
    // that includes every item EXCEPT the one at the specified index.
    // This is the standard React way to remove an item from state immutably.
    const updatedList = groceryList.filter((_, index) => index !== indexToRemove);
    setGroceryList(updatedList);
  };

  const handleCalculate = async () => {
    if (groceryList.length === 0) return;
    setResult('Calculating...');

    try {
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
          <p className="text-lg text-gray-400">Build your list, find the cheapest route.</p>
        </div>
        <form onSubmit={handleAddItem} className="flex gap-2 mb-6">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="e.g., milk, eggs, bread"
            className="flex-grow p-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md transition-colors">
            Add Item
          </button>
        </form>
        <div className="bg-gray-800 rounded-lg p-6 min-h-[200px]">
          <h2 className="text-2xl font-bold mb-4">Your Grocery List</h2>
          {groceryList.length === 0 ? (
            <p className="text-gray-500">Your list is empty. Add items above.</p>
          ) : (
            // --- MODIFICATION: Updated list rendering ---
            <ul className="space-y-2">
              {groceryList.map((item, index) => (
                <li key={index} className="flex justify-between items-center bg-gray-700/50 p-2 rounded-md">
                  <span className="text-lg capitalize">{item}</span>
                  <button 
                    onClick={() => handleRemoveItem(index)}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-1 px-2 rounded-full"
                    aria-label={`Remove ${item}`}
                  >
                    ✕
                  </button>
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