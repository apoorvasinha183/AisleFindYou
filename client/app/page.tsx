// client/app/page.tsx
'use client';

import { useState, FormEvent } from 'react'; // Import FormEvent for form handling

export default function Home() {
  // State for the text currently in the input box
  const [newItem, setNewItem] = useState('');
  // State for the list of grocery items the user has added
  const [groceryList, setGroceryList] = useState<string[]>([]);
  // State to hold the final result from the backend (we'll use this in the next step)
  const [result, setResult] = useState('');

  // This function runs when the user submits the form (clicks "Add Item")
  const handleAddItem = (event: FormEvent) => {
    event.preventDefault(); // Prevents the browser from reloading the page

    // Basic validation: don't add empty items
    if (!newItem.trim()) return; 

    // Add the new item to our groceryList state array
    setGroceryList([...groceryList, newItem.trim().toLowerCase()]);
    
    // Clear the input box for the next item
    setNewItem('');
  };

  // --- Replace the old handleCalculate function with this one ---

  const handleCalculate = async () => {
    // If the list is empty, do nothing.
    if (groceryList.length === 0) return;

    // Set a loading message while we wait for the backend.
    setResult('Calculating...');

    try {
      // Use fetch to make a POST request to our new endpoint.
      const response = await fetch('http://localhost:8000/api/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Send our groceryList state as the request body.
        body: JSON.stringify({ items: groceryList }),
      });

      const data = await response.json();

      // Update the result state with the response from the backend.
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
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-extrabold mb-2">AisleFindYou</h1>
          <p className="text-lg text-gray-400">Build your list, find the cheapest route.</p>
        </div>

        {/* Form for adding items */}
        <form onSubmit={handleAddItem} className="flex gap-2 mb-6">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="e.g., milk, eggs, bread"
            className="flex-grow p-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md transition-colors"
          >
            Add Item
          </button>
        </form>

        {/* Grocery List Display */}
        <div className="bg-gray-800 rounded-lg p-6 min-h-[200px]">
          <h2 className="text-2xl font-bold mb-4">Your Grocery List</h2>
          {groceryList.length === 0 ? (
            <p className="text-gray-500">Your list is empty. Add items above.</p>
          ) : (
            <ul className="list-disc list-inside space-y-2">
              {groceryList.map((item, index) => (
                <li key={index} className="text-lg capitalize">
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {/* Calculate Button */}
        <div className="mt-6 text-center">
            <button
                onClick={handleCalculate}
                disabled={groceryList.length === 0}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
                Find Cheapest Store
            </button>
        </div>

        {/* Result Display (for the next step) */}
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
