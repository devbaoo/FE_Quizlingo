import { useSelector } from 'react-redux';
import { Card, Col, Row, Typography, Statistic, Spin } from 'antd';
import { Pie, Column } from '@ant-design/plots';
import {
  UserOutlined,
  BookOutlined,
  TrophyOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import { useEffect } from 'react';
import { RootState, useAppDispatch } from '@/services/store/store';
import {
  fetchDashboardStats,
  fetchUsersByLevel,
  fetchUsersBySkill,
  fetchUsersByMonth,
} from '@/services/features/admin/adminSlice';

const { Title, Text } = Typography;

const AdminDashboard = () => {
  const dispatch = useAppDispatch();
  const { 
    dashboardStats, 
    usersByLevel, 
    usersBySkill, 
    usersByMonth, 
    dashboardLoading 
  } = useSelector((state: RootState) => state.admin);

  useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchUsersByLevel());
    dispatch(fetchUsersBySkill());
    dispatch(fetchUsersByMonth());
  }, [dispatch]);

  // Transform data for charts
  const roleData = Array.isArray(usersByLevel)
    ? usersByLevel.map(item => ({
        type: item.type,
        value: item.value,
      }))
    : [];

  const skillDistribution = Array.isArray(usersBySkill)
    ? usersBySkill.map(item => ({
        type: item.type,
        value: item.value,
      }))
    : [];

  const monthlyUserData = Array.isArray(usersByMonth) ? usersByMonth : [];

  const defaultMonthlyData = [
    { month: 'Tháng 1', value: 0 },
    { month: 'Tháng 2', value: 0 },
    { month: 'Tháng 3', value: 0 },
    { month: 'Tháng 4', value: 0 },
    { month: 'Tháng 5', value: 0 },
    { month: 'Tháng 6', value: 0 },
  ];

  const columnConfig = {
    data: monthlyUserData.length > 0 ? monthlyUserData : defaultMonthlyData,
    xField: 'month',
    yField: 'value',
    color: '#1890ff',
    label: {
      position: 'middle',
      style: {
        fill: '#fff',
        fontSize: 12,
        textAlign: 'center',
      },
    },
    xAxis: {
      label: {
        autoRotate: false,
      },
    },
    meta: {
      month: { alias: 'Tháng' },
      value: { alias: 'Số người đăng ký' },
    },
  };

  // Fallback data cho pieConfig
  const defaultRoleData = [
    { type: 'Level 1', value: 0 },
    { type: 'Level 2', value: 0 },
    { type: 'Level 3', value: 0 },
    { type: 'Level 4', value: 0 },
    { type: 'Level 5', value: 0 },
  ];

  const defaultSkillData = [
    { type: 'Grammar', value: 0 },
    { type: 'Vocabulary', value: 0 },
    { type: 'Listening', value: 0 },
    { type: 'Reading', value: 0 },
    { type: 'Speaking', value: 0 },
    { type: 'Writing', value: 0 },
  
  ];

 

  const pieConfig = {
    appendPadding: 10,
    data: roleData.length > 0 ? roleData : defaultRoleData,
    angleField: 'value',
    colorField: 'type',
    radius: 1,
    label: {
      type: 'inner',
      offset: '-30%',
      content: '{value}',
      style: { fontSize: 14, textAlign: 'center' },
    },
    interactions: [{ type: 'element-active' }],
  };

  const pieSkillConfig = {
    appendPadding: 10,
    data: skillDistribution.length > 0 ? skillDistribution : defaultSkillData,
    angleField: 'value',
    colorField: 'type',
    radius: 1,
    label: {
      type: 'inner',
      offset: '-30%',
      content: '{value}',
      style: { fontSize: 14, textAlign: 'center' },
    },
    interactions: [{ type: 'element-active' }],
  };

  if (dashboardLoading) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <Title level={2} style={{ fontFamily: "'Baloo 2', cursive" }}>Dashboard</Title>

      <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
        <SummaryCard
          title="Người dùng"
          count={dashboardStats?.totalUsers || 0}
          icon={<UserOutlined />}
          color="blue"
          subtitle="Tổng số người dùng"
        />
        <SummaryCard
          title="Bài học"
          count={dashboardStats?.totalLessons || 0}
          icon={<BookOutlined />}
          color="purple"
          subtitle="Tổng số bài học"
        />
        <SummaryCard
          title="Cấp độ"
          count={dashboardStats?.totalLevels || 0}
          icon={<TrophyOutlined />}
          color="red"
          subtitle="Tổng số cấp độ"
        />
        <SummaryCard
          title="Kỹ năng"
          count={dashboardStats?.totalSkills || 0}
          icon={<AppstoreOutlined />}
          color="green"
          subtitle="Tổng số kỹ năng"
        />
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={16}>
          <Card title="Số lượng người đăng ký theo tháng">
            <Column {...columnConfig} height={500} />
          </Card>
        </Col>
        <Col xs={4} md={4} lg={6}>
          <Card title="Tỷ lệ cấp độ người dùng">
            <Pie {...pieConfig} height={200} />
          </Card>
          <Card title="Tỷ lệ kỹ năng người dùng">
            <Pie {...pieSkillConfig} height={200} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

const SummaryCard = ({
  title,
  count,
  subtitle,
  color,
  icon,
}: {
  title: string;
  count: number;
  subtitle: string;
  color: string;
  icon: React.ReactNode;
}) => {
  return (
    <Col xs={24} sm={12} md={6}>
      <Card bordered>
        <Row align="middle" justify="space-between">
          <Col>
            <Text style={{ color: colorMap[color], fontFamily: "'Baloo 2', cursive", fontSize: 16 }}>
              {title}
            </Text>
            <Statistic
              value={count}
              valueStyle={{ fontSize: 28, fontWeight: 'bold' }}
              groupSeparator="."
            />
            <div style={{ color: '#888' }}>{subtitle}</div>
          </Col>
          <Col style={{ fontSize: 32, color: colorMap[color] }}>{icon}</Col>
        </Row>
      </Card>
    </Col>
  );
};

const colorMap: Record<string, string> = {
  blue: '#1890ff',
  purple: '#722ed1',
  red: '#f5222d',
  green: '#52c41a',
};

export default AdminDashboard;