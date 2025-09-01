import React, { useEffect, useState } from 'react';
import '../../styles/contactus.css';
import Header from '../../components/Header';
import BackButton from '../../components/BackButton';

export default function ContactPage() {
  const [headerHeight, setHeaderHeight] = useState<number>(0);

  useEffect(() => {
    /* Calculate header height for proper page spacing */
    const header = document.querySelector('.nhs-header') as HTMLElement;
    if (header) {
      setHeaderHeight(header.offsetHeight);
    }
  }, []);

  return (
    <div className="contact-page-container" style={{ paddingTop: `${headerHeight}px` }}>
      <Header title="Follow Us" showBack={true} />
      <BackButton />
      <div className="text-content">
        <h1 className="contact-title">Contact Us</h1>

        <section className="contact-section">
          <h2 className="contact-section-title">About Our Team</h2>
          <p className="contact-description">
            The DIPP is led by a team of passionate researchers dedicated to improving healthcare.
            For more information, our website is: 
            <a href="https://www.bristol.ac.uk/primaryhealthcare/researchthemes/dipp-study/research-team/"> https://www.bristol.ac.uk/primaryhealthcare/researchthemes/dipp-study/research-team/</a>
          </p>
          <hr className="divider" />
        </section>

        <section className="contact-section">
          <h2 className="contact-section-title">Contact Information</h2>
          <p className="contact-description">
            If you have any questions or need further assistance, feel free to reach out to us using the following methods:
          </p>

          <div className="contact-info">
            <div className="contact-info-item">
              <h3>Website</h3>
              <p>
                Follow what's happening in CAPC study:
                <a href="https://www.bristol.ac.uk/primaryhealthcare/researchthemes/dipp-study/"> https://www.bristol.ac.uk/primaryhealthcare/researchthemes/dipp-study/</a>
              </p>
            </div>
            
            <div className="contact-info-item">
              <h3>Email</h3>
              <p>
                Email us at: 
                <a href="dipp-study@bristol.ac.uk"> dipp-study@bristol.ac.uk</a>
              </p>
            </div>

            <div className="contact-info-item">
              <h3>Address</h3>
              <p>You can also visit us at our office:</p>
              <p>
                39 Whatley Road<br />
                GB,England,Bristol,BS8 2PS
              </p>
            </div>
          </div>

          <hr className="divider" />
        </section>

        <section className="contact-section">
          <h2 className="contact-section-title">Support Hours</h2>
          <p className="contact-description">
            Our support team is available Monday through Friday from 9 AM to 5 PM. We strive to respond to all inquiries within 1-2 business days.
          </p>
        </section>
      </div>  
    </div>
  );
}