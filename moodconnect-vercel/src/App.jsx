import React, { useState, useEffect } from 'react';
import { Heart, Users, Calendar, TrendingUp, Plus, X } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [moods, setMoods] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [todayMood, setTodayMood] = useState(null);
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    relationship: 'friend',
    reconnectDays: 14
  });

  // Load data from localStorage
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      const savedMoods = localStorage.getItem('moodconnect_moods');
      const savedContacts = localStorage.getItem('moodconnect_contacts');
      
      if (savedMoods) {
        setMoods(JSON.parse(savedMoods));
      }
      if (savedContacts) {
        setContacts(JSON.parse(savedContacts));
      }
    } catch (error) {
      console.log('No existing data found, starting fresh');
    }
  };

  const saveData = (moodsData, contactsData) => {
    try {
      localStorage.setItem('moodconnect_moods', JSON.stringify(moodsData));
      localStorage.setItem('moodconnect_contacts', JSON.stringify(contactsData));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const moodOptions = [
    { emoji: '😊', label: 'Great', value: 5, color: '#10b981', suggestion: 'Share your positive energy!' },
    { emoji: '🙂', label: 'Good', value: 4, color: '#8b5cf6', suggestion: 'Connect with close friends' },
    { emoji: '😐', label: 'Okay', value: 3, color: '#f59e0b', suggestion: 'Reach out to someone supportive' },
    { emoji: '😔', label: 'Down', value: 2, color: '#ef4444', suggestion: 'Talk to your closest confidants' },
    { emoji: '😢', label: 'Struggling', value: 1, color: '#dc2626', suggestion: 'Connect with your support system' }
  ];

  const relationshipTypes = [
    { value: 'family', label: 'Family', days: 7 },
    { value: 'close-friend', label: 'Close Friend', days: 7 },
    { value: 'friend', label: 'Friend', days: 14 },
    { value: 'acquaintance', label: 'Acquaintance', days: 30 },
    { value: 'colleague', label: 'Colleague', days: 21 }
  ];

  const getToday = () => {
    return new Date().toISOString().split('T')[0];
  };

  const logMood = (moodValue) => {
    const today = getToday();
    const moodEntry = {
      date: today,
      value: moodValue,
      timestamp: new Date().toISOString()
    };
    
    const updatedMoods = moods.filter(m => m.date !== today);
    updatedMoods.push(moodEntry);
    
    setMoods(updatedMoods);
    setTodayMood(moodValue);
    saveData(updatedMoods, contacts);
  };

  const addContact = () => {
    if (!newContact.name.trim()) return;
    
    const contact = {
      id: Date.now(),
      ...newContact,
      lastContact: null,
      notes: ''
    };
    
    const updatedContacts = [...contacts, contact];
    setContacts(updatedContacts);
    saveData(moods, updatedContacts);
    
    setNewContact({ name: '', relationship: 'friend', reconnectDays: 14 });
    setShowAddContact(false);
  };

  const updateLastContact = (contactId) => {
    const updatedContacts = contacts.map(c => 
      c.id === contactId ? { ...c, lastContact: new Date().toISOString() } : c
    );
    setContacts(updatedContacts);
    saveData(moods, updatedContacts);
  };

  const deleteContact = (contactId) => {
    const updatedContacts = contacts.filter(c => c.id !== contactId);
    setContacts(updatedContacts);
    saveData(moods, updatedContacts);
  };

  const getDaysSinceContact = (lastContact) => {
    if (!lastContact) return Infinity;
    const lastDate = new Date(lastContact);
    const today = new Date();
    const diffTime = Math.abs(today - lastDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getSuggestedContacts = () => {
    const todayMoodData = moods.find(m => m.date === getToday());
    if (!todayMoodData) return [];

    let suggestions = [];
    if (todayMoodData.value <= 2) {
      suggestions = contacts
        .filter(c => c.relationship === 'family' || c.relationship === 'close-friend')
        .slice(0, 3);
    } else if (todayMoodData.value >= 4) {
      suggestions = contacts.slice(0, 3);
    } else {
      suggestions = contacts.slice(0, 3);
    }

    return suggestions;
  };

  const getReconnectSuggestions = () => {
    return contacts
      .map(c => ({
        ...c,
        daysSince: getDaysSinceContact(c.lastContact)
      }))
      .filter(c => c.daysSince >= c.reconnectDays)
      .sort((a, b) => b.daysSince - a.daysSince)
      .slice(0, 5);
  };

  const getMoodStats = () => {
    const last7Days = moods.slice(-7);
    const avgMood = last7Days.length > 0
      ? (last7Days.reduce((sum, m) => sum + m.value, 0) / last7Days.length).toFixed(1)
      : 0;
    
    return {
      total: moods.length,
      average: avgMood,
      streak: moods.length > 0 ? 1 : 0
    };
  };

  useEffect(() => {
    const today = getToday();
    const todayEntry = moods.find(m => m.date === today);
    setTodayMood(todayEntry ? todayEntry.value : null);
  }, [moods]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: '"DM Sans", -apple-system, sans-serif',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px',
          color: 'white'
        }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: '700',
            margin: '0 0 10px 0',
            textShadow: '0 2px 10px rgba(0,0,0,0.2)'
          }}>
            MoodConnect
          </h1>
          <p style={{
            fontSize: '18px',
            opacity: 0.9,
            margin: 0
          }}>
            Check your mood, stay connected
          </p>
        </div>

        {/* Navigation */}
        <div style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '30px',
          background: 'rgba(255,255,255,0.2)',
          padding: '8px',
          borderRadius: '16px',
          backdropFilter: 'blur(10px)'
        }}>
          {[
            { id: 'home', label: 'Today', icon: Heart },
            { id: 'contacts', label: 'Contacts', icon: Users },
            { id: 'history', label: 'History', icon: Calendar },
            { id: 'insights', label: 'Insights', icon: TrendingUp }
          ].map(nav => {
            const Icon = nav.icon;
            return (
              <button
                key={nav.id}
                onClick={() => setCurrentView(nav.id)}
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  background: currentView === nav.id ? 'white' : 'transparent',
                  color: currentView === nav.id ? '#667eea' : 'white',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={18} />
                {nav.label}
              </button>
            );
          })}
        </div>

        {/* Main Content */}
        <div style={{
          background: 'white',
          borderRadius: '24px',
          padding: '30px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          minHeight: '500px'
        }}>
          {/* Home View */}
          {currentView === 'home' && (
            <div>
              <h2 style={{
                fontSize: '28px',
                fontWeight: '700',
                marginBottom: '20px',
                color: '#1f2937'
              }}>
                How are you feeling today?
              </h2>
              
              {todayMood === null ? (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: '15px',
                  marginBottom: '40px'
                }}>
                  {moodOptions.map(mood => (
                    <button
                      key={mood.value}
                      onClick={() => logMood(mood.value)}
                      style={{
                        padding: '25px',
                        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                        border: '2px solid #e9ecef',
                        borderRadius: '16px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        textAlign: 'center'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)';
                        e.currentTarget.style.borderColor = mood.color;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.borderColor = '#e9ecef';
                      }}
                    >
                      <div style={{ fontSize: '48px', marginBottom: '10px' }}>{mood.emoji}</div>
                      <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                        {mood.label}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  padding: '30px',
                  borderRadius: '16px',
                  color: 'white',
                  marginBottom: '40px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '64px', marginBottom: '15px' }}>
                    {moodOptions.find(m => m.value === todayMood)?.emoji}
                  </div>
                  <h3 style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 10px 0' }}>
                    Mood logged!
                  </h3>
                  <p style={{ margin: 0, opacity: 0.9 }}>
                    {moodOptions.find(m => m.value === todayMood)?.suggestion}
                  </p>
                </div>
              )}

              {/* Suggested Contacts */}
              {todayMood !== null && contacts.length > 0 && (
                <div style={{ marginBottom: '30px' }}>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    marginBottom: '15px',
                    color: '#1f2937'
                  }}>
                    Suggested Connections
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {getSuggestedContacts().map(contact => (
                      <div
                        key={contact.id}
                        style={{
                          padding: '15px 20px',
                          background: '#f8f9fa',
                          borderRadius: '12px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: '600', fontSize: '16px', color: '#1f2937' }}>
                            {contact.name}
                          </div>
                          <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
                            {relationshipTypes.find(r => r.value === contact.relationship)?.label}
                          </div>
                        </div>
                        <button
                          onClick={() => updateLastContact(contact.id)}
                          style={{
                            padding: '8px 16px',
                            background: '#667eea',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '14px'
                          }}
                        >
                          Contacted
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reconnect Suggestions */}
              {getReconnectSuggestions().length > 0 && (
                <div>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    marginBottom: '15px',
                    color: '#1f2937'
                  }}>
                    People to Reconnect With
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {getReconnectSuggestions().map(contact => (
                      <div
                        key={contact.id}
                        style={{
                          padding: '15px 20px',
                          background: '#fef3c7',
                          borderRadius: '12px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: '600', fontSize: '16px', color: '#1f2937' }}>
                            {contact.name}
                          </div>
                          <div style={{ fontSize: '14px', color: '#92400e', marginTop: '4px' }}>
                            {contact.daysSince === Infinity 
                              ? 'Never contacted' 
                              : `${contact.daysSince} days since last contact`}
                          </div>
                        </div>
                        <button
                          onClick={() => updateLastContact(contact.id)}
                          style={{
                            padding: '8px 16px',
                            background: '#f59e0b',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '14px'
                          }}
                        >
                          Reconnected
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {contacts.length === 0 && (
                <div style={{
                  textAlign: 'center',
                  padding: '40px',
                  color: '#6b7280'
                }}>
                  <Users size={48} style={{ margin: '0 auto 15px', opacity: 0.5 }} />
                  <p>Add contacts to get personalized suggestions!</p>
                  <button
                    onClick={() => setCurrentView('contacts')}
                    style={{
                      marginTop: '15px',
                      padding: '10px 20px',
                      background: '#667eea',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    Add Your First Contact
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Contacts View */}
          {currentView === 'contacts' && (
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px'
              }}>
                <h2 style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  margin: 0,
                  color: '#1f2937'
                }}>
                  Your Contacts
                </h2>
                <button
                  onClick={() => setShowAddContact(true)}
                  style={{
                    padding: '10px 20px',
                    background: '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Plus size={18} />
                  Add Contact
                </button>
              </div>

              {showAddContact && (
                <div style={{
                  background: '#f8f9fa',
                  padding: '20px',
                  borderRadius: '12px',
                  marginBottom: '20px'
                }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '15px' }}>
                    New Contact
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <input
                      type="text"
                      placeholder="Name"
                      value={newContact.name}
                      onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                      style={{
                        padding: '12px',
                        border: '2px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '15px'
                      }}
                    />
                    <select
                      value={newContact.relationship}
                      onChange={(e) => {
                        const rel = relationshipTypes.find(r => r.value === e.target.value);
                        setNewContact({ 
                          ...newContact, 
                          relationship: e.target.value,
                          reconnectDays: rel?.days || 14
                        });
                      }}
                      style={{
                        padding: '12px',
                        border: '2px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '15px'
                      }}
                    >
                      {relationshipTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        onClick={addContact}
                        style={{
                          flex: 1,
                          padding: '12px',
                          background: '#667eea',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontWeight: '600'
                        }}
                      >
                        Add
                      </button>
                      <button
                        onClick={() => {
                          setShowAddContact(false);
                          setNewContact({ name: '', relationship: 'friend', reconnectDays: 14 });
                        }}
                        style={{
                          flex: 1,
                          padding: '12px',
                          background: '#e5e7eb',
                          color: '#1f2937',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontWeight: '600'
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {contacts.map(contact => {
                  const daysSince = getDaysSinceContact(contact.lastContact);
                  const needsReconnect = daysSince >= contact.reconnectDays;
                  
                  return (
                    <div
                      key={contact.id}
                      style={{
                        padding: '20px',
                        background: needsReconnect ? '#fef3c7' : '#f8f9fa',
                        borderRadius: '12px',
                        border: needsReconnect ? '2px solid #fbbf24' : '2px solid transparent'
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '10px'
                      }}>
                        <div>
                          <div style={{ fontSize: '18px', fontWeight: '700', color: '#1f2937' }}>
                            {contact.name}
                          </div>
                          <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
                            {relationshipTypes.find(r => r.value === contact.relationship)?.label}
                          </div>
                        </div>
                        <button
                          onClick={() => deleteContact(contact.id)}
                          style={{
                            padding: '6px',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#ef4444'
                          }}
                        >
                          <X size={20} />
                        </button>
                      </div>
                      <div style={{
                        fontSize: '14px',
                        color: needsReconnect ? '#92400e' : '#6b7280',
                        marginBottom: '12px'
                      }}>
                        {daysSince === Infinity 
                          ? 'Never contacted' 
                          : contact.lastContact 
                            ? `Last contact: ${daysSince} days ago`
                            : 'No contact logged'}
                      </div>
                      <button
                        onClick={() => updateLastContact(contact.id)}
                        style={{
                          padding: '8px 16px',
                          background: '#667eea',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontWeight: '600',
                          fontSize: '14px'
                        }}
                      >
                        Mark as Contacted
                      </button>
                    </div>
                  );
                })}
              </div>

              {contacts.length === 0 && (
                <div style={{
                  textAlign: 'center',
                  padding: '60px 20px',
                  color: '#6b7280'
                }}>
                  <Users size={64} style={{ margin: '0 auto 20px', opacity: 0.3 }} />
                  <p style={{ fontSize: '18px', marginBottom: '10px' }}>No contacts yet</p>
                  <p style={{ fontSize: '14px' }}>Add people you want to stay connected with</p>
                </div>
              )}
            </div>
          )}

          {/* History View */}
          {currentView === 'history' && (
            <div>
              <h2 style={{
                fontSize: '28px',
                fontWeight: '700',
                marginBottom: '20px',
                color: '#1f2937'
              }}>
                Mood History
              </h2>
              
              {moods.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '60px 20px',
                  color: '#6b7280'
                }}>
                  <Calendar size={64} style={{ margin: '0 auto 20px', opacity: 0.3 }} />
                  <p style={{ fontSize: '18px', marginBottom: '10px' }}>No mood entries yet</p>
                  <p style={{ fontSize: '14px' }}>Start logging your daily moods</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[...moods].reverse().map((mood, index) => {
                    const moodData = moodOptions.find(m => m.value === mood.value);
                    return (
                      <div
                        key={index}
                        style={{
                          padding: '15px 20px',
                          background: '#f8f9fa',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '15px'
                        }}
                      >
                        <div style={{ fontSize: '32px' }}>{moodData?.emoji}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: '600', fontSize: '16px', color: '#1f2937' }}>
                            {moodData?.label}
                          </div>
                          <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
                            {new Date(mood.date).toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </div>
                        </div>
                        <div
                          style={{
                            width: '8px',
                            height: '40px',
                            background: moodData?.color,
                            borderRadius: '4px'
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Insights View */}
          {currentView === 'insights' && (
            <div>
              <h2 style={{
                fontSize: '28px',
                fontWeight: '700',
                marginBottom: '20px',
                color: '#1f2937'
              }}>
                Your Insights
              </h2>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '20px',
                marginBottom: '30px'
              }}>
                <div style={{
                  padding: '25px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '16px',
                  color: 'white'
                }}>
                  <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>
                    Total Check-ins
                  </div>
                  <div style={{ fontSize: '36px', fontWeight: '700' }}>
                    {getMoodStats().total}
                  </div>
                </div>
                
                <div style={{
                  padding: '25px',
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  borderRadius: '16px',
                  color: 'white'
                }}>
                  <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>
                    7-Day Average
                  </div>
                  <div style={{ fontSize: '36px', fontWeight: '700' }}>
                    {getMoodStats().average}
                  </div>
                </div>
                
                <div style={{
                  padding: '25px',
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  borderRadius: '16px',
                  color: 'white'
                }}>
                  <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>
                    Total Contacts
                  </div>
                  <div style={{ fontSize: '36px', fontWeight: '700' }}>
                    {contacts.length}
                  </div>
                </div>
              </div>

              <div style={{
                background: '#f8f9fa',
                padding: '25px',
                borderRadius: '16px'
              }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  marginBottom: '15px',
                  color: '#1f2937'
                }}>
                  Quick Stats
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '12px 0',
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    <span style={{ color: '#6b7280' }}>People needing reconnection</span>
                    <span style={{ fontWeight: '700', color: '#1f2937' }}>
                      {getReconnectSuggestions().length}
                    </span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '12px 0',
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    <span style={{ color: '#6b7280' }}>Close relationships</span>
                    <span style={{ fontWeight: '700', color: '#1f2937' }}>
                      {contacts.filter(c => c.relationship === 'family' || c.relationship === 'close-friend').length}
                    </span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '12px 0'
                  }}>
                    <span style={{ color: '#6b7280' }}>Days tracked</span>
                    <span style={{ fontWeight: '700', color: '#1f2937' }}>
                      {moods.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
