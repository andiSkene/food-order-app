export default function Button({ children, textOnly, className, ...props }) {
    let buttonClass = textOnly ? "text-button" : "button";
    buttonClass += " " + className;

    return <button className={buttonClass} {...props}>
        {children}
    </button>
}