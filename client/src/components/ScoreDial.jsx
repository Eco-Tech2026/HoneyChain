import { RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';

function scoreColor(score) {
  if (score >= 70) return '#F87171';
  if (score >= 35) return '#FBBF24';
  return '#34D399';
}

export default function ScoreDial({ score }) {
  const color = scoreColor(score);
  const data = [{ name: 'score', value: score, fill: color }];

  return (
    <div className="relative flex h-44 w-44 items-center justify-center">
      <RadialBarChart
        width={176}
        height={176}
        cx="50%"
        cy="50%"
        innerRadius="78%"
        outerRadius="100%"
        barSize={12}
        data={data}
        startAngle={90}
        endAngle={-270}
      >
        <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
        <RadialBar background={{ fill: '#1A2438' }} dataKey="value" cornerRadius={8} angleAxisId={0} />
      </RadialBarChart>
      <div className="absolute flex flex-col items-center">
        <span className="font-display text-3xl font-semibold text-mist">{score}</span>
        <span className="text-xs text-mist-faint">/ 100</span>
      </div>
    </div>
  );
}
