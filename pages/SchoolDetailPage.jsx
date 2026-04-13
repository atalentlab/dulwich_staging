import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSchoolDetail } from '../hooks/useSchoolDetail';
import { useLocale } from '../contexts/LocaleContext';
import PageHeader from '../components/layout/PageHeader';
import PageFooter from '../components/layout/PageFooter';
import DynamicSEO from '../components/DynamicSEO';
import '../styles/pages/SchoolDetailPage.css';

/**
 * SchoolDetailPage - Displays comprehensive information about a specific school
 * Accessible via /school/:slug route
 * Shows school info including programs, contact details, facilities, etc.
 */
const SchoolDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { locale } = useLocale();
  const { data: schoolData, isLoading, error } = useSchoolDetail(slug, locale);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (isLoading) {
    return (
      <div className="school-detail-loading">
        <div className="loading-spinner"></div>
        <p>Loading school information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="school-detail-error">
        <PageHeader />
        <div className="error-container">
          <h1>School Not Found</h1>
          <p>Sorry, we couldn't find information for this school.</p>
          <button onClick={() => navigate('/find-a-school')} className="btn-back">
            Back to School Listings
          </button>
        </div>
        <PageFooter />
      </div>
    );
  }

  if (!schoolData) {
    return null;
  }

  const {
    name,
    slug: schoolSlug,
    description,
    image_url,
    banner_image,
    established,
    ages,
    students,
    location,
    address,
    phone,
    email,
    website,
    tags,
    programs,
    facilities,
    curriculum,
    admissions_info,
    quick_facts,
  } = schoolData;

  return (
    <>
      <DynamicSEO
        title={`${name} - Dulwich College International`}
        description={description || `Learn more about ${name}, established in ${established}`}
        image={banner_image || image_url}
      />

      <PageHeader />

      <main className="school-detail-page">
        {/* Hero Section */}
        <section
          className="school-hero"
          style={{ backgroundImage: `url(${banner_image || image_url})` }}
        >
          <div className="hero-overlay">
            <div className="container">
              <h1 className="school-name">{name}</h1>
              {location && <p className="school-location">{location}</p>}
              {tags && tags.length > 0 && (
                <div className="school-tags">
                  {tags.map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Quick Facts Section */}
        <section className="quick-facts-section">
          <div className="container">
            <div className="quick-facts-grid">
              {established && (
                <div className="fact-card">
                  <div className="fact-icon">📅</div>
                  <h3>Established</h3>
                  <p>{established}</p>
                </div>
              )}
              {ages && (
                <div className="fact-card">
                  <div className="fact-icon">👥</div>
                  <h3>Age Range</h3>
                  <p>{ages}</p>
                </div>
              )}
              {students && (
                <div className="fact-card">
                  <div className="fact-icon">🎓</div>
                  <h3>Students</h3>
                  <p>{students}</p>
                </div>
              )}
              {curriculum && (
                <div className="fact-card">
                  <div className="fact-icon">📚</div>
                  <h3>Curriculum</h3>
                  <p>{curriculum}</p>
                </div>
              )}
            </div>

            {/* Additional Quick Facts */}
            {quick_facts && quick_facts.length > 0 && (
              <div className="additional-facts">
                {quick_facts.map((fact, index) => (
                  <div key={index} className="fact-item">
                    <strong>{fact.label}:</strong> {fact.value}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* About Section */}
        {description && (
          <section className="about-section">
            <div className="container">
              <h2>About {name}</h2>
              <div
                className="description-content"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            </div>
          </section>
        )}

        {/* Programs Section */}
        {programs && programs.length > 0 && (
          <section className="programs-section">
            <div className="container">
              <h2>Our Programmes</h2>
              <div className="programs-grid">
                {programs.map((program, index) => (
                  <div key={index} className="program-card">
                    {program.icon && <div className="program-icon">{program.icon}</div>}
                    <h3>{program.name}</h3>
                    <p>{program.description}</p>
                    {program.age_range && (
                      <span className="program-age">Ages: {program.age_range}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Facilities Section */}
        {facilities && facilities.length > 0 && (
          <section className="facilities-section">
            <div className="container">
              <h2>Facilities</h2>
              <div className="facilities-grid">
                {facilities.map((facility, index) => (
                  <div key={index} className="facility-item">
                    {facility.icon && <span className="facility-icon">{facility.icon}</span>}
                    <span>{facility.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Admissions Section */}
        {admissions_info && (
          <section className="admissions-section">
            <div className="container">
              <h2>Admissions Information</h2>
              <div
                className="admissions-content"
                dangerouslySetInnerHTML={{ __html: admissions_info }}
              />
              <div className="admissions-cta">
                <a
                  href={website ? `${website}/admissions` : '#'}
                  className="btn btn-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Apply Now
                </a>
                <a
                  href={website ? `${website}/admissions/visit` : '#'}
                  className="btn btn-secondary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Book a Visit
                </a>
              </div>
            </div>
          </section>
        )}

        {/* Contact Section */}
        <section className="contact-section">
          <div className="container">
            <h2>Contact Us</h2>
            <div className="contact-grid">
              {address && (
                <div className="contact-item">
                  <div className="contact-icon">📍</div>
                  <h3>Address</h3>
                  <p>{address}</p>
                </div>
              )}
              {phone && (
                <div className="contact-item">
                  <div className="contact-icon">📞</div>
                  <h3>Phone</h3>
                  <p><a href={`tel:${phone}`}>{phone}</a></p>
                </div>
              )}
              {email && (
                <div className="contact-item">
                  <div className="contact-icon">✉️</div>
                  <h3>Email</h3>
                  <p><a href={`mailto:${email}`}>{email}</a></p>
                </div>
              )}
              {website && (
                <div className="contact-item">
                  <div className="contact-icon">🌐</div>
                  <h3>Website</h3>
                  <p>
                    <a href={website} target="_blank" rel="noopener noreferrer">
                      Visit School Website
                    </a>
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="container">
            <h2>Ready to Join Our Community?</h2>
            <p>Discover the Dulwich difference and give your child the education they deserve.</p>
            <div className="cta-buttons">
              <a
                href={website || '#'}
                className="btn btn-primary-large"
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit School Website
              </a>
              <button
                onClick={() => navigate('/find-a-school')}
                className="btn btn-secondary-large"
              >
                Explore More Schools
              </button>
            </div>
          </div>
        </section>
      </main>

      <PageFooter />
    </>
  );
};

export default SchoolDetailPage;
