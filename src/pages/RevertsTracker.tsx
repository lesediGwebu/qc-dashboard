import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Search, ArrowUp, ArrowDown } from "lucide-react"

const data = [
    { name: 'Alex J.', reverts: 12 },
    { name: 'Jane D.', reverts: 18 },
    { name: 'Mike W.', reverts: 8 },
    { name: 'Samantha B.', reverts: 21 },
    { name: 'Chris L.', reverts: 15 },
    { name: 'Emily R.', reverts: 14 },
    { name: 'David C.', reverts: 6 },
    { name: 'Sarah P.', reverts: 10 },
    { name: 'Kevin M.', reverts: 23 },
    { name: 'Laura T.', reverts: 17 },
    { name: 'Brian O.', reverts: 13 },
    { name: 'Megan H.', reverts: 19 },
];

const tableData = [
    { id: "REV-001", name: "Homepage_Hero_Banner", status: "Open", reason: "Wrong Color Code", assignee: "Alex J.", due: "Oct 24, 2023" },
    { id: "REV-002", name: "Footer_Links_Update", status: "In Progress", reason: "Broken Link", assignee: "Jane D.", due: "Oct 25, 2023" },
    { id: "REV-003", name: "About_Us_Text", status: "Resolved", reason: "Typo", assignee: "Mike W.", due: "Oct 22, 2023" },
    { id: "REV-004", name: "Product_Card_Layout", status: "Open", reason: "Alignment Issue", assignee: "Samantha B.", due: "Oct 26, 2023" },
    { id: "REV-005", name: "Checkout_Flow_Step2", status: "In Progress", reason: "Validation Error", assignee: "Chris L.", due: "Oct 27, 2023" },
]

export default function RevertsTracker() {
    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Reverts Tracker Dashboard</h1>
                    <p className="text-muted-foreground mt-1">Overview of all revert-related activities, trends, and performance.</p>
                </div>
                <Select defaultValue="7days">
                    <SelectTrigger className="w-[140px] bg-white">
                        <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="7days">Last 7 Days</SelectItem>
                        <SelectItem value="30days">Last 30 Days</SelectItem>
                        <SelectItem value="90days">Last 3 Months</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-none shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Reverts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">142</div>
                        <p className="text-xs text-green-600 flex items-center mt-1 font-medium">
                            <ArrowUp size={12} className="mr-1" />
                            2.5% <span className="text-muted-foreground ml-1 font-normal">vs last week</span>
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Revert Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">5.8%</div>
                        <p className="text-xs text-rose-600 flex items-center mt-1 font-medium">
                            <ArrowDown size={12} className="mr-1" />
                            0.3% <span className="text-muted-foreground ml-1 font-normal">vs last week</span>
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Time to Resolution</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">2.1 Days</div>
                        <p className="text-xs text-green-600 flex items-center mt-1 font-medium">
                            <ArrowUp size={12} className="mr-1" />
                            5.0% <span className="text-muted-foreground ml-1 font-normal">vs last week</span>
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming QC Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">12</div>
                        <p className="text-xs text-rose-600 flex items-center mt-1 font-medium">
                            <ArrowDown size={12} className="mr-1" />
                            1.2% <span className="text-muted-foreground ml-1 font-normal">vs last week</span>
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Chart */}
            <Card className="border-none shadow-sm">
                <CardHeader>
                    <CardTitle className="text-base font-semibold">Reverts per Team Member</CardTitle>
                </CardHeader>
                <CardContent className="pl-0">
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 50 }}>
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#64748b' }}
                                    interval={0}
                                    angle={-45}
                                    textAnchor="end"
                                />
                                <Tooltip
                                    cursor={{ fill: '#f1f5f9' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="reverts" radius={[4, 4, 0, 0]}>
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.name === 'Alex J.' ? '#007bff' : '#cce5ff'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Table Section */}
            <Card className="border-none shadow-sm">
                <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                placeholder="Search by ID, name, or assignee..."
                                className="pl-9 bg-white"
                            />
                        </div>
                    </div>

                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm">
                            <thead className="[&_tr]:border-b">
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground text-xs uppercase tracking-wider">ID</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground text-xs uppercase tracking-wider">Item Name</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground text-xs uppercase tracking-wider">Status</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground text-xs uppercase tracking-wider">Revert Reason</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground text-xs uppercase tracking-wider">Assigned To</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground text-xs uppercase tracking-wider">Due Date</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {tableData.map((row) => (
                                    <tr key={row.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <td className="p-4 align-middle font-medium">{row.id}</td>
                                        <td className="p-4 align-middle">{row.name}</td>
                                        <td className="p-4 align-middle">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${row.status === 'Open' ? 'bg-blue-100 text-blue-800' :
                                                row.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {row.status}
                                            </span>
                                        </td>
                                        <td className="p-4 align-middle text-muted-foreground">{row.reason}</td>
                                        <td className="p-4 align-middle">{row.assignee}</td>
                                        <td className="p-4 align-middle text-muted-foreground">{row.due}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
