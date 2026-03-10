import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './supabaseClient';
import './App.css';

// 💎 BEAUTIFUL 3D GEM & MEDAL SVG GENERATORS
const getMedalSvg = (color1, color2) => (
    <svg width="40" height="40" viewBox="0 0 24 24">
       <defs>
          <linearGradient id={`med_${color1.replace('#','')}`} x1="0" y1="0" x2="1" y2="1">
             <stop offset="0%" stopColor={color1}/>
             <stop offset="100%" stopColor={color2}/>
          </linearGradient>
       </defs>
       <circle cx="12" cy="12" r="10" fill={`url(#med_${color1.replace('#','')})`} stroke="#fff" strokeWidth="1" />
       <circle cx="12" cy="12" r="7" fill="none" stroke="#fff" strokeWidth="1" strokeDasharray="2 2"/>
       <path d="M12 7l1.5 4h4l-3 2.5 1 4-3.5-2.5-3.5 2.5 1-4-3-2.5h4z" fill="#fff" opacity="0.8"/>
    </svg>
);

const getGemSvg = (mainColor, lightColor, darkColor) => (
    <svg width="40" height="40" viewBox="0 0 24 24">
        <defs>
            <linearGradient id={`gradTop_${mainColor.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={lightColor}/>
                <stop offset="100%" stopColor={mainColor}/>
            </linearGradient>
            <linearGradient id={`gradBot_${mainColor.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={mainColor}/>
                <stop offset="100%" stopColor={darkColor}/>
            </linearGradient>
        </defs>
        <polygon points="12,22 2,8 22,8" fill={`url(#gradBot_${mainColor.replace('#','')})`} />
        <polygon points="2,8 6,2 18,2 22,8" fill={`url(#gradTop_${mainColor.replace('#','')})`} />
        <polygon points="6,2 12,8 18,2" fill={lightColor} opacity="0.6" />
        <polygon points="2,8 12,22 12,8" fill="#000" opacity="0.15" />
        <polygon points="22,8 12,22 12,8" fill="#fff" opacity="0.15" />
        <polygon points="6,2 12,8 2,8" fill="#fff" opacity="0.3" />
    </svg>
);

// 🏅 NEW TIERED BADGE SETTINGS (LIFETIME ACHIEVEMENT)
const BADGE_CONFIG = [
    { id: 'bronze', name: 'ބްރޯންޒް', cost: 100, icon: getMedalSvg('#cd7f32', '#8b5a2b') },
    { id: 'silver', name: 'ސިލްވަރ', cost: 150, icon: getMedalSvg('#e5e4e2', '#a9a9a9') },
    { id: 'gold', name: 'ގޯލްޑް', cost: 200, icon: getMedalSvg('#FFDF00', '#D4AF37') },
    { id: 'emerald', name: 'އެމަރަލްޑް', cost: 300, icon: getGemSvg('#50C878', '#98FF98', '#00A86B') },
    { id: 'ruby', name: 'ރޫބީ', cost: 500, icon: getGemSvg('#E0115F', '#FF69B4', '#9B111E') },
    { id: 'sapphire', name: 'ސެފަޔަރ', cost: 700, icon: getGemSvg('#0F52BA', '#7CB9E8', '#000080') },
    { id: 'diamond', name: 'ޑައިމަންޑް', cost: 1000, icon: getGemSvg('#b9f2ff', '#ffffff', '#4bc6df') }
];

const BrandLogo = () => (
    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div className="brand-logo fancy-dhivehi" style={{ borderBottom: '3px solid #fbc02d', display: 'inline-block', paddingBottom: '5px', marginBottom: 0 }}>
            ޅޮހި<span style={{color: '#fbc02d'}}>ނޫރު</span>
        </div>
    </div>
);

export default function App() {
  const [view, setView] = useState('home'); 
  const [dashView, setDashView] = useState('overview'); 

  const navigateTo = (newView, newDashView = 'overview') => {
      window.history.pushState({ view: newView, dashView: newDashView }, '', '');
      setView(newView);
      setDashView(newDashView);
  };

  const handleGiftShopNavigation = () => {
      if (user && profileData && !profileData.isMissing) {
          navigateTo('dashboard', 'gift_shop');
      } else {
          navigateTo('public_shop');
      }
  };

  useEffect(() => {
      const handlePopState = (e) => {
          if (e.state && e.state.view) {
              setView(e.state.view);
              if (e.state.dashView) setDashView(e.state.dashView);
          } else {
              setView('home');
          }
      };
      window.addEventListener('popstate', handlePopState);
      window.history.replaceState({ view: 'home', dashView: 'overview' }, '', '');
      return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const [dailyWinner, setDailyWinner] = useState(null);
  const [monthlyWinners, setMonthlyWinners] = useState([]); 
  const [showWinnerCard, setShowWinnerCard] = useState(true);
  const [appMessage, setAppMessage] = useState({ show: false, type: '', text: '' });
  const [hasCongratulated, setHasCongratulated] = useState(false);
  const animationContainerRef = useRef(null);

  const [celebrationBadge, setCelebrationBadge] = useState(null);
  const [celebrationGift, setCelebrationGift] = useState(null); 
  const prevBadgeCountRef = useRef(0);
  const prevUnlockedGiftsRef = useRef(-1);

  const [authMode, setAuthMode] = useState('login'); 
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null); 
  const [profileData, setProfileData] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  
  const [quizState, setQuizState] = useState('intro'); 
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [quizLoading, setQuizLoading] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const [mathState, setMathState] = useState('intro');
  const [mathQuestions, setMathQuestions] = useState([]);
  const [mathCurrentQ, setMathCurrentQ] = useState(0);
  const [mathScore, setMathScore] = useState(0);
  const [mathLeaderboard, setMathLeaderboard] = useState([]);

  const [myOrders, setMyOrders] = useState([]);

  const [allStudents, setAllStudents] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]);
  const [allPartners, setAllPartners] = useState([]);
  const [partnerRequestsList, setPartnerRequestsList] = useState([]); 
  const [allGifts, setAllGifts] = useState([]); 
  const [winnerDate, setWinnerDate] = useState('');

  const [shopOrders, setShopOrders] = useState([]);
  const [shopWinners, setShopWinners] = useState([]);

  // 🔥 LIVE DRAW STATE 🔥
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinName, setSpinName] = useState("ނަސީބުވެރިޔާ ހޯދަނީ...");
  const [activeDrawGift, setActiveDrawGift] = useState(null);
  const [drawWinnerObj, setDrawWinnerObj] = useState(null);

  const routeUser = async (userObj) => {
      if (userObj.email === 'admin@lhohi.mv') {
          navigateTo('admin');
          loadAdminData();
      } else if (userObj.email === 'shop@lhohi.mv') {
          navigateTo('shop_admin');
          loadShopAdminData();
      } else {
          await fetchProfileDetails(userObj.id);
      }
  };

  useEffect(() => {
    fetchLatestWinner();
    fetchMonthlyWinners(); 
    fetchPartners(); 
    fetchLeaderboards(); 
    fetchGifts(); 

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) { setUser(session.user); routeUser(session.user); }
    });
    supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'PASSWORD_RECOVERY') { navigateTo('auth'); setAuthMode('update_password'); showToast('އައު ޕާސްވޯޑެއް ޖައްސަވާ!', 'success'); }
        if (event === 'SIGNED_IN' && session) { setUser(session.user); routeUser(session.user); }
    });
    setWinnerDate(getActiveQuizDate());
  }, []);

  const handleLogout = async () => {
      await supabase.auth.signOut();
      setUser(null);
      setProfileData(null);
      navigateTo('home');
      window.location.reload(); 
  };

  useEffect(() => {
      if (profileData && allGifts.length > 0) {
          const currentCoins = profileData.total_coins || 0;
          const unlockedGifts = allGifts.filter(g => currentCoins >= g.cost);
          
          if (prevUnlockedGiftsRef.current === -1) {
              prevUnlockedGiftsRef.current = unlockedGifts.length;
          } else if (unlockedGifts.length > prevUnlockedGiftsRef.current) {
              const newlyUnlocked = unlockedGifts.sort((a,b) => b.cost - a.cost)[0];
              setCelebrationGift(newlyUnlocked);
              prevUnlockedGiftsRef.current = unlockedGifts.length;
          } else {
              prevUnlockedGiftsRef.current = unlockedGifts.length;
          }
      }
  }, [profileData?.total_coins, allGifts]);

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

  const handleShareWinner = async () => {
    if (!dailyWinner) return;
    const shareText = `🎉 ޅޮހިނޫރުގެ މިއަދުގެ ނަސީބުވެރިޔާ: ${dailyWinner.username}!\n🎁 ލިބުނު އިނާމު: ${dailyWinner.prize}\n\nމިހާރު ލޮގިން ކުރައްވައިގެން ކުއިޒް ކުޅުއްވާ:`;
    const shareUrl = 'https://lhohinoor.com';
    if (navigator.share) {
        try { await navigator.share({ title: 'ޅޮހިނޫރު މިއަދުގެ ނަސީބުވެރިޔާ', text: shareText, url: shareUrl }); } catch (err) { console.log('ޝެއަރ ކެންސަލް ކުރެވިއްޖެ'); }
    } else {
        navigator.clipboard.writeText(`${shareText}\n${shareUrl}`); alert('މެސެޖާއި ލިންކް ކޮޕީ ކުރެވިއްޖެ! ޕޭސްޓް ކުރައްވާ.');
    }
  };

  const fetchLatestWinner = async () => {
    const { data } = await supabase.from('lhohinoor_daily_winners')
        .select('*')
        .order('won_at', { ascending: false }) 
        .limit(20); 
    
    if (data && data.length > 0) {
        const daily = data.find(w => w.prize && !String(w.prize).includes('ގުރުއަތުން'));
        if (daily) {
            setDailyWinner(daily);
            setHasCongratulated(false);
        }
    }
  };

  const fetchMonthlyWinners = async () => {
      const { data } = await supabase.from('lhohinoor_daily_winners')
          .select('*')
          .order('won_at', { ascending: false })
          .limit(30);
          
      if (data && data.length > 0) { 
          const monthly = data.filter(w => w.prize && String(w.prize).includes('ގުރުއަތުން')).slice(0, 6);
          setMonthlyWinners(monthly); 
      }
  };

  const fetchProfileDetails = async (userId) => {
    const { data } = await supabase.from('lhohinoor_students').select('*').eq('id', userId).maybeSingle();
    
    if (data) {
        const isMissing = !data.id_card || data.id_card === '' || !data.parent_phone || data.parent_phone === '' || !data.parent_address || data.parent_address === '' || !data.grade || data.grade === '';
        
        let calculatedCoins = 0; // Lifetime Coins for Badges
        let totalGeneralScore = 0;
        let totalMathScore = 0;
        let spentCoins = 0; // Coins spent in shop on tickets
        let certCount = 0;

        const activeDate = getActiveQuizDate();

        const { data: genAttempts } = await supabase.from('lhohinoor_quiz_attempts').select('score, created_at').eq('user_id', userId);
        if (genAttempts) {
            totalGeneralScore = genAttempts.reduce((sum, a) => sum + (parseInt(a.score, 10) || 0), 0);
            const passedGeneral = genAttempts.filter(a => parseInt(a.score, 10) >= 4).length;
            calculatedCoins += (passedGeneral * 5);
        }

        const { data: mathAttempts } = await supabase.from('lhohinoor_math_attempts').select('score, created_at').eq('user_id', userId);
        if (mathAttempts) {
            totalMathScore = mathAttempts.reduce((sum, a) => sum + (parseInt(a.score, 10) || 0), 0);
            const passedMath = mathAttempts.filter(a => parseInt(a.score, 10) >= 3).length; 
            calculatedCoins += (passedMath * 5);
        }

        const todayGenCount = genAttempts ? genAttempts.filter(a => a.created_at === activeDate).length : 0;
        const todayMathCount = mathAttempts ? mathAttempts.filter(a => a.created_at === activeDate).length : 0;

        const { data: purchaseData } = await supabase.from('lhohinoor_purchases').select('*').eq('user_id', userId);
        if (purchaseData) {
            spentCoins = purchaseData.reduce((sum, p) => sum + (parseInt(p.cost, 10) || 0), 0);
            setMyOrders(purchaseData.sort((a,b) => new Date(b.created_at) - new Date(a.created_at)));
        }
        
        if (data.level && String(data.level).trim() !== '' && data.level !== 'N/A') {
            calculatedCoins += 100;
            certCount = 1; 
        }

        const currentBalance = calculatedCoins - spentCoins; // Spendable Shop Coins

        const unlockedBadgesCount = BADGE_CONFIG.filter(b => calculatedCoins >= b.cost).length;
        if (prevBadgeCountRef.current > 0 && unlockedBadgesCount > prevBadgeCountRef.current) {
            setCelebrationBadge(BADGE_CONFIG[unlockedBadgesCount - 1]);
        }
        prevBadgeCountRef.current = unlockedBadgesCount; 

        const enrichedData = { 
            ...data, 
            isMissing, 
            total_coins: currentBalance, // Coins left for buying tickets
            lifetime_coins: calculatedCoins, // Coins earned overall
            quiz_total_score: totalGeneralScore,
            math_total_score: totalMathScore,
            quiz_attempts_today: todayGenCount,
            math_attempts_today: todayMathCount,
            unlocked_badges: unlockedBadgesCount, 
            total_certificates: certCount 
        };
        
        setProfileData(enrichedData);
        
        if (isMissing) { navigateTo('profile_setup'); } 
        else if (view !== 'quiz' && view !== 'math_quiz') { navigateTo('dashboard'); }
    } else {
        setProfileData({ student_name: "", id_card: "", parent_phone: "", parent_address: "", grade: "", isMissing: true });
        navigateTo('profile_setup');
    }
  };

  const fetchPartners = async () => { const { data } = await supabase.from('lhohinoor_partners').select('*'); if (data) setAllPartners(data); };
  
  const fetchGifts = async () => {
      const { data } = await supabase.from('lhohinoor_gifts').select('*').order('cost', { ascending: true });
      if (data) setAllGifts(data);
  };

  const fetchLeaderboards = async () => {
      const activeDate = getActiveQuizDate();
      const { data: genData } = await supabase.from('lhohinoor_quiz_attempts').select('username, score').eq('created_at', activeDate).order('score', { ascending: false }).limit(10);
      setLeaderboard(genData || []);

      const { data: mData } = await supabase.from('lhohinoor_math_attempts').select('username, score').eq('created_at', activeDate).order('score', { ascending: false }).limit(10);
      setMathLeaderboard(mData || []);
  };

  const loadAdminData = async () => {
    setLoading(true);
    const { data: s } = await supabase.from('lhohinoor_students').select('*').order('student_name', { ascending: true });
    setAllStudents(s || []);
    const { data: q } = await supabase.from('lhohinoor_questions').select('*').order('quiz_date', { ascending: false });
    setAllQuestions(q || []);
    fetchPartners();
    fetchGifts();
    const { data: r } = await supabase.from('lhohinoor_partner_requests').select('*');
    setPartnerRequestsList(r || []);
    setLoading(false);
  };

  const loadShopAdminData = async () => {
    setLoading(true);
    const { data: o } = await supabase.from('lhohinoor_purchases').select('*').order('created_at', { ascending: false });
    setShopOrders(o || []);
    const { data: w } = await supabase.from('lhohinoor_daily_winners').select('*').order('won_at', { ascending: false });
    setShopWinners(w || []);
    setLoading(false);
  };

  const handleAuth = async (e) => {
    e.preventDefault(); setLoading(true); 
    try {
      const d = Object.fromEntries(new FormData(e.target));

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
          else loginEmail = loginEmail.toLowerCase(); 
          
          const { data, error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: d.password });
          if (error) { 
              showToast('އީމެއިލް/އައި.ޑީ ނުވަތަ ޕާސްވޯޑް ނުބައި.', 'error'); 
          } else { 
              setUser(data.user); 
              routeUser(data.user); 
          }
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

  const handlePurchase = async (gift) => {
      if (!user || !profileData) return;
      if (profileData.total_coins < gift.cost) {
          showToast('މި އިނާމުގެ ޓިކެޓް ގަތުމަށް ކޮއިން މަދު!', 'error');
          return;
      }
      
      if (window.confirm(`ޔަޤީންތޯ ${gift.name} ގެ ގުރުއަތު ޓިކެޓެއް ގަންނަން ބޭނުންވަނީ؟ (${gift.cost} ކޮއިން ކެނޑޭނެ)`)) {
          setLoading(true);
          const { error } = await supabase.from('lhohinoor_purchases').insert([{
              user_id: user.id,
              phone: profileData.parent_phone,
              student_name: profileData.student_name,
              item_id: gift.id,
              item_name: gift.name,
              cost: gift.cost,
              status: 'Ticket'
          }]);

          if (error) { showToast('މައްސަލައެއް ދިމާވެއްޖެ: ' + error.message, 'error'); } else {
              showToast('🎉 ޓިކެޓް ގަނެވިއްޖެ! ބޮޑު ގުރުއަތުގައި ބައިވެރިވެވިއްޖެ.', 'success');
              await fetchProfileDetails(user.id); 
          }
          setLoading(false);
      }
  };

  const handlePartnerForm = async (e) => {
      e.preventDefault(); setLoading(true);
      const d = Object.fromEntries(new FormData(e.target));
      const safePayload = { business_name: d.business_name, contact_name: d.contact_name, phone: d.phone };
      const { error } = await supabase.from('lhohinoor_partner_requests').insert([safePayload]);
      if (error) { showToast('މައްސަލައެއް ދިމާވެއްޖެ: ' + error.message, 'error'); } else { showToast('ފޯމު ފޮނުވިއްޖެ! ވަރަށް އަވަހަށް ގުޅާނަން.', 'success'); navigateTo('home'); }
      setLoading(false);
  };

  // 🔥 NEW FAIR TICKET-BASED LIVE DRAW EXECUTOR 🔥
  const executeLiveDraw = async (gift) => {
      // Find all tickets bought specifically for THIS gift
      const { data: ticketBuyers } = await supabase.from('lhohinoor_purchases')
                                        .select('user_id, student_name, phone')
                                        .eq('item_id', gift.id);

      if (!ticketBuyers || ticketBuyers.length === 0) {
          setActiveDrawGift(gift);
          setSpinName("ޓިކެޓް ގަތް ކުއްޖަކު ނެތް! 😔");
          setIsSpinning(false);
          setDrawWinnerObj(null);
          showToast(`މި އިނާމުގެ ގުރުއަތުގައި ބައިވެރިވި ކުއްޖަކު ނެތް.`, "error");
          return;
      }

      setActiveDrawGift(gift);
      setIsSpinning(true);
      setDrawWinnerObj(null);

      let counter = 0;
      const spinInterval = setInterval(() => {
          // If a student bought 3 tickets, their name is in the array 3 times (higher chance!)
          setSpinName(ticketBuyers[Math.floor(Math.random() * ticketBuyers.length)].student_name);
          counter++;
          
          if (counter > 30) { 
              clearInterval(spinInterval);
              const finalWinner = ticketBuyers[Math.floor(Math.random() * ticketBuyers.length)];
              setSpinName(finalWinner.student_name);
              setDrawWinnerObj({ student_name: finalWinner.student_name, parent_phone: finalWinner.phone });
              setIsSpinning(false);
              
              supabase.from('lhohinoor_daily_winners').insert([{ 
                  username: finalWinner.student_name, 
                  phone: finalWinner.phone, 
                  score: 'Draw Winner', 
                  prize: `🎁 ގުރުއަތުން: ${gift.name}`, 
                  won_at: getActiveQuizDate(), 
                  congrats_count: 0, 
                  status: 'Pending' 
              }]).then(() => fetchMonthlyWinners());
          }
      }, 100);
  };

  const startQuiz = async () => {
    if (!user || !profileData || profileData.isMissing) { showToast("ކުޅުމަށް ފުރަތަމަ ލޮގިންކޮށް ޕްރޮފައިލް ފުރިހަމަކުރައްވާ!", "warning"); navigateTo('auth'); setAuthMode('login'); return; }
    setQuizLoading(true);
    
    if (profileData.quiz_attempts_today >= 2) { 
        showToast("މިއަދުގެ 2 ފުރުޞަތު ބޭނުންކޮށްފީމު! މާދަމާ އަލުން މަސައްކަތްކުރައްވާ.", "warning"); 
        setQuizLoading(false); 
        return; 
    }

    const activeDate = getActiveQuizDate(); 
    const { data, error } = await supabase.from('lhohinoor_questions').select('*').eq('quiz_date', activeDate);
    
    if (error) { showToast("System Error.", "error"); setQuizLoading(false); return; }
    
    if (data && data.length > 0) {
      const randomFive = data.sort(() => 0.5 - Math.random()).slice(0, 5);
      setQuestions(randomFive); setScore(0); setCurrentQ(0); setSelectedOption(null); setIsAnswered(false); setQuizState('playing'); navigateTo('quiz');
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
    const { error } = await supabase.from('lhohinoor_quiz_attempts').insert([{ user_id: user.id, username: profileData.student_name, address: profileData.parent_address || "N/A", phone: profileData.parent_phone, score: finalScore, created_at: activeDate }]);
    if (!error) { 
        await fetchLeaderboards();
        await fetchProfileDetails(user.id); 
        setQuizState('success'); 
    } else { showToast("މައްސަލައެއް ދިމާވެއްޖެ: " + error.message, "error"); }
    setQuizLoading(false);
  };

  const startMathQuiz = async () => {
      if (!user || !profileData || profileData.isMissing) { showToast("ކުޅުމަށް ފުރަތަމަ ލޮގިންކޮށް ޕްރޮފައިލް ފުރިހަމަކުރައްވާ!", "warning"); return; }
      setQuizLoading(true);
      
      if (profileData.math_attempts_today >= 5) { 
          showToast("މިއަދުގެ 5 ފުރުޞަތު ހަމަވެއްޖެ! މާދަމާ އަލުން މަސައްކަތްކުރައްވާ.", "warning"); 
          setQuizLoading(false); return; 
      }

      const { data: qData, error: qErr } = await supabase.from('lhohinoor_math_questions').select('*').eq('grade', profileData.grade);
      
      if (qErr) { showToast("Database Error. Tables not found.", "error"); setQuizLoading(false); return; }
      if (!qData || qData.length < 1) {
          showToast("މި ގްރޭޑަށް އަދި ސުވާލުތައް އަޕްލޯޑްކޮށްފައެއް ނުވޭ.", "warning");
          setQuizLoading(false); return;
      }

      const randomFive = qData.sort(() => 0.5 - Math.random()).slice(0, 5);
      setMathQuestions(randomFive); setMathScore(0); setMathCurrentQ(0); setSelectedOption(null); setIsAnswered(false); 
      setMathState('playing'); navigateTo('math_quiz');
      setQuizLoading(false);
  };

  const handleMathAnswer = (opt) => {
      if (isAnswered) return;
      setSelectedOption(opt); setIsAnswered(true);
      const isCorrect = opt === mathQuestions[mathCurrentQ].correct_option;
      if (isCorrect) setMathScore(mathScore + 1);

      setTimeout(() => {
          if (mathCurrentQ < mathQuestions.length - 1) {
              setMathCurrentQ(mathCurrentQ + 1); setSelectedOption(null); setIsAnswered(false);
          } else {
              const finalScore = isCorrect ? mathScore + 1 : mathScore;
              setMathScore(finalScore);
              setMathState('result');
              if (finalScore >= 3) {
                  setTimeout(() => autoSubmitMath(finalScore), 2500);
              } else {
                  autoSubmitMathBackground(finalScore); 
              }
          }
      }, 1000);
  };

  const autoSubmitMath = async (finalScore) => {
      const activeDate = getActiveQuizDate();
      await supabase.from('lhohinoor_math_attempts').insert([{ user_id: user.id, username: profileData.student_name, phone: profileData.parent_phone, score: finalScore, created_at: activeDate }]);
      await fetchLeaderboards();
      await fetchProfileDetails(user.id); 
      setMathState('success');
  };

  const autoSubmitMathBackground = async (finalScore) => {
      const activeDate = getActiveQuizDate();
      await supabase.from('lhohinoor_math_attempts').insert([{ user_id: user.id, username: profileData.student_name, phone: profileData.parent_phone, score: finalScore, created_at: activeDate }]);
      await fetchLeaderboards();
      await fetchProfileDetails(user.id); 
  };

  const getButtonColor = (opt, questionsArray, currentIndex) => {
    if (!isAnswered || !questionsArray[currentIndex]) return 'white';
    if (opt === questionsArray[currentIndex].correct_option) return '#d4edda';
    if (opt === selectedOption) return '#f8d7da'; return 'white';
  };

  const resetQuiz = () => { setQuizState('intro'); setScore(0); setCurrentQ(0); setSelectedOption(null); setIsAnswered(false); setQuestions([]); };
  const resetMath = () => { setMathState('intro'); setMathScore(0); setMathCurrentQ(0); setSelectedOption(null); setIsAnswered(false); setMathQuestions([]); };

  const isEnrolledInQuran = !!(profileData && (
      (profileData.level && String(profileData.level).trim() !== '' && profileData.level !== 'N/A') || 
      (profileData.category && String(profileData.category).trim() !== '' && profileData.category !== 'N/A') || 
      (profileData.recitation && String(profileData.recitation).trim() !== '' && profileData.recitation !== 'N/A') ||
      (profileData.marks && String(profileData.marks).trim() !== '')
  ));

  return (
    <div style={styles.appContainer}>
      <style>
        {`
        @font-face { 
            font-family: 'Faruma'; 
            src: local('Faruma'), url('/faruma.ttf') format('truetype'), url('/Faruma.ttf') format('truetype'); 
            font-display: swap; 
        }
        body, html, #root, div, span, h1, h2, h3, h4, p, a, button, input, select, textarea, table, th, td {
            font-family: 'Faruma', Arial, sans-serif !important;
        }
        .ltr-text, .ltr-text * { font-family: Arial, sans-serif !important; }

        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes popIn { 0% { transform: scale(0.5); opacity: 0; } 80% { transform: scale(1.1); opacity: 1; } 100% { transform: scale(1); } }
        @keyframes slideDown { 0% { transform: translate(-50%, -100%); opacity: 0; } 100% { transform: translate(-50%, 0); opacity: 1; } }
        @keyframes spinSlow { 100% { transform: rotate(360deg); } }
        @keyframes badgePop { 0% { transform: scale(0); opacity: 0; } 50% { transform: scale(1.2); opacity: 1; } 100% { transform: scale(1); } }
        @keyframes pulseText { 0% { transform: scale(1); } 50% { transform: scale(1.05); color: #d32f2f; } 100% { transform: scale(1); } }
        
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

        .celebration-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.9); z-index: 9999; display: flex; justify-content: center; align-items: center; overflow: hidden; flex-direction: column; }
        .rays-bg { position: absolute; width: 200%; height: 200%; top: -50%; left: -50%; background: repeating-conic-gradient(from 0deg, rgba(255, 215, 0, 0.15) 0deg 15deg, transparent 15deg 30deg); animation: spinSlow 20s linear infinite; z-index: -1; }
        .badge-showcase { background: white; padding: 40px; border-radius: 20px; text-align: center; box-shadow: 0 0 50px rgba(255, 215, 0, 0.5); animation: badgePop 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; position: relative; max-width: 300px; }

        .brand-logo { font-size: 32px; font-weight: 900; color: #0056b3; }
        .brand-logo span { color: #fbc02d; }

        .animate-card { animation: fadeInUp 0.8s ease-out; }
        .winner-card { background: linear-gradient(135deg, #fff3e0 0%, #ffffff 100%); border: 2px solid #ffd700; border-radius: 15px; padding: 20px; text-align: center; box-shadow: 0 10px 25px rgba(255, 215, 0, 0.3); margin-bottom: 20px; position: relative; animation: popIn 0.6s ease-out; max-width: 400px; margin-left: auto; margin-right: auto; overflow: hidden; }
        .close-btn { position: absolute; top: 10px; right: 10px; background: #ff5252; color: white; border: none; border-radius: 50%; width: 28px; height: 28px; cursor: pointer; font-size: 14px; line-height: 28px; text-align: center; padding: 0; z-index: 10; }
        .celebration-banner { font-size: 20px; color: #d84315; font-weight: bold; margin-bottom: 10px; }
        
        .dash-topbar { display: flex; justify-content: space-around; background: linear-gradient(90deg, #0056b3, #007bff); color: white; padding: 15px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 4px 10px rgba(0,86,179,0.3); }
        .dash-stat { text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.2s; }
        .dash-stat:hover { transform: translateY(-3px); }
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

        .gift-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 15px; margin-top: 15px; }
        .gift-card { background: white; border: 2px solid #fff3e0; border-radius: 15px; padding: 12px; text-align: center; display: flex; flex-direction: column; align-items: center; transition: transform 0.2s; box-shadow: 0 4px 10px rgba(0,0,0,0.04); }
        .gift-card:hover { transform: translateY(-4px); box-shadow: 0 8px 20px rgba(255,152,0,0.15); border-color: #ffb74d; }
        .gift-image-container { width: 100%; aspect-ratio: 1 / 1; border-radius: 10px; overflow: hidden; margin-bottom: 12px; background: #fafafa; display: flex; align-items: center; justify-content: center; }
        .gift-image-container img { width: 100%; height: 100%; object-fit: contain; padding: 10px; box-sizing: border-box; }

        .official-slip-table td { padding: 10px 0; border-bottom: 1px dashed #eee; }
        .official-slip-table tr:last-child td { border-bottom: none; }
        .slip-label { color: #555; width: 40%; font-size: 14px; }
        .slip-value { font-weight: bold; color: #000; font-size: 15px; }
        
        .leaderboard-row { display: flex; justify-content: space-between; padding: 10px; border-bottom: 1px solid #eee; font-size: 15px; }
        .leaderboard-row:nth-child(1) { color: #d4af37; font-weight: bold; font-size: 18px; }
        .leaderboard-row:nth-child(2) { color: #a9a9a9; font-weight: bold; font-size: 16px; }
        .leaderboard-row:nth-child(3) { color: #cd7f32; font-weight: bold; font-size: 16px; }

        .main-navbar { background: rgba(255, 255, 255, 0.98); backdrop-filter: blur(10px); position: sticky; top: 0; z-index: 1000; padding: 12px 3%; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border-bottom: 2px solid #f0f4f8; }
        .nav-links { display: flex; gap: 5px; align-items: center; flex-wrap: nowrap; justify-content: flex-end; }
        .nav-item { color: #555; font-weight: bold; cursor: pointer; transition: 0.2s; font-size: 13px; padding: 6px 8px; border-radius: 8px; user-select: none; white-space: nowrap; }
        .nav-item:hover { background: #f0f4f8; color: #0056b3; }
        .nav-btn-primary { background: linear-gradient(135deg, #0056b3, #007bff); color: white; border: none; padding: 6px 12px; border-radius: 20px; cursor: pointer; font-weight: bold; font-size: 13px; transition: transform 0.2s ease, box-shadow 0.2s ease; box-shadow: 0 4px 10px rgba(0,86,179,0.2); white-space: nowrap; }
        .nav-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 15px rgba(0,86,179,0.3); }
        .nav-btn-danger { background: #ffebee; color: #d32f2f; border: none; padding: 8px 15px; border-radius: 25px; cursor: pointer; font-weight: bold; font-size: 13px; transition: 0.2s ease; white-space: nowrap; }
        .nav-btn-danger:hover { background: #ffcdd2; }

        @keyframes scrollMarquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
        .marquee-wrapper { width: 100%; overflow: hidden; background: #e3f2fd; padding: 8px 0; border-radius: 5px; margin-bottom: 10px; position: relative; white-space: nowrap; display: flex; align-items: center; }
        .marquee-content { display: inline-block; padding-left: 100%; animation: scrollMarquee 15s linear infinite; color: #0056b3; font-size: 14px; font-weight: bold; }
        
       .live-draw-container { text-align: center; color: white; padding: 20px; box-sizing: border-box; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; background: radial-gradient(circle, #0056b3 0%, #001f3f 100%); width: 100vw; position: fixed; top: 0; left: 0; z-index: 10000; overflow-y: auto; overflow-x: hidden; }
        .spinner-box { background: white; color: #333; padding: 25px 15px; border-radius: 20px; box-shadow: 0 20px 50px rgba(0,0,0,0.5); width: 95%; max-width: 600px; z-index: 2; position: relative; box-sizing: border-box; margin: auto; }
        .spin-name { font-size: clamp(26px, 7vw, 60px); font-weight: bold; margin: 20px 0; color: #d32f2f; line-height: 1.3; word-break: break-word; padding: 0 10px; }
        .spin-name.spinning { animation: pulseText 0.2s infinite; color: #555; }
        .live-gift-img { width: clamp(100px, 30vw, 150px); height: clamp(100px, 30vw, 150px); object-fit: contain; margin-bottom: 15px; border-bottom: 3px solid #eee; padding-bottom: 15px; }
        .cert-container { background: #fff9e6; padding: 30px; border: 15px solid #d4af37; border-radius: 5px; text-align: center; position: relative; box-shadow: 0 10px 30px rgba(0,0,0,0.1); margin-top: 20px; }
        .cert-inner { border: 2px dashed #b8860b; padding: 30px; }
        .cert-title { color: #8b6508; font-size: 36px; font-weight: bold; margin-bottom: 10px; border-bottom: 2px solid #8b6508; display: inline-block; padding-bottom: 10px; }
        .cert-name { font-size: 28px; color: #d32f2f; margin: 20px 0; font-weight: bold; }
        .cert-body { font-size: 18px; color: #333; line-height: 1.8; }
        .cert-bonus { background: #d4edda; color: #155724; padding: 10px 20px; border-radius: 20px; display: inline-block; font-weight: bold; margin-top: 20px; border: 2px solid #c3e6cb; }
        `}
      </style>
      
      {appMessage.show && (
          <div className={`app-toast ${appMessage.type}`}>
              <span>{appMessage.type === 'error' ? '⚠️' : appMessage.type === 'warning' ? '🛑' : '✅'}</span>
              <span style={{flex: 1}}>{appMessage.text}</span>
          </div>
      )}

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

      {celebrationGift && (
          <div className="celebration-overlay" onClick={() => setCelebrationGift(null)}>
              <div className="rays-bg"></div>
              <div className="badge-showcase" onClick={e => e.stopPropagation()}>
                  <h2 style={{color: '#ff9800', margin: '0 0 10px 0'}}>🎉 އައު އިނާމެއް!</h2>
                  <p style={{color: '#555', fontSize: '14px', margin: '0 0 20px 0'}}>ކޮއިން ހަމަވެއްޖެ، މިހާރު މި އިނާމުގެ ޓިކެޓް ގަނެވޭނެ!</p>
                  <div style={{width: '120px', height: '120px', margin: '20px auto', borderRadius: '15px', overflow: 'hidden', border: '3px solid #ff9800', boxShadow: '0 10px 20px rgba(255,152,0,0.3)'}}>
                      <img src={celebrationGift.image_url} alt={celebrationGift.name} loading="lazy" style={{width: '100%', height: '100%', objectFit: 'contain', padding: '10px'}} />
                  </div>
                  <h3 style={{color: '#333', margin: '0 0 5px 0'}}>{celebrationGift.name}</h3>
                  <button onClick={() => { setCelebrationGift(null); navigateTo('dashboard', 'gift_shop'); }} style={{...styles.btn, background: '#ff9800', color: 'white', marginTop: '20px'}}>ފިހާރައަށް ދޭ</button>
              </div>
          </div>
      )}

      {view === 'live_draw' && (
          <div className="live-draw-container">
              <div className="rays-bg" style={{opacity: 0.3}}></div>
              
              {!isSpinning && !drawWinnerObj && (
                  <>
                      <h1 style={{fontSize: '40px', color: '#ffd700', textShadow: '2px 2px 10px rgba(0,0,0,0.5)', marginBottom: '40px'}}>🎁 މަހުގެ ބޮޑު ގުރުއަތުލުން 🎁</h1>
                      
                      <div style={{display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '1000px'}}>
                          {allGifts.map(gift => (
                              <div key={gift.id} style={{background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '15px', border: '2px solid rgba(255,215,0,0.3)', width: '200px'}}>
                                  <img src={gift.image_url} alt={gift.name} style={{width: '100px', height: '100px', objectFit: 'contain', marginBottom: '15px', background: 'white', borderRadius: '50%', padding: '10px'}} />
                                  <h3 style={{margin: '0 0 15px 0'}}>{gift.name}</h3>
                                  <button onClick={() => executeLiveDraw(gift)} style={{...styles.btn, background: '#ff9800', fontSize: '16px'}}>ގުރުއަތު ނަގާ!</button>
                              </div>
                          ))}
                      </div>
                      
                      <button onClick={() => navigateTo('admin')} style={{...styles.btnSecondary, marginTop: '50px', background: 'transparent', border: '1px solid white', width: 'auto'}}>← އެޑްމިން ޕެނަލްއަށް</button>
                  </>
              )}

              {(isSpinning || drawWinnerObj || spinName.includes('ކުއްޖަކު ނެތް')) && (
                  <div className="spinner-box animate-card">
                      {activeDrawGift && <img src={activeDrawGift.image_url} alt="Gift" className="live-gift-img" />}
                      <h2 style={{color: '#0056b3', margin: 0}}>{activeDrawGift?.name}</h2>
                      <p style={{color: '#666', marginTop: '5px'}}>{spinName.includes('ކުއްޖަކު ނެތް') ? 'ނަތީޖާ:' : 'ނަސީބުވެރިޔާ:'}</p>
                      
                      <div className={`spin-name ${isSpinning ? 'spinning' : ''}`} style={{ fontSize: spinName.includes('ކުއްޖަކު ނެތް') ? '30px' : '60px' }}>
                          {spinName}
                      </div>

                      {!isSpinning && drawWinnerObj && (
                          <>
                              <p className="ltr-text" style={{fontSize: '20px', color: '#ff9800', fontWeight: 'bold'}}>{drawWinnerObj.parent_phone}</p>
                              <div style={{marginTop: '30px'}}>
                                  <button onClick={() => { setDrawWinnerObj(null); setActiveDrawGift(null); }} style={{...styles.btn, background: '#2e7d32', width: 'auto', padding: '10px 30px', fontSize: '18px'}}>✅ ކާމިޔާބު!</button>
                              </div>
                          </>
                      )}

                      {!isSpinning && !drawWinnerObj && spinName.includes('ކުއްޖަކު ނެތް') && (
                          <div style={{marginTop: '30px'}}>
                              <button onClick={() => { setActiveDrawGift(null); setSpinName("ނަސީބުވެރިޔާ ހޯދަނީ..."); }} style={{...styles.btnSecondary, background: '#666', width: 'auto', padding: '10px 30px', fontSize: '18px'}}>ފަހަތަށް</button>
                          </div>
                      )}
                  </div>
              )}
          </div>
      )}

      {view !== 'live_draw' && (
          <div className="main-navbar">
            <div className="brand-logo" style={{cursor: 'pointer', fontSize: '24px'}} onClick={() => navigateTo('home')}>
                ޅޮހި<span>ނޫރު</span>
            </div>
            <div className="nav-links">
               <span className="nav-item" onClick={() => navigateTo('home')}>ހޯމް</span>
               <span className="nav-item" onClick={handleGiftShopNavigation} style={{color: '#e65100'}}>އިނާމު</span>
               <span className="nav-item" onClick={() => navigateTo('info')}>މަޢުލޫމާތު</span>
               
               {user ? (
                   <>
                       {user.email === 'admin@lhohi.mv' ? (
                           <button onClick={() => navigateTo('admin')} className="nav-btn-primary">އެޑްމިން</button>
                       ) : user.email === 'shop@lhohi.mv' ? (
                           <button onClick={() => navigateTo('shop_admin')} className="nav-btn-primary" style={{background: '#ff9800'}}>ފިހާރަ</button>
                       ) : !profileData?.isMissing ? (
                           <button onClick={() => navigateTo('dashboard', 'overview')} className="nav-btn-primary">ޑޭޝްބޯޑު</button>
                       ) : null}
                   </>
               ) : (
                   <button onClick={() => { navigateTo('auth'); setAuthMode('login'); }} className="nav-btn-primary">ލޮގިން</button>
               )}
            </div>
          </div>
      )}

      {view === 'public_shop' && (
        <div style={styles.centeredContainer}>
            <div style={{...styles.card, background: '#fffde7', width: '100%', maxWidth: '900px'}} className="animate-card">
                <h2 style={{color: '#f57f17', textAlign: 'center', margin: '0 0 10px 0', fontSize: '28px'}}>🎁 އިނާމު ފިހާރަ</h2>
                <p style={{fontSize: '15px', color: '#555', textAlign: 'center', marginBottom: '20px'}}>ކުއިޒް ކުޅެގެން ކޮއިން ހޯއްދަވާ، އަދި ބޮޑު ގުރުއަތުގައި ބައިވެރިވެލައްވާ!</p>
                
                <div className="gift-grid">
                    {allGifts.map(gift => (
                        <div key={gift.id} className="gift-card">
                            <div className="gift-image-container">
                                <img src={gift.image_url} alt={gift.name} loading="lazy" decoding="async" />
                            </div>
                            <h4 style={{margin: '0 0 5px 0', fontSize: '15px', color: '#333', lineHeight: '1.3'}}>{gift.name}</h4>
                            <p className="ltr-text" style={{margin: '0 0 12px 0', fontSize: '14px', color: '#ff9800', fontWeight: 'bold'}}>{gift.cost} 🪙</p>
                            <button onClick={() => { navigateTo('auth'); setAuthMode('login'); }} style={{...styles.btn, background: '#fbc02d', color: '#333', padding: '8px', fontSize: '13px'}}>ލޮގިންވޭ</button>
                        </div>
                    ))}
                    {allGifts.length === 0 && <p style={{textAlign: 'center', width: '100%', color: '#888'}}>އަދި ފިހާރައަށް އިނާމެއް ނުލާ...</p>}
                </div>
            </div>
        </div>
      )}

      {view === 'partner_form' && (
          <div style={styles.centeredContainer}>
            <div style={styles.quranCard} className="animate-card">
                <h2 style={{color: '#2e7d32', marginTop: 0}}>ބައިވެރިއަކަށް ވެލައްވާ</h2>
                <p style={{fontSize: '14px', color: '#666', marginBottom: '20px'}}>ޅޮހިނޫރު ޕްރޮގްރާމްތަކަށް އެހީތެރިވުމަށް އެދޭނަމަ މި ފޯމު ފުރުއްވާ.</p>
                <form onSubmit={handlePartnerForm} style={styles.form}>
                    <input name="business_name" placeholder="ނަން / ކުންފުނި" style={styles.input} required />
                    <input name="contact_name" placeholder="ގުޅޭނެ ފަރާތް" style={styles.input} required />
                    <input name="phone" placeholder="ގުޅޭނެ ނަންބަރު" type="tel" maxLength="7" onChange={handlePhoneInput} style={styles.inputLtr} required />
                    <button type="submit" disabled={loading} style={styles.btn}>{loading ? 'ފޮނުވަނީ...' : 'ރިކުއެސްޓް ފޮނުވާ'}</button>
                    <button type="button" onClick={() => navigateTo('home')} style={styles.btnSecondary}>ފަހަތަށް</button>
                </form>
            </div>
          </div>
      )}

      {view === 'info' && (
        <div style={styles.centeredContainer}>
          <div style={styles.quizCard} className="animate-card">
              <h2 style={{textAlign:'center', color:'#2e7d32', marginBottom:'20px'}}>މުބާރާތުގެ މަޢުލޫމާތު</h2>
              
              <div className="info-section">
                  <div className="info-title">🎁 އިނާމުތައް</div>
                  <ul className="info-list">
                      <li>ކޮންމެ ދުވަހެއްގެ ނަސީބުވެރިޔާއަށް: <b>100 ރުފިޔާގެ ގިފްޓް ވައުޗަރެއް</b>.</li>
                      <li>ފިތުރު ޢީދު ދުވަހު ގުރުއަތުން ހޮވޭ ފަރާތަކަށް: <b>ބޮޑު އިނާމު</b>!</li>
                  </ul>
              </div>

              <div className="info-section" style={{borderRightColor: '#fbc02d'}}>
                  <div className="info-title" style={{color: '#d84315'}}>📜 ޤަވާއިދުތައް</div>
                  <ul className="info-list">
                      <li>ކޮންމެ ދުވަހަކުވެސް 5 ސުވާލު ހިމެނޭ ކުއިޒެއް ކުރިއަށްދާނެއެވެ.</li>
                      <li>ގުރުއަތުގައި ބައިވެރިވެވޭނީ ކުއިޒުން <b>%80 އިން މަތި</b> ހޯދާ ފަރާތްތަކަށެވެ.</li>
                      <li>އެއް ފޯނު ނަންބަރަކުން ދުވާލަކު ބައިވެރިވެވޭނީ އެންމެ ފަހަރަކުއެވެ.</li>
                      <li>ފޯނު ނަންބަރު ވާންވާނީ ޞައްޙަ، ރާއްޖޭގެ ނަންބަރަކަށެވެ .</li>
                    <li>މިއަދުގެ ސުވާލަށް މާދަމާ ނަސީބު ވެރިޔާ ހޮވަންދެން ޖަވާބު ދެވިދާނެއެވެ .</li>
                    <li>އާ ސުވާލުތައް ފެންނާނީ ކޮންމެ ދުވަހެއްގެ  ހެދދުނު 9:30 ގެ ފަހުންނެވެ..</li>
                    <li>މި ކުއިޒްގައި  އިނާމު ލިބޭނީ ޅޮހީގެ ރައްޔިތުންނާއި ޅޮހީގަ ދިރިއުޅޭ މިޙުންނަށެވެ. ރާއްޖޭގެ ކޮންމެ މީހަކަށްވެސް ކުއިޒްގައި ބައިވެރި ވެވޭނެއެވެ .</li>
                    <li>ކޮންމެ ދުވަހެއްގެ ނަސީބުވެރިޔާ މިސައިޓުން ފެނިލައްވާނެއެވެ .</li>
                    <li>ވީހާވެސް ގިނައިން ކީރިތި ޤްރުއާން ކިޔެވުމަށް ނަސޭޙަތްތެރިވަމެވެ. ސުވާލުތައް އަންނާނީ ދުވާލަކު ފޮތަކުން(ޖުޒުއު) ނެވެ .</li>
                    <li>  ހިތަށް ފިތާލައްވައި ، ނަސީބުވެރިޔާއަށް މަރުޙަބާ ކިޔާލުން ކިހާ ރަނގަޅު!   .</li> 
                  </ul>
              </div>

              <button onClick={() => navigateTo('home')} style={{...styles.btnSecondary, marginTop: '10px'}}>ހޯމް އަށް</button>
          </div>
        </div>
      )}

      {/* HOME */}
      {view === 'home' && (
        <div style={styles.centeredGrid}>
          
          {dailyWinner && showWinnerCard ? (
            <div className="winner-card" ref={animationContainerRef}>
              <button className="close-btn" onClick={() => setShowWinnerCard(false)}>✕</button>
              <div className="celebration-banner">🎉 މަރުޙަބާ 🎉</div>
              <h3 style={{margin:'5px 0', fontSize:'16px'}}>މިއަދުގެ ނަސީބުވެރިޔާ</h3>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', margin: '10px 0' }}>
                  <h2 style={{color:'#2e7d32', margin: 0, fontSize: '24px'}}>{dailyWinner.username}</h2>
                  <div 
                      className={`heart-badge ${hasCongratulated ? 'clicked' : ''}`} 
                      onClick={handleCongratulate}
                      title="Congratulate!"
                  >
                      ❤️ <span className="heart-count-number">{dailyWinner.congrats_count || 0}</span>
                  </div>
              </div>
              
              <p style={{fontSize:'14px', margin:'10px 0', fontWeight: 'bold'}}>{dailyWinner.prize}</p>
              
              <button 
                  onClick={handleShareWinner} 
                  style={{...styles.btn, background: 'linear-gradient(135deg, #1976d2, #0056b3)', padding: '8px 15px', borderRadius: '25px', width: 'auto', display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13px', marginTop: '10px'}}
              >
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                  ޝެއަރ ކުރައްވާ
              </button>

              <p style={{fontSize:'12px', color:'#777', marginTop:'15px', borderTop:'1px dashed #eee', paddingTop:'10px'}}>އިނާމު ނެގުމަށް އޮފީހަށް ވަޑައިގަންނަވާ!</p>
            </div>
          ) : null}

          {monthlyWinners && monthlyWinners.length > 0 && (
              <div style={{background: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', marginBottom: '20px', textAlign: 'center'}}>
                  <h3 style={{color: '#ff9800', margin: '0 0 15px 0'}}>🏆 ގުރުއަތުގެ ނަސީބުވެރިން 🏆</h3>
                  <div style={{display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '10px'}}>
                      {monthlyWinners.map(mw => (
                          <div key={mw.id} style={{minWidth: '150px', background: '#fffde7', padding: '15px', borderRadius: '10px', border: '1px solid #ffe082'}}>
                              <p style={{margin: '0 0 5px 0', fontWeight: 'bold', color: '#333'}}>{mw.username}</p>
                              <p style={{margin: 0, fontSize: '12px', color: '#d84315'}}>{mw.prize}</p>
                          </div>
                      ))}
                  </div>
              </div>
          )}
          
          <div style={styles.grid}>
            <div style={styles.card} className="animate-card">
                <img src="https://ygexyftugtqcklnrlrgf.supabase.co/storage/v1/object/public/lhohinoor%20_images/1689479593355.png" alt="Quiz" style={styles.cardImg} loading="lazy" />
                
                <div className="marquee-wrapper">
                    <div className="marquee-content">
                         ޅޮހިނޫރު ޤްރުއާން މުބާރާތް ކުރިއަށް ދާނީ މާރޗް 7 އަދި 8 ގައެވެ. 
                    </div>
                </div>

                <h3>❓ ކޮންމެ ދުވަހަކު 5 ސުވާލު</h3>
                <p>ބޭނުންވަރަކަށް ފަރިތަކުރައްވާ. ޖަވާބު ފޮނުވޭނީ އެއްފަހަރު.</p>
                <button style={styles.btn} onClick={() => { resetQuiz(); navigateTo('quiz'); }}>ފަށަމާ</button>
            </div>
            
            <div style={styles.card} className="animate-card">
                <img src="https://i.pinimg.com/736x/cd/5b/17/cd5b1758007ccefc5122105d2b8e658e.jpg" alt="Quran" style={styles.cardImg} loading="lazy" />
                <h3>📖 ޤުރުއާން މުބާރާތް</h3>
                <p>ރަޖިސްޓްރޭޝަން އަދި ނަތީޖާ</p>
                <button style={styles.btn} onClick={() => { user && !profileData?.isMissing ? (() => {navigateTo('dashboard', 'programs');})() : (() => { navigateTo('auth'); setAuthMode('login'); })(); }}>ލޮގިން / ސްޓޫޑެންޓް ހަބް</button>
            </div>
          </div>
          
          <div style={styles.partnerSection} className="animate-card">
              <h3 style={{color:'#2e7d32'}}> ބައިވެރިން</h3>
              <div style={styles.sponsorGrid}>{allPartners.length > 0 ? allPartners.map(p => (<div key={p.id} style={{textAlign:'center'}}>{p.logo_url ? <img src={p.logo_url} style={styles.sponsorImg} alt={p.name} loading="lazy"/> : <span style={{fontWeight:'bold', color:'#555'}}>{p.name}</span>}</div>)) : <p>ބައިވެރިންގެ މަޢުލޫމާތު ލޯޑުކުރަނީ...</p>}</div>
              <p onClick={() => navigateTo('partner_form')} style={styles.simpleLink}>ބައިވެރިއަކަށް ވެލައްވާ</p>
              
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
            <button onClick={() => navigateTo('home')} style={{...styles.btnSecondary, marginTop:10}}>ކެންސަލް</button>
          </div>
        </div>
      )}

      {view === 'profile_setup' && profileData && (
          <div style={styles.centeredContainer}>
              <div style={styles.quranCard} className="animate-card">
                  
                  <BrandLogo />

                  <h2 style={{color: '#d32f2f', textAlign: 'center', marginTop: 0}}>މަރުޙަބާ! ޕްރޮފައިލް ފުރިހަމަކުރައްވާ</h2>
                  
                  <div style={{background: '#fff3cd', padding: '12px', borderRadius: '8px', marginBottom: '15px', border: '1px solid #ffeeba', textAlign: 'center', color: '#856404', lineHeight: '1.4'}}>
                      <span style={{fontSize: '12px'}}>ތިޔަ ލޮގިންވެފައިވަނީ:</span><br/>
                      <b className="ltr-text" style={{fontSize: '14px', color: '#0056b3'}}>{user?.email}</b><br/>
                      <span style={{fontSize: '11px'}}>(ކުރިން ބޭނުންކުރެއްވި އައި.ޑީ ނުވަތަ އީމެއިލް ނޫންނަމަ، ތިރީގައިވާ ލޮގްއައުޓް އަށް ފިތާލައްވާ)</span>
                  </div>
                  
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
                        
                        <button type="button" onClick={handleLogout} style={{...styles.btnSecondary, background: '#f44336'}}>އެހެން އެކައުންޓަކުން ވަނުމަށް (ލޮގްއައުޓް)</button>
                  </form>
              </div>
          </div>
      )}

      {/* 🚀 NEW GAMIFIED STUDENT HUB (DASHBOARD) 🚀 */}
      {view === 'dashboard' && profileData && (
        <div style={styles.centeredGrid}>
            
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px'}}>
                <div style={{textAlign: 'right'}}>
                    <h2 style={{color: '#333', margin: '0 0 5px 0'}}>ސްޓޫޑެންޓް ހަބް</h2>
                    <div style={{fontSize: '14px', color: '#666', display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <span>މަރުޙަބާ, <b style={{color: '#0056b3'}}>{profileData.student_name.split(' ')[0]}</b></span>
                        <span style={{color: '#ccc'}}>|</span>
                        <span className="ltr-text" style={{color: '#ff9800', fontWeight: 'bold'}}>🪙 {profileData.total_coins || 0}</span>
                    </div>
                </div>
                <button onClick={handleLogout} className="nav-btn-danger" style={{padding: '8px 15px', marginTop: '5px'}}>ލޮގްއައުޓް</button>
            </div>

            {/* GAMIFICATION TOP BAR */}
            <div className="dash-topbar animate-card">
                <div className="dash-stat">
                    <svg width="24" height="24" fill="none" stroke="#FFD700" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v8m-3-4h6"/></svg>
                    <h3 className="ltr-text">{profileData.total_coins || 0}</h3>
                    <p>ކޮއިން</p>
                </div>
                <div className="dash-stat" style={{borderLeft: '1px solid rgba(255,255,255,0.3)', borderRight: '1px solid rgba(255,255,255,0.3)', padding: '0 20px'}}>
                    <svg width="24" height="24" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15l-3 3-1-4-4-1 3-3-1-4 4 1 3-3 3 3 4-1-1 4 3 3-4 1-1 4-3-3z"/></svg>
                    <h3 className="ltr-text">{profileData.unlocked_badges || 0}</h3>
                    <p>ބެޖް</p>
                </div>
                <div className="dash-stat" onClick={() => navigateTo('dashboard', 'certificates')} style={{cursor: 'pointer'}} title="ސެޓްފިކެޓް ބައްލަވާ">
                    <svg width="24" height="24" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                    <h3 className="ltr-text">{profileData.total_certificates || 0}</h3>
                    <p>ސެޓްފިކެޓް (ބައްލަވާ)</p>
                </div>
            </div>

            {/* SUB-ROUTER VIEWS */}
            {dashView === 'overview' && (
                <div className="dash-menu-grid animate-card">
                    
                    {isEnrolledInQuran && (
                        <div className="dash-menu-btn" onClick={() => navigateTo('dashboard', 'quran_slip')} style={{background: 'linear-gradient(135deg, #FFD700, #FBC02D)', borderColor: '#F57F17'}}>
                            <div className="dash-icon" style={{background: 'white', color: '#F57F17'}}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            </div>
                            <div>
                                <p className="dash-menu-title" style={{color: '#333'}}>މަގޭ ޤުރުއާން ސްލިޕް (VIP)</p>
                                <p className="dash-menu-sub" style={{color: '#555', fontWeight: 'bold'}}>މުބާރާތުގެ މަޢުލޫމާތާއި މާކްސް</p>
                            </div>
                        </div>
                    )}

                    <div className="dash-menu-btn" onClick={() => navigateTo('dashboard', 'profile')}>
                        <div className="dash-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        </div>
                        <div><p className="dash-menu-title">މަގޭ ޕްރޮފައިލް</p><p className="dash-menu-sub">މަޢުލޫމާތު ބަދަލުކުރުމަށް</p></div>
                    </div>
                    
                    <div className="dash-menu-btn" onClick={() => { fetchLeaderboards(); navigateTo('dashboard', 'progress'); }}>
                        <div className="dash-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                        </div>
                        <div><p className="dash-menu-title">މަގޭ ނަތީޖާ އާއި ކާމިޔާބީ</p><p className="dash-menu-sub">ލީޑަރބޯޑް، ބެޖް އަދި ސެޓްފިކެޓް</p></div>
                    </div>

                    <div className="dash-menu-btn" onClick={() => navigateTo('dashboard', 'programs')}>
                        <div className="dash-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                        </div>
                        <div><p className="dash-menu-title">ކްލާސްތަކާއި މުބާރާތްތައް</p><p className="dash-menu-sub">ކުއިޒް، ޤުރުއާން، އަދި ސުވާލު ކީސާ</p></div>
                    </div>
                    
                    <div className="dash-menu-btn" onClick={() => navigateTo('dashboard', 'gift_shop')} style={{borderColor: '#ff9800'}}>
                        <div className="dash-icon" style={{color: '#ff9800', background: '#fff3e0'}}>
                            <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"/></svg>
                        </div>
                        <div><p className="dash-menu-title" style={{color: '#e65100'}}>އިނާމު ފިހާރަ (ގުރުއަތު ޓިކެޓް)</p><p className="dash-menu-sub">ކޮއިން ބޭނުންކޮށްގެން ގުރުއަތު ޓިކެޓް ގަންނަވާ!</p></div>
                    </div>
                </div>
            )}

            {/* 🔥 VIEW: DIGITAL CERTIFICATES 🔥 */}
            {dashView === 'certificates' && (
                <div style={styles.card} className="animate-card">
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px'}}>
                        <button onClick={() => navigateTo('dashboard', 'overview')} style={{...styles.btnSecondary, background: 'transparent', color: '#0056b3', width: 'auto', padding: 0}}>← ފަހަތަށް</button>
                        <h3 style={{margin: 0}}>މަގޭ ސެޓްފިކެޓްތައް</h3>
                    </div>

                    {profileData.total_certificates > 0 ? (
                        <div className="cert-container">
                            <div className="cert-inner">
                                <BrandLogo />
                                <div className="cert-title">ޝަރަފުގެ ސެޓްފިކެޓް</div>
                                <div className="cert-name">{profileData.student_name}</div>
                                <div className="cert-body">
                                    މި ސެޓްފިކެޓް ދީފައިވަނީ <b>ޅޮހިނޫރު ޤުރުއާން މުބާރާތުގައި</b> ބައިވެރިވިކަމުގެ އަގުވަޒަންކުރުމުގެ ގޮތުންނާއި، 
                                    މުބާރާތުގައި ދެއްކެވި ފަރުވާތެރިކަމަށްޓަކައި ހިތްވަރު ދިނުމުގެ ގޮތުންނެވެ.
                                </div>
                                <div className="cert-bonus">
                                    🎉 ބޯނަސް އިނާމު: 100 🪙
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div style={{textAlign: 'center', padding: '40px', color: '#888'}}>
                            <svg width="48" height="48" fill="none" stroke="#ddd" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                            <p>އަދި ސެޓްފިކެޓެއް ނުލިބޭ...</p>
                            <p style={{fontSize: '12px'}}>ޕްރޮގްރާމްތަކުގައި ބައިވެރިވުމުން ސެޓްފިކެޓް ލިބޭނެއެވެ.</p>
                        </div>
                    )}
                </div>
            )}

            {dashView === 'profile' && (
                <div style={styles.card} className="animate-card">
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px'}}>
                        <button onClick={() => navigateTo('dashboard', 'overview')} style={{...styles.btnSecondary, background: 'transparent', color: '#0056b3', width: 'auto', padding: 0}}>← ފަހަތަށް</button>
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
                            <p><b>އައި.ޑީ ކާޑު:</b> <span className="ltr-text">{profileData.id_card}</span></p>
                            <p><b>އެޑްރެސް:</b> {profileData.parent_address}</p>
                            <p><b>ފޯނު ނަންބަރު:</b> <span className="ltr-text">{profileData.parent_phone}</span></p>
                            <p><b>ގްރޭޑް / އުމުރު:</b> {profileData.grade}</p>
                            {user.email && !user.email.includes('@lhohi.mv') && <p><b>އީމެއިލް:</b> <span className="ltr-text">{user.email}</span></p>}
                            <button onClick={() => setIsEditingProfile(true)} style={{...styles.btnSecondary, marginTop: '15px'}}>މަޢުލޫމާތު ބަދަލުކުރޭ</button>
                        </div>
                    )}
                </div>
            )}

            {dashView === 'progress' && (
                <div style={styles.card} className="animate-card">
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px'}}>
                        <button onClick={() => navigateTo('dashboard', 'overview')} style={{...styles.btnSecondary, background: 'transparent', color: '#0056b3', width: 'auto', padding: 0}}>← ފަހަތަށް</button>
                        <h3 style={{margin: 0}}>މަގޭ ނަތީޖާ</h3>
                    </div>
                    
                    <div className="program-card" style={{marginBottom: '10px', textAlign: 'right'}}>
                        <h4 style={{margin: '0 0 5px 0', color: '#d32f2f'}}>💯 ސްކޯ ބޯޑު</h4>
                        <p style={{margin: '5px 0', fontSize: '14px'}}><b>ކުއިޒް ފާސްވި އަދަދު:</b> <span className="ltr-text" style={{width:'auto', color:'#000'}}>{(profileData.quiz_total_score || 0) / 5}</span></p>
                        <p style={{margin: '5px 0', fontSize: '14px'}}><b>ސުވާލު ކީސާ ފާސްވި އަދަދު:</b> <span className="ltr-text" style={{width:'auto', color:'#000'}}>{(profileData.math_total_score || 0) / 5}</span></p>
                        <p style={{margin: '5px 0', fontSize: '14px'}}><b>ޤުރުއާން މާކްސް:</b> <span className="ltr-text" style={{width:'auto', color:'#000'}}>{profileData.marks || 'ނުލިބޭ'}</span></p>
                    </div>

                    {/* 🔥 3D BADGES SHOWCASE 🔥 */}
                    <div className="program-card" style={{marginBottom: '10px'}}>
                        <h4 style={{margin: '0 0 10px 0', color: '#fbc02d'}}>🏅 ލައިފްޓައިމް ބެޖްތައް</h4>
                        <p style={{fontSize: '11px', color: '#666', marginTop: 0}}>މިއީ މިހާތަނަށް ލިބުނު ޖުމްލަ ކޮއިން (<span className="ltr-text">{profileData.lifetime_coins}</span>) އަށް ބަލައިގެން ދެވޭ ޝަރަފެކެވެ.</p>
                        <div className="badge-grid">
                            {BADGE_CONFIG.map(badge => {
                                const isUnlocked = (profileData.lifetime_coins || 0) >= badge.cost;
                                return (
                                    <div key={badge.id} className={`badge-item ${isUnlocked ? 'badge-unlocked' : 'badge-locked'}`} title={badge.name}>
                                        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50px'}}>{badge.icon}</div>
                                        <span style={{fontSize: '10px', marginTop:'5px', fontWeight: 'bold', textAlign:'center'}}>{badge.name}</span>
                                        {!isUnlocked && <span className="ltr-text" style={{fontSize: '9px', color:'#d32f2f', fontWeight:'bold', marginTop:'2px'}}>🔒 {badge.cost} 🪙</span>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="program-card" style={{marginBottom: '10px', textAlign: 'right', background: '#f9f9f9'}}>
                        <h4 style={{margin: '0 0 10px 0', color: '#0056b3', borderBottom: '1px solid #ddd', paddingBottom: '5px'}}>🏆 މިއަދުގެ ކުއިޒް ލީޑަރބޯޑު <span className="ltr-text" style={{fontSize: '12px', width: 'auto'}}>({getActiveQuizDate()})</span></h4>
                        {leaderboard.length > 0 ? leaderboard.map((l, i) => (
                            <div key={i} className="leaderboard-row"><span>{i+1}. {l.username}</span><span className="ltr-text" style={{width:'auto'}}>{l.score} މާކްސް</span></div>
                        )) : <p style={{fontSize:'12px', color:'#777'}}>މިއަދު އަދި އެއްވެސް ފަރާތަކުން ބައިވެރިވެފައެއް ނުވޭ.</p>}
                    </div>

                    <div className="program-card" style={{marginBottom: '10px', textAlign: 'right', background: '#e3f2fd'}}>
                        <h4 style={{margin: '0 0 10px 0', color: '#1976d2', borderBottom: '1px solid #bbdefb', paddingBottom: '5px'}}>🧮 މިއަދުގެ ސުވާލު ކީސާ ލީޑަރބޯޑު <span className="ltr-text" style={{fontSize: '12px', width: 'auto'}}>({getActiveQuizDate()})</span></h4>
                        {mathLeaderboard.length > 0 ? mathLeaderboard.map((l, i) => (
                            <div key={i} className="leaderboard-row"><span>{i+1}. {l.username}</span><span className="ltr-text" style={{width:'auto'}}>{l.score} މާކްސް</span></div>
                        )) : <p style={{fontSize:'12px', color:'#777'}}>މިއަދު އަދި އެއްވެސް ފަރާތަކުން ބައިވެރިވެފައެއް ނުވޭ.</p>}
                    </div>

                </div>
            )}

            {/* 🔥 NEW FAIR GIFT TICKET SHOP 🔥 */}
            {dashView === 'gift_shop' && (
                <div style={{...styles.card, background: '#fffde7'}} className="animate-card">
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #fbc02d', paddingBottom: '10px', marginBottom: '15px'}}>
                        <button onClick={() => navigateTo('dashboard', 'overview')} style={{...styles.btnSecondary, background: 'transparent', color: '#f57f17', width: 'auto', padding: 0}}>← ފަހަތަށް</button>
                        <h3 style={{margin: 0, color: '#f57f17'}}>އިނާމު ފިހާރަ 🎁</h3>
                    </div>
                    
                    <div style={{background: 'white', padding: '10px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)'}}>
                        <span style={{color: '#555', fontSize: '14px', fontWeight: 'bold'}}>މަގޭ ބެލެންސް:</span>
                        <span className="ltr-text" style={{color: '#ff9800', fontSize: '18px', fontWeight: 'bold', width:'auto'}}>{profileData.total_coins || 0} 🪙</span>
                    </div>

                    <div style={{background: '#fff3cd', padding: '15px', borderRadius: '10px', marginBottom: '20px', border: '1px solid #ffeeba', textAlign: 'right'}}>
                        <p style={{margin: 0, fontSize: '13px', color: '#856404', lineHeight: '1.6'}}>
                            💡 <b>ގުރުއަތު ޓިކެޓް:</b> ބޭނުންވާ އިނާމެއްގެ ގުރުއަތުގައި ބައިވެރިވުމަށް އެ އިނާމެއްގެ ޓިކެޓެއް ގަންނަވާ! ޓިކެޓް ގަންނަ ވަރަކަށް އެ އިނާމެއް ލިބުމުގެ ޗާންސް ބޮޑުވާނެއެވެ. ޓިކެޓް ގަތުމުން ބެލެންސް އިން ކޮއިން ކެނޑޭނެއެވެ.
                        </p>
                    </div>

                    <div className="gift-grid">
                        {allGifts.map(gift => {
                            const canAfford = (profileData.total_coins || 0) >= gift.cost;
                            const myTickets = myOrders.filter(o => o.item_id === gift.id).length;
                            return (
                                <div key={gift.id} className="gift-card" style={{border: myTickets > 0 ? '2px solid #4caf50' : '2px solid #fff3e0'}}>
                                    <div className="gift-image-container">
                                        <img src={gift.image_url} alt={gift.name} loading="lazy" decoding="async" />
                                    </div>
                                    <h4 style={{margin: '0 0 5px 0', fontSize: '13px', lineHeight: '1.3'}}>{gift.name}</h4>
                                    <p className="ltr-text" style={{margin: '0 0 10px 0', fontSize: '13px', color: '#ff9800', fontWeight: 'bold', width:'auto'}}>{gift.cost} 🪙</p>
                                    
                                    {myTickets > 0 && (
                                        <div style={{background: '#e8f5e9', color: '#2e7d32', padding: '4px 8px', borderRadius: '15px', fontSize: '11px', fontWeight: 'bold', marginBottom: '10px', width: '100%', boxSizing: 'border-box'}}>
                                            🎟️ މަގޭ ޓިކެޓް: <span className="ltr-text">{myTickets}</span>
                                        </div>
                                    )}

                                    <button 
                                        onClick={() => handlePurchase(gift)} 
                                        style={{...styles.btn, background: canAfford ? '#ff9800' : '#f5f5f5', color: canAfford ? 'white' : '#999', padding: '8px', fontSize: '12px', width: '100%', boxSizing: 'border-box'}}
                                        disabled={!canAfford}
                                    >
                                        {canAfford ? '+ ޓިކެޓް ގަންނަވާ' : '🔒 ކޮއިން މަދު'}
                                    </button>
                                </div>
                            );
                        })}
                        {allGifts.length === 0 && <p style={{textAlign: 'center', width: '100%', color: '#888'}}>އަދި ފިހާރައަށް އިނާމެއް ނުލާ...</p>}
                    </div>
                </div>
            )}

            {dashView === 'programs' && (
                <div style={styles.card} className="animate-card">
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px'}}>
                        <button onClick={() => navigateTo('dashboard', 'overview')} style={{...styles.btnSecondary, background: 'transparent', color: '#0056b3', width: 'auto', padding: 0}}>← ފަހަތަށް</button>
                        <h3 style={{margin: 0}}>ޕްރޮގްރާމްތައް</h3>
                    </div>

                    <div className="program-card" style={{marginBottom: '10px'}}>
                        <h4>❓ ދުވަހުގެ ކުއިޒް</h4>
                        <p style={{fontSize: '12px', margin: '5px 0', color: '#666'}}>(2 ފަހަރު ކުޅެވޭނެ. ބާކީ: <span className="ltr-text" style={{width:'auto'}}>{2 - (profileData.quiz_attempts_today || 0)}</span>)</p>
                        <button onClick={startQuiz} style={{...styles.btn, background: '#fbc02d', color: '#333', padding: '8px', fontSize: '14px'}}>މިއަދުގެ ކުއިޒް ކުޅުއްވާ</button>
                    </div>

                    <div className="program-card" style={{marginBottom: '10px'}}>
                        <h4 style={{color: '#1976d2'}}>🧮 ސުވާލު ކީސާ {profileData?.grade ? `(${profileData.grade})` : ''}</h4>
                        <p style={{fontSize: '12px', margin: '5px 0', color: '#666'}}>މަޢުލޫމާތު މުއްސަނދިކުރުމަށް އެކި ރޮނގުތަކުން ސުވާލު.</p>
                        <button onClick={startMathQuiz} style={{...styles.btn, background: '#1976d2', color: 'white', padding: '8px', fontSize: '14px'}}>ޗެލެންޖް ފަށާ!</button>
                    </div>

                    <div className="program-card" style={{marginBottom: '10px'}}>
                        <h4 style={{color: '#777'}}>📜 ޙަދީޘް މުބާރާތް</h4>
                        <button disabled style={{...styles.btnSecondary, background: '#eee', color: '#999', padding: '8px', fontSize: '14px', cursor: 'not-allowed'}}>އަދި ނުހުޅުވޭ</button>
                    </div>
                </div>
            )}

            {dashView === 'quran_slip' && profileData && (
                <div style={{width: '100%', maxWidth: '500px', margin: '0 auto'}}>
                    <div style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f0f4f8 100%)', border: '2px solid #0056b3', borderRadius: '12px', padding: '25px', boxShadow: '0 8px 16px rgba(0,0,0,0.1)', position: 'relative', overflow: 'hidden' }} className="animate-card">
                        <div style={{position:'absolute', top:0, right:0, background:'#0056b3', color:'white', padding:'5px 15px', borderBottomLeftRadius:'12px', fontSize:'12px', fontWeight:'bold'}}>ޤުރުއާން މުބާރާތް</div>
                        <BrandLogo />
                        <div style={{textAlign:'center', marginBottom: '20px', borderBottom: '2px dashed #ccc', paddingBottom: '15px'}}>
                            <h2 style={{color: '#2e7d32', margin: '10px 0 5px 0'}}>ރަޖިސްޓްރޭޝަން ސްލިޕް</h2>
                            <p className="ltr-text" style={{margin:0, color:'#666', fontSize:'13px', textAlign: 'center'}}>The Secretariat of the Lhohi Council</p>
                        </div>
                        <table className="official-slip-table" style={{ width: '100%', textAlign: 'right', borderCollapse: 'collapse' }}>
                            <tbody>
                                <tr><td className="slip-label">ނަން:</td><td className="slip-value" style={{fontSize: '16px'}}>{profileData.student_name || '-'}</td></tr>
                                <tr><td className="slip-label">އައި.ޑީ ކާޑު:</td><td className="slip-value"><span className="ltr-text">{profileData.id_card || '-'}</span></td></tr>
                                <tr><td className="slip-label">ގްރޭޑް/އުމުރު:</td><td className="slip-value">{profileData.grade || '-'}</td></tr>
                                <tr><td className="slip-label">ބައި:</td><td className="slip-value">{profileData.level || '-'}</td></tr>
                                <tr><td className="slip-label">ކިޔަވާ ގޮތް:</td><td className="slip-value">{profileData.category || '-'}</td></tr>
                                <tr><td className="slip-label">ކިޔަވާ ތަން:</td><td className="slip-value">{profileData.recitation || '-'}</td></tr>
                                <tr><td className="slip-label">ބެލެނިވެރިޔާ:</td><td className="slip-value">{profileData.parent_name !== 'N/A' ? profileData.parent_name : '-'}</td></tr>
                                <tr><td className="slip-label">އެޑްރެސް:</td><td className="slip-value">{profileData.parent_address || '-'}</td></tr>
                                <tr><td className="slip-label">ފޯނު:</td><td className="slip-value"><span className="ltr-text">{profileData.parent_phone || '-'}</span></td></tr>
                                <tr><td className="slip-label" style={{color: '#d32f2f', fontWeight: 'bold', paddingTop: '15px'}}>މާކްސް:</td><td className="slip-value ltr-text" style={{paddingTop: '15px', fontSize: '20px', color: '#d32f2f', textAlign: 'right'}}>{profileData.marks || 'ނުލިބޭ'}</td></tr>
                            </tbody>
                        </table>
                    </div>
                    <button onClick={() => navigateTo('dashboard', 'overview')} style={{...styles.btnSecondary, marginTop:20}}>ފަހަތަށް</button>
                </div>
            )}
        </div>
      )}

      {view === 'quiz' && (
        <div style={styles.centeredContainer}>
          <div style={styles.quizCard} className="animate-card">
            
            <BrandLogo />

            {quizState === 'intro' && (
              <div style={{textAlign:'right'}}>
                <h2 style={{color: '#0056b3'}}>❓ ޅޮހިނޫރު ސުވާލު މުބާރާތް</h2>
                <p>ކޮލިފައިވުމަށް %80 ހޯއްދަވަންޖެހޭނެ.</p>
                <p style={{color:'green', fontSize:'13px', fontWeight: 'bold'}}>މިއަދުގެ ތާރީޚް: {getActiveQuizDate()}</p>
                <button style={styles.btn} onClick={startQuiz} disabled={quizLoading}>{quizLoading ? 'ލޯޑުކުރަނީ...' : 'ފަށަމާ'}</button>
                <button style={{...styles.btnSecondary, marginTop:10}} onClick={() => navigateTo('dashboard', 'programs')}>ކެންސަލް</button>
              </div>
            )}

            {quizState === 'playing' && questions[currentQ] && (
              <>
                <div style={{display:'flex', justifyContent:'space-between', borderBottom: '2px solid #f0f4f8', paddingBottom: '10px', marginBottom: '15px'}}>
                    <span style={{fontWeight: 'bold', color: '#555'}}>ސުވާލު <span className="ltr-text" style={{width:'auto'}}>{currentQ+1} / {questions.length}</span></span>
                    <span style={{fontWeight: 'bold', color: '#0056b3'}}>މާކްސް: <span className="ltr-text" style={{width:'auto'}}>{score}</span></span>
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
                <h1 className="ltr-text">{score} / {questions.length}</h1>
                {(score >= Math.ceil(questions.length * 0.8)) ? 
                    <><p style={{color:'green', fontWeight: 'bold'}}>🎉 ކޮލިފައިވެއްޖެ! 5 ކޮއިން ލިބޭނެ.</p><p style={{fontSize: '12px', color: '#666'}}>މަޑުކޮށްލައްވާ...</p></> 
                    : 
                <>
                  <p style={{color:'red'}}>ކޮލިފައިވުމަށް އަލުން މަސައްކަތްކުރައްވާ!</p>
                  <button style={styles.btnSecondary} onClick={() => {navigateTo('home');}}>ހޯމް ޕޭޖަށް</button>
                </>}
              </div>
            )}
            
            {quizState === 'success' && (
              <div style={{textAlign:'center'}}>
                <h1 style={{fontSize:'50px', margin:'0 0 10px 0'}}>✅</h1>
                <h2 style={{marginTop:0}}>ލިބިއްޖެ!</h2>
                
                <div style={{marginTop:'20px', textAlign:'right', background:'#f9f9f9', padding:'15px', borderRadius:'10px', maxHeight:'200px', overflowY:'auto'}}>
                    <h4 style={{margin:'0 0 10px 0', borderBottom:'1px solid #ddd', paddingBottom:'5px'}}>🏆 މިއަދުގެ ޓޮޕް 10 ({getActiveQuizDate()})</h4>
                    {leaderboard.length > 0 ? leaderboard.map((l, i) => (
                        <div key={i} className="leaderboard-row"><span>{i+1}. {l.username}</span><span className="ltr-text" style={{width:'auto'}}>{l.score} މާކްސް</span></div>
                    )) : <p style={{fontSize:'12px', color:'#777'}}>މިއަދު އަދި އެއްވެސް ފަރާތަކުން ބައިވެރިވެފައެއް ނުވޭ.</p>}
                </div>
                <button style={{...styles.btn, marginTop:20}} onClick={() => { resetQuiz(); navigateTo('home'); }}>ހޯމް ޕޭޖަށް</button>
              </div>
            )}
          </div>
        </div>
      )}

      {view === 'math_quiz' && (
        <div style={styles.centeredContainer}>
          <div style={styles.quizCard} className="animate-card">
            
            <BrandLogo />

            {mathState === 'intro' && (
              <div style={{textAlign:'right'}}>
                <h2 style={{color: '#1976d2'}}>🧮 ސުވާލު ކީސާ</h2>
                <p>5 ސުވާލު.</p>
                <p style={{color:'green', fontSize:'13px', fontWeight: 'bold'}}>މިއަދުގެ ތާރީޚް: {getActiveQuizDate()}</p>
                <button style={{...styles.btn, background: '#1976d2'}} onClick={startMathQuiz} disabled={quizLoading}>{quizLoading ? 'ލޯޑުކުރަނީ...' : 'ޗެލެންޖް ފަށާ!'}</button>
                <button style={{...styles.btnSecondary, marginTop:10}} onClick={() => navigateTo('home')}>ކެންސަލް</button>
              </div>
            )}

            {mathState === 'playing' && mathQuestions[mathCurrentQ] && (
              <>
                <div style={{display:'flex', justifyContent:'space-between', borderBottom: '2px solid #e3f2fd', paddingBottom: '10px', marginBottom: '15px'}}>
                    <span style={{fontWeight: 'bold', color: '#1976d2'}}>ސުވާލު <span className="ltr-text" style={{width:'auto'}}>{mathCurrentQ+1} / {mathQuestions.length}</span></span>
                    <span style={{fontWeight: 'bold', color: '#1976d2'}}>މާކްސް: <span className="ltr-text" style={{width:'auto'}}>{mathScore}</span></span>
                </div>
                
                <h3 style={{lineHeight: '1.6', marginBottom: '25px', textAlign:'center', direction:'rtl', fontSize:'24px', color:'#333', fontFamily: '"Faruma", Arial, sans-serif', fontWeight: 'bold'}}>{mathQuestions[mathCurrentQ].question_text}</h3>
                
                <div style={{display:'flex', flexDirection:'column', gap:12}}>
                  {[mathQuestions[mathCurrentQ].option_1, mathQuestions[mathCurrentQ].option_2, mathQuestions[mathCurrentQ].option_3].map((opt, i) => (
                    <button key={i} style={{...styles.optionBtn, direction: 'rtl', textAlign: 'center', fontSize: '18px', fontFamily: '"Faruma", Arial, sans-serif', fontWeight: 'bold', background: getButtonColor(opt, mathQuestions, mathCurrentQ), borderColor: getButtonColor(opt, mathQuestions, mathCurrentQ) !== 'white' ? getButtonColor(opt, mathQuestions, mathCurrentQ) : '#ddd'}} onClick={() => handleMathAnswer(opt)} disabled={isAnswered}>{opt}</button>
                  ))}
                </div>
              </>
            )}

            {mathState === 'result' && (
              <div style={{textAlign:'center'}}>
                <h1 className="ltr-text">{mathScore} / {mathQuestions.length}</h1>
                
                {mathScore < 3 ? (
                    <div style={{textAlign: 'right', direction: 'rtl', marginTop: '20px', padding: '15px', background: '#ffebee', borderRadius: '10px', borderRight: '4px solid #f44336'}}>
                        <h4 style={{color: '#d32f2f', margin: '0 0 10px 0'}}>ރަނގަޅު ޖަވާބުތައް ދަސްކޮށްލަމާ:</h4>
                        {mathQuestions.map((q, i) => (
                            <div key={i} style={{background: 'white', padding: '10px', marginBottom: '8px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)'}}>
                                <p style={{margin: '0 0 5px 0', fontSize: '16px', fontWeight: 'bold', fontFamily: '"Faruma", Arial, sans-serif', direction: 'rtl', textAlign: 'right'}}>{q.question_text}</p>
                                <p style={{margin: 0, color: 'green', fontSize: '15px', fontFamily: '"Faruma", Arial, sans-serif', direction: 'rtl', textAlign: 'right'}}>✓ {q.correct_option}</p>
                            </div>
                        ))}
                        <p style={{fontSize: '13px', color: '#666', marginTop: '15px', fontWeight: 'bold'}}>ފާސްނުވޭ! ކޮއިންއެއް ނުލިބޭނެ.</p>
                        <button style={{...styles.btn, background: '#1976d2', marginTop: '10px'}} onClick={() => { navigateTo('home'); }}>ހޯމް ޕޭޖަށް</button>
                    </div>
                ) : (
                    <>
                        <p style={{color:'green', fontWeight: 'bold'}}>🎉 މޮޅު! 5 ކޮއިން ލިބޭނެ.</p>
                        <p style={{fontSize: '12px', color: '#666'}}>މަޑުކޮށްލައްވާ...</p>
                    </>
                )}
              </div>
            )}
            
            {mathState === 'success' && (
              <div style={{textAlign:'center'}}>
                <h1 style={{fontSize:'50px', margin:'0 0 10px 0'}}>✅</h1>
                <h2 style={{marginTop:0}}>ސޭވްކުރެވިއްޖެ!</h2>

                <div style={{marginTop:'20px', textAlign:'right', background:'#e3f2fd', padding:'15px', borderRadius:'10px', maxHeight:'200px', overflowY:'auto'}}>
                    <h4 style={{margin:'0 0 10px 0', color: '#1976d2', borderBottom:'1px solid #bbdefb', paddingBottom:'5px'}}>🧮 މިއަދުގެ ސުވާލު ކީސާ ޓޮޕް 10 ({getActiveQuizDate()})</h4>
                    {mathLeaderboard.length > 0 ? mathLeaderboard.map((l, i) => (
                        <div key={i} className="leaderboard-row"><span>{i+1}. {l.username}</span><span className="ltr-text" style={{width:'auto'}}>{l.score} މާކްސް</span></div>
                    )) : <p style={{fontSize:'12px', color:'#777'}}>މިއަދު އަދި އެއްވެސް ފަރާތަކުން ބައިވެރިވެފައެއް ނުވޭ.</p>}
                </div>

                <button style={{...styles.btn, marginTop:20, background: '#1976d2'}} onClick={() => { resetMath(); navigateTo('home'); }}>ހޯމް ޕޭޖަށް</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECURE ADMIN PORTALS */}
      {view === 'admin' && (
          <AdminPanel 
              allStudents={allStudents} 
              allQuestions={allQuestions} 
              allPartners={allPartners} 
              partnerRequestsList={partnerRequestsList} 
              allGifts={allGifts}
              winnerDate={winnerDate} 
              setWinnerDate={setWinnerDate} 
              loadAdminData={loadAdminData} 
              getActiveQuizDate={getActiveQuizDate} 
              fetchLatestWinner={fetchLatestWinner}
              handleLogout={handleLogout}
              styles={styles}
              showToast={showToast}
          />
      )}

      {/* SHOP ADMIN PORTAL */}
      {view === 'shop_admin' && (
          <ShopAdminPanel 
              shopOrders={shopOrders} 
              shopWinners={shopWinners} 
              loadShopAdminData={loadShopAdminData} 
              handleLogout={handleLogout}
              styles={styles}
              showToast={showToast}
          />
      )}
    </div>
  );
}

function ShopAdminPanel({ shopOrders, shopWinners, loadShopAdminData, handleLogout, styles, showToast }) {
    const [shopTab, setShopTab] = useState('orders');

    const deliverOrder = async (id) => {
        if(window.confirm("މި އިނާމު ދަރިވަރާ ހަވާލުކޮށްފިންތަ؟")) { 
            await supabase.from('lhohinoor_purchases').update({ status: 'Delivered' }).eq('id', id); 
            loadShopAdminData(); 
            showToast('އޯޑަރު ދޫކުރެވިއްޖެ!', 'success');
        }
    };

    const deliverVoucher = async (id) => {
        if(window.confirm("މި ވައުޗަރ ދަރިވަރާ ހަވާލުކޮށްފިންތަ؟")) { 
            await supabase.from('lhohinoor_daily_winners').update({ status: 'Delivered' }).eq('id', id); 
            loadShopAdminData(); 
            showToast('ވައުޗަރ ދޫކުރެވިއްޖެ!', 'success');
        }
    };

    return (
        <div style={styles.container}>
          <div style={{...styles.card, maxWidth:'1300px', margin: '20px auto'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20}}>
                <h2 style={{color: '#ff9800', textAlign: 'right', margin: 0}}>އިނާމު ފިހާރަ އެޑްމިން</h2>
                <button onClick={handleLogout} style={{...styles.btnSecondary, background: '#f44336', width: 'auto', padding: '8px 15px'}}>ލޮގްއައުޓް (Logout)</button>
            </div>
            
            <div className="admin-tabs" style={{display:'flex', gap:'10px', marginBottom:'20px', flexWrap: 'wrap'}}>
                <button style={{...styles.tab, borderBottom: shopTab==='orders'?'3px solid #ff9800':'none', color: shopTab==='orders'?'#ff9800':''}} onClick={()=>setShopTab('orders')}>ގުރުއަތު ޓިކެޓް އޯޑަރުތައް</button>
                <button style={{...styles.tab, borderBottom: shopTab==='vouchers'?'3px solid #ff9800':'none', color: shopTab==='vouchers'?'#ff9800':''}} onClick={()=>setShopTab('vouchers')}>ކުއިޒް ވައުޗަރުތައް</button>
            </div>

            {shopTab === 'orders' && (
                <div style={{ overflowX: 'auto', paddingBottom: '10px' }}>
                    <p style={{fontSize: '13px', color: '#666', marginBottom: '15px'}}>ކުދިން ގަނެފައިވާ ގުރުއަތު ޓިކެޓްތަކުގެ ލިސްޓު (މިއީ ލައިވް ޑްރޯއަށް ބޭނުންކުރެވޭނެ ލިސްޓެކެވެ).</p>
                    <table style={{...styles.table, minWidth: '800px'}}>
                        <thead><tr><th>ތާރީޚް</th><th>ނަން</th><th>ފޯނު</th><th>ޓިކެޓް ގަތް އިނާމު</th><th>ކޮއިން</th></tr></thead>
                        <tbody>
                            {shopOrders.length > 0 ? shopOrders.map(o => (
                                <tr key={o.id}>
                                    <td className="ltr-text" style={{fontSize: '12px'}}>{new Date(o.created_at).toLocaleDateString()}</td>
                                    <td>{o.student_name}</td>
                                    <td className="ltr-text">{o.phone}</td>
                                    <td>{o.item_name}</td>
                                    <td className="ltr-text" style={{color: '#ff9800'}}>{o.cost}</td>
                                </tr>
                            )) : <tr><td colSpan="5" style={{textAlign: 'center', padding: '20px'}}>އަދި ޓިކެޓެއް ނުވިކޭ</td></tr>}
                        </tbody>
                    </table>
                </div>
            )}

            {shopTab === 'vouchers' && (
                <div style={{ overflowX: 'auto', paddingBottom: '10px' }}>
                    <p style={{fontSize: '13px', color: '#666', marginBottom: '15px'}}>ކޮންމެ ދުވަހެއްގެ ކުއިޒް ނަސީބުވެރިޔާއަށް ދެވޭ 100 ރުފިޔާގެ ވައުޗަރ ހަވާލުކުރުން.</p>
                    <table style={{...styles.table, minWidth: '800px'}}>
                        <thead><tr><th>ތާރީޚް</th><th>ނަން</th><th>ފޯނު</th><th>އިނާމު</th><th>ސްޓޭޓަސް</th><th>ކަންތައް</th></tr></thead>
                        <tbody>
                            {shopWinners.length > 0 ? shopWinners.map(w => (
                                <tr key={w.id}>
                                    <td className="ltr-text" style={{fontSize: '12px'}}>{w.won_at}</td>
                                    <td>{w.username}</td>
                                    <td className="ltr-text">{w.phone}</td>
                                    <td>{w.prize}</td>
                                    <td style={{color: w.status === 'Pending' || !w.status ? '#f44336' : '#4caf50', fontWeight: 'bold'}}>{w.status === 'Pending' || !w.status ? 'ނުދީ' : 'ދީފި'}</td>
                                    <td>
                                        {w.status === 'Pending' || !w.status ? (
                                            <button style={{...styles.btn, background: '#4caf50', padding: '5px 10px', fontSize: '12px', width: 'auto'}} onClick={() => deliverVoucher(w.id)}>ދީފިން (Deliver)</button>
                                        ) : (
                                            <span style={{fontSize: '12px', color: '#999'}}>✔ Completed</span>
                                        )}
                                    </td>
                                </tr>
                            )) : <tr><td colSpan="6" style={{textAlign: 'center', padding: '20px'}}>އަދި ނަސީބުވެރިޔަކު ނެތް</td></tr>}
                        </tbody>
                    </table>
                </div>
            )}
          </div>
        </div>
    );
}

function AdminPanel({ 
    allStudents, allQuestions, allPartners, partnerRequestsList, allGifts,
    winnerDate, setWinnerDate, loadAdminData, getActiveQuizDate, 
    fetchLatestWinner, handleLogout, styles, showToast
}) {
    const [adminTab, setAdminTab] = useState('students');
    const [editingQ, setEditingQ] = useState(null);
    const [bulkJSON, setBulkJSON] = useState('');

    const saveQuestion = async (e) => { e.preventDefault(); const d = Object.fromEntries(new FormData(e.target)); if (d.correct_option !== d.option_1 && d.correct_option !== d.option_2 && d.correct_option !== d.option_3) return showToast("ޖަވާބު ދިމައެއްނުވޭ (Correct option mismatch)", "error"); if (!d.quiz_date) d.quiz_date = getActiveQuizDate(); if (editingQ) await supabase.from('lhohinoor_questions').update(d).eq('id', editingQ.id); else await supabase.from('lhohinoor_questions').insert([d]); setEditingQ(null); e.target.reset(); loadAdminData(); };
    const deleteQuestion = async (id) => { if(window.confirm("މި ސުވާލު ފޮހެލަންވީތަ؟")) { await supabase.from('lhohinoor_questions').delete().eq('id', id); loadAdminData(); } };
    
    const saveGift = async (e) => { 
        e.preventDefault(); const d = Object.fromEntries(new FormData(e.target)); 
        await supabase.from('lhohinoor_gifts').insert([{ name: d.name, cost: parseInt(d.cost, 10), image_url: d.image_url }]); 
        e.target.reset(); loadAdminData(); showToast("އިނާމު ސޭވްވެއްޖެ!", "success");
    };
    const deleteGift = async (id) => { if(window.confirm("މި އިނާމު ފޮހެލަންވީތަ؟")) { await supabase.from('lhohinoor_gifts').delete().eq('id', id); loadAdminData(); } };

    const openLiveDraw = () => {
        window.history.pushState({ view: 'live_draw', dashView: 'overview' }, '', '');
        const popStateEvent = new PopStateEvent('popstate', { state: { view: 'live_draw', dashView: 'overview' }});
        window.dispatchEvent(popStateEvent);
    };

    const savePartner = async (e) => { e.preventDefault(); const d = Object.fromEntries(new FormData(e.target)); await supabase.from('lhohinoor_partners').insert([{ name: d.name, logo_url: d.logo_url }]); e.target.reset(); loadAdminData(); };
    const deletePartner = async (id) => { if(window.confirm("މި ބައިވެރިޔާ ފޮހެލަންވީތަ؟")) { await supabase.from('lhohinoor_partners').delete().eq('id', id); loadAdminData(); } };
    const updateStudentResult = async (id, field, value) => { await supabase.from('lhohinoor_students').update({ [field]: value }).eq('id', id); };
    const deleteStudent = async (id) => { if(window.confirm("މި ދަރިވަރު ފޮހެލަންވީތަ؟")) { await supabase.from('lhohinoor_students').delete().eq('id', id); loadAdminData(); } };
    
    const handleBulkMathUpload = async () => {
        try {
            const parsedData = JSON.parse(bulkJSON);
            if (!Array.isArray(parsedData)) return showToast("ޖޭސަން (JSON) ފޯމެޓް ނުބައި!", "error");
            const { error } = await supabase.from('lhohinoor_math_questions').insert(parsedData);
            if (error) throw error;
            showToast(`${parsedData.length} ސުވާލު ކީސާ ސޭވްވެއްޖެ!`, "success");
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
          await supabase.from('lhohinoor_daily_winners').insert([{ username: winner.username, phone: winner.phone, score: winner.score, prize: "🎁 100 ރުފިޔާގެ ގިފްޓް ވައުޗަރ", won_at: winnerDate, congrats_count: 0, status: 'Pending' }]);
          showToast(`ނަސީބުވެރިޔާ: ${winner.username} (Score: ${winner.score})`, "success"); fetchLatestWinner();
        } else { showToast(`ޝަރުތު ހަމަވާ މީހުން ތިބި ނަމަވެސް، އެންމެންނަކީ ފާއިތުވި 7 ދުވަހު އިނާމު ލިބިފައިވާ މީހުން!`, "warning"); }
    };

    return (
        <div style={styles.container}>
          <div style={{...styles.card, maxWidth:'1300px', margin: '20px auto'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20}}>
                <h2 className="ltr-text" style={{textAlign: 'right', margin: 0}}>އެޑްމިން ޑޭޝްބޯޑު</h2>
                <button onClick={handleLogout} style={{...styles.btnSecondary, background: '#f44336', width: 'auto', padding: '8px 15px'}}>ލޮގްއައުޓް (Logout)</button>
            </div>
            
            <div className="admin-tabs" style={{display:'flex', gap:'10px', marginBottom:'20px', flexWrap: 'wrap'}}>
                <button style={{...styles.tab, borderBottom: adminTab==='students'?'3px solid #2e7d32':'none'}} onClick={()=>setAdminTab('students')}>ދަރިވަރުން</button>
                <button style={{...styles.tab, borderBottom: adminTab==='quiz'?'3px solid #2e7d32':'none'}} onClick={()=>setAdminTab('quiz')}>ސުވާލު މުބާރާތް</button>
                <button style={{...styles.tab, borderBottom: adminTab==='math'?'3px solid #1976d2':'none', color: '#1976d2'}} onClick={()=>setAdminTab('math')}>ސުވާލު ކީސާ</button>
                <button style={{...styles.tab, borderBottom: adminTab==='gifts'?'3px solid #ff9800':'none', color: adminTab==='gifts'?'#ff9800':''}} onClick={()=>setAdminTab('gifts')}>އިނާމު ފިހާރަ</button>
                <button style={{...styles.tab, borderBottom: adminTab==='partners'?'3px solid #2e7d32':'none'}} onClick={()=>setAdminTab('partners')}>ބައިވެރިން</button>
                
                <button style={{...styles.tab, background: '#d32f2f', color: 'white', borderRadius: '8px'}} onClick={openLiveDraw}>🔴 ލައިވް ގުރުއަތު ޕޯޓަލް</button>
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
                        <tbody>{allStudents.map(s => (<tr key={s.id}><td>{s.student_name}</td><td className="ltr-text">{s.id_card}</td><td>{s.grade || '-'}</td><td>{s.level || '-'}</td><td>{s.category || '-'}</td><td>{s.recitation || '-'}</td><td>{s.parent_name || '-'}</td><td>{s.parent_address || '-'}</td><td className="ltr-text">{s.parent_phone}</td><td><input style={styles.tableInput} defaultValue={s.marks} onBlur={(e) => updateStudentResult(s.id, 'marks', e.target.value)} /></td><td><button onClick={()=>deleteStudent(s.id)} style={{...styles.btnSecondary, background:'red'}}>ފޮހެލާ</button></td></tr>))}</tbody>
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

            {adminTab === 'math' && (
                <div style={{ overflowX: 'auto', paddingBottom: '10px' }}>
                    <h3 style={{color: '#1976d2'}}>ސުވާލު ކީސާ (Bulk Upload)</h3>
                    <p style={{fontSize: '13px', color: '#666', marginBottom: '10px'}}>ތިރީގައިވާ ފޮއްޓަށް JSON ފޯމެޓުގައި ސުވާލުތައް ޕޭސްޓް ކުރައްވާ.</p>
                    <textarea 
                        value={bulkJSON} 
                        onChange={(e) => setBulkJSON(e.target.value)} 
                        placeholder='[ {"grade": "Grade 3", "question_text": "ދިވެހިރާއްޖޭގެ ވެރިރަށަކީ ކޮބާ?", "option_1": "މާލެ", "option_2": "އައްޑޫ", "option_3": "ކުޅުދުއްފުށި", "correct_option": "މާލެ"} ]'
                        style={{...styles.inputLtr, height: '200px', resize: 'vertical', fontFamily: 'monospace', fontSize: '12px'}}
                    />
                    <button onClick={handleBulkMathUpload} style={{...styles.btn, background: '#1976d2', marginTop: '10px', maxWidth: '200px'}}>އަޕްލޯޑް ކުރޭ</button>
                </div>
            )}

            {adminTab === 'gifts' && (
                <div style={{ overflowX: 'auto', paddingBottom: '10px' }}>
                    <div style={{background: '#e3f2fd', padding: '15px', borderRadius: '8px', marginBottom: '20px', borderLeft: '4px solid #1976d2'}}>
                        <p style={{margin: 0, fontSize: '13px', color: '#0056b3'}}>ℹ️ <b>މަޢުލޫމާތު:</b> ގުރުއަތު ނެގޭނީ މި އިނާމުގެ "ޓިކެޓް" ގަނެފައިވާ ކުދިންގެ މެދުގައެވެ. އެއް ކުއްޖަކަށް އެއް އިނާމެއްގެ ގިނަ ޓިކެޓްވެސް ގަނެވިދާނެއެވެ (ޗާންސް ބޮޑުވާނެއެވެ).</p>
                    </div>

                    <form onSubmit={saveGift} style={{...styles.form, marginBottom:'20px', minWidth: '500px', background: '#fff3e0', padding: '20px', borderRadius: '10px'}}>
                        <h3 style={{color: '#e65100', marginTop: 0}}>އައު އިނާމެއް އިތުރުކުރޭ</h3>
                        <input name="name" placeholder="އިނާމުގެ ނަން" style={styles.input} required />
                        <input name="cost" type="number" placeholder="ޓިކެޓެއްގެ އަގު (ކޮއިން)" style={styles.inputLtr} required />
                        <input name="image_url" placeholder="ފޮޓޯ ލިންކް (Image URL)" style={styles.inputLtr} required />
                        <button type="submit" style={{...styles.btn, background: '#ff9800', maxWidth: '200px'}}>އިތުރުކުރޭ</button>
                    </form>

                    <table style={{...styles.table, minWidth: '800px'}}>
                        <thead><tr><th>ފޮޓޯ</th><th>ނަން</th><th>ޓިކެޓެއްގެ އަގު</th><th>ކަންތައް</th></tr></thead>
                        <tbody>{allGifts.map(g => (
                            <tr key={g.id}>
                                <td><img src={g.image_url} alt={g.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px', border: '1px solid #ddd' }} /></td>
                                <td>{g.name}</td>
                                <td className="ltr-text" style={{color: '#ff9800', fontWeight: 'bold'}}>{g.cost} 🪙</td>
                                <td>
                                    <button style={{...styles.btnSecondary, background:'red', width:'auto', padding: '6px 12px', fontSize: '13px'}} onClick={()=>deleteGift(g.id)}>ފޮހެލާ</button>
                                </td>
                            </tr>
                        ))}</tbody>
                    </table>
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
                        <thead><tr><th>ވިޔަފާރި</th><th>ފޯނު</th><th>ގުޅޭނެ ފަރާތް</th></tr></thead>
                        <tbody>{partnerRequestsList.map(r => (<tr key={r.id}>
                            <td>{r.business_name}</td>
                            <td style={{direction: 'ltr', textAlign: 'right'}}>{r.phone}</td>
                            <td>{r.contact_name}</td>
                        </tr>))}</tbody>
                    </table>
                </div>
            )}
          </div>
        </div>
    );
}

const styles = {
  appContainer: { minHeight: '100vh', background: '#f0f4f8', direction: 'rtl', textAlign: 'right' },
  container: { padding: '20px', maxWidth: '1400px', margin: '0 auto' },
  centeredGrid: { padding: '20px', maxWidth: '1000px', margin: '0 auto' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' },
  card: { background: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', textAlign: 'center' },
  cardImg: { width: '100%', height: '180px', objectFit: 'cover', borderRadius: '10px', marginBottom: '15px' },
  centeredContainer: { minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' },
  quizCard: { background: 'white', width: '100%', maxWidth: '500px', padding: '30px', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' },
  quranCard: { background: 'white', width: '100%', maxWidth: '450px', padding: '30px', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' },
  form: { display: 'flex', flexDirection: 'column', gap: '12px' },
  input: { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', width: '100%', boxSizing: 'border-box', textAlign: 'right' },
  inputLtr: { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', width: '100%', boxSizing: 'border-box', textAlign: 'left', direction: 'ltr' },
  btn: { padding: '12px', background: '#0056b3', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', width: '100%' },
  btnSecondary: { padding: '10px', background: '#666', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', width: '100%' },
  optionBtn: { padding: '15px', background: '#f8f9fa', border: '2px solid #e0e0e0', borderRadius: '12px', cursor: 'pointer', textAlign: 'right', width:'100%', transition: 'all 0.2s', fontSize: '15px' },
  tabs: { display: 'flex', marginBottom: '20px' },
  tab: { flex: 1, padding: '10px', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '20px', textAlign: 'right' },
  tableInput: { width: '50px', padding: '5px', textAlign: 'center' },
  scrollArea: { maxHeight: '50vh', overflowY: 'auto', display:'flex', flexDirection:'column', gap:'10px' },
  partnerSection: { background: 'white', padding: '30px 20px', borderRadius: '15px', marginTop: '40px', textAlign: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' },
  sponsorGrid: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '15px', alignItems: 'center', marginTop: '20px' },
  sponsorImg: { maxWidth: '80px', maxHeight: '40px', objectFit: 'contain' },
  simpleLink: { color: '#0056b3', cursor: 'pointer', fontSize: '13px', marginTop: '20px', textDecoration: 'underline' }
};
