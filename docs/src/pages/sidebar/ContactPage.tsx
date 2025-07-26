import Header from '../../components/Header';

export default function ContactPage() {
  return (
    <div className="contact-container">
      <Header title="Contact Us" showBack={true} /> {/* 使用 Header 中的返回按钮 */}
      <h1 className="contact-title">Contact Us</h1>

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
              <a href="http://XXXXXXXXX.com"> http://XXXXXXXXX.com</a>
            </p>
          </div>
          
          <div className="contact-info-item">
            <h3>Email</h3>
            <p>
              Email us at: 
              <a href="mailto:XXXXXXX@example.com"> XXXXXXX@example.com</a>
            </p>
          </div>

          <div className="contact-info-item">
            <h3>Phone</h3>
            <p>
              If you need immediate assistance, give us a call at: 
              <strong>+1 (234) 567-890</strong>
            </p>
          </div>

          <div className="contact-info-item">
            <h3>Address</h3>
            <p>You can also visit us at our office:</p>
            <p>
              DIPP Research Team<br />
              1234 Research Lane<br />
              XXXXXX, State, 12345
            </p>
          </div>
        </div>

        {/* 添加一个分隔线 */}
        <hr className="divider" />
      </section>

      <section className="contact-section">
        <h2 className="contact-section-title">Follow Us</h2>
        <p className="contact-description">
          Stay updated with the latest news and updates about the DIPP project on our social media channels:
        </p>
        <ul className="social-links">
          <li>
            <a href="https://XXXXXXXX.com/DIPP_Project" target="_blank" rel="noopener noreferrer">Twitter</a>
          </li>
          <li>
            <a href="https://www.XXXXXXXXXXX.com/XXXXXXXXXXXX/dipp-project" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </li>
        </ul>
        {/* 这里添加一个分隔线 */}
        <hr className="divider" />
      </section>

      <section className="contact-section">
        <h2 className="contact-section-title">Support Hours</h2>
        <p className="contact-description">
          Our support team is available Monday through Friday from XXXX AM to XXXX PM. We strive to respond to all inquiries within 1-2 business days.
        </p>
      </section>
    </div>
  );
}
