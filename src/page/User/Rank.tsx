import React, { useEffect, useState } from "react";
import { Typography, Spin, Avatar } from "antd";
import { UserOutlined, CrownFilled } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { RootState } from "@/services/store/store";
import { UserProfile } from "@/interfaces/IUser";
import { apiMethods } from "@/services/constant/axiosInstance";
import { ApiResponse } from "@/services/constant/axiosInstance";
import { GET_LEADERBOARD_ENDPOINT } from "@/services/constant/apiConfig";

const { Title } = Typography;
const COLORS = ["#FFD700", "#C0C0C0", "#CD7F32"];
const GRADIENTS = [
    "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",  // Gold gradient
    "linear-gradient(135deg, #C0C0C0 0%, #A9A9A9 100%)",  // Silver gradient
    "linear-gradient(135deg, #CD7F32 0%, #8B4513 100%)"   // Bronze gradient
];

interface RankUser {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    totalScore: number;
    completedLessons: number;
    email?: string;
}

const InfoBox = () => (
    <div className="fixed top-24 right-8 max-w-sm bg-[#1a2b3c] bg-opacity-90 text-white p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-bold mb-2">BẢNG XẾP HẠNG LÀ GÌ?</h3>
        <p className="text-gray-300 mb-4">Học tập. Thi đua. Kiếm điểm.</p>
        <p className="text-gray-300 text-sm">
            Làm thật nhiều bài, kiếm thật nhiều điểm từ các bài học để thi đua với những người học khác trên bảng xếp hạng.
        </p>
    </div>
);

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
                minHeight: "100vh",
                background: "linear-gradient(180deg, #1a2b3c 0%, #2d4b6b 100%)",
                padding: "40px 20px",
                position: "relative"
            }}
        >
            <InfoBox />
            <div style={{
                maxWidth: 1200,
                margin: "0 auto",
                display: "flex",
                justifyContent: "flex-start",
                position: "relative",
                paddingLeft: "120px",
            }}>
                <div style={{
                    width: "100%",
                    maxWidth: 720,
                    position: "relative",
                    zIndex: 1
                }}>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex-1">
                            <div
                                style={{
                                    background: "linear-gradient(90deg, #1677ff 0%, #40a9ff 100%)",
                                    borderRadius: 20,
                                    padding: "16px 24px",
                                    position: "relative",
                                    overflow: "hidden"
                                }}
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 opacity-10">
                                    <svg viewBox="0 0 100 100" fill="none">
                                        <path d="M50 0L93.3013 25V75L50 100L6.69873 75V25L50 0Z" fill="currentColor" />
                                    </svg>
                                </div>
                                <Title level={3} style={{ margin: 0, color: "#fff", letterSpacing: 2, display: "flex", alignItems: "center", gap: "12px" }}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M12 0L22.3923 6V18L12 24L1.60769 18V6L12 0Z" fill="white" />
                                        <path d="M12 3L18.1962 6.75V14.25L12 18L5.80385 14.25V6.75L12 3Z" fill="#40a9ff" />
                                    </svg>
                                    BẢNG XẾP HẠNG
                                </Title>
                            </div>
                        </div>
                    </div>

                    <Spin spinning={loading}>
                        {/* Top 3 */}
                        <div style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "flex-end",
                            gap: 34,
                            padding: "24px 0 32px 0",
                        }}>
                            {[1, 0, 2].map((orderIdx) => {
                                const user = top3[orderIdx];
                                if (!user) return null;

                                const isCurrent = getCurrentUserId() === user._id;
                                const position = orderIdx === 0 ? "2nd" : orderIdx === 1 ? "1st" : "3rd";
                                return (
                                    <div key={user._id} style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        width: 120,
                                        marginBottom: orderIdx === 0 ? 0 : 16,
                                        position: "relative",
                                    }}>
                                        <div style={{
                                            position: "relative",
                                            marginBottom: 6,
                                            padding: 4,
                                            background: GRADIENTS[orderIdx],
                                            borderRadius: "50%",
                                            animation: "pulse 2s infinite",
                                        }}>
                                            <style>
                                                {`
                                                @keyframes pulse {
                                                    0% { box-shadow: 0 0 0 0 ${COLORS[orderIdx]}66; }
                                                    70% { box-shadow: 0 0 0 10px ${COLORS[orderIdx]}00; }
                                                    100% { box-shadow: 0 0 0 0 ${COLORS[orderIdx]}00; }
                                                }
                                                `}
                                            </style>
                                            <Avatar
                                                src={user.avatar || undefined}
                                                icon={!user.avatar && <UserOutlined style={{ color: '#fff' }} />}
                                                size={orderIdx === 0 ? 80 : 64}
                                                style={{
                                                    border: `3px solid ${COLORS[orderIdx]}`,
                                                    background: !user.avatar ? '#40a9ff' : "#fff",
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
                                                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
                                                animation: "float 3s ease-in-out infinite",
                                            }} />
                                            <style>
                                                {`
                                                @keyframes float {
                                                    0% { transform: translateX(-50%) translateY(0px); }
                                                    50% { transform: translateX(-50%) translateY(-5px); }
                                                    100% { transform: translateX(-50%) translateY(0px); }
                                                }
                                                `}
                                            </style>
                                        </div>
                                        <div style={{
                                            fontWeight: isCurrent ? 700 : 600,
                                            color: isCurrent ? "#40a9ff" : "#fff",
                                            fontSize: orderIdx === 0 ? 18 : 16,
                                            textAlign: "center",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            maxWidth: 110,
                                            textShadow: `0 0 10px ${COLORS[orderIdx]}`,
                                        }}>
                                            {user.firstName} {user.lastName}
                                        </div>
                                        <div style={{
                                            fontWeight: 700,
                                            color: COLORS[orderIdx],
                                            fontSize: 18,
                                            marginTop: 2,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            textShadow: `0 0 10px ${COLORS[orderIdx]}66`,
                                        }}>
                                            <span style={{ marginRight: 4 }}>{user.totalScore}</span>
                                            <span style={{ fontSize: 18, color: COLORS[orderIdx] }}>★</span>
                                        </div>
                                        <div style={{
                                            fontWeight: 600,
                                            color: "#9CA3AF",
                                            fontSize: 16,
                                            marginTop: 2,
                                            background: GRADIENTS[orderIdx],
                                            WebkitBackgroundClip: "text",
                                            WebkitTextFillColor: "transparent",
                                        }}>
                                            {position}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        {/* Others */}
                        <div style={{ padding: "0 12px" }}>
                            {others.map((user, idx) => {
                                const isCurrent = getCurrentUserId() === user._id;
                                return (
                                    <div
                                        key={user._id}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            background: isCurrent
                                                ? "rgba(64, 169, 255, 0.1)"
                                                : "rgba(255, 255, 255, 0.05)",
                                            borderRadius: 16,
                                            margin: "10px 0",
                                            border: isCurrent ? "2px solid #40a9ff" : "1px solid rgba(255,255,255,0.1)",
                                            minHeight: 56,
                                            padding: "6px 16px",
                                            backdropFilter: "blur(10px)"
                                        }}
                                    >
                                        <span style={{
                                            fontWeight: 600,
                                            fontSize: 16,
                                            color: "#9CA3AF",
                                            width: 44,
                                            textAlign: "center"
                                        }}>{idx + 4}.</span>
                                        <Avatar
                                            src={user.avatar || undefined}
                                            icon={!user.avatar && <UserOutlined style={{ color: '#fff' }} />}
                                            size={44}
                                            style={{
                                                background: !user.avatar ? '#40a9ff' : "#fff",
                                                marginRight: 18,
                                                marginLeft: 4,
                                                border: isCurrent ? "2px solid #40a9ff" : "1px solid rgba(255,255,255,0.1)",
                                            }}
                                        />
                                        <div style={{ flex: 1 }}>
                                            <div style={{
                                                fontWeight: isCurrent ? 700 : 600,
                                                fontSize: 16,
                                                color: isCurrent ? "#40a9ff" : "#fff",
                                                display: "flex",
                                                alignItems: "center"
                                            }}>
                                                {user.firstName} {user.lastName}
                                                {isCurrent && <span style={{
                                                    background: "#40a9ff",
                                                    color: "#fff",
                                                    borderRadius: 8,
                                                    padding: "2px 8px",
                                                    marginLeft: 8,
                                                    fontSize: 12
                                                }}>Bạn</span>}
                                            </div>
                                        </div>
                                        <div style={{
                                            fontWeight: 600,
                                            fontSize: 16,
                                            color: "#FFD700",
                                            marginRight: 8,
                                            minWidth: 60,
                                            textAlign: "right",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "flex-end"
                                        }}>
                                            <span style={{ marginRight: 4 }}>{user.totalScore}</span>
                                            <span style={{ fontSize: 16, color: "#FFD700" }}>★</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </Spin>
                </div>
            </div>
        </div>
    );
};

export default Rank;