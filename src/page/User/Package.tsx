import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/services/store/store';
import {
    fetchActivePackages,
    purchasePackage,
    clearPurchaseState,
    checkActivePackage,
    getPackageDetails,
    checkPaymentStatus,
    cancelPayment,
    checkAndUpdateUserPackages,
    clearPackageDetails,
    clearPaymentStatus
} from '@/services/features/package/packageSlice';
import {
    Card,
    Row,
    Col,
    Button,
    Spin,
    Alert,
    Modal,
    message,
    Tooltip,
    Descriptions,
    Tag,
    Badge
} from 'antd';
import {
    CheckCircleOutlined,
    CrownOutlined,
    ThunderboltOutlined,
    HeartOutlined,
    InfoCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    EyeOutlined
} from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';

interface IPackageFeature {
    doubleXP: boolean;
    unlimitedLives: boolean;
}

interface IPackage {
    _id: string;
    name: string;
    description: string;
    price: number;
    duration: number;
    isActive: boolean;
    discount: number;
    discountEndDate: string;
    features: IPackageFeature;
    createdAt: string;
    updatedAt: string;
}

const getDisplayPackageName = (name: string) => {
    const lowercaseName = name.toLowerCase();
    if (lowercaseName.includes('silver')) return 'Gói Bạc';
    if (lowercaseName.includes('premium')) return 'Gói Premium';
    return name;
};

const calculateRemainingDays = (endDate: string) => {
    const end = dayjs(endDate);
    const now = dayjs();
    return end.diff(now, 'day');
};

