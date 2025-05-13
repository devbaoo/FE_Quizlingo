import { Button, Typography } from "antd";

export default function Header() {
  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
      <Typography.Title level={3} style={{ margin: 0, color: "#1677ff" }}>
        Quizlingo
      </Typography.Title>
      <Button
        type="primary"
        size="large"
        style={{ backgroundColor: "#1677ff", borderColor: "#1677ff" }}
      >
        Đăng nhập
      </Button>
    </header>
  );
}
