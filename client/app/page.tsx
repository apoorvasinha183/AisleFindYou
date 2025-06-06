// client/app/page.tsx

// This directive tells Next.js that this is a Client Component,
// which allows us to use interactive features like state and effects.
'use client'; 

// We import React's hooks for managing state and side effects.
import { useState, useEffect } from 'react';

export default function Home() {
  // 'useState' creates a state variable to hold our message from the API.
  // It starts with a default value of 'Loading...'.
  const [apiMessage, setApiMessage] = useState('Loading message from API...');

  // 'useEffect' runs code after the component has loaded in the browser.
  // The empty array [] at the end means it will only run ONCE.
  useEffect(() => {
    // This is an async function to fetch data from our backend.
    const fetchMessage = async () => {
      try {
        // We use the 'fetch' API to make a GET request to our backend endpoint.
        // Docker automatically makes our 'server' service available at localhost:8000.
        const response = await fetch('http://localhost:8000/api/test');
        const data = await response.json(); // Parse the JSON response
        
        // Update our state variable with the message from the backend.
        setApiMessage(data.message);
      } catch (error) {
        console.error('Failed to fetch message from API:', error);
        setApiMessage('Could not connect to the backend API.');
      }
    };

    fetchMessage(); // Call the function to run it.
  }, []); 

  // This is the JSX that gets rendered to the screen.
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-900 text-white">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4">AisleFindYou</h1>
        <p className="text-lg text-gray-400">Your full-stack app is now connected!</p>
        
        <div className="mt-8 p-6 border border-gray-700 rounded-lg bg-gray-800 w-full max-w-md">
          <p className="text-md font-sans">Message from Backend:</p>
          <p className="text-xl font-mono p-4 bg-black rounded-md mt-2 break-all">
            {/* The 'apiMessage' state variable is displayed here */}
            {apiMessage}
          </p>
        </div>
      </div>
    </main>
  );
}