function Package() {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const transactionIdParam = searchParams.get('transactionId');

    const {
        packages,
        loading,
        error,
        purchaseLoading,
        purchaseError,
        paymentUrl,
        hasActivePackage,
        activePackage,
        activePackageLoading,
        packageDetails,
        paymentStatus,
        paymentStatusLoading
    } = useSelector((state: RootState) => state.package);

    useEffect(() => {
        dispatch(fetchActivePackages());
        dispatch(checkActivePackage());
        dispatch(checkAndUpdateUserPackages());

        if (transactionIdParam) {
            dispatch(checkPaymentStatus(transactionIdParam));
        }
    }, [dispatch, transactionIdParam]);

    useEffect(() => {
        if (paymentUrl) {
            const newWindow = window.open(paymentUrl, '_blank', 'noopener,noreferrer');
            if (newWindow) newWindow.opener = null;
            dispatch(clearPurchaseState());
        }
    }, [paymentUrl, dispatch]);

    useEffect(() => {
        if (purchaseError) {
            message.error(purchaseError);
            dispatch(clearPurchaseState());
        }
    }, [purchaseError, dispatch]);

    const handlePurchase = (packageId: string) => {
        if (hasActivePackage) {
            message.info("Bạn cần đợi gói hiện tại hết hạn trước khi mua gói mới");
            return;
        }

        Modal.confirm({
            title: 'Xác nhận mua gói',
            content: 'Bạn có chắc chắn muốn mua gói này không?',
            okText: 'Đồng ý',
            cancelText: 'Hủy',
            onOk: () => dispatch(purchasePackage(packageId)),
        });
    };

    const handleViewDetails = (packageId: string) => {
        dispatch(getPackageDetails(packageId));
    };

    const handleCancelPayment = (transactionId: string) => {
        Modal.confirm({
            title: 'Xác nhận hủy thanh toán',
            content: 'Bạn có chắc chắn muốn hủy thanh toán này không?',
            okText: 'Đồng ý',
            cancelText: 'Hủy',
            onOk: () => {
                dispatch(cancelPayment(transactionId))
                    .then(() => {
                        message.success('Đã hủy thanh toán thành công');
                        dispatch(clearPaymentStatus());
                    });
            },
        });
    };

    if (loading || activePackageLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spin size="large" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4">
                <Alert type="error" message={error} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
            {/* Active package info */}
            {hasActivePackage && activePackage && (
                <div className="max-w-7xl mx-auto mb-8">
                    <Card
                        title={
                            <div className="flex items-center">
                                <CrownOutlined className="text-yellow-500 mr-2" />
                                <span className="font-bold">Gói của bạn hiện tại</span>
                            </div>
                        }
                    >
                        <Descriptions bordered column={1}>
                            <Descriptions.Item label="Tên gói">
                                {getDisplayPackageName(activePackage.package.name)}
                                {activePackage.package.discount > 0 && (
                                    <Tag color="orange" className="ml-2">
                                        Giảm {activePackage.package.discount}%
                                    </Tag>
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Thời hạn">
                                <ClockCircleOutlined className="mr-2" />
                                Còn {calculateRemainingDays(activePackage.endDate)} ngày
                            </Descriptions.Item>
                            <Descriptions.Item label="Ngày hết hạn">
                                {dayjs(activePackage.endDate).format('DD/MM/YYYY')}
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>
                </div>
            )}

            {/* Payment status */}
            {transactionIdParam && paymentStatus && (
                <div className="max-w-7xl mx-auto mb-8">
                    <Alert
                        message={`Trạng thái thanh toán: ${paymentStatus.status}`}
                        description={`Mã giao dịch: ${transactionIdParam}`}
                        type={paymentStatus.status === 'completed' ? 'success' : 'warning'}
                        showIcon
                        action={
                            paymentStatus.status === 'pending' && (
                                <Button
                                    type="primary"
                                    danger
                                    size="small"
                                    onClick={() => handleCancelPayment(transactionIdParam)}
                                    icon={<CloseCircleOutlined />}
                                >
                                    Hủy thanh toán
                                </Button>
                            )
                        }
                    />
                </div>
            )}

            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        <CrownOutlined className="text-yellow-500 mr-3" />
                        Nâng cấp tài khoản Premium
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Mở khóa tất cả tính năng cao cấp và tối ưu hóa trải nghiệm học tập của bạn
                    </p>
                </div>

                <Row gutter={[24, 24]} justify="center">
                    {packages.map((pkg: IPackage) => {
                        const discountedPrice = pkg.price * (1 - pkg.discount / 100);
                        const isPopular = pkg.duration === 30;

                        return (
                            <Col key={pkg._id} xs={24} sm={12} md={8} lg={6}>
                                <Badge.Ribbon
                                    text="Phổ biến"
                                    color="blue"
                                    placement="start"
                                    style={{ display: isPopular ? 'block' : 'none' }}
                                >
                                    <Card
                                        className="h-full transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                                        title={
                                            <div className="text-xl font-bold text-center">
                                                {getDisplayPackageName(pkg.name)}
                                            </div>
                                        }
                                    >
                                        <div className="text-center mb-6">
                                            {pkg.discount > 0 ? (
                                                <div className="space-y-1">
                                                    <div className="text-gray-500 line-through text-lg">
                                                        {pkg.price.toLocaleString('vi-VN')}đ
                                                    </div>
                                                    <div className="text-3xl font-bold text-blue-600">
                                                        {discountedPrice.toLocaleString('vi-VN')}đ
                                                    </div>
                                                    <Tag color="red" className="mt-1">
                                                        Giảm {pkg.discount}%
                                                    </Tag>
                                                </div>
                                            ) : (
                                                <div className="text-3xl font-bold text-blue-600">
                                                    {pkg.price.toLocaleString('vi-VN')}đ
                                                </div>
                                            )}
                                            <div className="text-gray-500 mt-2">/{pkg.duration} ngày</div>
                                        </div>

                                        <div className="mb-6">
                                            <p className="text-gray-600 text-center">{pkg.description}</p>
                                        </div>

                                        <div className="space-y-3 mb-6">
                                            <h3 className="font-bold mb-3 text-gray-700 flex items-center">
                                                <ThunderboltOutlined className="text-yellow-500 mr-2" />
                                                Tính năng bao gồm:
                                            </h3>
                                            <ul className="space-y-2">
                                                {pkg.features.doubleXP && (
                                                    <li className="flex items-center text-gray-600">
                                                        <CheckCircleOutlined className="text-green-500 mr-2" />
                                                        Nhân đôi XP
                                                    </li>
                                                )}
                                                {pkg.features.unlimitedLives && (
                                                    <li className="flex items-center text-gray-600">
                                                        <HeartOutlined className="text-red-500 mr-2" />
                                                        Mạng không giới hạn
                                                    </li>
                                                )}
                                            </ul>
                                        </div>

                                        <div className="flex space-x-2">
                                            <Tooltip title={hasActivePackage ? "Bạn cần đợi gói hiện tại hết hạn trước khi mua gói mới" : ""}>
                                                <Button
                                                    type="primary"
                                                    size="large"
                                                    block
                                                    onClick={() => handlePurchase(pkg._id)}
                                                    loading={purchaseLoading}
                                                    disabled={hasActivePackage}
                                                >
                                                    {hasActivePackage ? (
                                                        <>
                                                            <InfoCircleOutlined className="mr-2" />
                                                            Đã có gói
                                                        </>
                                                    ) : (
                                                        'Mua Ngay'
                                                    )}
                                                </Button>
                                            </Tooltip>
                                            <Button
                                                icon={<EyeOutlined />}
                                                onClick={() => handleViewDetails(pkg._id)}
                                            />
                                        </div>
                                    </Card>
                                </Badge.Ribbon>
                            </Col>
                        );
                    })}
                </Row>

                {/* Package details modal */}
                {packageDetails && (
                    <Modal
                        title={`Chi tiết gói ${getDisplayPackageName(packageDetails.name)}`}
                        open={!!packageDetails}
                        onCancel={() => dispatch(clearPackageDetails())}
                        footer={null}
                        width={700}
                    >
                        <Descriptions bordered column={1}>
                            <Descriptions.Item label="Mô tả">{packageDetails.description}</Descriptions.Item>
                            <Descriptions.Item label="Giá gốc">
                                {packageDetails.price.toLocaleString('vi-VN')}đ
                                {packageDetails.discount > 0 && (
                                    <span className="ml-2">
                                        <Tag color="red">Giảm {packageDetails.discount}%</Tag>
                                        <span className="ml-2 text-lg font-semibold">
                                            → {Math.round(packageDetails.price * (1 - packageDetails.discount / 100)).toLocaleString('vi-VN')}đ
                                        </span>
                                    </span>
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Thời hạn">{packageDetails.duration} ngày</Descriptions.Item>
                            <Descriptions.Item label="Tính năng">
                                <ul className="list-disc pl-5 space-y-2">
                                    {packageDetails.features.doubleXP && (
                                        <li className="flex items-center">
                                            <CheckCircleOutlined className="text-green-500 mr-2" />
                                            Nhân đôi điểm kinh nghiệm (XP) khi học
                                        </li>
                                    )}
                                    {packageDetails.features.unlimitedLives && (
                                        <li className="flex items-center">
                                            <HeartOutlined className="text-red-500 mr-2" />
                                            Mạng không giới hạn khi làm bài kiểm tra
                                        </li>
                                    )}
                                </ul>
                            </Descriptions.Item>
                        </Descriptions>
                    </Modal>
                )}

                <div className="mt-12 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Câu hỏi thường gặp</h2>
                    <div className="max-w-3xl mx-auto grid gap-6 text-left">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Làm sao để thanh toán?</h3>
                            <p className="text-gray-600">Chúng tôi hỗ trợ thanh toán qua PayOS với nhiều phương thức khác nhau như thẻ ngân hàng, ví điện tử.</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Tôi có thể hủy gói đã mua không?</h3>
                            <p className="text-gray-600">Bạn có thể hủy thanh toán khi đang ở trạng thái chờ thanh toán. Sau khi thanh toán thành công, gói sẽ tự động kích hoạt.</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Tôi có thể nâng cấp gói hiện tại không?</h3>
                            <p className="text-gray-600">Khi gói hiện tại hết hạn, bạn có thể mua gói mới với thời hạn và tính năng tùy chọn.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Package;