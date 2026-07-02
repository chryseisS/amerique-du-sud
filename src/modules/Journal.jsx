import faune from '../donnees/faune.json';
import gastronomie from '../donnees/gastronomie.json';
import { useObservationsFaune } from '../hooks/useObservationsFaune';
import { useAvisGastronomie } from '../hooks/useAvisGastronomie';
import JournalBlock from '../composants/JournalBlock';

// ═══════════════════════════════════════════════════════
// Composant stat : titre + sous-titre à gauche, cercle à droite
// ═══════════════════════════════════════════════════════
function StatBloc({ titre, sousTitre, fait, total, couleur = 'terra-900' }) {
  const pct = total > 0 ? fait / total : 0;
  const r = 18;
  const circonference = 2 * Math.PI * r;
  const dash = pct * circonference;

  return (

    <div className="flex items-center justify-between gap-3">

      {/* Gauche : titre + sous-titre */}
      <div>
        <div className={`font-serif font-semibold text-xl leading-tight text-${couleur}`}>
          {titre}
        </div>
        {sousTitre && (
          <div className={`text-[10px] italic opacity-60 text-${couleur}`}>
            {sousTitre}
          </div>
        )}
      </div>

      {/* Droite : cercle de progression */}
      <div className="flex-shrink-0">
        <svg width="52" height="52" viewBox="0 0 52 52">
          {/* Fond cercle */}
          <circle
            cx="26" cy="26" r={r}
            fill="none"
            stroke="#999999"
            strokeWidth="3"
          />
          {/* Arc progression */}
          <circle
            cx="26" cy="26" r={r}
            fill="none"
            stroke="#2a1a0e"
            strokeOpacity="0.85"
            strokeWidth="3"
            strokeDasharray={`${dash} ${circonference}`}
            strokeLinecap="round"
            transform="rotate(-90 26 26)"
          />
          {/* Chiffre */}
          <text
            x="26" y="28"
            textAnchor="middle"
            fontSize="11"
            fill="#2a1a0e"
            fontFamily="system-ui"
            fontWeight="700"
          >
            {fait}
          </text>
        </svg>
      </div>

    </div>
  );
}

// ═══════════════════════════════════════════════════════
// Configuration centralisée des 4 blocs
// ═══════════════════════════════════════════════════════
const JOURNAL_BLOCKS = [
  {
    id: 'journal',
    to: '/journal/bord',
    icon: '/images/journal/journal_icone.png',
    bgStyle: {
      backgroundImage: 'url(/images/journal/journal_de_bord.png)',
      backgroundPosition: 'center',
      backgroundSize: 'cover',
    },
  },
  {
    id: 'gastro',
    to: '/journal/gastronomie',
    icon: '/images/journal/gastronomie_icone.png',
    bgStyle: {
      backgroundImage: 'url(/images/journal/gastronomie.png)',
      backgroundPosition: 'center',
      backgroundSize: 'cover',
    },
  },
  {
    id: 'premieres-fois',
    to: '/journal/premieres-fois',
    icon: '/images/journal/defis_icone.png',
    bgStyle: {
      backgroundImage: 'url(/images/journal/defis.png)',
      backgroundPosition: 'center',
      backgroundSize: 'cover',
    },
  },
  {
    id: 'pokedex',
    to: '/journal/faune',
    icon: '/images/journal/pokedex_icone.png',
    bgStyle: {
      backgroundImage: 'url(/images/journal/pokedex.png)',
      backgroundPosition: 'center',
      backgroundSize: 'cover',
    },
  },
];

function Journal() {
  const { vuSet } = useObservationsFaune();
  const { testeSet } = useAvisGastronomie();

  const gastro = { fait: testeSet.size, total: gastronomie.length };
  const fauneFait = vuSet.size;
  const fauneTotal = faune.length;
  const last = null;
  const premieresFois = { fait: 0, total: 10 };

  return (
    <div className="fond-carte-journal relative min-h-full overflow-hidden">

    <div className="p-4">

      {/* ═══ Titre de la page ═══ */}
      <div className="text-center mb-5">
        <div className="inline-block border-t border-b border-terra-muted/60 py-3">
          <h1 className="font-serif text-4xl text-terra-900 font-semibold leading-none">
            Carnet
          </h1>
          <div className="font-serif italic text-sm text-terra-muted mt-1">
            de notre traversée sud-américaine
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">

        {/* ─── BLOC 1 : JOURNAL DE BORD ─── */}
        <div style={JOURNAL_BLOCKS[0].bgStyle} className="rounded-2xl min-h-[120px] shadow-md hover:shadow-lg transition-shadow overflow-hidden">
          <JournalBlock to={JOURNAL_BLOCKS[0].to} icon={JOURNAL_BLOCKS[0].icon} bgClassName="bg-transparent">
            <div>
              <div className="font-serif font-semibold text-xl text-terra-900 leading-tight">
                Journal de bord
              </div>
              <div className="text-[10px] italic text-terra-900/50 mb-1">de notre voyage</div>
            </div>
          </JournalBlock>
        </div>

        {/* ─── BLOC 2 : GASTRONOMIE ─── */}
        <div style={JOURNAL_BLOCKS[1].bgStyle} className="rounded-2xl min-h-[120px] shadow-md hover:shadow-lg transition-shadow overflow-hidden">
          <JournalBlock to={JOURNAL_BLOCKS[1].to} icon={JOURNAL_BLOCKS[1].icon} bgClassName="bg-transparent">
            <StatBloc
              titre="Gastronomie"
              sousTitre="Carte des saveurs"
              fait={gastro.fait}
              total={gastro.total}
            />
          </JournalBlock>
        </div>

        {/* ─── BLOC 3 : PREMIÈRES FOIS ─── */}
        <div style={JOURNAL_BLOCKS[2].bgStyle} className="rounded-2xl min-h-[120px] shadow-md hover:shadow-lg transition-shadow overflow-hidden">
          <JournalBlock to={JOURNAL_BLOCKS[2].to} icon={JOURNAL_BLOCKS[2].icon} bgClassName="bg-transparent">
            <StatBloc
              titre="1ères Fois"
              sousTitre="Les expériences à vivre"
              fait={premieresFois.fait}
              total={premieresFois.total}
            />
          </JournalBlock>
        </div>

        {/* ─── BLOC 4 : POKÉDEX ─── */}
        <div style={JOURNAL_BLOCKS[3].bgStyle} className="rounded-2xl min-h-[120px] shadow-md hover:shadow-lg transition-shadow overflow-hidden">
          <JournalBlock to={JOURNAL_BLOCKS[3].to} icon={JOURNAL_BLOCKS[3].icon} bgClassName="bg-transparent">
            <StatBloc
              titre="Pokédex"
              sousTitre="de la faune"
              fait={fauneFait}
              total={fauneTotal}
            />
          </JournalBlock>
        </div>

      </div>
    </div></div>
  );
}

export default Journal;