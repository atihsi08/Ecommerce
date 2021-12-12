import React from 'react';
import playStore from '../../../images/playstore.png';
import appStore from '../../../images/Appstore.png';
import './footer.css';

function Footer() {
    return (
        <footer id="footer">
            <div className="leftFooter">
                <h4>DOWNLOAD OUR APP</h4>
                <p>Download App for Android and IOS mobile devices.</p>
                <img src={playStore} alt="playStore" />
                <img src={appStore} alt="appStore" />
            </div>

            <div className="midFooter">
                <h1>ECOMMERCE</h1>
                <p>High Quality is our first priority.</p>
                <p>Copyright 2021 &copy; IshitaGarg</p>
            </div>

            <div className="rightFooter">
                <h4>Follow us</h4>
                <a href="/">Instagram</a>
                <a href="/">Facebook</a>
                <a href="/">Youtube</a>
            </div>
        </footer>
    )
}

export default Footer
