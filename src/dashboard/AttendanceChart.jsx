import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

const AttendanceChart = ({ data }) => {
  const limitedData = data.slice(0, 20);

  return (
    <div className="card chart-card h-100">
      <div className="card-body">
        <h5 className="card-title">Attendance Patterns</h5>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={limitedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="attendance_count"
              stroke="#C9A64B"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AttendanceChart;