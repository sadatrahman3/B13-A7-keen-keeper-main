import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

const analyticsColors = ['#f97316', '#10b981', '#2563eb']

function StatsPage({ timeline }) {
  const interactionCounts = timeline.reduce((acc, entry) => {
    acc[entry.type] = (acc[entry.type] || 0) + 1
    return acc
  }, {})

  const chartData = [
    { name: 'Calls', value: interactionCounts.call || 0, color: analyticsColors[0] },
    { name: 'Texts', value: interactionCounts.text || 0, color: analyticsColors[1] },
    { name: 'Videos', value: interactionCounts.video || 0, color: analyticsColors[2] },
  ]

  const totalInteractions = chartData.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="page-stack">
      <section className="section-card">
        <div className="section-heading">
          <div>
            <p className="section-heading__eyebrow">Analytics</p>
            <h1>Friendship Stats</h1>
          </div>
        </div>

        {totalInteractions === 0 ? (
          <div className="loading-card">
            <p>No interaction data yet. Start checking in with your friends to see your stats!</p>
          </div>
        ) : (
          <div className="chart-panel">
            <div className="chart-copy">
              <h2>Interaction Breakdown</h2>
              <p>
                See how you stay connected with your friends. Each slice represents
                a different type of interaction you've logged.
              </p>
            </div>

            <div className="chart-shell">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [`${value} ${name.toLowerCase()}`, 'Count']}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

export default StatsPage