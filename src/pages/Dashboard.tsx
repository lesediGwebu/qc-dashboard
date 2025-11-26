import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function Dashboard() {
  const designers = useQuery(api.designers.get);
  const qcItems = useQuery(api.designers.getQCItems);

  console.log("[DASHBOARD] designers data:", designers);
  console.log("[DASHBOARD] designers count:", designers?.length);
  console.log("[DASHBOARD] qcItems data:", qcItems);
  console.log("[DASHBOARD] qcItems count:", qcItems?.length);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">Sherbet QC Dashboard</h1>
        <span className="text-sm text-muted-foreground">v0.1.0</span>
      </header>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Designer Performance with Reverts */}
        <Card className="border-none bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Designer Performance & Reverts</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-center">Int. Reverts</TableHead>
                  <TableHead className="text-center">Ext. Reverts</TableHead>
                  <TableHead className="text-center">QC Reverts</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {designers?.map((designer) => (
                  <TableRow key={designer._id}>
                    <TableCell className="font-medium">{designer.name}</TableCell>
                    <TableCell className="text-center">
                      <span className={`inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-medium ${(designer.internalReverts || 0) > 0 ? "bg-red-100 text-red-800" : "bg-slate-100 text-slate-800"
                        }`}>
                        {designer.internalReverts || 0}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={`inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-medium ${(designer.externalReverts || 0) > 0 ? "bg-orange-100 text-orange-800" : "bg-slate-100 text-slate-800"
                        }`}>
                        {designer.externalReverts || 0}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={`inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-medium ${(designer.qcReverts || 0) > 0 ? "bg-purple-100 text-purple-800" : "bg-slate-100 text-slate-800"
                        }`}>
                        {designer.qcReverts || 0}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
                {!designers && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      Loading designers...
                    </TableCell>
                  </TableRow>
                )}
                {designers && designers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No designer data available. Run sync to populate.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Right Column - Upcoming QC */}
        <Card className="border-none bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Upcoming QC</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead>Assignee</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {qcItems?.slice(0, 10).map((item) => (
                  <TableRow key={item._id}>
                    <TableCell className="font-medium max-w-[200px] truncate">{item.name}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${item.function === 'QC 1 - Copy' ? 'bg-purple-100 text-purple-800' :
                          item.function === 'QC 2 - Design' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                        }`}>
                        {item.function}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm">{item.assignee}</TableCell>
                  </TableRow>
                ))}
                {!qcItems && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                      Loading QC items...
                    </TableCell>
                  </TableRow>
                )}
                {qcItems && qcItems.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                      No QC items in review.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard
