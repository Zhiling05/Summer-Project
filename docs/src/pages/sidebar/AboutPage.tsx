// src/pages/sidebar/AboutPage.tsx
import Header from '../../components/Header';
import BackButton from '../../components/BackButton';


export default function AboutPage() {
  return (
    <div className="about-page">
      <Header title="About Us" />
            <BackButton />
      <h1 className="about-title">About Us Page</h1>
      
      <section className="about-section">
        <h2 className="about-heading">DIPP Research Team</h2>
        <p className="about-description">
          The DIPP is led by a team of passionate researchers dedicated to improving healthcare.
        </p>
        
        <h3 className="team-title">Team members:</h3>
        <ul className="team-list">
          <li>XXX - XXXXXXX</li>
          <li>XXX - XXXXXXX</li>
          <li>XXX - XXXXXXX</li>
          <li>XXX - XXXXXXX</li>
          <li>XXX - XXXXXXX</li>
          <li>XXX - XXXXXXX</li>
          <li>XXX - XXXXXXX</li>
          <li>XXX - XXXXXXX</li>
        </ul>
      </section>
    </div>
  );
}
