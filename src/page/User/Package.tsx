import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/services/store/store';
import { fetchActivePackages, IPackage, purchasePackage, clearPurchaseState, checkActivePackage } from '@/services/features/package/packageSlice';
import { Card, Row, Col, Button, Spin, Alert, Modal, message, Tooltip } from 'antd';
import { CheckCircleOutlined, CrownOutlined, ThunderboltOutlined, HeartOutlined, InfoCircleOutlined } from '@ant-design/icons';

const getDisplayPackageName = (name: string) => {
    const lowercaseName = name.toLowerCase();
    if (lowercaseName.includes('silver')) {
        return 'Gói Bạc';
    }
    if (lowercaseName.includes('premium')) {
        return 'Gói Premium';
    }
    return name;
};

function Package() {
    const dispatch = useDispatch<AppDispatch>();
    const {
        packages,
        loading,
        error,
        purchaseLoading,
        purchaseError,
        paymentUrl,
        hasActivePackage,
        activePackageLoading
    } = useSelector((state: RootState) => state.package);

    useEffect(() => {
        dispatch(fetchActivePackages());
        dispatch(checkActivePackage());
    }, [dispatch]);

    useEffect(() => {
        if (paymentUrl) {
            window.location.href = paymentUrl;
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
            onOk: () => {
                dispatch(purchasePackage(packageId));
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
            {hasActivePackage && (
                <div className="max-w-7xl mx-auto mb-8">
                    <Alert
                        message="Thông báo"
                        description="Bạn đang có gói Premium đang hoạt động. Bạn cần đợi gói hiện tại hết hạn trước khi mua gói mới."
                        type="info"
                        showIcon
                    />
                </div>
            )}

            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4 font-baloo">
                        <CrownOutlined className="text-yellow-500 mr-3" />
                        Nâng cấp tài khoản Premium
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto font-baloo">
                        Mở khóa tất cả tính năng cao cấp và tối ưu hóa trải nghiệm học tập của bạn
                    </p>
                </div>

                <Row gutter={[24, 24]} justify="center">
                    {packages.map((pkg: IPackage) => {
                        const discountedPrice = pkg.price * (1 - pkg.discount / 100);
                        const isPopular = pkg.duration === 30; // Giả sử gói 30 ngày là phổ biến nhất

                        return (
                            <Col key={pkg._id} xs={24} sm={12} md={8} lg={6}>
                                <Card
                                    className={`h-full transform transition-all duration-300 hover:scale-105 ${isPopular ? 'border-blue-500 shadow-xl' : 'hover:shadow-lg'
                                        }`}
                                    styles={{
                                        header: {
                                            borderBottom: isPopular ? '2px solid #3B82F6' : undefined,
                                            backgroundColor: isPopular ? '#EFF6FF' : undefined
                                        }
                                    }}
                                    title={
                                        <div className="relative">
                                            {isPopular && (
                                                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                                                    <span className="bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                                                        Phổ biến nhất
                                                    </span>
                                                </div>
                                            )}
                                            <div className="text-xl font-bold text-center font-baloo mt-2">
                                                {getDisplayPackageName(pkg.name)}
                                            </div>
                                        </div>
                                    }
                                    variant="outlined"
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
                                                <div className="inline-block bg-red-100 text-red-600 text-sm font-semibold px-2 py-1 rounded-full">
                                                    Giảm {pkg.discount}%
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-3xl font-bold text-blue-600">
                                                {pkg.price.toLocaleString('vi-VN')}đ
                                            </div>
                                        )}
                                        <div className="text-gray-500 mt-2 font-baloo">/{pkg.duration} ngày</div>
                                    </div>

                                    <div className="mb-6">
                                        <p className="text-gray-600 text-center font-baloo">{pkg.description}</p>
                                    </div>

                                    <div className="space-y-3 mb-6">
                                        <h3 className="font-bold mb-3 font-baloo text-gray-700 flex items-center">
                                            <ThunderboltOutlined className="text-yellow-500 mr-2" />
                                            Tính năng bao gồm:
                                        </h3>
                                        <ul className="space-y-2">
                                            {pkg.features.doubleXP && (
                                                <li className="flex items-center text-gray-600">
                                                    <CheckCircleOutlined className="text-green-500 mr-2" />
                                                    <span className="font-baloo">Nhân đôi XP</span>
                                                </li>
                                            )}
                                            {pkg.features.unlimitedLives && (
                                                <li className="flex items-center text-gray-600">
                                                    <HeartOutlined className="text-red-500 mr-2" />
                                                    <span className="font-baloo">Mạng không giới hạn</span>
                                                </li>
                                            )}
                                        </ul>
                                    </div>

                                    <Tooltip title={hasActivePackage ? "Bạn cần đợi gói hiện tại hết hạn trước khi mua gói mới" : ""}>
                                        <Button
                                            type="primary"
                                            size="large"
                                            block
                                            className={`font-baloo ${isPopular ? 'bg-blue-500 hover:bg-blue-600' : ''}`}
                                            onClick={() => handlePurchase(pkg._id)}
                                            loading={purchaseLoading}
                                            disabled={hasActivePackage}
                                        >
                                            {hasActivePackage ? (
                                                <>
                                                    <InfoCircleOutlined className="mr-2" />
                                                    Đã có gói active
                                                </>
                                            ) : (
                                                'Mua Ngay'
                                            )}
                                        </Button>
                                    </Tooltip>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>

                <div className="mt-12 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 font-baloo">Câu hỏi thường gặp</h2>
                    <div className="max-w-3xl mx-auto grid gap-6 text-left">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2 font-baloo">Làm sao để thanh toán?</h3>
                            <p className="text-gray-600 font-baloo">Chúng tôi hỗ trợ nhiều phương thức thanh toán khác nhau như thẻ ngân hàng, ví điện tử MoMo, ZaloPay, và VNPay.</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2 font-baloo">Tôi có thể hủy gói đã mua không?</h3>
                            <p className="text-gray-600 font-baloo">Bạn có thể hủy gói Premium bất cứ lúc nào, nhưng chúng tôi không hoàn tiền cho thời gian còn lại của gói.</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2 font-baloo">Tôi có thể nâng cấp gói hiện tại không?</h3>
                            <p className="text-gray-600 font-baloo">Có, bạn có thể nâng cấp lên gói cao hơn bất cứ lúc nào. Thời gian còn lại của gói cũ sẽ được quy đổi tương ứng.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Package;