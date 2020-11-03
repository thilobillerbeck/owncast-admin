import { LineChart, XAxis, YAxis, Line, Tooltip, Legend } from "recharts";
import { timeFormat } from "d3-time-format";

interface ToolTipProps {
  active?: boolean,
  payload?: object,
  unit?: string
}

const defaultProps = {
  active: false,
  payload: Object,
  unit: "",
};

interface TimedValue {
  time: Date;
  value: Number;
}

interface ChartProps {
  // eslint-disable-next-line react/require-default-props
  data?: TimedValue[],
  color: string,
  unit: string,
  // eslint-disable-next-line react/require-default-props
  dataCollections?: any[],
}

function CustomizedTooltip(props: ToolTipProps) {
  const { active, payload, unit } = props;
  if (active && payload && payload[0]) {
    const time = payload[0].payload ? timeFormat("%I:%M")(new Date(payload[0].payload.time)) : "";
    return (
      <div className="custom-tooltip">
        <p className="label">
          <strong>{time}</strong> {payload[0].payload.value} {unit}
        </p>
      </div>
    );
  }
  return null;
}
CustomizedTooltip.defaultProps = defaultProps;

export default function Chart({ data, color, unit, dataCollections }: ChartProps) {
  if (!data && !dataCollections) {
    return null;
  }

  const timeFormatter = (tick: string) => {
    return timeFormat("%I:%M")(new Date(tick));
  };

  let ticks
  if (dataCollections.length > 0) {
    ticks = dataCollections[0].data?.map(function (collection) {
      return collection?.time;
    })
  } else if (data?.length > 0){
    ticks = data?.map(function (item) {
      return item?.time;
    });
  }

  return (
    <LineChart width={1200} height={400} data={data}>
      <XAxis
        dataKey="time"
        tickFormatter={timeFormatter}
        interval="preserveStartEnd"
        tickCount={5}
        minTickGap={15}
        domain={["dataMin", "dataMax"]}
        ticks={ticks}
      />
      <YAxis
        dataKey="value"
        interval="preserveStartEnd"
        unit={unit}
        domain={["dataMin", "dataMax"]}
      />
      <Tooltip content={<CustomizedTooltip unit={unit} />} />
      <Legend />
      <Line
        type="monotone"
        dataKey="value"
        stroke={color}
        dot={null}
        strokeWidth={3}
      />
      {dataCollections?.map((s) => (
        <Line
          dataKey="value"
          data={s.data}
          name={s.name}
          key={s.name}
          type="monotone"
          stroke={s.color}
          dot={null}
          strokeWidth={3}
        />
      ))}
    </LineChart>
  );
}

Chart.defaultProps = {
  dataCollections: [],
};