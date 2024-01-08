interface ToolbarMenuItemWrapperProps {
    title: string;
    children?: JSX.Element;
}

export const ToolbarMenuItemWrapper = ({ title, children }: ToolbarMenuItemWrapperProps) => {
    return (
        <div>
            <p className="text-xs text-neutral-600">{title}</p>
            {children}
        </div>
    );
};
