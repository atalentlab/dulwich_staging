import React, { useState, useEffect, useCallback } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://cms.dulwich.atalent.xyz';

export default function FeeStructureBlock({ content }) {
  const [openSections, setOpenSections] = useState({});
  const [feeData, setFeeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Calculator states
  const [numChildren, setNumChildren] = useState(1);
  const [children, setChildren] = useState([{ id: 1, ageGroup: '' }]);
  const [paymentPreference, setPaymentPreference] = useState('annually');
  const [selectedTerm, setSelectedTerm] = useState('');

  const title = content?.title || 'Understanding our Fee Structure';
  const description = content?.description || '';

  const getSchoolFromURL = () => {
    if (typeof window === 'undefined') return null;
    const hostname = window.location.hostname;
    const parts = hostname.split('.');
    if (parts.length > 1) return parts[0];
    return null;
  };

  useEffect(() => {
    const fetchFeeStructures = async () => {
      const schoolFromURL = getSchoolFromURL();
      if (!schoolFromURL) {
        setError('No school found in URL');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `${API_BASE_URL}/api/fee_structure?school=${schoolFromURL}`
        );
        if (!response.ok) throw new Error(`Failed to fetch data for school: ${schoolFromURL}`);
        const result = await response.json();
        if (result.success && result.data && Array.isArray(result.data)) {
          if (result.data.length === 0) {
            setError('No fee structure data found');
          } else {
            setFeeData(result.data);
            setOpenSections({});
          }
        } else {
          setError('Invalid data format');
        }
      } catch (err) {
        console.error('Error fetching fee structures:', err);
        setError('Failed to load fee structure data');
      } finally {
        setLoading(false);
      }
    };
    fetchFeeStructures();
  }, []);

  const toggleSection = useCallback((dataIndex) => {
    setOpenSections(prev => ({ ...prev, [dataIndex]: !prev[dataIndex] }));
  }, []);

  const formatPrice = (price) => Number(price).toLocaleString('en-US');

  const stripHtmlTags = (html) => {
    if (!html) return '';
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const handleNumChildrenChange = (delta) => {
    const newNum = Math.max(1, Math.min(10, numChildren + delta));
    setNumChildren(newNum);
    if (newNum > children.length) {
      const newChildren = [...children];
      for (let i = children.length; i < newNum; i++) {
        newChildren.push({ id: i + 1, ageGroup: '' });
      }
      setChildren(newChildren);
    } else {
      setChildren(children.slice(0, newNum));
    }
  };

  const handleAgeGroupChange = (childId, ageGroup) => {
    setChildren(children.map(child =>
      child.id === childId ? { ...child, ageGroup } : child
    ));
  };

  // Helper: get fee for a single child from a single fee category
  const getChildFeeForCategory = (feeStructure, ageGroupName) => {
    const ageGroup = feeStructure.content?.groups?.find(g => g.age_group === ageGroupName);
    if (!ageGroup) return { fee: 0, currency: 'RMB' };
    if (paymentPreference === 'annually') {
      const annualTerm = ageGroup.terms.find(t => t.term.toLowerCase().includes('annual'));
      return annualTerm ? { fee: Number(annualTerm.price), currency: annualTerm.currency || 'RMB' } : { fee: 0, currency: 'RMB' };
    } else {
      const termEntry = ageGroup.terms.find(t => t.term === selectedTerm);
      return termEntry ? { fee: Number(termEntry.price), currency: termEntry.currency || 'RMB' } : { fee: 0, currency: 'RMB' };
    }
  };

  const calculateTotalFees = () => {
    if (!feeData.length || children.some(c => !c.ageGroup)) return null;
    if (paymentPreference === 'termly' && !selectedTerm) return null;
    let total = 0;
    children.forEach(child => {
      feeData.forEach(feeStructure => {
        const { fee } = getChildFeeForCategory(feeStructure, child.ageGroup);
        total += fee;
      });
    });
    return total;
  };

  // Get breakdown per fee category for a child
  const getCategoryBreakdown = (ageGroupName) => {
    return feeData.map(feeStructure => {
      const { fee, currency } = getChildFeeForCategory(feeStructure, ageGroupName);
      return { title: feeStructure.title, fee, currency };
    }).filter(item => item.fee > 0);
  };

  const getAvailableAgeGroups = () => {
    const ageGroupMap = new Map();
    feeData.forEach(feeStructure => {
      (feeStructure.content?.groups || []).forEach(group => {
        if (!ageGroupMap.has(group.age_group)) {
          ageGroupMap.set(group.age_group, group);
        }
      });
    });
    return Array.from(ageGroupMap.values());
  };

  const getAvailableTerms = () => {
    const termSet = new Set();
    feeData.forEach(feeStructure => {
      (feeStructure.content?.groups || []).forEach(group => {
        (group.terms || []).forEach(t => {
          if (!t.term.toLowerCase().includes('annual')) termSet.add(t.term);
        });
      });
    });
    return Array.from(termSet);
  };

  if (loading) {
    return (
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9e1422]"></div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">{title}</h2>
          <div className="bg-gray-50 rounded-lg p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No School Found</h3>
              <p className="text-gray-600 max-w-md">We couldn't find any fee structure information.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const totalFees = calculateTotalFees();
  const discount = paymentPreference === 'annually' ? 0.05 : 0;

  return (
    <section className="py-16 px-6 bg-white">
      {/* Smooth accordion animation via CSS grid */}
      <style>{`
        .fee-accordion-wrap {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 0.35s ease;
        }
        .fee-accordion-wrap.is-open {
          grid-template-rows: 1fr;
        }
        .fee-accordion-wrap > div {
          overflow: hidden;
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">

          {/* ── Left Column ── */}
          <div className="lg:col-span-7">
            <h2 className="text-3xl md:text-[40px] md:leading-[1.15] font-bold text-gray-900 mb-10 text-left">
              {title}
            </h2>
            {description && (
              <p className="text-gray-600 text-sm md:text-base mb-8">{description}</p>
            )}

            <div>
              {feeData.map((feeStructure, dataIndex) => {
                const isOpen = openSections[dataIndex] || false;
                const groups = feeStructure.content?.groups || [];
                const structureTitle = feeStructure.title || '';
                const structureDescription = stripHtmlTags(feeStructure.description) || '';

                return (
                  <div key={dataIndex} className="border-t border-gray-200 last:border-b">
                    {/* ── Accordion Header ── */}
                    <button
                      onClick={() => toggleSection(dataIndex)}
                      className={`
                        w-full flex items-center justify-between
                        py-5 px-5 rounded-lg
                        group transition-colors duration-200
                        ${isOpen ? 'bg-[#f5f2ec]' : 'hover:bg-[#f5f2ec]'}
                      `}
                      aria-expanded={isOpen}
                    >
                      <h3 className="text-base md:text-lg font-semibold text-gray-900 text-left pr-4">
                        {structureTitle}
                      </h3>

                      {/* Arrow — circle only appears on hover / open */}
                      <span
                        className={`
                          w-10 h-10 rounded-full flex-shrink-0
                          flex items-center justify-center
                          transition-all duration-300
                          ${isOpen
                            ? 'bg-[#9e1422]'
                            : 'bg-transparent group-hover:bg-[#9e1422]'
                          }
                        `}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                        >
                          <path
                            d="M6 9l6 6 6-6"
                            className={`transition-colors duration-300 ${
                              isOpen
                                ? 'stroke-white'
                                : 'stroke-gray-400 group-hover:stroke-white'
                            }`}
                          />
                        </svg>
                      </span>
                    </button>

                    {/* ── Accordion Body (smooth grid-row animation) ── */}
                    <div className={`fee-accordion-wrap ${isOpen ? 'is-open' : ''}`}>
                      <div>
                        <div className="px-5 pb-6 pt-1">
                          {structureDescription && (
                            <p className="text-sm text-gray-600 mb-5 leading-relaxed text-left">
                              {structureDescription}
                            </p>
                          )}

                          <div className="space-y-6">
                            {groups.map((group, gi) => (
                              <div key={gi}>
                                <h4 className="text-sm md:text-base font-bold text-[#9e1422] mb-3 text-left">
                                  {group.age_group}
                                </h4>
                                {(group.terms || []).map((term, ti) => (
                                  <div key={ti} className="flex items-center justify-between py-2.5 text-sm">
                                    <span className="text-gray-700">{term.term}</span>
                                    <div className="flex items-center gap-6 md:gap-10">
                                      <span className="text-gray-500 text-xs md:text-sm">{term.currency}</span>
                                      <span className="text-gray-900 font-semibold min-w-[80px] md:min-w-[100px] text-right tabular-nums">
                                        {formatPrice(term.price)}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Right Column — Calculator ── */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-8">
              <div className="bg-[#f5f1e8] rounded-xl p-6 md:p-8">
                <h3 className="text-2xl md:text-[32px] md:leading-tight font-bold text-gray-900 mb-3 text-left">
                  Calculate your fees
                </h3>
                <p className="text-sm text-gray-600 mb-8 leading-relaxed text-left">
                  Select your children's age groups to see personalised tuition costs and payment options.
                </p>

                {/* Number of Children */}
                <div className="mb-6 text-left">
                  <label className="block text-sm font-bold text-gray-900 mb-3">Number of children</label>
                  <div className="inline-flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                    <button
                      onClick={() => handleNumChildrenChange(-1)}
                      className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors border-r border-gray-300 text-xl"
                      aria-label="Decrease children"
                    >−</button>
                    <div className="w-14 h-12 flex items-center justify-center text-base font-medium text-gray-900 select-none">
                      {numChildren}
                    </div>
                    <button
                      onClick={() => handleNumChildrenChange(1)}
                      className="w-12 h-12 flex items-center justify-center text-[#9e1422] hover:text-[#7f1019] hover:bg-gray-50 transition-colors border-l border-gray-300 text-xl"
                      aria-label="Increase children"
                    >+</button>
                  </div>
                </div>

                {/* Children Age Groups */}
                <div className="space-y-4 mb-6">
                  {children.map((child) => (
                    <div key={child.id}>
                      <label className="block text-sm font-bold text-gray-900 mb-2">Child {child.id}</label>
                      <div className="relative">
                        <select
                          value={child.ageGroup}
                          onChange={(e) => handleAgeGroupChange(child.id, e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#9e1422]/20 focus:border-[#9e1422] transition-colors"
                        >
                          <option value="">Select Age</option>
                          {getAvailableAgeGroups().map((group, idx) => (
                            <option key={idx} value={group.age_group}>{group.age_group}</option>
                          ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                          <svg className="w-5 h-5 text-[#9e1422]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Payment Preference */}
                <div className="bg-white rounded-lg border border-gray-200 p-5 mb-6">
                  <label className="block text-sm font-bold text-gray-900 mb-4">Payment preference</label>
                  <div className="flex items-center gap-5 flex-wrap">
                    <label className="flex items-center cursor-pointer group">
                      <div className="relative w-5 h-5">
                        <input type="radio" name="payment" value="termly"
                          checked={paymentPreference === 'termly'}
                          onChange={(e) => { setPaymentPreference(e.target.value); setSelectedTerm(''); }}
                          className="sr-only" />
                        <div className={`w-5 h-5 rounded-full border-2 transition-colors ${
                          paymentPreference === 'termly' ? 'border-[#9e1422]' : 'border-gray-300 group-hover:border-gray-400'
                        }`}>
                          {paymentPreference === 'termly' && (
                            <div className="absolute inset-[3px] rounded-full bg-[#9e1422]" />
                          )}
                        </div>
                      </div>
                      <span className="ml-2.5 text-sm text-gray-900">Pay Termly</span>
                    </label>
                    <label className="flex items-center cursor-pointer group">
                      <div className="relative w-5 h-5">
                        <input type="radio" name="payment" value="annually"
                          checked={paymentPreference === 'annually'}
                          onChange={(e) => setPaymentPreference(e.target.value)}
                          className="sr-only" />
                        <div className={`w-5 h-5 rounded-full border-2 transition-colors ${
                          paymentPreference === 'annually' ? 'border-[#9e1422]' : 'border-gray-300 group-hover:border-gray-400'
                        }`}>
                          {paymentPreference === 'annually' && (
                            <div className="absolute inset-[3px] rounded-full bg-[#9e1422]" />
                          )}
                        </div>
                      </div>
                      <span className="ml-2.5 text-sm text-gray-900">Pay Annually</span>
                    </label>
                    {paymentPreference === 'annually' && (
                      <span className="px-2.5 py-1 bg-[#c2d96e] text-gray-900 text-xs font-medium rounded-full">
                        Save ~5%
                      </span>
                    )}
                  </div>
                </div>

                {/* Term Selector (visible only when Pay Termly) */}
                {paymentPreference === 'termly' && (
                  <div className="mb-6">
                    <label className="block text-sm font-bold text-gray-900 mb-2">Select Term</label>
                    <div className="relative">
                      <select
                        value={selectedTerm}
                        onChange={(e) => setSelectedTerm(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#9e1422]/20 focus:border-[#9e1422] transition-colors"
                      >
                        <option value="">Select Term</option>
                        {getAvailableTerms().map((term, idx) => (
                          <option key={idx} value={term}>{term}</option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-5 h-5 text-[#9e1422]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}

                {/* Result Display */}
                {totalFees === null ? (
                  <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                    <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center">
                      <svg className="w-14 h-14 text-[#9e1422]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                      </svg>
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2 text-base">Select age groups to begin</h4>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      We'll calculate fees based on your children's ages<br />and payment preference
                    </p>
                  </div>
                ) : (
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="space-y-4 mb-4">
                      {children.map((child) => {
                        if (!child.ageGroup) return null;
                        const breakdown = getCategoryBreakdown(child.ageGroup);
                        const childTotal = breakdown.reduce((sum, item) => sum + item.fee, 0);
                        const currency = breakdown.length > 0 ? breakdown[0].currency : 'RMB';
                        return (
                          <div key={child.id}>
                            <p className="text-sm font-semibold text-gray-900 mb-1.5">
                              Child {child.id} — {child.ageGroup}
                            </p>
                            <div className="space-y-1 pl-3">
                              {breakdown.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center text-sm">
                                  <span className="text-gray-500">{item.title}</span>
                                  <span className="text-gray-700">{item.currency} {formatPrice(item.fee)}</span>
                                </div>
                              ))}
                            </div>
                            <div className="flex justify-between items-center text-sm mt-1.5 pt-1.5 border-t border-gray-100 pl-3">
                              <span className="text-gray-600 font-medium">Subtotal</span>
                              <span className="font-semibold text-gray-900">{currency} {formatPrice(childTotal)}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="border-t border-gray-200 pt-4 mb-5">
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                            {paymentPreference === 'annually' ? 'Total Annual Fees' : `Total ${selectedTerm} Fees`}
                          </p>
                          <p className="text-2xl md:text-3xl font-bold text-gray-900">RMB {formatPrice(totalFees)}</p>
                        </div>
                        {discount > 0 && (
                          <span className="text-sm text-green-700 font-medium bg-green-50 px-2 py-1 rounded">Save ~5%</span>
                        )}
                      </div>
                      {discount > 0 && (
                        <p className="text-xs text-gray-500 mt-2">
                          You save approximately RMB {formatPrice(Math.round(totalFees * discount))} with annual payment
                        </p>
                      )}
                    </div>
                    <button className="w-full bg-[#9e1422] text-white py-3.5 rounded-lg font-semibold hover:bg-[#7f1019] transition-colors text-sm">
                      Apply Now
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
