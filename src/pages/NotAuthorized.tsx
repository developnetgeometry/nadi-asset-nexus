
import { ShieldX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotAuthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-full py-20">
      <div className="rounded-full bg-red-100 p-5 mb-4">
        <ShieldX className="h-12 w-12 text-red-600" />
      </div>
      <h1 className="text-2xl font-bold mb-2">Not Authorized</h1>
      <p className="text-gray-600 text-center max-w-md mb-6">
        You do not have permission to access this page. Please contact your administrator if you believe this is a mistake.
      </p>
      <Button onClick={() => navigate("/")}>
        Return to Dashboard
      </Button>
    </div>
  );
};

export default NotAuthorized;
