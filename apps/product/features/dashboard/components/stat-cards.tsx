import { Card, CardHeader, CardTitle } from "@repo/ui/components/card";

export interface Stat {
  label: string;
  value: string;
  hint?: string;
}

export function StatCards({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardHeader>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <CardTitle className="text-3xl">{stat.value}</CardTitle>
            {stat.hint ? <p className="text-xs text-muted-foreground">{stat.hint}</p> : null}
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
