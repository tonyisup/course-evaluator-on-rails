import { useState, useEffect } from "react";
import { toast } from "sonner";

export function SignOutButton() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

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
      setIsAuthenticated(response.ok);
    } catch (error) {
      setIsAuthenticated(false);
    } finally {
      setChecking(false);
    }
  };

  const getCsrfToken = (): string | null => {
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    return metaTag ? metaTag.getAttribute('content') : null;
  };

  const handleSignOut = async () => {
    const csrfToken = getCsrfToken();
    
    try {
      const response = await fetch('/users/sign_out', {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken || '',
        },
      });

      if (response.ok) {
        toast.success("Signed out successfully!");
        window.location.reload();
      } else {
        toast.error("Failed to sign out");
      }
    } catch (error) {
      toast.error("Failed to sign out");
    }
  };

  if (checking || !isAuthenticated) {
    return null;
  }

  return (
    <button
      className="px-4 py-2 rounded bg-white text-secondary border border-gray-200 font-semibold hover:bg-gray-50 hover:text-secondary-hover transition-colors shadow-sm hover:shadow"
      onClick={handleSignOut}
    >
      Sign out
    </button>
  );
}
