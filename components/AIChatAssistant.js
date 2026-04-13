import React, { useState, useEffect } from 'react';
import { X, Send, ThumbsUp, ThumbsDown } from 'lucide-react';
import Icon from './Icon';

// Sparkle Icon Component
const SparkleIcon = () => (
    <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 28 24" fill="#D30013" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2l1.5 5.5L19 9l-5.5 1.5L12 16l-1.5-5.5L5 9l5.5-1.5L12 2z"/>
      <path d="M19 14l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3z"/>
    </svg>
);

// Header Sparkle Icon Component
const HeaderSparkleIcon = () => (
    <svg className="w-[36px] h-[36px]" viewBox="0 0 28 24" fill="white" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2l1.5 5.5L19 9l-5.5 1.5L12 16l-1.5-5.5L5 9l5.5-1.5L12 2z"/>
      <path d="M19 14l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3z"/>
    </svg>
);

// Send Icon Component (Paper Plane)
const SendIcon = () => (
    <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
    </svg>
);

function AIChatAssistant({
                           chatOpen,
                           setChatOpen,
                           chatMessages,
                           setChatMessages,
                           chatMessage,
                           setChatMessage,
                           handleSendMessage,
                           chatMessagesEndRef,
                           selectedSchoolSlug
                         }) {
  const [isLoading, setIsLoading] = useState(false);
  const [availableQuestions, setAvailableQuestions] = useState([
    'Admissions',
    'Fees',
    'Curriculum',
    'Lunch',
    'School Bus'
  ]);
  const [showAllQuestions, setShowAllQuestions] = useState(false);
  const [messageFeedback, setMessageFeedback] = useState({}); // Track likes/dislikes by message ID

  // Disable body scroll when chat is open
  useEffect(() => {
    if (chatOpen) {
      // Disable body scroll
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${window.scrollY}px`;
    } else {
      // Re-enable body scroll
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }

    return () => {
      // Cleanup on unmount
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    };
  }, [chatOpen]);

  // Get browser locale
  const getLocale = () => {
    const browserLang = navigator.language || navigator.userLanguage;
    return browserLang.split('-')[0]; // Get 'en' from 'en-US', 'zh' from 'zh-CN', etc.
  };

  // Function to call the Dulwich AI Chat API
  const callDulwichAPI = async (question, school = null, locale = null) => {
    try {
      setIsLoading(true);

      // Use proxy in development, direct URL in production
      const API_ENDPOINT = process.env.NODE_ENV === 'development'
          ? '/api/vector/ask'
          : 'https://dulwich-ai-chat.atalent.xyz/api/vector/ask';

      // Build request body
      const requestBody = {
        question
      };

      // Add optional parameters if provided
      if (school) {
        requestBody.school = school;
      }
      if (locale) {
        requestBody.locale = locale;
      }

      console.log('API Request:', API_ENDPOINT, requestBody);

      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const data = await response.json();
      console.log('API Response:', data);

      const aiAnswer = data.ai_answer || null;
      const answer = data.answer ||
          data.assistant?.choices?.[0]?.message?.content ||
          'I apologize, but I cannot provide specific details regarding the operating hours of the school bus service from the information available to me. Bus Services are mentioned as an additional cost, but the exact schedule or operational times are not specified in the provided documents.\n' +
          'For detailed information about when the school bus operates, I recommend reaching out to the Head of Admissions.';

      const selectedChunks = data.selected_chunks || data.qdrant_raw?.selected_chunks || [];

      // Extract related questions from top_matches
      if (data.top_matches && Array.isArray(data.top_matches)) {
        const relatedQuestions = data.top_matches
            .map(item => item.question)
            .filter(Boolean);
        if (relatedQuestions.length > 0) {
          setAvailableQuestions(relatedQuestions);
        }
      } else if (data.qdrant_search && Array.isArray(data.qdrant_search)) {
        // Fallback to qdrant_search if top_matches is not available
        const relatedQuestions = data.qdrant_search
            .map(item => item.payload?.title)
            .filter(Boolean);
        if (relatedQuestions.length > 0) {
          setAvailableQuestions(relatedQuestions);
        }
      }

      return { aiAnswer, answer, selectedChunks };
    } catch (error) {
      console.error('Error calling Dulwich AI API:', error);
      return {
        aiAnswer: null,
        answer: 'I apologize, but I cannot provide specific details regarding the operating hours of the school bus service from the information available to me. Bus Services are mentioned as an additional cost, but the exact schedule or operational times are not specified in the provided documents.\n' +
            'For detailed information about when the school bus operates, I recommend reaching out to the Head of Admissions.',
        selectedChunks: []
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sending message with API integration
  const handleSendWithAPI = async () => {
    if (!chatMessage.trim() || isLoading) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: chatMessage
    };

    setChatMessages(prev => [...prev, userMessage]);
    const currentQuestion = chatMessage;
    setChatMessage('');

    // Get locale
    const locale = getLocale();

    // Call API and get response with school and locale
    const { aiAnswer, answer, selectedChunks } = await callDulwichAPI(
        currentQuestion,
        selectedSchoolSlug,
        locale
    );

    // Add bot message with both ai_answer and answer
    const botMessage = {
      id: Date.now() + 1,
      type: 'bot',
      aiAnswer: aiAnswer,
      text: answer,
      selectedChunks: selectedChunks
    };
    setChatMessages(prev => [...prev, botMessage]);
  };

  // Handle quick action buttons
  const handleQuickAction = async (text) => {
    const msg = {
      id: Date.now(),
      type: 'user',
      text: text
    };
    setChatMessages(prev => [...prev, msg]);

    // Get locale
    const locale = getLocale();

    // Call API and get response with school and locale
    const { aiAnswer, answer, selectedChunks } = await callDulwichAPI(
        text,
        selectedSchoolSlug,
        locale
    );

    // Add bot message with both ai_answer and answer
    const botMessage = {
      id: Date.now() + 1,
      type: 'bot',
      aiAnswer: aiAnswer,
      text: answer,
      selectedChunks: selectedChunks
    };
    setChatMessages(prev => [...prev, botMessage]);
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Parse HTML from selected_chunks
  const parseChunkHTML = (chunk) => {
    try {
      if (chunk.html) {
        const parsed = JSON.parse(chunk.html);
        return parsed.copy || '';
      }
      return '';
    } catch (e) {
      return chunk.html || '';
    }
  };

  // Handle feedback (like/dislike)
  const handleFeedback = (messageId, type) => {
    setMessageFeedback(prev => {
      const currentFeedback = prev[messageId];
      // If clicking the same type, remove it (toggle off)
      if (currentFeedback === type) {
        const newFeedback = { ...prev };
        delete newFeedback[messageId];
        return newFeedback;
      }
      // Otherwise set the new feedback type
      return {
        ...prev,
        [messageId]: type
      };
    });
  };

  return (
      <>
        {/* AI Chat Container - Full Page Modal */}
        {chatOpen && (
            <div className="fixed top-[65px] lg:top-[72px] left-0 right-0 bottom-0 z-[60] bg-[#f5f5f5] flex flex-col">
              {/* Chat Header */}
           

              {/* Chat Body */}
              <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-4 lg:py-8 bg-[#f5f5f5] min-h-0">
              <div className="px-4 lg:px-6 py-4 lg:py-6">
                <button
                    onClick={() => setChatOpen(false)}
                    className="absolute top-4 lg:top-6 right-4 lg:right-6 w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all"
                    aria-label="Close chat"
                >
                  <X className="w-5 h-5 lg:w-6 lg:h-6 text-[#333]" />
                </button>
                <div className="text-center max-w-3xl mx-auto pr-8 lg:pr-0">
                  <div className="flex items-center justify-center gap-2 lg:gap-3 mb-1 lg:mb-2">
                    <div className="w-[36px] h-[36px] lg:w-[48px] lg:h-[48px] rounded-xl flex items-center justify-center shadow-md" style={{ background: 'linear-gradient(135deg, #9E1422 0%, #D30013 100%)' }}>
                      <Icon icon="Icon-AI" size={30} color="white" />
                    </div>
                    <h3 className="text-[18px] lg:text-[24px] font-semibold text-[#333] m-0">Dulwich AI Assistant</h3>
                  </div>
                  <p className="text-[10px] lg:text-[12px] text-[#666] m-0">
                    Prefer to talk with a human? Find your local <a href="#admissions" className="text-[#D30013] underline font-medium hover:text-[#9E1422]">Admissions Team</a>
                  </p>
                </div>
              </div>
                <div className="max-w-4xl mx-auto flex flex-col gap-1 lg:gap-2">
                  {chatMessages.map((message, index) => (
                      <div
                          key={message.id}
                          className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        {message.type === 'bot' ? (
                            // Bot Message
                            <div className="flex flex-col gap-1 lg:gap-2 max-w-[90%] lg:max-w-[85%]">
                              {/* Bot Icon and Label */}
                              <div className="flex items-center gap-2 mb-0.5 lg:mb-1">
                                <div className="w-6 h-6 lg:w-6 lg:h-6 rounded flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #9E1422 0%, #D30013 100%)' }}>
                                  <Icon icon="Icon-AI" size={16} color="white" />
                                </div>
                                <span className="text-[18px] lg:text-[13px] font-medium text-[#333]">Dulwich AI Assistant</span>
                              </div>

                              {/* Message Content */}
                              <div className="bg-white rounded-xl px-4 py-3 lg:px-5 lg:py-4 shadow-sm">
                                {/* AI Answer - shown first if it exists */}
                                {message.aiAnswer && (
                                    <div
                                        className="text-left text-[13px] lg:text-[14px] leading-[1.6] lg:leading-[1.7] text-[#666] mb-3 pb-3 border-b border-[#e5e5e5]"
                                        dangerouslySetInnerHTML={{ __html: message.aiAnswer }}
                                    />
                                )}

                                {/* Main Answer */}
                                <div
                                    className="text-left text-[13px] lg:text-[14px] leading-[1.6] lg:leading-[1.7] text-[#333] prose prose-sm max-w-none"
                                    dangerouslySetInnerHTML={{ __html: message.text }}
                                />

                                {/* Message Footer - Snapchat Style */}
                                <div className="mt-3 lg:mt-4 pt-3 border-t border-[#f0f0f0] flex items-center justify-between">
                                  {/* Left: Feedback Icons */}
                                  <div className="flex items-center gap-2 lg:gap-3">
                                    <button
                                        onClick={() => handleFeedback(message.id, 'like')}
                                        className="group flex items-center justify-center transition-all duration-200 transform hover:scale-110 active:scale-95"
                                        aria-label="Like message"
                                    >
                                      <ThumbsUp
                                          className={`w-4 h-4 lg:w-[18px] lg:h-[18px] transition-all duration-300 ${
                                              messageFeedback[message.id] === 'like'
                                                    ? 'text-[#dcdbdb] fill-[#D30013] scale-110'
                                                  : 'text-[#999] hover:text-[#D30013]'
                                          }`}
                                          strokeWidth={2}
                                      />
                                    </button>
                                    <button
                                        onClick={() => handleFeedback(message.id, 'dislike')}
                                        className="group flex items-center justify-center transition-all duration-200 transform hover:scale-110 active:scale-95"
                                        aria-label="Dislike message"
                                    >
                                      <ThumbsDown
                                          className={`w-4 h-4 lg:w-[18px] lg:h-[18px] transition-all duration-300 ${
                                              messageFeedback[message.id] === 'dislike'
                                                  ? 'text-[#dcdbdb] fill-[#D30013] scale-110'
                                                  : 'text-[#999] hover:text-[#D30013]'
                                          }`}
                                          strokeWidth={2}
                                      />
                                    </button>
                                  </div>

                                  {/* Right: Time and Checkmark */}
                                  <div className="flex items-center gap-1.5 text-[10px] lg:text-[11px] text-[#999]">
                                    <span>{formatTime(message.id)}</span>
                                    <svg
                                        className="w-3 h-3 lg:w-3.5 lg:h-3.5 transition-all duration-200"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                    >
                                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                                    </svg>
                                  </div>
                                </div>
                              </div>
                            </div>
                        ) : (
                            // User Message
                            <div className="flex flex-col items-end max-w-[75%] lg:max-w-[70%]">
                              <div className="bg-[#3d3d3d] text-white rounded-xl px-4 pt-2.5 pb-1.5 lg:px-5 lg:pt-3 lg:pb-2 shadow-sm">
                                <p className="text-[13px] lg:text-[14px] leading-[1.5] lg:leading-[1.6] m-0 mb-1">{message.text}</p>
                                {/* Time and Checkmark inside bubble */}
                                <div className="flex items-center justify-end gap-1 text-[10px] lg:text-[11px] text-gray-400">
                                  <span>{formatTime(message.id)}</span>
                                  <svg
                                      className="w-3 h-3 lg:w-3.5 lg:h-3.5"
                                      viewBox="0 0 24 24"
                                      fill="currentColor"
                                  >
                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                                  </svg>
                                </div>
                              </div>
                            </div>
                        )}
                      </div>
                  ))}

                  {isLoading && (
                      <div className="flex justify-start">
                        <div className="flex flex-col gap-1 lg:gap-2">
                          <div className="flex items-center gap-2 mb-0.5 lg:mb-1">
                            <div className="w-6 h-6 lg:w-6 lg:h-6 rounded flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #9E1422 0%, #D30013 100%)' }}>
                              <Icon icon="Icon-AI" size={16} color="white" />
                            </div>
                            <span className="text-[11px] lg:text-[13px] font-medium text-[#333]">Dulwich AI Assistant</span>
                          </div>
                          <div className="bg-white rounded-xl px-4 py-3 lg:px-5 lg:py-4 shadow-sm">
                            <div className="flex items-center gap-1.5">
                              <div className="w-3 h-3 bg-[#9E1422] rounded-full animate-bounce" style={{ animationDuration: '0.6s' }}></div>
                              <div className="w-2 h-2 bg-[#9E1422] rounded-full animate-bounce" style={{ animationDuration: '0.6s', animationDelay: '0.15s' }}></div>
                              <div className="w-2 h-2 bg-[#9E1422] rounded-full animate-bounce" style={{ animationDuration: '0.6s', animationDelay: '0.3s' }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                  )}
                  <div ref={chatMessagesEndRef} />
                </div>
              </div>

              {/* Chat Footer */}
              <div className="bg-white px-4 lg:px-6 py-4 lg:py-6 border-t border-[#e5e5e5]">
                <div className="max-w-4xl mx-auto">
                  {/* Quick Actions with Header */}
                  {availableQuestions.length > 0 && (
                      <div className="mb-3 lg:mb-4">
                        <div className="flex flex-wrap gap-1.5 lg:gap-2">
                          {(showAllQuestions ? availableQuestions : availableQuestions.slice(0, 10)).map((question, index) => (
                              <button
                                  key={index}
                                  onClick={() => handleQuickAction(question)}
                                  disabled={isLoading}
                                  className="text-white px-3 py-2 lg:px-4 lg:py-2 rounded-lg text-[11px] lg:text-[13px] font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                                  style={{ background: 'linear-gradient(135deg, #9E1422 0%, #D30013 50%, #D30013 100%)' }}
                              >
                                {question}
                              </button>
                          ))}
                          {availableQuestions.length > 10 && (
                              <button
                                  onClick={() => setShowAllQuestions(!showAllQuestions)}
                                  disabled={isLoading}
                                  className="bg-white border-2 border-[#D30013] px-3 py-2 lg:px-4 lg:py-2 rounded-lg text-[11px] lg:text-[13px] text-[#D30013] font-medium hover:bg-[#f8f8f8] hover:shadow-sm transition-all duration-200 disabled:opacity-50"
                              >
                                {showAllQuestions ? 'Show Less' : 'See more prompts +'}
                              </button>
                          )}
                        </div>
                      </div>
                  )}

                  {/* Input Container */}
                  <div className="flex gap-2 lg:gap-3 items-center bg-[#f5f5f5] border border-[#e0e0e0] rounded-xl px-3 py-2.5 lg:px-4 lg:py-3 transition-all duration-200 focus-within:border-[#D30013]/40 focus-within:shadow-sm">
                    <button
                        className="w-7 h-7 lg:w-8 lg:h-8 flex items-center justify-center text-[#666] hover:text-[#D30013] transition-colors flex-shrink-0"
                        aria-label="Attach file"
                    >
                      <Icon icon="Icon-Add" size={20} className="text-[#D30013]" />
                    </button>
                    <input
                        type="text"
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !isLoading) {
                            handleSendWithAPI();
                          }
                        }}
                        placeholder="Message"
                        disabled={isLoading}
                        className="flex-1 border-none bg-transparent py-1 text-[13px] lg:text-[14px] text-[#333] outline-none focus:outline-none focus:ring-0 placeholder:text-[#999]"
                    />
                    <button
                        onClick={handleSendWithAPI}
                        disabled={isLoading || !chatMessage.trim()}
                        className="w-8 h-8 lg:w-9 lg:h-9 flex items-center justify-center rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 shadow-md lg:hover:shadow-xl lg:transform lg:hover:scale-110 lg:active:scale-95"
                        style={{
                          background: isLoading || !chatMessage.trim()
                              ? '#e0e0e0'
                              : '#D30013'
                        }}
                        onMouseEnter={(e) => {
                          if (!isLoading && chatMessage.trim() && window.innerWidth >= 1024) {
                            e.currentTarget.style.background = '#9E1422';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isLoading && chatMessage.trim()) {
                            e.currentTarget.style.background = '#D30013';
                          }
                        }}
                        aria-label="Send message"
                    >
                      <Icon icon="Icon-Arrow" size={20} color="white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
        )}
      </>
  );
}

export default AIChatAssistant;
