export const getOrderStatusName = (orderStatusKey) => {
    switch (orderStatusKey) {
        case 'CREATED':
            return 'Created';
        case 'IN_PROGRESS':
            return 'In progress';
        case 'DELIVERED':
            return 'Delivered';
        default:
            return null;
    }
}

export default {
    CREATED: 'CREATED',
    IN_PROGRESS: 'IN_PROGRESS',
    DELIVERED: 'DELIVERED',
};
