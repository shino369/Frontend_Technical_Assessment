export interface Props {
    className?: string;
    styles?: any;
    children: React.ReactNode;
}

const CommonWrapper: React.FC<Props> = ({ className, styles, children }) => {
    return (
        <div className={className} style={styles}>
            {children}
        </div>
    )
}

export default CommonWrapper;