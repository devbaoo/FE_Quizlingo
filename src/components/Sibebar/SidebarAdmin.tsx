import { useState } from 'react';
import { Layout, Menu, Button } from 'antd';
import {
  DashboardOutlined,
  BookOutlined,
  TeamOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SoundOutlined,
  ReadOutlined,
  EditOutlined,
  AudioOutlined,
  TagsOutlined,
} from '@ant-design/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '@/services/features/auth/authSlice';

const { Sider } = Layout;

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const getSelectedKeys = () => {
    if (location.pathname.startsWith('/admin/lesson')) return [location.pathname];
    return [location.pathname];
  };

  return (
    <Sider
      collapsible
      trigger={null}
      collapsed={collapsed}
      onCollapse={setCollapsed}
      width={240}
      className="shadow relative"
      style={{
        background: 'linear-gradient(to bottom, #60a5fa, #2563eb)',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
      }}
    >
      {/* Top: Toggle + Logo */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '16px 20px',
          gap: 12,
        }}
      >
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{ color: 'white', fontSize: 18 }}
        />
        {!collapsed && (
          <div style={{ fontSize: 20, fontWeight: 'bold', color: 'white', fontFamily: "'Baloo 2', cursive" }}>
            Quizlingo
          </div>
        )}
      </div>

      {/* Middle: Menu */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <Menu
          mode="inline"
          selectedKeys={getSelectedKeys()}
          openKeys={collapsed ? [] : openKeys}
          onOpenChange={(keys) => setOpenKeys(keys)}
          theme="light"
          style={{
            background: 'transparent',
            border: 'none',
            fontFamily: "'Baloo 2', cursive"
          }}
        >
          <Menu.Item key="/admin" icon={<DashboardOutlined />}>
            <Link to="/admin" style={{ fontFamily: "'Baloo 2', cursive" }}>Dashboard</Link>
          </Menu.Item>

          <Menu.SubMenu key="lesson" icon={<BookOutlined />} title={<span style={{ fontFamily: "'Baloo 2', cursive" }}>Manage Lesson</span>}>
             <Menu.Item key="/admin/lesson/topics" icon={<TagsOutlined />}>
                <Link to="/admin/lesson/topics" style={{ fontFamily: "'Baloo 2', cursive" }}> Topics</Link>
            </Menu.Item>
            <Menu.Item key="/admin/lesson/listening" icon={<SoundOutlined />}>
              <Link to="/admin/lesson/listening" style={{ fontFamily: "'Baloo 2', cursive" }}>Listening</Link>
            </Menu.Item>
            <Menu.Item key="/admin/lesson/reading" icon={<ReadOutlined />}>
              <Link to="/admin/lesson/reading" style={{ fontFamily: "'Baloo 2', cursive" }}>Reading</Link>
            </Menu.Item>
            <Menu.Item key="/admin/lesson/writing" icon={<EditOutlined />}>
              <Link to="/admin/lesson/writing" style={{ fontFamily: "'Baloo 2', cursive" }}>Writing</Link>
            </Menu.Item>
            <Menu.Item key="/admin/lesson/speaking" icon={<AudioOutlined />}>
              <Link to="/admin/lesson/speaking" style={{ fontFamily: "'Baloo 2', cursive" }}>Speaking</Link>
            </Menu.Item>
          </Menu.SubMenu>

          <Menu.Item key="/admin/users" icon={<TeamOutlined />}>
            <Link to="/admin/users" style={{ fontFamily: "'Baloo 2', cursive" }}>Manage User</Link>
          </Menu.Item>
        </Menu>
      </div>

      {/* Bottom: Logout */}
      <div
        style={{
          padding: '16px',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          textAlign: 'center',
        }}
      >
        <Button
          type="text"
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          style={{ color: 'black', fontSize: 16, fontFamily: "'Baloo 2', cursive" }}
        >
          {!collapsed && 'Logout'}
        </Button>
      </div>
    </Sider>
  );
};

export default Sidebar;
