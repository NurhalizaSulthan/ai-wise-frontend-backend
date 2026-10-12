import { Icon } from '@iconify/react';
import Button from './Button';

interface TableStatusProps {
    variant: 'error' | 'loading' | 'empty';
    message: string;
    onRetry?: () => void;
}

const config = {
    error: { icon: 'mdi:cloud-off-outline', tone: 'text-danger' },
    loading: { icon: 'mdi:loading', tone: 'text-primary animate-spin' },
    empty: { icon: 'mdi:account-group-outline', tone: 'text-muted' },
} as const;

const TableStatus = ({ variant, message, onRetry }: TableStatusProps) => {
    const c = config[variant];

    return (
        <div className="flex flex-col items-center gap-3 py-14 text-center">
            <Icon icon={c.icon} className={`h-10 w-10 ${c.tone}`} />
            <p className="text-sm text-muted">
                {variant === 'loading' ? 'Memuat data...' : message}
            </p>
            {variant === 'error' && onRetry && (
                <Button
                    size="sm"
                    variant="secondary"
                    onClick={onRetry}
                    startIcon={<Icon icon="mdi:refresh" className="h-4 w-4" />}
                >
                    Coba lagi
                </Button>
            )}
        </div>
    );
};

export default TableStatus;