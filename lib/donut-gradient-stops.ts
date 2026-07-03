type DonutGradientSegment = {
  value: number;
  color: string;
};

export function buildDonutGradientStops(
  segments: DonutGradientSegment[],
  total: number
): string {
  return segments
    .filter((segment) => segment.value > 0)
    .reduce<{ stops: string[]; cumulative: number }>(
      (acc, segment) => {
        const start = (acc.cumulative / total) * 100;
        const cumulative = acc.cumulative + segment.value;
        const end = (cumulative / total) * 100;

        acc.stops.push(`${segment.color} ${start}% ${end}%`);
        return { stops: acc.stops, cumulative };
      },
      { stops: [], cumulative: 0 }
    )
    .stops.join(", ");
}
