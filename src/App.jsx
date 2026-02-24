import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './supabaseClient';
import './App.css';

// 🏅 PREMIUM SVG BADGE SETTINGS
const BADGE_CONFIG = [
    { id: 'starter', icon: <svg width="36" height="36" fill="none" stroke="#fbc02d" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>, name: 'ފެށުން', cost: 0 },
    { id: 'quiz_master', icon: <svg width="36" height="36" fill="none" stroke="#9c27b0" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>, name: 'ކުއިޒް މާސްޓަރ', cost: 100 },
    { id: 'math_genius', icon: <svg width="36" height="36" fill="none" stroke="#1976d2" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m-6 4h6m-6 4h6M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>, name: 'ހިސާބު', cost: 500 },
    { id: 'quran_star', icon: <svg width="36" height="36" fill="none" stroke="#388e3c" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>, name: 'ޤާރީ', cost: 1000 },
    { id: 'champion', icon: <svg width="36" height="36" fill="none" stroke="#d32f2f" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>, name: 'ޗެމްޕިއަން', cost: 5000 }
];

// 🎁 PREMIUM SVG GIFT STORE SETTINGS
const GIFTS_CONFIG = [
    { id: 'sweets', name: 'ޗޮކްލެޓް / މެޓާ', cost: 200, icon: <svg width="40" height="40" fill="none" stroke="#e91e63" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11.66 4.88a2.54 2.54 0 00-3.59 0l-2.19 2.2a2.54 2.54 0 000 3.59l6.36 6.36a2.54 2.54 0 003.59 0l2.19-2.2a2.54 2.54 0 000-3.59l-6.36-6.36z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9.19 7.42l5.66 5.66M6.41 15.89l-2.12 3.82a1.41 1.41 0 001.98 1.98l3.82-2.12M17.59 8.11l2.12-3.82a1.41 1.41 0 00-1.98-1.98l-3.82 2.12" /></svg> },
    { id: 'stationery', name: 'ސްޓޭޝަނަރީ ޕެކް', cost: 500, icon: <svg width="40" height="40" fill="none" stroke="#00bcd4" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg> },
    { id: 'ice_cream', name: 'އައިސްކްރީމް', cost: 300, icon: <svg width="40" height="40" fill="none" stroke="#ff9800" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z"/></svg> },
    { id: 'voucher', name: '50ރ ގިފްޓް ވައުޗަރ', cost: 1000, icon: <svg width="40" height="40" fill="none" stroke="#4caf50" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/></svg> }
];

// REUSABLE PREMIUM LOGO COMPONENT
const BrandLogo = () => (
    <div className="brand-logo fancy-dhivehi">
        ޅޮހި<span>ނޫރު</span>
    </div>
);

export default function App() {
  const [view, setView] = useState('home'); 
  const [dailyWinner, setDailyWinner] = useState(null);
  const [showWinnerCard, setShowWinnerCard] = useState(true);
  const [appMessage, setAppMessage] = useState({ show: false, type: '', text: '' });
  const [hasCongratulated, setHasCongratulated] = useState(false);
  const animationContainerRef = useRef(null);

  const [celebrationBadge, setCelebrationBadge] = useState(null);
  const prevBadgeCountRef = useRef(0);

  const [authMode, setAuthMode] = useState('login'); 
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null); 
  const [profileData, setProfileData] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [dashView, setDashView] = useState('overview'); 
  
  // --- GENERAL QUIZ STATE ---
  const [quizState, setQuizState] = useState('intro'); 
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [quizLoading, setQuizLoading] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // --- MATH QUIZ STATE ---
  const [mathState, setMathState] = useState('intro');
  const [mathQuestions, setMathQuestions] = useState([]);
  const [mathCurrentQ, setMathCurrentQ] = useState(0);
  const [mathScore, setMathScore] = useState(0);

  // ADMIN STATE
  const [allStudents, setAllStudents] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]);
  const [allPartners, setAllPartners] = useState([]);
  const [partnerRequestsList, setPartnerRequestsList] = useState([]); 
  const [winnerDate, setWinnerDate] = useState('');

  useEffect(() => {
    fetchLatestWinner();
    fetchPartners(); 
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) { setUser(session.user); fetchProfileDetails(session.user.id); }
    });
    supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'PASSWORD_RECOVERY') { setView('auth'); setAuthMode('update_password'); showToast('އައު ޕާސްވޯޑެއް ޖައްސަވާ!', 'success'); }
        if (event === 'SIGNED_IN' && session) { setUser(session.user); fetchProfileDetails(session.user.id); }
        if (event === 'SIGNED_OUT') { setUser(null); setProfileData(null); setView('home'); prevBadgeCountRef.current = 0; }
    });
    setWinnerDate(getActiveQuizDate());
  }, []);

  const handlePhoneInput = (e) => { e.target.value = e.target.value.replace(/\D/g, '').slice(0, 7); };
  const validatePhone = (phone) => /^[79]\d{6}$/.test(phone);
  const validateIDCard = (id) => { const clean = id.replace(/\s/g, '').toUpperCase(); return clean.startsWith('A') && clean.length >= 6; };
  const getActiveQuizDate = () => {
    const now = new Date();
    if (now.getHours() < 9 || (now.getHours() === 9 && now.getMinutes() < 30)) now.setDate(now.getDate() - 1);
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  };

  const showToast = (text, type = 'error') => {
      setAppMessage({ show: true, type, text });
      setTimeout(() => setAppMessage({ show: false, type: '', text: '' }), 4000);
  };

  // 🔥 CLEAN AND SIMPLE HEART ANIMATION 🔥
  const handleCongratulate = async () => {
    if (hasCongratulated || !dailyWinner) return;
    setHasCongratulated(true);
    
    const container = animationContainerRef.current;
    if (container) {
        for (let i = 0; i < 4; i++) {
            const heart = document.createElement('div');
            heart.innerText = '❤️';
            heart.className = 'floating-heart';
            heart.style.left = `calc(50% + ${(Math.random() - 0.5) * 50}px)`; 
            heart.style.animationDelay = `${i * 0.15}s`;
            heart.style.setProperty('--tx', `${(Math.random() - 0.5) * 80}`); 
            container.appendChild(heart);
            setTimeout(() => { if (container.contains(heart)) container.removeChild(heart); }, 2000);
        }
    }
    
    const { data: liveData } = await supabase.from('lhohinoor_daily_winners').select('congrats_count').eq('id', dailyWinner.id).single();
    const trueCount = (liveData?.congrats_count || 0) + 1;
    setDailyWinner(prev => ({ ...prev, congrats_count: trueCount }));
    await supabase.from('lhohinoor_daily_winners').update({ congrats_count: trueCount }).eq('id', dailyWinner.id);
  };

  const fetchLatestWinner = async () => {
    const { data } = await supabase.from('lhohinoor_daily_winners').select('*').order('won_at', { ascending: false }).limit(1).single();
    if (data) { setDailyWinner(data); setHasCongratulated(false); }
  };

  const fetchProfileDetails = async (userId) => {
    const { data } = await supabase.from('lhohinoor_students').select('*').eq('id', userId).maybeSingle();
    
    if (data) {
        const isMissing = !data.id_card || data.id_card === '' || !data.parent_phone || data.parent_phone === '' || !data.parent_address || data.parent_address === '' || !data.grade || data.grade === '';
        
        let calculatedCoins = 0;
        let totalGeneralScore = 0;
        let totalMathScore = 0;

        if (data.parent_phone) {
            const { data: genAttempts } = await supabase.from('lhohinoor_quiz_attempts').select('score').eq('phone', data.parent_phone);
            if (genAttempts) {
                totalGeneralScore = genAttempts.reduce((sum, a) => sum + (parseInt(a.score, 10) || 0), 0);
                const passedGeneral = genAttempts.filter(a => parseInt(a.score, 10) >= 4).length;
                calculatedCoins += (passedGeneral * 5);
            }

            const { data: mathAttempts, error: mathErr } = await supabase.from('lhohinoor_math_attempts').select('score').eq('phone', data.parent_phone);
            if (!mathErr && mathAttempts) {
                totalMathScore = mathAttempts.reduce((sum, a) => sum + (parseInt(a.score, 10) || 0), 0);
                const passedMath = mathAttempts.filter(a => parseInt(a.score, 10) >= 8).length; // 8/10 passing score
                calculatedCoins += (passedMath * 5);
            }
        }
        
        if (data.level) calculatedCoins += 100;

        const unlockedBadgesCount = BADGE_CONFIG.filter(b => calculatedCoins >= b.cost).length;

        if (prevBadgeCountRef.current > 0 && unlockedBadgesCount > prevBadgeCountRef.current) {
            setCelebrationBadge(BADGE_CONFIG[unlockedBadgesCount - 1]);
        }
        prevBadgeCountRef.current = unlockedBadgesCount; 

        const enrichedData = { 
            ...data, 
            isMissing, 
            total_coins: calculatedCoins, 
            quiz_total_score: totalGeneralScore,
            math_total_score: totalMathScore,
            unlocked_badges: unlockedBadgesCount, 
            total_certificates: 0 
        };
        
        setProfileData(enrichedData);
        
        if (isMissing) { setView('profile_setup'); } 
        else if (view !== 'quiz' && view !== 'math_quiz') { setView('dashboard'); }
    } else {
        setProfileData({ student_name: "", id_card: "", parent_phone: "", parent_address: "", grade: "", isMissing: true });
        setView('profile_setup');
    }
  };

  const fetchPartners = async () => { const { data } = await supabase.from('lhohinoor_partners').select('*'); if (data) setAllPartners(data); };
  const fetchLeaderboard = async () => { const { data } = await supabase.from('lhohinoor_quiz_attempts').select('username, score').eq('created_at', getActiveQuizDate()).order('score', { ascending: false }).order('created_at', { ascending: false }).limit(10); setLeaderboard(data || []); };

  const loadAdminData = async () => {
    setLoading(true);
    const { data: s } = await supabase.from('lhohinoor_students').select('*').order('student_name', { ascending: true });
    setAllStudents(s || []);
    const { data: q } = await supabase.from('lhohinoor_questions').select('*').order('quiz_date', { ascending: false });
    setAllQuestions(q || []);
    fetchPartners();
    const { data: r } = await supabase.from('lhohinoor_partner_requests').select('*');
    setPartnerRequestsList(r || []);
    setLoading(false);
  };

  const handleAuth = async (e) => {
    e.preventDefault(); setLoading(true); 
    try {
      const d = Object.fromEntries(new FormData(e.target));
      if (authMode === 'login' && (d.login_identifier === 'admin@lhohi.mv' || d.login_identifier.toUpperCase() === 'ADMIN01') && d.password === 'admin123') { 
          setView('admin'); loadAdminData(); setLoading(false); return; 
      }
      if (authMode === 'signup') {
          if (d.password.length < 6) { showToast('ޕާސްވޯޑްގައި މަދުވެގެން 6 އަކުރު ހުންނަންވާނެ.', 'error'); setLoading(false); return; }
          const { data: auth, error } = await supabase.auth.signUp({ email: d.email, password: d.password });
          if (error) { showToast(error.message.includes("already registered") ? 'މި އީމެއިލް ކުރިން ރަޖިސްޓްރީ ކުރެވިފައިވޭ.' : 'މައްސަލައެއް ދިމާވެއްޖެ.', 'error');
          } else if (auth.user) {
              await supabase.from('lhohinoor_students').insert([{ id: auth.user.id, student_name: d.username, id_card: '', parent_phone: '', parent_address: '', grade: '' }]);
              showToast('އެކައުންޓް ހެދިއްޖެ! ލޮގިން ކުރައްވާ.', 'success'); setTimeout(() => { setAuthMode('login'); }, 2000);
          }
      } else if (authMode === 'login') {
          let loginEmail = d.login_identifier.trim();
          if (!loginEmail.includes('@')) loginEmail = `${loginEmail.toUpperCase()}@lhohi.mv`;
          const { data, error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: d.password });
          if (error) { showToast('އީމެއިލް/އައި.ޑީ ނުވަތަ ޕާސްވޯޑް ނުބައި.', 'error'); } else { setUser(data.user); await fetchProfileDetails(data.user.id); }
      } else if (authMode === 'forgot_password') {
          const { error } = await supabase.auth.resetPasswordForEmail(d.email, { redirectTo: window.location.origin });
          if (error) showToast(error.message, 'error'); else showToast('ޕާސްވޯޑް ރިސެޓް ލިންކް ފޮނުވިއްޖެ!', 'success');
      } else if (authMode === 'update_password') {
          const { error } = await supabase.auth.updateUser({ password: d.password });
          if (error) showToast(error.message, 'error'); else { showToast('ޕާސްވޯޑް ބަދަލުކުރެވިއްޖެ!', 'success'); setTimeout(() => setAuthMode('login'), 2000); }
      }
    } catch (err) { showToast('ސިސްޓަމް މައްސަލައެއް.', 'error'); } finally { setLoading(false); }
  };

  const handleUpdateProfile = async (e) => {
      e.preventDefault(); setLoading(true);
      const d = Object.fromEntries(new FormData(e.target));
      const idToProcess = d.id_card ? d.id_card.replace(/\s/g, '').toUpperCase() : profileData.id_card;
      
      if (!validateIDCard(idToProcess)) { showToast('އައި.ޑީ ކާޑު ފޯމެޓް ނުބައި. އަކުރު A އިން ފަށާފައި ނަންބަރު ޖައްސަވާ.', 'warning'); setLoading(false); return; }
      if (!validatePhone(d.parent_phone)) { showToast('ފޯނު ނަންބަރު ރަނގަޅެއް ނޫން.', 'warning'); setLoading(false); return; }
      
      let finalData = { id: user.id, student_name: d.student_name, parent_address: d.parent_address, parent_phone: d.parent_phone, grade: d.grade, id_card: idToProcess };
      if (profileData && profileData.level) { finalData.level = profileData.level; finalData.category = profileData.category; finalData.recitation = profileData.recitation; finalData.parent_name = profileData.parent_name; finalData.marks = profileData.marks; }

      const { data: ghostRow } = await supabase.from('lhohinoor_students').select('*').eq('id_card', idToProcess).neq('id', user.id).maybeSingle();
      if (ghostRow) {
          if (ghostRow.level) finalData.level = ghostRow.level; if (ghostRow.category) finalData.category = ghostRow.category; if (ghostRow.recitation) finalData.recitation = ghostRow.recitation; if (ghostRow.parent_name) finalData.parent_name = ghostRow.parent_name; if (ghostRow.marks) finalData.marks = ghostRow.marks;
          await supabase.from('lhohinoor_students').delete().eq('id_card', idToProcess).neq('id', user.id);
      }

      const { error: dbError } = await supabase.from('lhohinoor_students').upsert(finalData);
      if (dbError) { showToast('ޕްރޮފައިލް ސޭވް ނުކުރެވުނު! ' + dbError.message, 'error'); } else { 
          showToast('ޕްރޮފައިލް ސޭވް ކުރެވިއްޖެ!', 'success'); await fetchProfileDetails(user.id); setIsEditingProfile(false);
      }
      setLoading(false);
  };

  const handlePartnerForm = async (e) => {
      e.preventDefault(); setLoading(true);
      const d = Object.fromEntries(new FormData(e.target));
      const safePayload = { business_name: d.business_name, phone: d.phone };
      const { error } = await supabase.from('lhohinoor_partner_requests').insert([safePayload]);
      if (error) { showToast('މައްސަލައެއް ދިމާވެއްޖެ: ' + error.message, 'error'); } else { showToast('ފޯމު ފޮނުވިއްޖެ! ވަރަށް އަވަހަށް ގުޅާނަން.', 'success'); setView('home'); }
      setLoading(false);
  };

  // --- GENERAL QUIZ ---
  const startQuiz = async () => {
    if (!user || !profileData || profileData.isMissing) { showToast("ކުޅުމަށް ފުރަތަމަ ލޮގިންކޮށް ޕްރޮފައިލް ފުރިހަމަކުރައްވާ!", "warning"); setView('auth'); setAuthMode('login'); return; }
    setQuizLoading(true);
    const activeDate = getActiveQuizDate(); 
    const { data: existing } = await supabase.from('lhohinoor_quiz_attempts').select('phone').eq('phone', profileData.parent_phone).eq('created_at', activeDate);
    
    if (existing && existing.length > 0) { showToast("މިއަދުގެ ކުއިޒްގައި ވަނީ ބައިވެރިވެފައި! މާދަމާ އަލުން މަސައްކަތްކުރައްވާ.", "warning"); setView('dashboard'); setDashView('progress'); setQuizLoading(false); return; }

    const { data, error } = await supabase.from('lhohinoor_questions').select('*').eq('quiz_date', activeDate);
    if (error) { showToast("System Error.", "error"); setQuizLoading(false); return; }
    if (data && data.length > 0) {
      const randomFive = data.sort(() => 0.5 - Math.random()).slice(0, 5);
      setQuestions(randomFive); setScore(0); setCurrentQ(0); setSelectedOption(null); setIsAnswered(false); setQuizState('playing'); setView('quiz');
    } else { 
      const now = new Date();
      if (now.getHours() >= 9 && now.getMinutes() >= 30) { showToast("މިއަދުގެ ސުވާލުތައް އަދި އަޕްލޯޑް ނުކުރޭ.", "warning"); } else { showToast("މިއަދުގެ ސުވާލުތައް ބަންދުވެއްޖެ. އައު ސުވާލުތައް 09:30 ގައި ލިބޭނެ.", "warning"); }
    }
    setQuizLoading(false);
  };

  const handleAnswer = (opt) => {
    if (isAnswered) return;
    setSelectedOption(opt); setIsAnswered(true);
    const isCorrect = opt === questions[currentQ].correct_option;
    if (isCorrect) setScore(score + 1);
    
    // LIGHTNING FAST TIMEOUT (1000ms)
    setTimeout(() => {
      if (currentQ < questions.length - 1) { setCurrentQ(currentQ + 1); setSelectedOption(null); setIsAnswered(false); } else {
        const passMark = Math.ceil(questions.length * 0.8);
        const finalScore = isCorrect ? score + 1 : score;
        setScore(finalScore);
        if (finalScore >= passMark) { setQuizState('result'); setTimeout(() => autoSubmitQuiz(finalScore), 2000); } else { setQuizState('result'); }
      }
    }, 1000); 
  };

  const autoSubmitQuiz = async (finalScore) => {
    setQuizLoading(true);
    const activeDate = getActiveQuizDate(); 
    const { error } = await supabase.from('lhohinoor_quiz_attempts').insert([{ username: profileData.student_name, address: profileData.parent_address || "N/A", phone: profileData.parent_phone, score: finalScore, created_at: activeDate }]);
    if (!error) { 
        await fetchLeaderboard();
        await fetchProfileDetails(user.id); 
        setQuizState('success'); 
    } else { showToast("މައްސަލައެއް ދިމާވެއްޖެ: " + error.message, "error"); }
    setQuizLoading(false);
  };

  // --- MATH CHALLENGE (GRADE BASED, 10 QUESTIONS) ---
  const startMathQuiz = async () => {
      if (!user || !profileData || profileData.isMissing) { showToast("ކުޅުމަށް ފުރަތަމަ ލޮގިންކޮށް ޕްރޮފައިލް ފުރިހަމަކުރައްވާ!", "warning"); return; }
      setQuizLoading(true);
      const activeDate = getActiveQuizDate();

      const { data: attempts, error: attErr } = await supabase.from('lhohinoor_math_attempts').select('id').eq('phone', profileData.parent_phone).eq('created_at', activeDate);
      if (attErr) { showToast("Database error, have you created the tables?", "error"); setQuizLoading(false); return; }
      
      if (attempts && attempts.length >= 2) {
          showToast("މިއަދުގެ 2 ފުރުޞަތު ވަނީ ބޭނުންކޮށްފައި! މާދަމާ އަލުން މަސައްކަތްކުރައްވާ.", "warning"); 
          setQuizLoading(false); return;
      }

      const { data: qData, error: qErr } = await supabase.from('lhohinoor_math_questions').select('*').eq('grade', profileData.grade);
      
      if (qErr) { showToast("Database Error. Tables not found.", "error"); setQuizLoading(false); return; }
      if (!qData || qData.length < 1) {
          showToast("މި ގްރޭޑަށް އަދި ސުވާލުތައް އަޕްލޯޑްކޮށްފައެއް ނުވޭ.", "warning");
          setQuizLoading(false); return;
      }

      // 10 Standard Questions for Math Challenge
      const randomTen = qData.sort(() => 0.5 - Math.random()).slice(0, 10);
      setMathQuestions(randomTen); setMathScore(0); setMathCurrentQ(0); setSelectedOption(null); setIsAnswered(false); 
      setMathState('playing'); setView('math_quiz');
      setQuizLoading(false);
  };

  const handleMathAnswer = (opt) => {
      if (isAnswered) return;
      setSelectedOption(opt); setIsAnswered(true);
      const isCorrect = opt === mathQuestions[mathCurrentQ].correct_option;
      if (isCorrect) setMathScore(mathScore + 1);

      // LIGHTNING FAST TIMEOUT (1000ms)
      setTimeout(() => {
          if (mathCurrentQ < mathQuestions.length - 1) {
              setMathCurrentQ(mathCurrentQ + 1); setSelectedOption(null); setIsAnswered(false);
          } else {
              setMathState('result');
              const finalScore = isCorrect ? mathScore + 1 : mathScore;
              setMathScore(finalScore);
              setTimeout(() => autoSubmitMath(finalScore), 2000);
          }
      }, 1000);
  };

  const autoSubmitMath = async (finalScore) => {
      const activeDate = getActiveQuizDate();
      await supabase.from('lhohinoor_math_attempts').insert([{ phone: profileData.parent_phone, score: finalScore, created_at: activeDate }]);
      await fetchProfileDetails(user.id); 
      setMathState('success');
  };

  const getButtonColor = (opt, questionsArray, currentIndex) => {
    if (!isAnswered || !questionsArray[currentIndex]) return 'white';
    if (opt === questionsArray[currentIndex].correct_option) return '#d4edda';
    if (opt === selectedOption) return '#f8d7da'; return 'white';
  };

  const resetQuiz = () => { setQuizState('intro'); setScore(0); setCurrentQ(0); setSelectedOption(null); setIsAnswered(false); setQuestions([]); };

  // EXTREMELY SAFE ENROLLMENT CHECK
  const isEnrolledInQuran = profileData && (
      (profileData.level && profileData.level.trim().length > 0) || 
      (profileData.category && profileData.category.trim().length > 0) || 
      (profileData.recitation && profileData.recitation.trim().length > 0) ||
      (profileData.marks && String(profileData.marks).trim().length > 0)
  );

  return (
    <div style={styles.appContainer}>
      <style>
        {`
        @font-face { font-family: 'Faruma'; src: url('/faruma.ttf') format('truetype'); font-weight: normal; font-style: normal; }
        .fancy-dhivehi { font-family: "MV Boli", "A_Faseyha", "Faruma", cursive, sans-serif; }

        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes popIn { 0% { transform: scale(0.5); opacity: 0; } 80% { transform: scale(1.1); opacity: 1; } 100% { transform: scale(1); } }
        @keyframes slideDown { 0% { transform: translate(-50%, -100%); opacity: 0; } 100% { transform: translate(-50%, 0); opacity: 1; } }
        @keyframes spinSlow { 100% { transform: rotate(360deg); } }
        @keyframes badgePop { 0% { transform: scale(0); opacity: 0; } 50% { transform: scale(1.2); opacity: 1; } 100% { transform: scale(1); } }
        
        /* CLEAN HEART ANIMATION */
        @keyframes floatHeart { 
            0% { transform: translate(0, 0) scale(0.5); opacity: 0; } 
            20% { transform: translate(calc(var(--tx) * 0.3px), -20px) scale(1.2); opacity: 1; } 
            100% { transform: translate(calc(var(--tx) * 1px), -120px) scale(1); opacity: 0; } 
        }
        .floating-heart { position: absolute; bottom: 70px; font-size: 28px; animation: floatHeart 1.5s ease-out forwards; pointer-events: none; z-index: 15; filter: drop-shadow(0px 4px 6px rgba(211,47,47,0.4)); opacity: 0; }
        
        .app-toast { position: fixed; top: 20px; left: 50%; transform: translateX(-50%); z-index: 10000; background: white; padding: 15px 25px; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); display: flex; align-items: center; gap: 10px; animation: slideDown 0.3s ease-out forwards; border-left: 5px solid; font-weight: bold; width: 90%; max-width: 400px; text-align: right; direction: rtl; }
        .app-toast.error { border-color: #f44336; color: #d32f2f; }
        .app-toast.success { border-color: #4caf50; color: #2e7d32; }
        .app-toast.warning { border-color: #ff9800; color: #e65100; }

        .celebration-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.85); z-index: 9999; display: flex; justify-content: center; align-items: center; overflow: hidden; }
        .rays-bg { position: absolute; width: 200%; height: 200%; top: -50%; left: -50%; background: repeating-conic-gradient(from 0deg, rgba(255, 215, 0, 0.15) 0deg 15deg, transparent 15deg 30deg); animation: spinSlow 20s linear infinite; z-index: -1; }
        .badge-showcase { background: white; padding: 40px; border-radius: 20px; text-align: center; box-shadow: 0 0 50px rgba(255, 215, 0, 0.5); animation: badgePop 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; position: relative; max-width: 300px; }

        .brand-logo { font-size: 42px; font-weight: 900; color: #0056b3; text-shadow: 2px 2px 4px rgba(0,0,0,0.1); margin-bottom: 20px; text-align: center; }
        .brand-logo span { color: #fbc02d; }

        .animate-card { animation: fadeInUp 0.8s ease-out; }
        .winner-card { background: linear-gradient(135deg, #fff3e0 0%, #ffffff 100%); border: 2px solid #ffd700; border-radius: 15px; padding: 20px; text-align: center; box-shadow: 0 10px 25px rgba(255, 215, 0, 0.3); margin-bottom: 20px; position: relative; animation: popIn 0.6s ease-out; max-width: 400px; margin-left: auto; margin-right: auto; overflow: hidden; }
        .close-btn { position: absolute; top: 10px; right: 10px; background: #ff5252; color: white; border: none; border-radius: 50%; width: 28px; height: 28px; cursor: pointer; font-size: 14px; line-height: 28px; text-align: center; padding: 0; z-index: 10; }
        .celebration-banner { font-size: 20px; color: #d84315; font-weight: bold; margin-bottom: 10px; }
        
        .dash-topbar { display: flex; justify-content: space-around; background: linear-gradient(90deg, #0056b3, #007bff); color: white; padding: 15px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 4px 10px rgba(0,86,179,0.3); }
        .dash-stat { text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .dash-stat h3 { margin: 5px 0 0 0; font-size: 24px; font-family: sans-serif; }
        .dash-stat p { margin: 0; font-size: 12px; opacity: 0.9; }
        
        .dash-menu-grid { display: grid; grid-template-columns: 1fr; gap: 15px; }
        .dash-menu-btn { background: white; border: 2px solid #e0e0e0; border-radius: 12px; padding: 20px; text-align: right; cursor: pointer; transition: 0.2s; box-shadow: 0 2px 5px rgba(0,0,0,0.02); display: flex; justify-content: space-between; align-items: center; }
        .dash-menu-btn:hover { border-color: #0056b3; transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0,86,179,0.1); }
        .dash-menu-title { font-size: 18px; font-weight: bold; color: #333; margin: 0 0 5px 0; }
        .dash-menu-sub { font-size: 13px; color: #777; margin: 0; }
        .dash-icon { color: #0056b3; display: flex; align-items: center; justify-content: center; background: #f0f4f8; padding: 12px; border-radius: 50%; }

        .program-card { background: white; border: 1px solid #eee; border-radius: 10px; padding: 15px; text-align: center; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
        .program-card h4 { margin: 0 0 10px 0; color: #0056b3; }
        
        .badge-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 15px; }
        .badge-item { background: #f9f9f9; border-radius: 12px; padding: 10px; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: inset 0 2px 4px rgba(0,0,0,0.05); }
        .badge-locked { filter: grayscale(100%); opacity: 0.6; }
        .badge-unlocked { filter: drop-shadow(0px 4px 6px rgba(255,215,0,0.6)); border: 1px solid #fbc02d; background: #fffde7;}

        .gift-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 15px; margin-top: 15px; }
        .gift-card { background: white; border: 1px solid #eee; border-radius: 12px; padding: 15px; text-align: center; display: flex; flex-direction: column; align-items: center; }

        .official-slip-table td { padding: 8px 0; border-bottom: 1px solid #eee; }
        .official-slip-table tr:last-child td { border-bottom: none; }
        .slip-label { color: #555; width: 35%; font-size: 13px; }
        .slip-value { font-weight: bold; color: #000; font-size: 14px; }
        .ltr-text { direction: ltr; unicode-bidi: embed; text-align: right; display: inline-block; width: 100%; }
        `}
      </style>

      {/* 🚀 GLOBAL TOAST NOTIFICATION 🚀 */}
      {appMessage.show && (
          <div className={`app-toast ${appMessage.type}`}>
              <span>{appMessage.type === 'error' ? '⚠️' : appMessage.type === 'warning' ? '🛑' : '✅'}</span>
              <span style={{flex: 1}}>{appMessage.text}</span>
          </div>
      )}

      {/* 🎉 BADGE CELEBRATION MODAL 🎉 */}
      {celebrationBadge && (
          <div className="celebration-overlay" onClick={() => setCelebrationBadge(null)}>
              <div className="rays-bg"></div>
              <div className="badge-showcase" onClick={e => e.stopPropagation()}>
                  <h2 style={{color: '#d32f2f', margin: '0 0 10px 0'}}>މަރުޙަބާ!</h2>
                  <p style={{color: '#555', fontSize: '14px', margin: '0 0 20px 0'}}>އައު ބެޖެއް ލިބިއްޖެ</p>
                  <div style={{transform: 'scale(2.5)', margin: '40px 0', filter: 'drop-shadow(0px 10px 10px rgba(255,215,0,0.8))'}}>{celebrationBadge.icon}</div>
                  <h3 style={{color: '#333', margin: '0 0 5px 0'}}>{celebrationBadge.name}</h3>
                  <button onClick={() => setCelebrationBadge(null)} style={{...styles.btn, background: '#fbc02d', color: '#333', marginTop: '20px'}}>ކުރިއަށްދޭ</button>
              </div>
          </div>
      )}
      
      <div style={styles.navbar}>
        <div style={styles.logo} className="fancy-dhivehi" onClick={() => setView('home')}>ޅޮހި<span style={{color:'#fbc02d'}}>ނޫރު</span></div>
        <div style={{display:'flex', gap:10}}>
           <button onClick={() => setView('home')} style={styles.navBtn}>ފުރަތަމަ ޞަފުޙާ</button>
           <button onClick={() => setView('info')} style={styles.navBtn}>މަޢުލޫމާތު</button>
           {user && !profileData?.isMissing ? (
               <button onClick={() => {setView('dashboard'); setDashView('overview');}} style={{...styles.navBtn, color: '#0056b3'}}>ޑޭޝްބޯޑު</button>
           ) : (
               !user && <button onClick={() => { setView('auth'); setAuthMode('login'); setAuthMessage({type:'', text:''}); }} style={styles.navBtn}>ލޮގިން</button>
           )}
        </div>
      </div>

      {view === 'info' && (
        <div style={styles.centeredContainer}>
          <div style={styles.quizCard} className="animate-card">
              <h2 style={{textAlign:'center', color:'#2e7d32', marginBottom:'20px'}}>މުބާރާތުގެ މަޢުލޫމާތު</h2>
              <div style={{textAlign: 'right', padding: '15px', background: '#f9f9f9', borderRadius: '10px', borderRight: '4px solid #0056b3', marginBottom: '15px'}}>
                  <div style={{color: '#0056b3', fontSize: '18px', marginBottom: '10px', fontWeight: 'bold'}}>🎁 އިނާމުތައް</div>
                  <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
                      <li style={{marginBottom: '8px', fontSize: '14px', position: 'relative', paddingRight: '20px'}}>ކޮންމެ ދުވަހެއްގެ ނަސީބުވެރިޔާއަށް: <b>100 ރުފިޔާގެ ގިފްޓް ވައުޗަރެއް</b>.<span style={{position: 'absolute', right: 0}}>✔️</span></li>
                      <li style={{marginBottom: '8px', fontSize: '14px', position: 'relative', paddingRight: '20px'}}>ފިތުރު ޢީދު ދުވަހު ގުރުއަތުން ހޮވޭ ފަރާތަކަށް: <b>ބޮޑު އިނާމު</b>!<span style={{position: 'absolute', right: 0}}>✔️</span></li>
                  </ul>
              </div>
              <div style={{textAlign: 'right', padding: '15px', background: '#f9f9f9', borderRadius: '10px', borderRight: '4px solid #fbc02d'}}>
                  <div style={{color: '#d84315', fontSize: '18px', marginBottom: '10px', fontWeight: 'bold'}}>📜 ޤަވާއިދުތައް</div>
                  <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
                      <li style={{marginBottom: '8px', fontSize: '14px', position: 'relative', paddingRight: '20px'}}>ކޮންމެ ދުވަހަކުވެސް 5 ސުވާލު ހިމެނޭ ކުއިޒެއް ކުރިއަށްދާނެއެވެ.<span style={{position: 'absolute', right: 0}}>✔️</span></li>
                      <li style={{marginBottom: '8px', fontSize: '14px', position: 'relative', paddingRight: '20px'}}>ގުރުއަތުގައި ބައިވެރިވެވޭނީ ކުއިޒުން <b>%80 އިން މަތި</b> ހޯދާ ފަރާތްތަކަށެވެ.<span style={{position: 'absolute', right: 0}}>✔️</span></li>
                      <li style={{marginBottom: '8px', fontSize: '14px', position: 'relative', paddingRight: '20px'}}>އެއް ފޯނު ނަންބަރަކުން ދުވާލަކު ބައިވެރިވެވޭނީ އެންމެ ފަހަރަކުއެވެ.<span style={{position: 'absolute', right: 0}}>✔️</span></li>
                      <li style={{marginBottom: '8px', fontSize: '14px', position: 'relative', paddingRight: '20px'}}>ފޯނު ނަންބަރު ވާންވާނީ ޞައްޙަ، ރާއްޖޭގެ ނަންބަރަކަށެވެ.<span style={{position: 'absolute', right: 0}}>✔️</span></li>
                  </ul>
              </div>
              <button onClick={() => setView('home')} style={{...styles.btnSecondary, marginTop: '10px'}}>ފުރަތަމަ ޞަފުޙާއަށް</button>
          </div>
        </div>
      )}

      {view === 'partner_form' && (
          <div style={styles.centeredContainer}>
            <div style={styles.card} className="animate-card">
               <h2 style={{color: '#2e7d32', marginTop: 0}}>ބައިވެރިއަކަށް ވެލައްވާ</h2>
               <p style={{fontSize: '14px', color: '#666', marginBottom: '20px'}}>ޅޮހިނޫރު ޕްރޮގްރާމްތަކަށް އެހީތެރިވުމަށް އެދޭނަމަ މި ފޯމު ފުރުއްވާ.</p>
               <form onSubmit={handlePartnerForm} style={styles.form}>
                   <input name="business_name" placeholder="ނަން / ކުންފުނި" style={styles.input} required />
                   <input name="phone" placeholder="ގުޅޭނެ ނަންބަރު" type="tel" maxLength="7" onChange={handlePhoneInput} style={styles.inputLtr} required />
                   <button type="submit" disabled={loading} style={styles.btn}>{loading ? 'ފޮނުވަނީ...' : 'ރިކުއެސްޓް ފޮނުވާ'}</button>
                   <button type="button" onClick={() => setView('home')} style={styles.btnSecondary}>ފަހަތަށް</button>
               </form>
            </div>
          </div>
      )}

      {view === 'home' && (
        <div style={styles.centeredGrid}>
            
          <div style={{textAlign: 'center', marginBottom: '30px', marginTop: '20px'}} className="animate-card">
              <div style={{ background: 'linear-gradient(135deg, #0056b3, #00a8ff)', width: '80px', height: '80px', borderRadius: '50%', margin: '0 auto 15px', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 10px 20px rgba(0,86,179,0.3)' }}>
                  <svg width="40" height="40" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              </div>
              <BrandLogo />
              <p className="fancy-dhivehi" style={{color: '#555', marginTop: '-10px', fontSize: '18px', fontWeight: 'bold'}}>އުނގެނުމުގެ އާ ދަތުރެއް</p>
          </div>

          {dailyWinner && showWinnerCard && (
            <div className="winner-card" ref={animationContainerRef}>
              <button className="close-btn" onClick={() => setShowWinnerCard(false)}>✕</button>
              <div className="celebration-banner">🎉 މަރުޙަބާ 🎉</div>
              <h3 style={{margin:'5px 0', fontSize:'16px'}}>މިއަދުގެ ނަސީބުވެރިޔާ</h3>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', margin: '10px 0' }}>
                  <h2 style={{color:'#2e7d32', margin: 0, fontSize: '24px'}}>{dailyWinner.username}</h2>
                  <div style={{display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '4px', background: '#fff', color: '#d32f2f', border: '1px solid #ffcdd2', padding: '4px 10px', borderRadius: '20px', cursor: 'pointer', boxShadow: '0 2px 4px rgba(211,47,47,0.1)', transition: 'all 0.2s ease', fontSize: '14px', userSelect: 'none'}} onClick={handleCongratulate}>❤️ <span style={{fontFamily: 'sans-serif', fontWeight: 'bold', fontSize: '13px', color: '#c62828'}}>{dailyWinner.congrats_count || 0}</span></div>
              </div>
              <p style={{fontSize:'14px', margin:'10px 0', fontWeight: 'bold'}}>🎁 {dailyWinner.prize}</p>
            </div>
          )}
          
          <div style={styles.grid}>
            
            <div style={styles.card} className="animate-card">
                <img src="https://url-shortener.me/DF5H" alt="Quiz" style={styles.cardImg}/>
                <h3 style={{margin: '10px 0'}}>❓ ކޮންމެ ދުވަހަކު 5 ސުވާލު</h3>
                <p style={{fontSize: '13px', color: '#555', marginBottom: '15px'}}>ދުވާލަކު 1 ފުރުޞަތު. ފާސްވެއްޖެނަމަ 5 ކޮއިން!</p>
                <button style={styles.btn} onClick={startQuiz}>{user && profileData && !profileData.isMissing ? 'ކުއިޒް ފަށަމާ!' : 'ކުޅުމަށް ލޮގިން ކުރައްވާ'}</button>
            </div>
            
            <div style={styles.card} className="animate-card">
                <img src="https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600" alt="Math" style={styles.cardImg}/>
                <h3 style={{margin: '10px 0', color: '#1976d2'}}>🧮 ހިސާބު ޗެލެންޖް</h3>
                <p style={{fontSize: '13px', color: '#555', marginBottom: '15px'}}>10 ސުވާލު. ދުވާލަކު 2 ފުރުޞަތު. ފާސްވެއްޖެނަމަ 5 ކޮއިން!</p>
                <button style={{...styles.btn, background: '#1976d2'}} onClick={startMathQuiz}>{user && profileData && !profileData.isMissing ? 'ޗެލެންޖް ފަށާ!' : 'ކުޅުމަށް ލޮގިން ކުރައްވާ'}</button>
            </div>

            <div style={styles.card} className="animate-card">
                <img src="https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=600" alt="Quran" style={styles.cardImg}/>
                <h3 style={{margin: '10px 0'}}>📖 ޤުރުއާން މުބާރާތް</h3>
                <p style={{fontSize: '13px', color: '#555', marginBottom: '15px'}}>މުބާރާތުގެ މަޢުލޫމާތާއި ނަތީޖާ</p>
                <button style={styles.btn} onClick={() => { user && !profileData?.isMissing ? (() => {setView('dashboard'); setDashView('programs');})() : (() => { setView('auth'); setAuthMode('login'); })(); }}>ލޮގިން / ސްޓޫޑެންޓް ހަބް</button>
            </div>
          </div>

          <div style={styles.partnerSection} className="animate-card">
              <h3 style={{color:'#2e7d32'}}>ބައިވެރިން</h3>
              <div style={styles.sponsorGrid}>
                  {allPartners.length > 0 ? allPartners.map(p => (
                      <div key={p.id} style={{textAlign:'center'}}>
                          {p.logo_url ? <img src={p.logo_url} style={styles.sponsorImg} alt={p.name}/> : <span style={{fontWeight:'bold', color:'#555'}}>{p.name}</span>}
                      </div>
                  )) : <p style={{fontSize: '12px', color: '#999', gridColumn: '1 / -1'}}>ބައިވެރިންގެ މަޢުލޫމާތު ލޯޑުކުރަނީ...</p>}
              </div>
              
              <p onClick={() => setView('partner_form')} style={styles.simpleLink}>ބައިވެރިއަކަށް ވެލައްވާ</p>
              
              <div style={{ marginTop: '25px', paddingTop: '15px', borderTop: '1px solid #eee', fontSize: '11px', color: '#888', lineHeight: '1.4' }}>
                  <p style={{ margin: '0 0 3px 0', color: '#2e7d32', fontWeight: 'bold' }}>
                      © {new Date().getFullYear()} ޅޮހިނޫރު - LhohiNoor
                  </p>
                  <p style={{ margin: '0 0 3px 0' }}>The Secretariat of the Lhohi Council</p>
                  <p style={{ margin: 0, fontSize: '9px', fontFamily: 'sans-serif', letterSpacing: '0.5px' }}>ALL RIGHTS RESERVED</p>
              </div>
          </div>

        </div>
      )}

      {/* 🔒 AUTHENTICATION 🔒 */}
      {view === 'auth' && (
        <div style={styles.centeredContainer}>
          <div style={styles.quranCard}>
            
            <BrandLogo /> 

            <div style={styles.tabs}>
                <button onClick={() => {setAuthMode('signup');}} style={{...styles.tab, borderBottom: authMode==='signup'?'3px solid #0056b3':'none'}}>އެކައުންޓް ހެދުން</button>
                <button onClick={() => {setAuthMode('login');}} style={{...styles.tab, borderBottom: authMode==='login'?'3px solid #0056b3':'none'}}>ލޮގިން</button>
            </div>

            <form onSubmit={handleAuth} style={styles.form}>
              {authMode === 'login' && (
                <>
                  <input name="login_identifier" type="text" placeholder="ID Card or Email" style={styles.inputLtr} required />
                  <input name="password" type="password" placeholder="Password" style={styles.inputLtr} required />
                  <p onClick={() => {setAuthMode('forgot_password');}} style={{fontSize:'12px', color:'#0056b3', cursor:'pointer', textAlign:'left'}}>ޕާސްވޯޑް ހަނދާންނެތިއްޖެތަ؟</p>
                  <button type="submit" disabled={loading} style={styles.btn}>{loading ? 'ޗެކްކުރަނީ...' : 'ލޮގިން'}</button>
                </>
              )}
              {authMode === 'signup' && (
                <div style={styles.scrollArea}>
                  <input name="username" placeholder="ފުރިހަމަ ނަން (Full Name)" style={styles.input} required />
                  <input name="email" type="email" placeholder="Email Address" style={styles.inputLtr} required />
                  <input name="password" type="password" placeholder="Password (Min 6 chars)" style={styles.inputLtr} required />
                  <button type="submit" disabled={loading} style={{...styles.btn, background:'green'}}>{loading ? 'ރަޖިސްޓްރީ ކުރަނީ...' : 'އެކައުންޓް ހަދާ'}</button>
                </div>
              )}
              {authMode === 'forgot_password' && (
                <>
                    <p style={{fontSize:'13px', color:'#555', marginBottom:'10px'}}>ރަޖިސްޓްރީ ކުރިއިރު ބޭނުންކުރެއްވި އީމެއިލް ޖައްސަވާ.</p>
                    <input name="email" type="email" placeholder="Email Address" style={styles.inputLtr} required />
                    <button type="submit" disabled={loading} style={styles.btn}>{loading ? 'ފޮނުވަނީ...' : 'ޕާސްވޯޑް ރިސެޓް ލިންކް ފޮނުވާ'}</button>
                    <div style={{marginTop: '15px', padding: '10px', background: '#fff3cd', border: '1px solid #ffeeba', borderRadius: '8px', fontSize: '12px', color: '#856404', textAlign: 'right'}}>💡 <b>ސަމާލުކަމަށް:</b> ކުރިން އައި.ޑީ ކާޑު ބޭނުންކޮށްގެން ރަޖިސްޓްރީ ކޮށްފައިވާނަމަ، ޕާސްވޯޑް ބަދަލުކުރުމަށް ކައުންސިލަށް ގުޅުއްވާ.</div>
                    <p onClick={() => setAuthMode('login')} style={{fontSize:'12px', color:'#0056b3', cursor:'pointer', marginTop:'10px'}}>ފަހަތަށް</p>
                </>
              )}
            </form>
            <button onClick={() => setView('home')} style={{...styles.btnSecondary, marginTop:10}}>ކެންސަލް</button>
          </div>
        </div>
      )}

      {/* 🛑 THE GATEKEEPER: FORCED PROFILE SETUP 🛑 */}
      {view === 'profile_setup' && profileData && (
          <div style={styles.centeredContainer}>
              <div style={styles.quranCard} className="animate-card">
                  
                  <BrandLogo />

                  <h2 style={{color: '#d32f2f', textAlign: 'center', marginTop: 0}}>މަރުޙަބާ! ޕްރޮފައިލް ފުރިހަމަކުރައްވާ</h2>
                  <p style={{fontSize: '13px', color: '#555', textAlign: 'center', marginBottom: '20px'}}>ސިސްޓަމް ބޭނުންކުރުމަށް ތިރީގައިވާ މަޢުލޫމާތު ފުރިހަމަ ކުރަންޖެހޭނެއެވެ.</p>
                  
                  <form onSubmit={handleUpdateProfile} style={styles.form}>
                        <label style={{textAlign: 'left', fontSize: '12px', color: '#666', marginBottom: '-8px'}}>ފުރިހަމަ ނަން (Full Name)</label>
                        <input name="student_name" defaultValue={profileData.student_name} placeholder="ފުރިހަމަ ނަން" style={styles.input} required />
                        
                        <label style={{textAlign: 'left', fontSize: '12px', color: '#666', marginBottom: '-8px'}}>އައި.ޑީ ކާޑު ނަންބަރު (ID Card)</label>
                        <input name="id_card" defaultValue={profileData.id_card} placeholder="A123456" style={styles.inputLtr} required />
                        
                        <label style={{textAlign: 'left', fontSize: '12px', color: '#666', marginBottom: '-8px'}}>އެޑްރެސް (Address)</label>
                        <input name="parent_address" defaultValue={profileData.parent_address} placeholder="އެޑްރެސް" style={styles.input} required />
                        
                        <label style={{textAlign: 'left', fontSize: '12px', color: '#666', marginBottom: '-8px'}}>ފޯނު ނަންބަރު (Phone)</label>
                        <input name="parent_phone" defaultValue={profileData.parent_phone} placeholder="7xxxxxx" type="tel" maxLength="7" onChange={handlePhoneInput} style={styles.inputLtr} required />
                        
                        <label style={{textAlign: 'left', fontSize: '12px', color: '#666', marginBottom: '-8px'}}>ގްރޭޑް / އުމުރު (Grade / Age)</label>
                        <select name="grade" defaultValue={profileData.grade} style={styles.input} required>
                            <option value="">ގްރޭޑް / އުމުރު ޚިޔާރުކުރައްވާ</option>
                            <option value="Pre School">ޕްރީ ސްކޫލް</option>
                            {[...Array(10)].map((_, i) => <option key={i} value={`Grade ${i+1}`}>ގްރޭޑް {i+1}</option>)}
                            <option value="17+">17 އަހަރުން މަތި</option>
                            <option value="45+">45 އަހަރުން މަތި</option>
                        </select>

                        <button type="submit" disabled={loading} style={{...styles.btn, background:'green', marginTop: '10px'}}>{loading ? 'ސޭވްކުރަނީ...' : 'ސޭވްކޮށްފައި ކުރިއަށްދޭ'}</button>
                  </form>
              </div>
          </div>
      )}

      {/* 🚀 NEW GAMIFIED STUDENT HUB (DASHBOARD) 🚀 */}
      {view === 'dashboard' && profileData && (
        <div style={styles.centeredGrid}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
                <h2 style={{color: '#333', margin: 0}}>ސްޓޫޑެންޓް ހަބް</h2>
                <button onClick={() => supabase.auth.signOut()} style={{...styles.btnSecondary, background:'#f44336', width: 'auto', padding: '6px 12px', fontSize: '12px'}}>ލޮގްއައުޓް</button>
            </div>

            {/* GAMIFICATION TOP BAR WITH SVGS */}
            <div className="dash-topbar animate-card">
                <div className="dash-stat">
                    <svg width="24" height="24" fill="none" stroke="#FFD700" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v8m-3-4h6"/></svg>
                    <h3>{profileData.total_coins || 0}</h3>
                    <p>ކޮއިން</p>
                </div>
                <div className="dash-stat" style={{borderLeft: '1px solid rgba(255,255,255,0.3)', borderRight: '1px solid rgba(255,255,255,0.3)', padding: '0 20px'}}>
                    <svg width="24" height="24" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15l-3 3-1-4-4-1 3-3-1-4 4 1 3-3 3 3 4-1-1 4 3 3-4 1-1 4-3-3z"/></svg>
                    <h3>{profileData.unlocked_badges || 0}</h3>
                    <p>ބެޖް</p>
                </div>
                <div className="dash-stat">
                    <svg width="24" height="24" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                    <h3>{profileData.total_certificates || 0}</h3>
                    <p>ސެޓްފިކެޓް</p>
                </div>
            </div>

            {/* SUB-ROUTER VIEWS */}
            {dashView === 'overview' && (
                <div className="dash-menu-grid animate-card">
                    
                    {/* DIRECT QURAN SLIP ACCESS ON OVERVIEW */}
                    {isEnrolledInQuran && (
                        <div className="dash-menu-btn" onClick={() => setDashView('programs')} style={{background: '#e8f5e9', borderColor: '#4caf50'}}>
                            <div className="dash-icon" style={{background: 'white', color: '#4caf50'}}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            </div>
                            <div><p className="dash-menu-title" style={{color: '#2e7d32'}}>މަގޭ ޤުރުއާން ސްލިޕް</p><p className="dash-menu-sub">މުބާރާތުގެ މަޢުލޫމާތު ބެއްލެވުމަށް</p></div>
                        </div>
                    )}

                    <div className="dash-menu-btn" onClick={() => setDashView('profile')}>
                        <div className="dash-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        </div>
                        <div><p className="dash-menu-title">މަގޭ ޕްރޮފައިލް</p><p className="dash-menu-sub">މަޢުލޫމާތު ބަދަލުކުރުމަށް</p></div>
                    </div>
                    <div className="dash-menu-btn" onClick={() => setDashView('progress')}>
                        <div className="dash-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                        </div>
                        <div><p className="dash-menu-title">މަގޭ ނަތީޖާ އާއި ކާމިޔާބީ</p><p className="dash-menu-sub">ލީޑަރބޯޑް، ބެޖް އަދި ސެޓްފިކެޓް</p></div>
                    </div>
                    <div className="dash-menu-btn" onClick={() => setDashView('programs')}>
                        <div className="dash-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                        </div>
                        <div><p className="dash-menu-title">ކްލާސްތަކާއި މުބާރާތްތައް</p><p className="dash-menu-sub">ކުއިޒް، ޤުރުއާން، އަދި ހިސާބު</p></div>
                    </div>
                    
                    <div className="dash-menu-btn" onClick={() => setDashView('gift_shop')} style={{borderColor: '#ff9800'}}>
                        <div className="dash-icon" style={{color: '#ff9800', background: '#fff3e0'}}>
                            <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"/></svg>
                        </div>
                        <div><p className="dash-menu-title" style={{color: '#e65100'}}>އިނާމު ފިހާރަ</p><p className="dash-menu-sub">ކޮއިން ބޭނުންކޮށްގެން އިނާމު ހޯދާ!</p></div>
                    </div>
                </div>
            )}

            {/* VIEW: MY PROFILE */}
            {dashView === 'profile' && (
                <div style={styles.card} className="animate-card">
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px'}}>
                        <button onClick={() => setDashView('overview')} style={{...styles.btnSecondary, background: 'transparent', color: '#0056b3', width: 'auto', padding: 0}}>← ފަހަތަށް</button>
                        <h3 style={{margin: 0}}>މަގޭ ޕްރޮފައިލް</h3>
                    </div>

                    {isEditingProfile ? (
                        <form onSubmit={handleUpdateProfile} style={styles.form}>
                            <label style={{textAlign: 'left', fontSize: '12px', color: '#666', marginBottom: '-8px'}}>ނަން (Name)</label>
                            <input name="student_name" defaultValue={profileData.student_name} style={styles.input} required />
                            <label style={{textAlign: 'left', fontSize: '12px', color: '#666', marginBottom: '-8px'}}>އައި.ޑީ ކާޑު (ID Card)</label>
                            <input name="id_card" defaultValue={profileData.id_card} readOnly={!!profileData.id_card} style={{...styles.inputLtr, background: profileData.id_card ? '#eee' : 'white'}} required />
                            <label style={{textAlign: 'left', fontSize: '12px', color: '#666', marginBottom: '-8px'}}>އެޑްރެސް (Address)</label>
                            <input name="parent_address" defaultValue={profileData.parent_address} style={styles.input} required />
                            <label style={{textAlign: 'left', fontSize: '12px', color: '#666', marginBottom: '-8px'}}>ފޯނު ނަންބަރު (Phone)</label>
                            <input name="parent_phone" defaultValue={profileData.parent_phone} type="tel" maxLength="7" onChange={handlePhoneInput} style={styles.inputLtr} required />
                            <label style={{textAlign: 'left', fontSize: '12px', color: '#666', marginBottom: '-8px'}}>ގްރޭޑް / އުމުރު (Grade)</label>
                            <select name="grade" defaultValue={profileData.grade} style={styles.input} required>
                                <option value="Pre School">ޕްރީ ސްކޫލް</option>
                                {[...Array(10)].map((_, i) => <option key={i} value={`Grade ${i+1}`}>ގްރޭޑް {i+1}</option>)}
                                <option value="17+">17 އަހަރުން މަތި</option><option value="45+">45 އަހަރުން މަތި</option>
                            </select>
                            <button type="submit" disabled={loading} style={{...styles.btn, background:'green'}}>{loading ? 'ސޭވްކުރަނީ...' : 'ސޭވްކުރޭ'}</button>
                            <button type="button" onClick={() => setIsEditingProfile(false)} style={styles.btnSecondary}>ކެންސަލް</button>
                        </form>
                    ) : (
                        <div style={{textAlign: 'right', lineHeight: '1.8'}}>
                            <p><b>ނަން:</b> {profileData.student_name}</p>
                            <p><b>އައި.ޑީ ކާޑު:</b> <span style={{direction: 'ltr', unicodeBidi: 'embed'}}>{profileData.id_card}</span></p>
                            <p><b>އެޑްރެސް:</b> {profileData.parent_address}</p>
                            <p><b>ފޯނު ނަންބަރު:</b> <span style={{direction: 'ltr', unicodeBidi: 'embed'}}>{profileData.parent_phone}</span></p>
                            <p><b>ގްރޭޑް / އުމުރު:</b> {profileData.grade}</p>
                            {user.email && !user.email.includes('@lhohi.mv') && <p><b>އީމެއިލް:</b> <span style={{direction: 'ltr', unicodeBidi: 'embed'}}>{user.email}</span></p>}
                            <button onClick={() => setIsEditingProfile(true)} style={{...styles.btnSecondary, marginTop: '15px'}}>މަޢުލޫމާތު ބަދަލުކުރޭ</button>
                        </div>
                    )}
                </div>
            )}

            {/* VIEW: MY PROGRESS & REWARDS */}
            {dashView === 'progress' && (
                <div style={styles.card} className="animate-card">
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px'}}>
                        <button onClick={() => setDashView('overview')} style={{...styles.btnSecondary, background: 'transparent', color: '#0056b3', width: 'auto', padding: 0}}>← ފަހަތަށް</button>
                        <h3 style={{margin: 0}}>މަގޭ ނަތީޖާ</h3>
                    </div>
                    
                    <div className="program-card" style={{marginBottom: '10px', textAlign: 'right'}}>
                        <h4 style={{margin: '0 0 5px 0', color: '#d32f2f'}}>💯 ސްކޯ ބޯޑު</h4>
                        <p style={{margin: '5px 0', fontSize: '14px'}}><b>ކުއިޒް ފާސްވި އަދަދު:</b> {(profileData.quiz_total_score || 0) / 5}</p>
                        <p style={{margin: '5px 0', fontSize: '14px'}}><b>ހިސާބު ފާސްވި އަދަދު:</b> {(profileData.math_total_score || 0) / 10}</p>
                        <p style={{margin: '5px 0', fontSize: '14px'}}><b>ޤުރުއާން މާކްސް:</b> {profileData.marks || 'ނުލިބޭ'}</p>
                    </div>

                    <div className="program-card" style={{marginBottom: '10px'}}>
                        <h4 style={{margin: '0 0 10px 0', color: '#fbc02d'}}>🏅 އަންލޮކްވެފައިވާ ބެޖްތައް</h4>
                        
                        <div className="badge-grid">
                            {BADGE_CONFIG.map(badge => {
                                const isUnlocked = (profileData.total_coins || 0) >= badge.cost;
                                return (
                                    <div key={badge.id} className={`badge-item ${isUnlocked ? 'badge-unlocked' : 'badge-locked'}`} title={badge.name}>
                                        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40px'}}>{badge.icon}</div>
                                        <span style={{fontSize: '9px', marginTop:'5px', fontWeight: 'bold', textAlign:'center'}}>{badge.name}</span>
                                        {!isUnlocked && <span style={{fontSize: '10px', color:'#d32f2f', fontWeight:'bold', marginTop:'2px'}}>🔒 {badge.cost} 🪙</span>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* VIEW: GIFT SHOP */}
            {dashView === 'gift_shop' && (
                <div style={{...styles.card, background: '#fffde7'}} className="animate-card">
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #fbc02d', paddingBottom: '10px', marginBottom: '15px'}}>
                        <button onClick={() => setDashView('overview')} style={{...styles.btnSecondary, background: 'transparent', color: '#f57f17', width: 'auto', padding: 0}}>← ފަހަތަށް</button>
                        <h3 style={{margin: 0, color: '#f57f17'}}>އިނާމު ފިހާރަ 🎁</h3>
                    </div>
                    
                    <div style={{background: 'white', padding: '10px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)'}}>
                        <span style={{color: '#555', fontSize: '14px', fontWeight: 'bold'}}>މަގޭ ކޮއިން:</span>
                        <span style={{color: '#ff9800', fontSize: '18px', fontWeight: 'bold'}}>{profileData.total_coins || 0} 🪙</span>
                    </div>

                    <div className="gift-grid">
                        {GIFTS_CONFIG.map(gift => {
                            const canAfford = (profileData.total_coins || 0) >= gift.cost;
                            return (
                                <div key={gift.id} className="gift-card">
                                    <div style={{background: '#f0f4f8', padding: '15px', borderRadius: '50%', marginBottom: '10px'}}>{gift.icon}</div>
                                    <h4 style={{margin: '0 0 5px 0', fontSize: '14px'}}>{gift.name}</h4>
                                    <p style={{margin: '0 0 15px 0', fontSize: '12px', color: '#ff9800', fontWeight: 'bold'}}>{gift.cost} 🪙</p>
                                    
                                    <button 
                                        onClick={() => showToast('🎉 އިނާމު ހޯދުމަށް ކައުންސިލް އިދާރާއަށް ވަޑައިގަންނަވާ!', 'success')} 
                                        disabled={!canAfford} 
                                        style={{...styles.btn, background: canAfford ? '#4caf50' : '#ddd', color: canAfford ? 'white' : '#999', padding: '8px', fontSize: '12px', cursor: canAfford ? 'pointer' : 'not-allowed'}}
                                    >
                                        {canAfford ? 'ބަދަލުކުރޭ' : 'ކޮއިން މަދު'}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* VIEW: PROGRAMS & CLASSES */}
            {dashView === 'programs' && (
                <div style={styles.card} className="animate-card">
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px'}}>
                        <button onClick={() => setDashView('overview')} style={{...styles.btnSecondary, background: 'transparent', color: '#0056b3', width: 'auto', padding: 0}}>← ފަހަތަށް</button>
                        <h3 style={{margin: 0}}>ޕްރޮގްރާމްތައް</h3>
                    </div>

                    {isEnrolledInQuran && (
                        <div style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f0f4f8 100%)', border: '2px solid #0056b3', borderRadius: '12px', padding: '20px', boxShadow: '0 8px 16px rgba(0,0,0,0.1)', position: 'relative', overflow: 'hidden', marginBottom: '20px' }}>
                            <div style={{position:'absolute', top:0, right:0, background:'#0056b3', color:'white', padding:'5px 15px', borderBottomLeftRadius:'12px', fontSize:'12px', fontWeight:'bold'}}>
                                ޤުރުއާން މުބާރާތް
                            </div>
                            <div style={{textAlign:'center', marginBottom: '15px', borderBottom: '2px dashed #ccc', paddingBottom: '10px'}}>
                                <h3 style={{color: '#2e7d32', margin: '15px 0 5px 0'}}>ރަޖިސްޓްރޭޝަން ސްލިޕް</h3>
                            </div>
                            <table className="official-slip-table" style={{ width: '100%', textAlign: 'right', borderCollapse: 'collapse' }}>
                                <tbody>
                                    <tr><td className="slip-label">ނަން:</td><td className="slip-value">{profileData.student_name || '-'}</td></tr>
                                    <tr><td className="slip-label">އައި.ޑީ:</td><td className="slip-value"><span className="ltr-text">{profileData.id_card || '-'}</span></td></tr>
                                    <tr><td className="slip-label">ގްރޭޑް/އުމުރު:</td><td className="slip-value">{profileData.grade || '-'}</td></tr>
                                    <tr><td className="slip-label">ބައި:</td><td className="slip-value">{profileData.level || '-'}</td></tr>
                                    <tr><td className="slip-label">ކިޔަވާ ގޮތް:</td><td className="slip-value">{profileData.category || '-'}</td></tr>
                                    <tr><td className="slip-label">ތަން:</td><td className="slip-value">{profileData.recitation || '-'}</td></tr>
                                    <tr><td className="slip-label" style={{color: '#d32f2f', fontWeight: 'bold', paddingTop: '10px'}}>މާކްސް:</td><td className="slip-value" style={{paddingTop: '10px', fontSize: '18px', color: '#d32f2f'}}>{profileData.marks || 'ނުލިބޭ'}</td></tr>
                                </tbody>
                            </table>
                        </div>
                    )}

                    <div className="program-card" style={{marginBottom: '10px'}}>
                        <h4>❓ ދުވަހުގެ ކުއިޒް</h4>
                        <button onClick={startQuiz} style={{...styles.btn, background: '#fbc02d', color: '#333', padding: '8px', fontSize: '14px'}}>މިއަދުގެ ކުއިޒް ކުޅުއްވާ</button>
                    </div>

                    <div className="program-card" style={{marginBottom: '10px'}}>
                        <h4 style={{color: '#1976d2'}}>🧮 ހިސާބު ޗެލެންޖް (Maths)</h4>
                        <p style={{fontSize: '12px', margin: '5px 0', color: '#666'}}>ދުވާލަކު 2 ފުރުޞަތު. ފާސްވެއްޖެނަމަ 5 ކޮއިން!</p>
                        <button onClick={startMathQuiz} style={{...styles.btn, background: '#1976d2', color: 'white', padding: '8px', fontSize: '14px'}}>ޗެލެންޖް ފަށާ!</button>
                    </div>

                    <div className="program-card" style={{marginBottom: '10px'}}>
                        <h4 style={{color: '#777'}}>📜 ޙަދީޘް މުބާރާތް</h4>
                        <button disabled style={{...styles.btnSecondary, background: '#eee', color: '#999', padding: '8px', fontSize: '14px', cursor: 'not-allowed'}}>އަދި ނުހުޅުވޭ</button>
                    </div>
                </div>
            )}
        </div>
      )}

      {/* 🎮 GENERAL QUIZ EXPERIENCE 🎮 */}
      {view === 'quiz' && (
        <div style={styles.centeredContainer}>
          <div style={styles.quizCard} className="animate-card">
            
            <BrandLogo />

            {quizState === 'playing' && questions[currentQ] && (
              <>
                <div style={{display:'flex', justifyContent:'space-between', borderBottom: '2px solid #f0f4f8', paddingBottom: '10px', marginBottom: '15px'}}>
                    <span style={{fontWeight: 'bold', color: '#555'}}>ސުވާލު {currentQ+1} / {questions.length}</span>
                    <span style={{fontWeight: 'bold', color: '#0056b3'}}>މާކްސް: {score}</span>
                </div>
                <h3 className="fancy-dhivehi" style={{lineHeight: '1.8', marginBottom: '25px', direction: 'rtl', textAlign: 'right', fontSize: '22px', color: '#333'}}>{questions[currentQ].question_text}</h3>
                <div style={{display:'flex', flexDirection:'column', gap:12}}>
                  {[questions[currentQ].option_1, questions[currentQ].option_2, questions[currentQ].option_3].map((opt, i) => (
                    <button key={i} className="fancy-dhivehi" style={{...styles.optionBtn, direction: 'rtl', fontSize: '18px', background: getButtonColor(opt, questions, currentQ), borderColor: getButtonColor(opt, questions, currentQ) !== 'white' ? getButtonColor(opt, questions, currentQ) : '#ddd'}} onClick={() => handleAnswer(opt)} disabled={isAnswered}>{opt}</button>
                  ))}
                </div>
              </>
            )}

            {quizState === 'result' && (
              <div style={{textAlign:'center'}}>
                <h1>{score} / {questions.length}</h1>
                {(score >= Math.ceil(questions.length * 0.8)) ? 
                    <><p style={{color:'green', fontWeight: 'bold'}}>🎉 ކޮލިފައިވެއްޖެ! 5 ކޮއިން ލިބޭނެ.</p><p style={{fontSize: '12px', color: '#666'}}>މަޑުކޮށްލައްވާ...</p></> 
                    : 
                <>
                  <p style={{color:'red'}}>ކޮލިފައިވުމަށް އަލުން މަސައްކަތްކުރައްވާ!</p>
                  <button style={styles.btnSecondary} onClick={() => {setView('dashboard'); setDashView('programs');}}>ޑޭޝްބޯޑަށް</button>
                  <button style={{...styles.btn, marginTop:10}} onClick={startQuiz}>އަލުން މަސައްކަތްކުރައްވާ</button>
                </>}
              </div>
            )}
            
            {quizState === 'success' && (
              <div style={{textAlign:'center'}}>
                <h1 style={{fontSize:'50px', margin:'0 0 10px 0'}}>✅</h1>
                <h2 style={{marginTop:0}}>ލިބިއްޖެ!</h2>
                
                <div style={{marginTop:'20px', textAlign:'right', background:'#f9f9f9', padding:'15px', borderRadius:'10px', maxHeight:'200px', overflowY:'auto'}}>
                    <h4 style={{margin:'0 0 10px 0', borderBottom:'1px solid #ddd', paddingBottom:'5px'}}>މިއަދުގެ ޓޮප් 10</h4>
                    {leaderboard.length > 0 ? leaderboard.map((l, i) => (
                        <div key={i} className="leaderboard-row"><span>{i+1}. {l.username}</span><span>{l.score} މާކްސް</span></div>
                    )) : <p style={{fontSize:'12px', color:'#777'}}>މިއަދު އަދި އެއްވެސް ފަރާތަކުން ބައިވެރިވެފައެއް ނުވޭ.</p>}
                </div>
                <button style={{...styles.btn, marginTop:20}} onClick={() => { resetQuiz(); setView('dashboard'); setDashView('programs'); }}>ޑޭޝްބޯޑަށް</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 🧮 MATH QUIZ EXPERIENCE 🧮 */}
      {view === 'math_quiz' && (
        <div style={styles.centeredContainer}>
          <div style={styles.quizCard} className="animate-card">
            
            <BrandLogo />

            {mathState === 'playing' && mathQuestions[mathCurrentQ] && (
              <>
                <div style={{display:'flex', justifyContent:'space-between', borderBottom: '2px solid #e3f2fd', paddingBottom: '10px', marginBottom: '15px'}}>
                    <span style={{fontWeight: 'bold', color: '#1976d2'}}>ހިސާބު ސުވާލު {mathCurrentQ+1} / {mathQuestions.length}</span>
                    <span style={{fontWeight: 'bold', color: '#1976d2'}}>މާކްސް: {mathScore}</span>
                </div>
                {/* RTL Support for Dhivehi Math word problems */}
                <h3 className="fancy-dhivehi" style={{lineHeight: '1.8', marginBottom: '25px', textAlign:'right', direction:'rtl', fontSize:'22px', color:'#333'}}>{mathQuestions[mathCurrentQ].question_text}</h3>
                <div style={{display:'flex', flexDirection:'column', gap:12}}>
                  {[mathQuestions[mathCurrentQ].option_1, mathQuestions[mathCurrentQ].option_2, mathQuestions[mathCurrentQ].option_3].map((opt, i) => (
                    <button key={i} className="fancy-dhivehi" style={{...styles.optionBtn, direction: 'rtl', fontSize: '18px', background: getButtonColor(opt, mathQuestions, mathCurrentQ), borderColor: getButtonColor(opt, mathQuestions, mathCurrentQ) !== 'white' ? getButtonColor(opt, mathQuestions, mathCurrentQ) : '#ddd'}} onClick={() => handleMathAnswer(opt)} disabled={isAnswered}>{opt}</button>
                  ))}
                </div>
              </>
            )}

            {mathState === 'result' && (
              <div style={{textAlign:'center'}}>
                <h1>{mathScore} / {mathQuestions.length}</h1>
                {(mathScore >= Math.ceil(mathQuestions.length * 0.8)) ? 
                    <><p style={{color:'green', fontWeight: 'bold'}}>🎉 މޮޅު! 5 ކޮއިން ލިބޭނެ.</p><p style={{fontSize: '12px', color: '#666'}}>މަޑުކޮށްލައްވާ...</p></> 
                    : 
                <>
                  <p style={{color:'red'}}>ފާސްނުވޭ! ކޮއިންއެއް ނުލިބޭނެ.</p>
                  <button style={{...styles.btn, background: '#1976d2'}} onClick={() => { setView('dashboard'); setDashView('programs'); autoSubmitMath(mathScore); }}>ޑޭޝްބޯޑަށް</button>
                </>}
              </div>
            )}
            
            {mathState === 'success' && (
              <div style={{textAlign:'center'}}>
                <h1 style={{fontSize:'50px', margin:'0 0 10px 0'}}>✅</h1>
                <h2 style={{marginTop:0}}>ސޭވްކުރެވިއްޖެ!</h2>
                <button style={{...styles.btn, marginTop:20, background: '#1976d2'}} onClick={() => { setView('dashboard'); setDashView('programs'); }}>ޑޭޝްބޯޑަށް</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ADMIN PANEL */}
      {view === 'admin' && (
          <AdminPanel 
              allStudents={allStudents} 
              allQuestions={allQuestions} 
              allPartners={allPartners} 
              partnerRequestsList={partnerRequestsList} 
              winnerDate={winnerDate} 
              setWinnerDate={setWinnerDate} 
              loadAdminData={loadAdminData} 
              getActiveQuizDate={getActiveQuizDate} 
              fetchLatestWinner={fetchLatestWinner}
              styles={styles}
              showToast={showToast}
          />
      )}
    </div>
  );
}

// INLINED ADMIN PANEL
function AdminPanel({ 
    allStudents, allQuestions, allPartners, partnerRequestsList, 
    winnerDate, setWinnerDate, loadAdminData, getActiveQuizDate, 
    fetchLatestWinner, styles, showToast
}) {
    const [adminTab, setAdminTab] = useState('students');
    const [editingQ, setEditingQ] = useState(null);
    const [bulkJSON, setBulkJSON] = useState('');

    const saveQuestion = async (e) => { e.preventDefault(); const d = Object.fromEntries(new FormData(e.target)); if (d.correct_option !== d.option_1 && d.correct_option !== d.option_2 && d.correct_option !== d.option_3) return showToast("ޖަވާބު ދިމައެއްނުވޭ (Correct option mismatch)", "error"); if (!d.quiz_date) d.quiz_date = getActiveQuizDate(); if (editingQ) await supabase.from('lhohinoor_questions').update(d).eq('id', editingQ.id); else await supabase.from('lhohinoor_questions').insert([d]); setEditingQ(null); e.target.reset(); loadAdminData(); };
    const deleteQuestion = async (id) => { if(window.confirm("މި ސުވާލު ފޮހެލަންވީތަ؟")) { await supabase.from('lhohinoor_questions').delete().eq('id', id); loadAdminData(); } };
    const savePartner = async (e) => { e.preventDefault(); const d = Object.fromEntries(new FormData(e.target)); await supabase.from('lhohinoor_partners').insert([{ name: d.name, logo_url: d.logo_url }]); e.target.reset(); loadAdminData(); };
    const deletePartner = async (id) => { if(window.confirm("މި ބައިވެރިޔާ ފޮހެލަންވީތަ؟")) { await supabase.from('lhohinoor_partners').delete().eq('id', id); loadAdminData(); } };
    const updateStudentResult = async (id, field, value) => { await supabase.from('lhohinoor_students').update({ [field]: value }).eq('id', id); };
    const deleteStudent = async (id) => { if(window.confirm("މި ދަރިވަރު ފޮހެލަންވީތަ؟")) { await supabase.from('lhohinoor_students').delete().eq('id', id); loadAdminData(); } };
    
    // NEW: BULK UPLOAD MATH QUESTIONS
    const handleBulkMathUpload = async () => {
        try {
            const parsedData = JSON.parse(bulkJSON);
            if (!Array.isArray(parsedData)) return showToast("ޖޭސަން (JSON) ފޯމެޓް ނުބައި!", "error");
            const { error } = await supabase.from('lhohinoor_math_questions').insert(parsedData);
            if (error) throw error;
            showToast(`${parsedData.length} ހިސާބު ސުވާލު ސޭވްވެއްޖެ!`, "success");
            setBulkJSON('');
        } catch (err) {
            showToast("މައްސަލައެއް: " + err.message, "error");
        }
    };

    const pickWinner = async () => { 
        if (!winnerDate) return showToast("ތާރީޚް ޚިޔާރުކުރައްވާ.", "error");
        const selectedDateObj = new Date(winnerDate); selectedDateObj.setDate(selectedDateObj.getDate() - 7); const sevenDaysAgo = selectedDateObj.toISOString().split('T')[0];
        const { data: recentWinners } = await supabase.from('lhohinoor_daily_winners').select('phone').gte('won_at', sevenDaysAgo).lte('won_at', winnerDate);
        const recentWinnerPhones = recentWinners ? recentWinners.map(w => w.phone) : [];
        const { data: qData } = await supabase.from('lhohinoor_questions').select('id').eq('quiz_date', winnerDate);
        if (!qData || qData.length === 0) return showToast("މި ތާރީޚުގައި މުބާރާތެއް ނެތް.", "error");
        const passMark = Math.ceil(qData.length * 0.8);
        const { data: attempts } = await supabase.from('lhohinoor_quiz_attempts').select('*').eq('created_at', winnerDate).gte('score', passMark); 
        if (!attempts || attempts.length === 0) return showToast(`މި ތާރީޚުގައި ޝަރުތު ހަމަވާ މީހަކު ނެތް.`, "error");
        const eligibleCandidates = attempts.filter(attempt => !recentWinnerPhones.includes(attempt.phone));
        if (eligibleCandidates.length > 0) {
          const winner = eligibleCandidates[Math.floor(Math.random() * eligibleCandidates.length)];
          await supabase.from('lhohinoor_daily_winners').insert([{ username: winner.username, phone: winner.phone, score: winner.score, prize: "🎁 100 ރުފިޔާގެ ގިފްޓް ވައުޗަރ", won_at: winnerDate, congrats_count: 0 }]);
          showToast(`ނަސީބުވެރިޔާ: ${winner.username} (Score: ${winner.score})`, "success"); fetchLatestWinner();
        } else { showToast(`ޝަރުތު ހަމަވާ މީހުން ތިބި ނަމަވެސް، އެންމެންނަކީ ފާއިތުވި 7 ދުވަހު އިނާމު ލިބިފައިވާ މީހުން!`, "warning"); }
    };

    return (
        <div style={styles.container}>
          <div style={{...styles.card, maxWidth:'1300px', margin: '20px auto'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20}}>
                <h2>އެޑްމިން ޑޭޝްބޯޑު</h2>
                <button onClick={() => window.location.reload()} style={{...styles.btnSecondary, width:'auto'}}>ލޮގްއައުޓް</button>
            </div>
            
            <div className="admin-tabs" style={{display:'flex', gap:'10px', marginBottom:'20px'}}>
                <button style={{...styles.tab, borderBottom: adminTab==='students'?'3px solid #2e7d32':'none'}} onClick={()=>setAdminTab('students')}>ދަރިވަރުން</button>
                <button style={{...styles.tab, borderBottom: adminTab==='quiz'?'3px solid #2e7d32':'none'}} onClick={()=>setAdminTab('quiz')}>ސުވާލު މުބާރާތް</button>
                <button style={{...styles.tab, borderBottom: adminTab==='math'?'3px solid #1976d2':'none', color: '#1976d2'}} onClick={()=>setAdminTab('math')}>ހިސާބު ސުވާލުތައް</button>
                <button style={{...styles.tab, borderBottom: adminTab==='partners'?'3px solid #2e7d32':'none'}} onClick={()=>setAdminTab('partners')}>ބައިވެރިން</button>
            </div>
            
            {adminTab === 'students' && (
                <div style={{overflowX:'auto', paddingBottom: '10px'}}>
                    <div style={{display:'flex', gap:10, marginBottom:15, alignItems: 'center', background:'#f0f4f8', padding:'10px', borderRadius:'8px', flexWrap: 'wrap'}}>
                        <label style={{fontWeight:'bold', color:'#333'}}>ގުރުއަތު ނަގާ ތާރީޚް:</label>
                        <input type="date" value={winnerDate} onChange={(e) => setWinnerDate(e.target.value)} style={{...styles.input, width:'auto', padding:'8px'}} />
                        <button onClick={pickWinner} style={{...styles.btn, background:'purple', width:'auto', padding:'8px 15px'}}>ނަސީބުވެރިޔާ ހޮވާ</button>
                    </div>
                    <table style={styles.table}>
                        <thead><tr><th>ނަން</th><th>އައި.ޑީ</th><th>ގްރޭޑް</th><th>ބައި</th><th>ގޮތް</th><th>ތަން</th><th>ބެލެނިވެރިޔާ</th><th>އެޑްރެސް</th><th>ފޯނު</th><th>މާކްސް</th><th>ކަންތައް</th></tr></thead>
                        <tbody>{allStudents.map(s => (<tr key={s.id}><td>{s.student_name}</td><td>{s.id_card}</td><td>{s.grade || '-'}</td><td>{s.level || '-'}</td><td>{s.category || '-'}</td><td>{s.recitation || '-'}</td><td>{s.parent_name || '-'}</td><td>{s.parent_address || '-'}</td><td>{s.parent_phone}</td><td><input style={styles.tableInput} defaultValue={s.marks} onBlur={(e) => updateStudentResult(s.id, 'marks', e.target.value)} /></td><td><button onClick={()=>deleteStudent(s.id)} style={{...styles.btnSecondary, background:'red'}}>ފޮހެލާ</button></td></tr>))}</tbody>
                    </table>
                </div>
            )}

            {adminTab === 'quiz' && (
                <div style={{ overflowX: 'auto', paddingBottom: '10px' }}>
                    <form className="q-form" onSubmit={saveQuestion} style={{...styles.form, minWidth: '600px'}}>
                        <h3>{editingQ?'ބަދަލުކުރޭ':'އިތުރުކުރޭ'} ސުވާލު</h3>
                        <label style={{fontSize:'12px', color:'#666'}}>މި ސުވާލު ފެންނަންވީ ތާރީޚް:</label>
                        <input name="quiz_date" type="date" defaultValue={editingQ?.quiz_date || getActiveQuizDate()} style={{...styles.input, width: '200px'}} required />
                        <input name="question_text" placeholder="ސުވާލު" defaultValue={editingQ?.question_text} style={{...styles.input, direction:'rtl'}} required />
                        <div style={{display:'flex', gap:10, flexWrap: 'wrap'}}>
                            <input name="option_1" placeholder="ޖަވާބު 1" defaultValue={editingQ?.option_1} style={{...styles.input, flex: 1, minWidth: '150px', direction:'rtl'}} required />
                            <input name="option_2" placeholder="ޖަވާބު 2" defaultValue={editingQ?.option_2} style={{...styles.input, flex: 1, minWidth: '150px', direction:'rtl'}} required />
                            <input name="option_3" placeholder="ޖަވާބު 3" defaultValue={editingQ?.option_3} style={{...styles.input, flex: 1, minWidth: '150px', direction:'rtl'}} required />
                        </div>
                        <input name="correct_option" placeholder="ރަނގަޅު ޖަވާބު" defaultValue={editingQ?.correct_option} style={{...styles.input, direction:'rtl'}} required />
                        <div style={{display:'flex', gap:10, maxWidth: '300px'}}>
                            <button type="submit" style={styles.btn}>ސޭވް</button>
                            {editingQ && <button type="button" style={styles.btnSecondary} onClick={()=>{setEditingQ(null); document.querySelector('.q-form').reset()}}>ކެންސަލް</button>}
                        </div>
                    </form>
                    <table style={{...styles.table, marginTop:'20px', minWidth: '800px'}}>
                        <thead><tr><th>ތާރީޚް</th><th>ސުވާލު</th><th>ޖަވާބު</th><th>ކަންތައް</th></tr></thead>
                        <tbody>{allQuestions.map(q => (<tr key={q.id}><td style={{direction:'ltr', width: '100px'}}>{q.quiz_date}</td><td>{q.question_text}</td><td style={{color:'green'}}>{q.correct_option}</td><td style={{width: '200px'}}><button style={{...styles.btnSecondary, width:'auto', marginRight: '5px'}} onClick={()=>setEditingQ(q)}>ބަދަލުކުރޭ</button><button style={{...styles.btnSecondary, background:'red', width:'auto'}} onClick={()=>deleteQuestion(q.id)}>ފޮހެލާ</button></td></tr>))}</tbody>
                    </table>
                </div>
            )}

            {/* NEW MATH ADMIN TAB */}
            {adminTab === 'math' && (
                <div style={{ overflowX: 'auto', paddingBottom: '10px' }}>
                    <h3 style={{color: '#1976d2'}}>ހިސާބު ސުވާލުތައް އެއްފަހަރާ އަޕްލޯޑްކުރޭ (Bulk Upload)</h3>
                    <p style={{fontSize: '13px', color: '#666', marginBottom: '10px'}}>ތިރީގައިވާ ފޮއްޓަށް JSON ފޯމެޓުގައި ސުވާލުތައް ޕޭސްޓް ކުރައްވާ.</p>
                    <textarea 
                        value={bulkJSON} 
                        onChange={(e) => setBulkJSON(e.target.value)} 
                        placeholder='[ {"grade": "Grade 3", "question_text": "10 + 5 = ?", "option_1": "10", "option_2": "15", "option_3": "20", "correct_option": "15"} ]'
                        style={{...styles.inputLtr, height: '200px', resize: 'vertical', fontFamily: 'monospace', fontSize: '12px'}}
                    />
                    <button onClick={handleBulkMathUpload} style={{...styles.btn, background: '#1976d2', marginTop: '10px', maxWidth: '200px'}}>އަޕްލޯޑް ކުރޭ</button>
                </div>
            )}

            {adminTab === 'partners' && (
                <div style={{ overflowX: 'auto', paddingBottom: '10px' }}>
                    <form onSubmit={savePartner} style={{...styles.form, marginBottom:'20px', minWidth: '500px'}}>
                        <h3>ބައިވެރިއެއް އިތުރުކުރޭ</h3>
                        <input name="name" placeholder="ނަން" style={styles.input} required />
                        <input name="logo_url" placeholder="ލޯގޯ ލިންކް (URL)" style={styles.inputLtr} />
                        <button type="submit" style={{...styles.btn, maxWidth: '200px'}}>އިތުރުކުރޭ</button>
                    </form>
                    <table style={{...styles.table, minWidth: '500px'}}>
                        <thead><tr><th>ނަން</th><th>ކަންތައް</th></tr></thead>
                        <tbody>{allPartners.map(p => (<tr key={p.id}><td>{p.name}</td><td><button style={{...styles.btnSecondary, background:'red', width:'auto'}} onClick={()=>deletePartner(p.id)}>ފޮހެލާ</button></td></tr>))}</tbody>
                    </table>
                    
                    <h3 style={{marginTop: '30px'}}>ރިކުއެސްޓްތައް</h3>
                    <table style={{...styles.table, minWidth: '500px'}}>
                        <thead><tr><th>ވިޔަފާރި</th><th>ފޯނު</th></tr></thead>
                        <tbody>{partnerRequestsList.map(r => (<tr key={r.id}>
                            <td>{r.business_name}</td>
                            <td style={{direction: 'ltr', textAlign: 'right'}}>{r.phone}</td>
                        </tr>))}</tbody>
                    </table>
                </div>
            )}
          </div>
        </div>
    );
}

// --- STYLES ---
const styles = {
  appContainer: { minHeight: '100vh', background: '#f0f4f8', fontFamily: '"Faruma", sans-serif', direction: 'rtl', textAlign: 'right' },
  navbar: { background: 'white', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' },
  logo: { fontWeight: '900', fontSize: '24px', color: '#2e7d32', cursor: 'pointer' },
  navBtn: { border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold', fontFamily: '"Faruma", sans-serif' },
  container: { padding: '20px', maxWidth: '1400px', margin: '0 auto' },
  centeredGrid: { padding: '20px', maxWidth: '1000px', margin: '0 auto' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' },
  card: { background: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', textAlign: 'center' },
  cardImg: { width: '100%', height: '180px', objectFit: 'cover', borderRadius: '10px', marginBottom: '15px' },
  centeredContainer: { minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' },
  quizCard: { background: 'white', width: '100%', maxWidth: '500px', padding: '30px', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' },
  quranCard: { background: 'white', width: '100%', maxWidth: '450px', padding: '30px', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' },
  form: { display: 'flex', flexDirection: 'column', gap: '12px' },
  input: { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', width: '100%', boxSizing: 'border-box', fontFamily: '"Faruma", sans-serif', textAlign: 'right' },
  inputLtr: { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', width: '100%', boxSizing: 'border-box', fontFamily: 'sans-serif', textAlign: 'left', direction: 'ltr' },
  btn: { padding: '12px', background: '#0056b3', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', width: '100%', fontFamily: '"Faruma", sans-serif' },
  btnSecondary: { padding: '10px', background: '#666', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', width: '100%', fontFamily: '"Faruma", sans-serif' },
  optionBtn: { padding: '15px', background: '#f8f9fa', border: '2px solid #e0e0e0', borderRadius: '12px', cursor: 'pointer', textAlign: 'right', width:'100%', transition: 'all 0.2s', fontFamily: '"Faruma", sans-serif', fontSize: '15px' },
  tabs: { display: 'flex', marginBottom: '20px' },
  tab: { flex: 1, padding: '10px', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold', fontFamily: '"Faruma", sans-serif' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '20px', textAlign: 'right' },
  tableInput: { width: '50px', padding: '5px', textAlign: 'center' },
  scrollArea: { maxHeight: '50vh', overflowY: 'auto', display:'flex', flexDirection:'column', gap:'10px' },
  
  partnerSection: { background: 'white', padding: '30px 20px', borderRadius: '15px', marginTop: '40px', textAlign: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' },
  sponsorGrid: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '15px', alignItems: 'center', marginTop: '20px' },
  sponsorImg: { maxWidth: '80px', maxHeight: '40px', objectFit: 'contain' },
  simpleLink: { color: '#0056b3', cursor: 'pointer', fontSize: '13px', marginTop: '20px', textDecoration: 'underline' }
};