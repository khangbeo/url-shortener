const Button = ({ children, onClick, loading, type, extra }) => {
    const types = {
        primary: "btn-primary",
        secondary: "btn-secondary",
        accent: "btn-accent",
        error: "btn-error",
        success: "btn-success",
        warning: "btn-warning",
        info: "btn-info",
    };
    return (
        <button
            className={`btn ${types[type]} ${extra} mx-2`}
            onClick={onClick}
            disabled={loading}
        >
            {children}
        </button>
    );
};

export default Button;
