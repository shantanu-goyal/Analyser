import "../styles/Title.css";

function Title({ heading, subHeading, children }) {
    return (
        <div className="title-container">
            <div className="heading">
                {heading}
            </div>
            <div className="subHeading">
                {subHeading}
            </div>
            <div className="children">
                <div>
                    {children}
                </div>

            </div>
        </div>
    )
}

export default Title;