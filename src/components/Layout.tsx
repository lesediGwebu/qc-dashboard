import { Link, Outlet, useLocation } from "react-router-dom"
import { LayoutDashboard, RotateCcw, Settings, HelpCircle, Activity } from "lucide-react"

export default function Layout() {
    const location = useLocation()

    const isActive = (path: string) => {
        return location.pathname === path ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:bg-slate-50"
    }

    return (
        <div className="min-h-screen bg-slate-100 text-foreground flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col fixed h-full">
                <div className="p-6 flex items-center gap-3">
                    <img src="/Sherbet Blue Logo(1).jpg" alt="Sherbet Logo" className="h-10 w-auto" />
                </div>

                <nav className="flex-1 px-4 py-4 space-y-1">
                    <Link
                        to="/"
                        className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive("/")}`}
                    >
                        <LayoutDashboard size={18} />
                        Dashboard
                    </Link>
                    <Link
                        to="/reverts-tracker"
                        className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive("/reverts-tracker")}`}
                    >
                        <RotateCcw size={18} />
                        Reverts & QC Tracker
                    </Link>
                </nav>

                <div className="p-4 border-t border-slate-100 space-y-1">
                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                        <Settings size={18} />
                        Settings
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                        <HelpCircle size={18} />
                        Help
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-8">
                <div className="mx-auto max-w-6xl">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}
