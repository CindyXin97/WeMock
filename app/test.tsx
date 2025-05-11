"use client";

import { Button } from "@/components/ui/button";

export default function TestPage() {
  return (
    <div className="p-8 max-w-lg mx-auto">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Tailwind Test</h1>
      <p className="text-gray-700 mb-6">This page tests if Tailwind classes are working correctly.</p>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-red-100 p-4 rounded-md">Red background</div>
        <div className="bg-blue-100 p-4 rounded-md">Blue background</div>
        <div className="bg-green-100 p-4 rounded-md">Green background</div>
        <div className="bg-yellow-100 p-4 rounded-md">Yellow background</div>
      </div>
      
      <div className="mt-6 flex gap-4">
        <Button variant="default">Default Button</Button>
        <Button variant="outline">Outline Button</Button>
      </div>
    </div>
  );
} 