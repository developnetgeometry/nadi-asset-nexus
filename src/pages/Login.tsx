
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Example emails for quick login
  const demoEmails = [
    {
      email: "ahmad@tp.example.com",
      label: "TP Admin"
    },
    {
      email: "farah@tp.example.com",
      label: "TP Operation"
    },
    {
      email: "site@tp.example.com",
      label: "TP Site"
    },
    {
      email: "rajesh@dusp.example.com",
      label: "DUSP Admin"
    },
    {
      email: "nurul@mcmc.example.com",
      label: "MCMC Admin"
    },
    {
      email: "tan@vendor.example.com",
      label: "Vendor Admin"
    },
    {
      email: "super@admin.example.com",
      label: "Super Admin"
    }
  ];

  const handleEmailSelect = (selectedEmail: string) => {
    setEmail(selectedEmail);
    setPassword("password"); // In a real app, password would not be prefilled
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      console.log("Attempting login with:", email, password);
      const success = await login(email, password);
      console.log("Login result:", success);
      if (success) {
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">NADI e-System</h2>
          <p className="mt-2 text-sm text-gray-600">
            Asset & Maintenance Management
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Sign in to your account</CardTitle>
            <CardDescription>
              Enter your email and password to access the system
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="text-xs">
                  <p className="text-gray-500 mb-2">Demo accounts (use any password):</p>
                  <div className="flex flex-wrap gap-2">
                    {demoEmails.map((demo, index) => (
                      <Button
                        key={index}
                        type="button"
                        variant="outline"
                        size="sm"
                        className="text-xs py-1"
                        onClick={() => handleEmailSelect(demo.email)}
                      >
                        {demo.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full bg-nadi-600 hover:bg-nadi-700" 
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
