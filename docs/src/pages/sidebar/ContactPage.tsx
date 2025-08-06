import React, { useEffect, useState } from 'react';
import '../../styles/contactus.css';
import Header from '../../components/Header';
import BackButton from '../../components/BackButton';//zkx

export default function ContactPage() {
  const [headerHeight, setHeaderHeight] = useState<number>(0);

  useEffect(() => {
    const header = document.querySelector('.nhs-header') as HTMLElement;  // 类型断言
    if (header) {
      setHeaderHeight(header.offsetHeight); // 安全访问 offsetHeight
    }
  }, []);
  return (
    <div className="contact-page-container" style={{ paddingTop: `${headerHeight}px` }}>
      <Header title="Follow Us" showBack={true} /> {/* 使用 Header 中的返回按钮 */}
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
          {/* 这里添加一个分隔线 */}
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
                For general inquiries or support, our website is: 
                <a href="https://www.bristol.ac.uk/primaryhealthcare/researchthemes/dipp-study/" > https://www.bristol.ac.uk/primaryhealthcare/researchthemes/dipp-study/</a>
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
              <h3>Follow Us</h3>
              <p className="contact-description">
                Stay updated with the latest news and updates about the DIPP project on our social media channels:
              </p>
              <ul className="social-links">
                <li>
                  <a href="https://www.youtube.com/channel/UCQ99TuE8DFfOFNjMgi7m1sQ" target="_blank" rel="noopener noreferrer">Youtube</a>
                </li>
                <li>
                  <a href="https://www.linkedin.com/company/centre-for-academic-primary-care/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                </li>
                <li>
                  <a href="https://bsky.app/profile/capcbristol.bsky.social" target="_blank" rel="noopener noreferrer">Bluesky</a>
                </li>
              </ul>
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

          {/* 添加一个分隔线 */}
          <hr className="divider" />
        </section>

        <section className="contact-section">
          <h2 className="contact-section-title">Support Hours</h2>
          <p className="contact-description">
            Our support team is available Monday through Friday from XXXX AM to XXXX PM. We strive to respond to all inquiries within 1-2 business days.
          </p>
        </section>
      </div>  
    </div>
  );
}
