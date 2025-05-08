
import { Menu, Bell, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "../../contexts/AuthContext";
import { 
  DropdownMenu, 
  DropdownMenuContent,
  DropdownMenuItem, 
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  toggleSidebar: () => void;
  userName: string;
  userRole: string;
}

const Header = ({ toggleSidebar, userName, userRole }: HeaderProps) => {
  const { logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="flex justify-between items-center px-4 py-3">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2 md:hidden" 
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold text-nadi-700">NADI e-System</h1>
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              3
            </span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-nadi-500 text-white flex items-center justify-center">
                    <User className="h-5 w-5" />
                  </div>
                  <div className="ml-2 text-sm text-left hidden md:block">
                    <div className="font-medium">{userName}</div>
                    <div className="text-xs text-gray-500">{userRole}</div>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 h-4 w-4"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
