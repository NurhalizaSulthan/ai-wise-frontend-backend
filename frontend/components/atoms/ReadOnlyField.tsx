type ReadOnlyFieldProps = {
    label: string;
    value: string;
    mono?: boolean;
};

const ReadOnlyField = ({ label, value, mono = false }: ReadOnlyFieldProps) => (
    <div>
        <p className="text-md font-semibold text-muted">{label}</p>
        <div className="mt-1 flex items-center rounded-lg bg-muted/10 px-3 py-2">
            <span className={`truncate text-sm text-foreground ${mono ? "font-mono" : ""}`}>
                {value}
            </span>
        </div>
    </div>
);

export default ReadOnlyField;