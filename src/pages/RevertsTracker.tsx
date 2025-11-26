import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ArrowUp, ArrowDown, ExternalLink } from "lucide-react"
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function RevertsTracker() {
    const qcItems = useQuery(api.designers.getQCItems);
    const reverts = useQuery(api.designers.getReverts);

    // Sort reverts by timestamp (most recent first)
    const recentReverts = reverts ? [...reverts].sort((a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ).slice(0, 10) : [];

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">QC & Reverts Dashboard</h1>
                    <p className="text-muted-foreground mt-1">Track QC items and reverts across all projects.</p>
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
                        <CardTitle className="text-sm font-medium text-muted-foreground">Items in QC</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{qcItems ? qcItems.length : "-"}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Currently in review
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Reverts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{reverts ? reverts.length : "-"}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Requiring attention
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">QC 1 - Copy</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">
                            {qcItems ? qcItems.filter(item => item.function === "QC 1 - Copy").length : "-"}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            In review
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">QC 2 - Design</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">
                            {qcItems ? qcItems.filter(item => item.function === "QC 2 - Design").length : "-"}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            In review
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Upcoming QC Section */}
            <Card className="border-none shadow-sm">
                <CardHeader>
                    <CardTitle className="text-base font-semibold">Upcoming QC Items</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Item Name</TableHead>
                                <TableHead>QC Stage</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Assignee</TableHead>
                                <TableHead>Link</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {qcItems?.map((item) => (
                                <TableRow key={item._id}>
                                    <TableCell className="font-medium">{item.name}</TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${item.function === 'QC 1 - Copy' ? 'bg-purple-100 text-purple-800' :
                                                item.function === 'QC 2 - Design' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-green-100 text-green-800'
                                            }`}>
                                            {item.function}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-amber-100 text-amber-800">
                                            {item.status}
                                        </span>
                                    </TableCell>
                                    <TableCell>{item.assignee}</TableCell>
                                    <TableCell>
                                        {item.url && (
                                            <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                                                View <ExternalLink size={12} />
                                            </a>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {!qcItems && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                        Loading QC items...
                                    </TableCell>
                                </TableRow>
                            )}
                            {qcItems && qcItems.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                        No items currently in QC.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Recent Reverts Section */}
            <Card className="border-none shadow-sm">
                <CardHeader>
                    <CardTitle className="text-base font-semibold">Recent Reverts</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Item Name</TableHead>
                                <TableHead>QC Stage</TableHead>
                                <TableHead>Reason</TableHead>
                                <TableHead>Assignee</TableHead>
                                <TableHead>Last Updated</TableHead>
                                <TableHead>Link</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentReverts?.map((item) => (
                                <TableRow key={item._id}>
                                    <TableCell className="font-medium">{item.name}</TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${item.function === 'QC 1 - Copy' ? 'bg-purple-100 text-purple-800' :
                                                item.function === 'QC 2 - Design' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-green-100 text-green-800'
                                            }`}>
                                            {item.function}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-red-100 text-red-800">
                                            {item.reason}
                                        </span>
                                    </TableCell>
                                    <TableCell>{item.assignee}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {new Date(item.timestamp).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        {item.url && (
                                            <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                                                View <ExternalLink size={12} />
                                            </a>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {!reverts && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        Loading reverts...
                                    </TableCell>
                                </TableRow>
                            )}
                            {reverts && reverts.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        No recent reverts.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
