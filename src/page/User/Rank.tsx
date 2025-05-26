import React, { useEffect, useState } from "react";
import { Card, Typography, Spin, Avatar } from "antd";
import { UserOutlined, CrownFilled } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { RootState } from "@/services/store/store";
import { UserProfile } from "@/interfaces/IUser";
import { apiMethods } from "@/services/constant/axiosInstance";
import { ApiResponse } from "@/services/constant/axiosInstance";
import { GET_LEADERBOARD_ENDPOINT } from "@/services/constant/apiConfig";

const { Title } = Typography;
const COLORS = ["#FFD700", "#C0C0C0", "#CD7F32"];

interface RankUser {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    totalScore: number;
    completedLessons: number;
    email?: string;
}

const Rank: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [leaderboardData, setLeaderboardData] = useState<RankUser[]>([]);
    const currentUser = useSelector((state: RootState) => state.user.profile) as UserProfile | null;

    const getCurrentUserId = () => {
        return currentUser?.id || '';
    };

    useEffect(() => {
        const fetchLeaderboard = async () => {
            setLoading(true);
            try {
                const { data } = await apiMethods.get<ApiResponse<RankUser[]>>(GET_LEADERBOARD_ENDPOINT);
                if (data.success && Array.isArray(data.data)) {
                    setLeaderboardData(data.data);
                }
            } catch (error) {
                console.error('Error fetching leaderboard:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    const top3 = leaderboardData.slice(0, 3);
    const others = leaderboardData.slice(3);

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                minHeight: "100vh",
                background: "linear-gradient(180deg, #e6f7ff 0%, #fff 100%)"
            }}
        >
            <Card
                style={{
                    margin: 32,
                    minWidth: 400,
                    maxWidth: 480,
                    borderRadius: 24,
                    boxShadow: "0 8px 32px #b4b4b4a0",
                    border: "4px solid #1890ff",
                    background: "linear-gradient(180deg, #fffbe6 0%, #fff 100%)"
                }}
                bodyStyle={{ padding: 0 }}
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
                <Spin spinning={loading}>
                    {/* Top 3 */}
                    <div style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "flex-end",
                        gap: 24,
                        padding: "24px 0 12px 0",
                        background: "linear-gradient(180deg, #fffbe6 60%, #fff 100%)"
                    }}>
                        {[2, 0, 1].map((orderIdx) => {
                            const user = top3[orderIdx];
                            if (!user) return null;

                            const isCurrent = getCurrentUserId() === user._id;
                            const position = orderIdx === 0 ? "1st" : orderIdx === 1 ? "3rd" : "2nd";
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
                                        <span style={{ marginRight: 4 }}>{user.totalScore}</span>
                                        <span style={{ fontSize: 18, color: "#FFD700" }}>★</span>
                                    </div>
                                    <div style={{
                                        fontWeight: 600,
                                        color: "#b8860b",
                                        fontSize: 13,
                                        marginTop: 2,
                                        opacity: 0.8
                                    }}>
                                        {position}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    {/* Others */}
                    <div style={{
                        maxHeight: 400,
                        overflowY: "auto",
                        padding: "0 18px 18px 18px"
                    }}>
                        {others.map((user, idx) => {
                            const isCurrent = getCurrentUserId() === user._id;
                            return (
                                <div
                                    key={user._id}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        background: isCurrent
                                            ? "linear-gradient(90deg, #e6ffe6 0%, #b7ffd6 100%)"
                                            : "linear-gradient(90deg, #1677ff 0%, #40a9ff 100%)",
                                        borderRadius: 16,
                                        margin: "10px 0",
                                        border: isCurrent ? "2.5px solid #52c41a" : "2px solid #fff",
                                        minHeight: 56,
                                        padding: "6px 12px"
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
                                            border: isCurrent ? "2px solid #52c41a" : undefined,
                                        }}
                                    />
                                    <div style={{ flex: 1 }}>
                                        <div style={{
                                            fontWeight: isCurrent ? 700 : 600,
                                            fontSize: 15,
                                            color: isCurrent ? "#52c41a" : "#fff",
                                            display: "flex",
                                            alignItems: "center"
                                        }}>
                                            {user.firstName} {user.lastName}
                                            {isCurrent && <span style={{
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
                                        <span style={{ marginRight: 4 }}>{user.totalScore}</span>
                                        <span style={{ fontSize: 18, color: "#FFD700" }}>★</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Spin>
            </Card>
        </div>
    );
};

export default Rank;