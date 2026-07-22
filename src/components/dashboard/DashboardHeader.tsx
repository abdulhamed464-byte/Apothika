import {
  Bell,
  Search,
  UserCircle,
  ChevronDown,
} from "lucide-react";

interface DashboardHeaderProps {
  workspaceName?: string;
  userName?: string;
}

function DashboardHeader({
  workspaceName = "APOTHIKA Workspace",
  userName = "Owner",
}: DashboardHeaderProps) {
  return (
    <header className="dashboard-header">

      <div className="dashboard-header-left">

        <h2>Dashboard</h2>

        <span>{workspaceName}</span>

      </div>

      <div className="dashboard-header-center">

        <div className="search-box">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search modules, products, customers..."
          />

        </div>

      </div>

      <div className="dashboard-header-right">

        <button className="notification-btn">

          <Bell size={20} />

          <span className="notification-dot"></span>

        </button>

        <div className="profile-box">

          <UserCircle size={36} />

          <div>

            <strong>{userName}</strong>

            <span>Workspace Owner</span>

          </div>

          <ChevronDown size={18} />

        </div>

      </div>

    </header>
  );
}

export default DashboardHeader;