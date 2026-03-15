import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#163A70', '#C9A64B', '#5A7DBA', '#8FB3D9', '#F4D58D', '#2E5984'];

const CourseDistributionChart = ({ data }) => {
  const formattedData = data.map((item) => ({
    name: item.course_code,
    value: item.students_count,
  }));

  return (
    <div className="card chart-card h-100">
      <div className="card-body">
        <h5 className="card-title">Student Distribution by Course</h5>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={formattedData}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              fill="#163A70"
              label
            >
              {formattedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CourseDistributionChart;