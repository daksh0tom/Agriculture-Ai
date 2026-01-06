import React, { useState } from 'react';
import { ChevronDown, Leaf, Shield, Droplets, TrendingUp, Award, Zap, CreditCard, Plane } from 'lucide-react';

const FarmerSchemes = () => {
  const [expandedScheme, setExpandedScheme] = useState(null);

  const schemes = [
    {
      id: 1,
      name: 'PM-KISAN (Samman Nidhi)',
      category: 'Income Support',
      icon: TrendingUp,
      color: 'bg-green-50 border-green-200',
      benefits: '₹6,000/year in 3 installments',
      eligibility: 'All landholding farmer families',
      description: 'Central sector scheme with 100% funding from GoI. Provides income support to all landholding farmers to supplement financial needs for procuring various inputs.',
      deadline: 'Ongoing',
      application: 'Online at pmkisan.gov.in'
    },
    {
      id: 2,
      name: 'PM Fasal Bima Yojana (PMFBY)',
      category: 'Crop Insurance',
      icon: Shield,
      color: 'bg-blue-50 border-blue-200',
      benefits: 'Lowest premium (1.5% - 5%)',
      eligibility: 'Farmers growing notified crops',
      description: 'Comprehensive insurance coverage against non-preventable natural risks from pre-sowing to post-harvest. Premium is 2% for Kharif and 1.5% for Rabi crops.',
      deadline: 'Cut-off dates (usually July/Dec)',
      application: 'Banks / CSC / pmfby.gov.in'
    },
    {
      id: 3,
      name: 'Kisan Credit Card (KCC)',
      category: 'Credit & Loan',
      icon: CreditCard,
      color: 'bg-indigo-50 border-indigo-200',
      benefits: 'Loans at effective 4% interest',
      eligibility: 'Owner cultivators, tenant farmers',
      description: 'Provides adequate and timely credit support from the banking system under a single window with flexible and simplified procedure. Includes interest subvention of 3% for prompt repayment.',
      deadline: 'Ongoing',
      application: 'Any Commercial Bank'
    },
    {
      id: 4,
      name: 'Namo Drone Didi Scheme',
      category: 'Technology',
      icon: Plane,
      color: 'bg-pink-50 border-pink-200',
      benefits: '80% subsidy on Drones (up to ₹8L)',
      eligibility: 'Women Self Help Groups (SHGs)',
      description: 'Empowers women SHGs to provide drone rental services to farmers for spraying fertilizers and pesticides. Reduces labor cost and health hazards for farmers.',
      deadline: 'Ongoing',
      application: 'Through NRLM / State Dept'
    },
    {
      id: 5,
      name: 'PM Krishi Sinchayee Yojana',
      category: 'Irrigation',
      icon: Droplets,
      color: 'bg-cyan-50 border-cyan-200',
      benefits: '45-55% subsidy on micro-irrigation',
      eligibility: 'Farmers with cultivable land',
      description: 'Promotes "Per Drop More Crop" by subsidizing drip and sprinkler irrigation systems to improve water use efficiency.',
      deadline: 'State specific',
      application: 'State Horticulture/Agri Dept'
    },
    {
      id: 6,
      name: 'Soil Health Card Scheme',
      category: 'Agri-Management',
      icon: Leaf,
      color: 'bg-amber-50 border-amber-200',
      benefits: 'Soil nutrient status & advice',
      eligibility: 'All farmers',
      description: 'Provides information to farmers on nutrient status of their soil along with recommendations on appropriate dosage of nutrients to be applied.',
      deadline: 'Cycle of 2 years',
      application: 'Agri Dept / CSC'
    },
    {
      id: 7,
      name: 'Paramparagat Krishi Vikas (PKVY)',
      category: 'Organic Farming',
      icon: Award,
      color: 'bg-emerald-50 border-emerald-200',
      benefits: '₹50,000/ha for organic conversion',
      eligibility: 'Farmers in clusters (20ha)',
      description: 'Promotes organic farming through a cluster approach. Financial assistance is given for mobilization, capacity building, procurement of organic inputs, and branding.',
      deadline: 'Ongoing',
      application: 'Jaivikkheti.in / State Dept'
    },
    {
      id: 8,
      name: 'PM Kisan Maan Dhan Yojana',
      category: 'Pension',
      icon: Zap,
      color: 'bg-purple-50 border-purple-200',
      benefits: '₹3,000 monthly pension',
      eligibility: 'Small/Marginal Farmers (18-40 yrs)',
      description: 'A voluntary and contributory pension scheme for small and marginal farmers to provide a social safety net after the age of 60 years.',
      deadline: 'Apply before age 40',
      application: 'CSC / maandhan.in'
    }
  ];

  const toggleScheme = (id) => {
    setExpandedScheme(expandedScheme === id ? null : id);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '48px 16px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: '800', color: '#111827', marginBottom: '16px', lineHeight: '1.2' }}>
            Government Schemes for Farmers
          </h1>
          <p style={{ fontSize: '18px', color: '#6b7280', margin: '0', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
            A curated guide to the most impactful financial, insurance, and technological welfare schemes for Indian agriculture.
          </p>
        </div>

        {/* Stats */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '24px', 
          marginBottom: '48px' 
        }}>
          <div style={{ 
            backgroundColor: '#fff', 
            padding: '32px 24px', 
            borderRadius: '16px', 
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
            textAlign: 'center',
            border: '1px solid #f3f4f6'
          }}>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 12px 0', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Active Beneficiaries</p>
            <p style={{ fontSize: '36px', fontWeight: '800', color: '#059669', margin: '0' }}>11 Cr+</p>
          </div>
          <div style={{ 
            backgroundColor: '#fff', 
            padding: '32px 24px', 
            borderRadius: '16px', 
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
            textAlign: 'center',
             border: '1px solid #f3f4f6'
          }}>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 12px 0', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>KCC Coverage</p>
            <p style={{ fontSize: '36px', fontWeight: '800', color: '#0891b2', margin: '0' }}>7.3 Cr+</p>
          </div>
          <div style={{ 
            backgroundColor: '#fff', 
            padding: '32px 24px', 
            borderRadius: '16px', 
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
            textAlign: 'center',
             border: '1px solid #f3f4f6'
          }}>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 12px 0', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Credit Outlay</p>
            <p style={{ fontSize: '36px', fontWeight: '800', color: '#7c3aed', margin: '0' }}>₹20 Lakh Cr</p>
          </div>
        </div>

        {/* Schemes List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {schemes.map((scheme) => {
            const Icon = scheme.icon;
            const isExpanded = expandedScheme === scheme.id;

            return (
              <div
                key={scheme.id}
                style={{
                  backgroundColor: '#fff',
                  borderRadius: '16px',
                  border: isExpanded ? `2px solid ${scheme.color.split('-')[1]}` : '1px solid #e5e7eb',
                  overflow: 'hidden',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: isExpanded ? '0 10px 15px -3px rgba(0,0,0,0.1)' : '0 1px 3px rgba(0,0,0,0.05)'
                }}
              >
                {/* Main Row */}
                <div
                  onClick={() => toggleScheme(scheme.id)}
                  style={{
                    padding: '24px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: isExpanded ? '#f9fafb' : '#fff',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1, minWidth: 0 }}>
                    <div style={{
                      width: '56px',
                      height: '56px',
                      minWidth: '56px',
                      borderRadius: '14px',
                      backgroundColor: isExpanded ? '#fff' : '#f3f4f6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      border: '1px solid #e5e7eb'
                    }}>
                      <Icon style={{ width: '28px', height: '28px', color: '#374151' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{ 
                        fontSize: '18px', 
                        fontWeight: '700', 
                        color: '#111827', 
                        marginBottom: '8px',
                        margin: '0 0 8px 0',
                        lineHeight: '1.4'
                      }}>
                        {scheme.name}
                      </h3>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
                        <span style={{
                          display: 'inline-block',
                          backgroundColor: '#e0f2fe',
                          color: '#0284c7',
                          padding: '4px 12px',
                          borderRadius: '9999px',
                          fontSize: '13px',
                          fontWeight: '600',
                          whiteSpace: 'nowrap'
                        }}>
                          {scheme.category}
                        </span>
                        <span style={{ color: '#4b5563', fontSize: '14px', fontWeight: '500' }}>
                          {scheme.benefits}
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronDown
                    style={{
                      width: '24px',
                      height: '24px',
                      color: '#9ca3af',
                      transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease',
                      flexShrink: 0,
                      marginLeft: '16px'
                    }}
                  />
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div style={{
                    padding: '32px',
                    borderTop: '1px solid #f3f4f6',
                    backgroundColor: '#fff'
                  }}>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
                      gap: '32px',
                      marginBottom: '32px'
                    }}>
                      {/* Eligibility Block */}
                      <div>
                         <p style={{ 
                          fontSize: '12px', 
                          fontWeight: '700', 
                          color: '#9ca3af', 
                          textTransform: 'uppercase', 
                          marginBottom: '8px',
                          margin: '0 0 10px 0',
                          letterSpacing: '0.05em'
                        }}>
                          Eligibility Criteria
                        </p>
                        <p style={{ color: '#1f2937', fontSize: '15px', lineHeight: '1.6', margin: '0', fontWeight: '500' }}>
                          {scheme.eligibility}
                        </p>
                      </div>
                      
                      {/* Deadline Block */}
                      <div>
                        <p style={{ 
                          fontSize: '12px', 
                          fontWeight: '700', 
                          color: '#9ca3af', 
                          textTransform: 'uppercase', 
                          marginBottom: '8px',
                          margin: '0 0 10px 0',
                          letterSpacing: '0.05em'
                        }}>
                          Application Deadline
                        </p>
                        <p style={{ color: '#1f2937', fontSize: '15px', lineHeight: '1.6', margin: '0', fontWeight: '500' }}>
                          {scheme.deadline}
                        </p>
                      </div>

                       {/* Benefits Detail Block */}
                       <div style={{ gridColumn: '1 / -1' }}>
                        <p style={{ 
                          fontSize: '12px', 
                          fontWeight: '700', 
                          color: '#9ca3af', 
                          textTransform: 'uppercase', 
                          marginBottom: '8px',
                          margin: '0 0 10px 0',
                          letterSpacing: '0.05em'
                        }}>
                          Scheme Description
                        </p>
                        <p style={{ color: '#4b5563', fontSize: '15px', lineHeight: '1.7', margin: '0' }}>
                          {scheme.description}
                        </p>
                      </div>
                    </div>
                    
                    <div style={{ 
                      padding: '20px', 
                      backgroundColor: '#f0fdf4', 
                      borderRadius: '12px', 
                      border: '1px solid #bbf7d0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#16a34a' }}></div>
                      <p style={{ fontSize: '15px', color: '#166534', fontWeight: '600', margin: '0' }}>
                        How to Apply: <span style={{ fontWeight: '400', color: '#15803d' }}>{scheme.application}</span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

    {/* Footer Info */}
        <div style={{
          marginTop: '48px',
          padding: '24px',
          backgroundColor: '#ecfdf5',
          borderRadius: '12px',
          borderLeft: '4px solid #059669'
        }}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#047857', marginBottom: '16px', margin: '0 0 16px 0' }}>
            💡 How to Apply?
          </h3>
          <ul style={{ 
            color: '#047857', 
            fontSize: '15px', 
            lineHeight: '2', 
            margin: '0',
            paddingLeft: '20px',
            listStyleType: 'none'
          }}>
            <li style={{ marginBottom: '8px' }}>✓ Visit the official government agriculture website</li>
            <li style={{ marginBottom: '8px' }}>✓ Contact your nearest agricultural extension office</li>
            <li style={{ marginBottom: '8px' }}>✓ Apply through Common Service Centers (CSCs)</li>
            <li>✓ Call the Kisan Helpline: 1800-180-1551 (toll-free)</li>
          </ul>
        </div>
        <div style={{
          marginTop: '64px',
          padding: '40px',
          backgroundColor: '#064e3b',
          borderRadius: '24px',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '20px', margin: '0 0 24px 0', color: '#fff' }}>
              Essential Documents Required
            </h3>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '20px' 
            }}>
              {['Aadhaar Card', 'Land Ownership Records', 'Bank Passbook', 'Passport Size Photo'].map((item) => (
                <div key={item} style={{ 
                  backgroundColor: 'rgba(255,255,255,0.1)', 
                  padding: '16px', 
                  borderRadius: '12px',
                  backdropFilter: 'blur(4px)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#34d399' }}></div>
                  <span style={{ fontSize: '15px', fontWeight: '500' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default FarmerSchemes;
