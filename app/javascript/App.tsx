import { useState, useEffect } from "react";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { CourseEvaluator } from "./CourseEvaluator";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm h-16 flex justify-between items-center border-b shadow-sm px-4">
        <h2 className="text-xl font-semibold text-primary">Course Evaluator</h2>
        <SignOutButton />
      </header>
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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      const response = await fetch('/api/v1/evaluations', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      // If we get a successful response or 401, we know the auth status
      if (response.status === 401 || response.status === 403) {
        setIsAuthenticated(false);
      } else if (response.ok) {
        setIsAuthenticated(true);
      } else {
        // For other errors, assume not authenticated
        setIsAuthenticated(false);
      }
    } catch (error) {
      setIsAuthenticated(false);
    }
  };

  if (isAuthenticated === null) {
    return (
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">Course Equivalency Evaluator</h1>
        {isAuthenticated ? (
          <p className="text-xl text-secondary mb-8">
            Compare course descriptions to determine equivalency for transfer credit
          </p>
        ) : (
          <p className="text-xl text-secondary">Sign in to evaluate courses</p>
        )}
      </div>

      {isAuthenticated ? (
        <CourseEvaluator />
      ) : (
        <div className="max-w-md mx-auto">
          <SignInForm />
        </div>
      )}
    </div>
  );
}
