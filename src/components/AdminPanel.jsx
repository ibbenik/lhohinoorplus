import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function AdminPanel({ 
    allStudents, allQuestions, allPartners, partnerRequestsList, 
    winnerDate, setWinnerDate, loadAdminData, getActiveQuizDate, 
    fetchLatestWinner, styles 
}) {
    const [adminTab, setAdminTab] = useState('students');
    const [editingQ, setEditingQ] = useState(null);

    // --- ADMIN ACTIONS ---
    const saveQuestion = async (e) => { e.preventDefault(); const d = Object.fromEntries(new FormData(e.target)); if (d.correct_option !== d.option_1 && d.correct_option !== d.option_2 && d.correct_option !== d.option_3) return alert("ޖަވާބު ދިމައެއްނުވޭ"); if (!d.quiz_date) d.quiz_date = getActiveQuizDate(); if (editingQ) await supabase.from('lhohinoor_questions').update(d).eq('id', editingQ.id); else await supabase.from('lhohinoor_questions').insert([d]); setEditingQ(null); e.target.reset(); loadAdminData(); };
    const deleteQuestion = async (id) => { if(confirm("މި ސުވާލު ފޮހެލަންވީތަ؟")) { await supabase.from('lhohinoor_questions').delete().eq('id', id); loadAdminData(); } };
    const savePartner = async (e) => { e.preventDefault(); const d = Object.fromEntries(new FormData(e.target)); await supabase.from('lhohinoor_partners').insert([{ name: d.name, logo_url: d.logo_url }]); e.target.reset(); loadAdminData(); };
    const deletePartner = async (id) => { if(confirm("މި ބައިވެރިޔާ ފޮހެލަންވީތަ؟")) { await supabase.from('lhohinoor_partners').delete().eq('id', id); loadAdminData(); } };
    const updateStudentResult = async (id, field, value) => { await supabase.from('lhohinoor_students').update({ [field]: value }).eq('id', id); };
    const deleteStudent = async (id) => { if(confirm("މި ދަރިވަރު ފޮހެލަންވީތަ؟")) { await supabase.from('lhohinoor_students').delete().eq('id', id); loadAdminData(); } };
    
    const pickWinner = async () => { 
        if (!winnerDate) return alert("ތާރީޚް ޚިޔާރުކުރައްވާ.");
        const selectedDateObj = new Date(winnerDate); selectedDateObj.setDate(selectedDateObj.getDate() - 7); const sevenDaysAgo = selectedDateObj.toISOString().split('T')[0];
        const { data: recentWinners } = await supabase.from('lhohinoor_daily_winners').select('phone').gte('won_at', sevenDaysAgo).lte('won_at', winnerDate);
        const recentWinnerPhones = recentWinners ? recentWinners.map(w => w.phone) : [];
        const { data: qData } = await supabase.from('lhohinoor_questions').select('id').eq('quiz_date', winnerDate);
        if (!qData || qData.length === 0) return alert("މި ތާރީޚުގައި މުބާރާތެއް ނެތް.");
        const passMark = Math.ceil(qData.length * 0.8);
        const { data: attempts } = await supabase.from('lhohinoor_quiz_attempts').select('*').eq('created_at', winnerDate).gte('score', passMark); 
        if (!attempts || attempts.length === 0) return alert(`މި ތާރީޚުގައި ޝަރުތު ހަމަވާ މީހަކު ނެތް.`);
        const eligibleCandidates = attempts.filter(attempt => !recentWinnerPhones.includes(attempt.phone));
        if (eligibleCandidates.length > 0) {
          const winner = eligibleCandidates[Math.floor(Math.random() * eligibleCandidates.length)];
          await supabase.from('lhohinoor_daily_winners').insert([{ username: winner.username, phone: winner.phone, score: winner.score, prize: "🎁 100 ރުފިޔާގެ ގިފްޓް ވައުޗަރ", won_at: winnerDate, congrats_count: 0 }]);
          alert(`ނަސީބުވެރިޔާ: ${winner.username} (Score: ${winner.score})`); fetchLatestWinner();
        } else { alert(`ޝަރުތު ހަމަވާ މީހުން ތިބި ނަމަވެސް، އެންމެންނަކީ ފާއިތުވި 7 ދުވަހު އިނާމު ލިބިފައިވާ މީހުން!`); }
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
                        <input name="question_text" placeholder="ސުވާލު" defaultValue={editingQ?.question_text} style={styles.input} required />
                        <div style={{display:'flex', gap:10, flexWrap: 'wrap'}}>
                            <input name="option_1" placeholder="ޖަވާބު 1" defaultValue={editingQ?.option_1} style={{...styles.input, flex: 1, minWidth: '150px'}} required />
                            <input name="option_2" placeholder="ޖަވާބު 2" defaultValue={editingQ?.option_2} style={{...styles.input, flex: 1, minWidth: '150px'}} required />
                            <input name="option_3" placeholder="ޖަވާބު 3" defaultValue={editingQ?.option_3} style={{...styles.input, flex: 1, minWidth: '150px'}} required />
                        </div>
                        <input name="correct_option" placeholder="ރަނގަޅު ޖަވާބު" defaultValue={editingQ?.correct_option} style={styles.input} required />
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

            {adminTab === 'partners' && (
                <div style={{ overflowX: 'auto', paddingBottom: '10px' }}>
                    <form onSubmit={savePartner} style={{...styles.form, marginBottom:'20px', minWidth: '500px'}}>
                        <h3>ބައިވެރިއެއް އިތުރުކުރޭ</h3>
                        <input name="name" placeholder="ނަން" style={styles.input} required />
                        <input name="logo_url" placeholder="ލޯގޯ ލިންކް (URL)" style={styles.input} />
                        <button type="submit" style={{...styles.btn, maxWidth: '200px'}}>އިތުރުކުރޭ</button>
                    </form>
                    <table style={{...styles.table, minWidth: '500px'}}>
                        <thead><tr><th>ނަން</th><th>ކަންތައް</th></tr></thead>
                        <tbody>{allPartners.map(p => (<tr key={p.id}><td>{p.name}</td><td><button style={{...styles.btnSecondary, background:'red', width:'auto'}} onClick={()=>deletePartner(p.id)}>ފޮހެލާ</button></td></tr>))}</tbody>
                    </table>
                </div>
            )}
          </div>
        </div>
    );
}