const Button = ({ children, onClick, loading, type, extra }) => {
    const types = {
        primary: "primary",
        secondary: "secondary",
        accent: "accent",
        error: "error",
        success: "success",
        warning: "warning",
        info: "info",
    };
    return (
        <button
            className={`btn btn-${types[type]} ${extra}`}
            onClick={onClick}
            disabled={loading}
        >
            {children}
        </button>
    );
};

export default Button;
