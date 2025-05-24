import React, { useEffect } from "react";
import { Card, Typography, Spin, Avatar } from "antd";
import { UserOutlined, CrownFilled } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/services/store/store";
import { fetchUsers } from "@/services/features/admin/adminSlice";
import { fetchUserProfile } from "@/services/features/user/userSlice";
import { UserProfile } from "@/interfaces/IUser";
import { IAdmin } from "@/interfaces/IAdmin";

const { Title } = Typography;
const COLORS = ["#FFD700", "#C0C0C0", "#CD7F32"];

interface RankUser extends Omit<IAdmin, 'createdAt' | 'lastLoginDate'> {
    xp: number;
    userLevel: number;
    streak: number;
    avatar?: string;
}

const Rank: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { users, loading } = useSelector((state: RootState) => state.admin);
    const currentUser = useSelector((state: RootState) => state.user.profile as UserProfile | null);

    useEffect(() => {
        dispatch(fetchUsers());
        dispatch(fetchUserProfile());
    }, [dispatch]);

    // Kiểm tra users có tồn tại và là mảng không
    const safeUsers = Array.isArray(users) ? users : [];

    // Lọc và sắp xếp users
    const filteredUsers: RankUser[] = safeUsers
        .filter((user): user is IAdmin & { xp: number; userLevel: number; streak: number } => {
            return user !== null &&
                user !== undefined &&
                user.role === "user" &&
                typeof (user as any).xp === "number" &&
                typeof (user as any).userLevel === "number" &&
                typeof (user as any).streak === "number";
        })
        .map(user => ({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            avatar: (user as any).avatar || "",
            xp: (user as any).xp || 0,
            userLevel: (user as any).userLevel || 0,
            streak: (user as any).streak || 0
        }))
        .sort((a, b) => b.xp - a.xp); // Sắp xếp theo xp từ cao xuống thấp

    const top3 = filteredUsers.slice(0, 3);
    const others = filteredUsers.slice(3);

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                minHeight: "100vh",
                padding: "20px 0",
                background: "linear-gradient(180deg, #e6f7ff 0%, #fff 100%)"
            }}
        >
            <Card
                style={{
                    margin: "0 16px",
                    width: "100%",
                    maxWidth: 600,
                    minWidth: 320,
                    borderRadius: 24,
                    boxShadow: "0 8px 32px #b4b4b4a0",
                    border: "4px solid #1890ff",
                    background: "linear-gradient(180deg, #fffbe6 0%, #fff 100%)",
                    height: "calc(100vh - 40px)",
                    display: "flex",
                    flexDirection: "column"
                }}
                bodyStyle={{
                    padding: 0,
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden"
                }}
            >
                <div
                    style={{
                        background: "linear-gradient(90deg, #ffe066 0%, #fffbe6 100%)",
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        padding: "18px 0 10px 0",
                        textAlign: "center"
                    }}
                >
                    <Title level={3} style={{ margin: 0, fontFamily: "'Baloo 2', cursive", color: "#b8860b", letterSpacing: 2 }}>
                        LEADER BOARD
                    </Title>
                </div>
                <Spin spinning={loading} style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    {/* Top 3 */}
                    <div style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "flex-end",
                        gap: 24,
                        padding: "24px 16px 12px",
                        background: "linear-gradient(180deg, #fffbe6 60%, #fff 100%)"
                    }}>
                        {[1, 0, 2].map((orderIdx) => {
                            const user = top3[orderIdx];
                            if (!user) return null;

                            const isCurrent = currentUser && user._id === currentUser.id;
                            return (
                                <div key={user._id} style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    width: 90,
                                    marginBottom: orderIdx === 0 ? 0 : 16,
                                }}>
                                    <div style={{
                                        position: "relative",
                                        marginBottom: 6,
                                    }}>
                                        <Avatar
                                            src={user.avatar}
                                            icon={!user.avatar && <UserOutlined />}
                                            size={orderIdx === 0 ? 70 : 56}
                                            style={{
                                                border: `3px solid ${COLORS[orderIdx]}`,
                                                background: !user.avatar ? "#fff7e6" : "#fff",
                                                boxShadow: `0 0 12px ${COLORS[orderIdx]}55`,
                                            }}
                                        />
                                        <CrownFilled style={{
                                            position: "absolute",
                                            top: -18,
                                            left: "50%",
                                            transform: "translateX(-50%)",
                                            color: COLORS[orderIdx],
                                            fontSize: 28,
                                            filter: "drop-shadow(0 2px 4px #fffbe6)"
                                        }} />
                                    </div>
                                    <div style={{
                                        fontWeight: isCurrent ? 700 : 600,
                                        color: isCurrent ? "#52c41a" : "#333",
                                        fontSize: orderIdx === 0 ? 17 : 15,
                                        textAlign: "center",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        maxWidth: 80
                                    }}>
                                        {user.firstName} {user.lastName}
                                        {isCurrent && <span style={{
                                            background: "#52c41a",
                                            color: "#fff",
                                            borderRadius: 8,
                                            padding: "2px 8px",
                                            marginLeft: 4,
                                            fontSize: 12
                                        }}>Bạn</span>}
                                    </div>
                                    <div style={{
                                        fontWeight: 700,
                                        color: "#b8860b",
                                        fontSize: 15,
                                        marginTop: 2,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center"
                                    }}>
                                        <span style={{ marginRight: 4 }}>{user.xp}</span>
                                        <span style={{ fontSize: 18, color: "#FFD700" }}>★</span>
                                    </div>
                                    <div style={{
                                        fontWeight: 600,
                                        color: "#b8860b",
                                        fontSize: 13,
                                        marginTop: 2,
                                        opacity: 0.8
                                    }}>
                                        {orderIdx === 0 ? "1st" : orderIdx === 1 ? "2nd" : "3rd"}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    {/* Others */}
                    <div
                        className="rank-list-container"
                        style={{
                            flex: 1,
                            overflowY: "auto",
                            padding: "0 16px 16px",
                            marginRight: 0
                        }}
                    >
                        <style>
                            {`
                            .rank-list-container::-webkit-scrollbar {
                                width: 8px;
                            }
                            .rank-list-container::-webkit-scrollbar-track {
                                background: #f0f0f0;
                                border-radius: 4px;
                            }
                            .rank-list-container::-webkit-scrollbar-thumb {
                                background: #1890ff;
                                border-radius: 4px;
                            }
                            .rank-list-container {
                                scrollbar-width: thin;
                                scrollbar-color: #1890ff #f0f0f0;
                            }
                            .rank-item {
                                transition: transform 0.2s ease;
                            }
                            .rank-item:hover {
                                transform: translateY(-2px);
                            }
                            `}
                        </style>
                        {others.map((user, idx) => (
                            <div
                                key={user._id}
                                className="rank-item"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    background: user._id === currentUser?.id
                                        ? "linear-gradient(90deg, #e6ffe6 0%, #b7ffd6 100%)"
                                        : "linear-gradient(90deg, #1677ff 0%, #40a9ff 100%)",
                                    borderRadius: 16,
                                    margin: "8px 0",
                                    border: user._id === currentUser?.id ? "2.5px solid #52c41a" : "2px solid #fff",
                                    padding: "8px 12px",
                                    cursor: "default"
                                }}
                            >
                                <span style={{
                                    fontWeight: 700,
                                    fontSize: 18,
                                    color: "#fff",
                                    width: 32,
                                    textAlign: "center"
                                }}>{idx + 4}.</span>
                                <Avatar
                                    src={user.avatar}
                                    icon={!user.avatar && <UserOutlined />}
                                    size={36}
                                    style={{
                                        background: !user.avatar ? "#f56a00" : "#fff",
                                        marginRight: 12,
                                        marginLeft: 4,
                                        border: user._id === currentUser?.id ? "2px solid #52c41a" : undefined,
                                    }}
                                />
                                <div style={{ flex: 1 }}>
                                    <div style={{
                                        fontWeight: user._id === currentUser?.id ? 700 : 600,
                                        fontSize: 15,
                                        color: user._id === currentUser?.id ? "#52c41a" : "#fff",
                                        display: "flex",
                                        alignItems: "center"
                                    }}>
                                        {user.firstName} {user.lastName}
                                        {user._id === currentUser?.id && <span style={{
                                            background: "#52c41a",
                                            color: "#fff",
                                            borderRadius: 8,
                                            padding: "2px 8px",
                                            marginLeft: 8,
                                            fontSize: 12
                                        }}>Bạn</span>}
                                    </div>
                                </div>
                                <div style={{
                                    fontWeight: 700,
                                    fontSize: 15,
                                    color: "#ffe066",
                                    marginRight: 8,
                                    minWidth: 48,
                                    textAlign: "right",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "flex-end"
                                }}>
                                    <span style={{ marginRight: 4 }}>{user.xp}</span>
                                    <span style={{ fontSize: 18, color: "#FFD700" }}>★</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Spin>
            </Card>
        </div>
    );
};

export default Rank;