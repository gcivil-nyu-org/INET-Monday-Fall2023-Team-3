function MyButton({ onClick, label }) {
    return (
        <button onClick={onClick}>
            {label}
        </button>
    );
}

export default MyButton;