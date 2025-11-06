import { useState, useEffect } from "react";
import { Toaster } from "sonner";
import { CourseEvaluator } from "./CourseEvaluator";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1 p-8">
        <div className="w-full max-w-4xl mx-auto">
          <Content />
        </div>
      </main>
      <Toaster />
    </div>
  );
}

function Content() {
  const checkAuthentication = async () => {
    try {
      const response = await fetch('/api/v1/evaluations', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Failed to check authentication:', error);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <CourseEvaluator />
    </div>
  );
}
