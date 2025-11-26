import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

function Dashboard() {
  const upcoming = [
    {
      title: "Project_X_Final_Check",
      date: "16 Oct 2023, 09:00 AM",
      assignee: "John Smith",
    },
    {
      title: "Marketing_Banner_Review",
      date: "16 Oct 2023, 11:30 AM",
      assignee: "Emily White",
    },
    {
      title: "Legal_Disclaimer_Update",
      date: "17 Oct 2023, 02:00 PM",
      assignee: "Michael Brown",
    },
    {
      title: "Feature_Release_Notes",
      date: "18 Oct 2023, 10:00 AM",
      assignee: "Jane Doe",
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">QC Dashboard</h1>
        <span className="text-sm text-muted-foreground">v0.1.0</span>
      </header>

      {/* Two columns */}
      <div className="grid gap-6 md:grid-cols-2 items-start">
        {/* Reverts */}
        <Card className="border-none bg-white shadow-sm">
          <CardContent className="pt-6 pb-6">
            <div className="flex flex-col gap-4">
              <h2 className="text-base font-semibold">Reverts</h2>

              <Input
                placeholder="Filter by item or assignee"
                className="h-9 text-sm"
              />

              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3 rounded-xl border border-slate-100 bg-rose-50/70 px-3 py-3">
                  <span className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-500 text-lg font-semibold text-white">
                    !
                  </span>
                  <div className="flex-1">
                    <p className="font-medium">Document_A_v2</p>
                    <p className="text-xs text-muted-foreground">15 Oct 2023, 10:30 AM</p>
                    <p className="mt-1 text-xs text-muted-foreground">Assigned to: Jane Doe</p>
                  </div>
                </li>

                <li className="flex items-start gap-3 rounded-xl border border-slate-100 bg-rose-50/70 px-3 py-3">
                  <span className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-500 text-lg font-semibold text-white">
                    !
                  </span>
                  <div className="flex-1">
                    <p className="font-medium">Image_Asset_Correction</p>
                    <p className="text-xs text-muted-foreground">15 Oct 2023, 09:15 AM</p>
                    <p className="mt-1 text-xs text-muted-foreground">Assigned to: Alex Ray</p>
                  </div>
                </li>

                <li className="flex items-start gap-3 rounded-xl border border-slate-100 bg-amber-50 px-3 py-3">
                  <span className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-400 text-lg font-semibold text-white">
                    !
                  </span>
                  <div className="flex-1">
                    <p className="font-medium">Copy_Check_Homepage</p>
                    <p className="text-xs text-muted-foreground">14 Oct 2023, 05:45 PM</p>
                    <p className="mt-1 text-xs text-muted-foreground">Assigned to: Sarah Lee</p>
                  </div>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming QC */}
        <Card className="border-none bg-white shadow-sm">
          <CardContent className="pt-6 pb-6">
            <div className="flex flex-col gap-4">
              <h2 className="text-base font-semibold">Upcoming QC</h2>

              <Input
                placeholder="Filter by item or assignee"
                className="h-9 text-sm"
              />

              <ul className="space-y-3 text-sm">
                {upcoming.map((item) => (
                  <li
                    key={item.title}
                    className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-3"
                  >
                    <span className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-500 text-lg font-semibold text-white">
                      ✓
                    </span>
                    <div className="flex-1">
                      <p className="font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.date}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Assigned to: {item.assignee}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard
