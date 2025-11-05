import { useState } from "react";
import { toast } from "sonner";

export function SignInForm() {
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [submitting, setSubmitting] = useState(false);

  const getCsrfToken = (): string | null => {
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    return metaTag ? metaTag.getAttribute('content') : null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    
    const formData = new FormData(e.target as HTMLFormElement);
    const csrfToken = getCsrfToken();

    try {
      const url = flow === "signIn" ? "/users/sign_in" : "/users";
      const response = await fetch(url, {
        method: "POST",
        credentials: 'include',
        headers: {
          'X-CSRF-Token': csrfToken || '',
        },
        body: formData,
      });

      if (response.ok) {
        toast.success(flow === "signIn" ? "Signed in successfully!" : "Account created successfully!");
        // Reload the page to update authentication state
        window.location.reload();
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || errorData.message || 
          (flow === "signIn" 
            ? "Could not sign in. Please check your credentials." 
            : "Could not sign up. Please try again.");
        toast.error(errorMessage);
        setSubmitting(false);
      }
    } catch (error) {
      toast.error(
        flow === "signIn"
          ? "Could not sign in. Please try again."
          : "Could not sign up. Please try again."
      );
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <form
        className="flex flex-col gap-form-field"
        onSubmit={handleSubmit}
      >
        <input
          className="auth-input-field"
          type="email"
          name="email"
          placeholder="Email"
          required
        />
        <input
          className="auth-input-field"
          type="password"
          name="password"
          placeholder="Password"
          required
        />
        <button className="auth-button" type="submit" disabled={submitting}>
          {submitting ? "Processing..." : flow === "signIn" ? "Sign in" : "Sign up"}
        </button>
        <div className="text-center text-sm text-secondary">
          <span>
            {flow === "signIn"
              ? "Don't have an account? "
              : "Already have an account? "}
          </span>
          <button
            type="button"
            className="text-primary hover:text-primary-hover hover:underline font-medium cursor-pointer"
            onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
          >
            {flow === "signIn" ? "Sign up instead" : "Sign in instead"}
          </button>
        </div>
      </form>
    </div>
  );
}
