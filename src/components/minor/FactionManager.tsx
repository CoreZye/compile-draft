import { useState, useEffect } from 'react';
import { db } from '../../utils/firebase'; // Your config
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

// Types for TS safety
interface Faction { id: string; name: string; }
interface Card { id: string; name: string; factionId: string; }
interface CardDetail extends Card { description: string; power: number; }

type ViewState = 'FACTIONS' | 'CARDS' | 'DETAILS';

const FactionManager = () => {
  // Navigation State
  const [view, setView] = useState<ViewState>('FACTIONS');
  const [selectedFactionId, setSelectedFactionId] = useState<string | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  // Data Cache State
  const [factions, setFactions] = useState<Faction[]>([]);
  const [cardsByFaction, setCardsByFaction] = useState<Record<string, Card[]>>({});
  const [cardDetails, setCardDetails] = useState<Record<string, CardDetail>>({});

  // 1. Load Factions on mount
  useEffect(() => {
    const loadFactions = async () => {
      const querySnapshot = await getDocs(collection(db, "factions"));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Faction));
      setFactions(data);
    };
    loadFactions();
  }, []);

  // 2. Select Faction (Load cards only if not cached)
  const handleSelectFaction = async (id: string) => {
    setSelectedFactionId(id);
    setView('CARDS');

    if (!cardsByFaction[id]) {
      const q = await getDocs(collection(db, `factions/${id}/cards`));
      const data = q.docs.map(doc => ({ id: doc.id, ...doc.data() } as Card));
      setCardsByFaction(prev => ({ ...prev, [id]: data }));
    }
  };

  // 3. Select Card (Load details only if not cached)
  const handleSelectCard = async (id: string) => {
    setSelectedCardId(id);
    setView('DETAILS');

    if (!cardDetails[id]) {
      const docRef = doc(db, "cardDetails", id); // Or wherever your details live
      const d = await getDoc(docRef);
      setCardDetails(prev => ({ ...prev, [id]: { id: d.id, ...d.data() } as CardDetail }));
    }
  };

  // Custom Back Logic
  const goBack = () => {
    if (view === 'DETAILS') setView('CARDS');
    else if (view === 'CARDS') setView('FACTIONS');
  };

  useEffect(() => {
    // Push a state so there is something to "go back" from
    window.history.pushState(null, "", window.location.href);

    const handlePopState = (_event: PopStateEvent) => {
        // Prevent the actual browser back
        window.history.pushState(null, "", window.location.href);
        
        // Trigger your internal back logic instead
        goBack(); 
  };

  window.addEventListener('popstate', handlePopState);
  return () => window.removeEventListener('popstate', handlePopState);
}, [view]); // Re-run to ensure goBack has the latest view state

  return (
    <div className="app-container">
      {view !== 'FACTIONS' && <button onClick={goBack}>Back</button>}

      {view === 'FACTIONS' && (
        <div className="grid">
          {factions.map(f => (
            <div key={f.id} onClick={() => handleSelectFaction(f.id)}>{f.name}</div>
          ))}
        </div>
      )}

      {view === 'CARDS' && selectedFactionId && (
        <div className="grid">
          {cardsByFaction[selectedFactionId]?.map(c => (
            <div key={c.id} onClick={() => handleSelectCard(c.id)}>{c.name}</div>
          ))}
        </div>
      )}

      {view === 'DETAILS' && selectedCardId && cardDetails[selectedCardId] && (
        <div className="detail-view">
          <h1>{cardDetails[selectedCardId].name}</h1>
          <p>{cardDetails[selectedCardId].description}</p>
        </div>
      )}
    </div>
  );
};
export default FactionManager