import React from "react";

const Menu = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary text-center">
            <a className="navbar-brand" href="#">
                Mitcon Infrastructure Live Status   
            </a>
            <button
                className="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbarColor01"
                aria-controls="navbarColor01"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span className="navbar-toggler-icon" />
            </button>

            <div className="collapse navbar-collapse" id="navbarColor01" />
        </nav>
    );
};

export default Menu;
