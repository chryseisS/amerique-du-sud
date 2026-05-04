import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Check, Camera, MapPin, Calendar } from 'lucide-react';
import faune from '../donnees/faune.json';
import {
  HABITATS,
  RARETE_LIBELLES,
  versSlug,
} from '../donnees/constantes';
import Accordeon from '../composants/Accordeon';

function DetailFaune() {
  const { slug } = useParams();

  // On retrouve l'animal à partir du slug de son nom — même logique que DetailActivite
  const animal = faune.find((a) => versSlug(a.nom) === slug);

  // ─── ÉTAT TEMPORAIRE : sera remplacé par Dexie plus tard ───
  // observation = null → animal pas vu
  // observation = { date, lieu, note, photo } → animal vu
  const [observation, setObservation] = useState(null);

  // ─── Cas où l'animal n'existe pas (URL bidouillée) ───
  if (!animal) {
    return (
      <div className="p-4">
        <Link to="/journal/faune" className="flex items-center gap-2 text-terra-500 mb-4">
          <ArrowLeft className="w-4 h-4" strokeWidth={2} />
          <span className="text-sm">Retour</span>
        </Link>
        <p className="text-terra-muted">Espèce introuvable.</p>
      </div>
    );
  }

  // ─── Préparation des affichages ───
  const numero = String(animal.numero).padStart(3, '0');
  const etoiles = '★'.repeat(animal.rarete) + '☆'.repeat(3 - animal.rarete);
  const rareteLibelle = RARETE_LIBELLES[animal.rarete];

  // Le premier habitat de l'animal sert pour le tag (cas le plus courant)
  const habitatPrincipal = HABITATS[animal.habitats[0]];

  const vu = observation !== null;

  // ─── Action temporaire pour tester l'UI ───
  // À remplacer par un vrai formulaire (date, lieu, photo, note)
  const marquerCommeVu = () => {
    setObservation({
      date: '12 mai 2026',
      lieu: 'Vallée Sacrée, Cuzco',
      note: 'Croisé un troupeau près des ruines, le berger nous a fait essayer la laine.',
      photo: null,
    });
  };

  const reinitialiser = () => setObservation(null);

  return (
    <div className="p-4">
      {/* ─── Bouton retour ─── */}
      <Link
        to="/journal/faune"
        className="flex items-center gap-2 text-terra-500 mb-4"
      >
        <ArrowLeft className="w-4 h-4" strokeWidth={2} />
        <span className="text-sm">Retour</span>
      </Link>

      {/* ─── En-tête visuel : grosse bulle emoji + N° + badge statut ─── */}
      <div className="bg-terra-100 rounded-2xl h-40 flex items-center justify-center relative mb-4">
        <span className="text-7xl">{animal.emoji}</span>

        {/* Numéro Pokédex en haut à gauche */}
        <span className="absolute top-2.5 left-3 text-[10px] text-terra-muted bg-terra-50/85 px-2 py-0.5 rounded-md">
          N°{numero}
        </span>

        {/* Badge de statut en haut à droite */}
        <span
          className={`absolute top-2.5 right-3 text-[10px] px-2 py-0.5 rounded-md ${
            vu
              ? 'bg-terra-50/85 text-emerald-700'
              : 'bg-terra-50/85 text-terra-500'
          }`}
        >
          {vu ? '✓ vu' : `${etoiles} ${rareteLibelle}`}
        </span>
      </div>

      {/* ─── Titre ─── */}
      <h1 className="font-serif text-2xl text-terra-900 leading-tight">
        {animal.nom}
      </h1>


      {/* ─── Tag habitat + rareté ─── */}
      <div className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded bg-terra-100 text-terra-muted mb-4">
        {habitatPrincipal.icone} {habitatPrincipal.libelle} · {etoiles} {rareteLibelle}
      </div>

      {/* ─── Bloc "Mon observation" : visible seulement si vu ─── */}
      {vu && (
        <div className="bg-terra-500/10 border border-terra-500/20 rounded-xl p-3 mb-4">
          <div className="text-[10px] uppercase tracking-wider text-terra-500 mb-2">
            Mon observation
          </div>
          <div className="flex items-center gap-2 text-xs text-terra-900 mb-1">
            <Calendar className="w-3 h-3" strokeWidth={2} />
            <span>{observation.date}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-terra-900 mb-2">
            <MapPin className="w-3 h-3" strokeWidth={2} />
            <span>{observation.lieu}</span>
          </div>
          {observation.note && (
            <div className="font-serif text-xs italic text-terra-900/80 leading-relaxed">
              « {observation.note} »
            </div>
          )}
          {observation.photo && (
            <div className="flex items-center gap-1 text-[11px] text-terra-500 mt-2">
              <Camera className="w-3 h-3" strokeWidth={2} />
              <span>1 photo</span>
            </div>
          )}
        </div>
      )}

      {/* ─── Comment le reconnaître (toujours visible) ─── */}
      <div className="mb-4">
        <div className="text-[10px] uppercase tracking-wider text-terra-muted mb-1">
          Comment le reconnaître
        </div>
        <p className="text-sm text-terra-900 leading-relaxed text-justify">
          {animal.reconnaitre}
        </p>
      </div>

      {/* ─── Anecdote courte (toujours visible) ─── */}
      {animal.anecdoteCourte && (
        <div className="bg-terra-100 border-l-4 border-terra-500 rounded-md p-3 mb-4">
          <p className="font-serif text-sm italic text-terra-900/80 leading-relaxed">
            « {animal.anecdoteCourte} »
          </p>
        </div>
      )}

      {/* ─── Où le trouver ─── */}
      {animal.ouLeTrouver && animal.ouLeTrouver.length > 0 && (
        <div className="mb-4">
          <div className="text-[10px] uppercase tracking-wider text-terra-muted mb-2">
            Où le trouver
          </div>
          <div className="flex flex-wrap gap-1.5">
            {animal.ouLeTrouver.map((lieu) => (
              <span
                key={lieu}
                className="text-[11px] px-2 py-1 rounded bg-terra-100 text-terra-500"
              >
                {lieu}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ─── Accordéons : sections détaillées ─── */}
      {animal.sections && animal.sections.length > 0 && (
        <div className="border-b border-terra-border mb-4">
          {animal.sections.map((section, i) => (
            <Accordeon
              key={i}
              titre={section.titre}
              contenu={section.contenu}
            />
          ))}
        </div>
      )}

      {/* ─── Bouton principal : varie selon le statut ─── */}
      {!vu ? (
        <button
          onClick={marquerCommeVu}
          className="w-full bg-terra-500 text-white rounded-xl py-3 font-medium text-sm flex items-center justify-center gap-2"
        >
          <Check className="w-4 h-4" strokeWidth={2.5} />
          Je l'ai vu !
        </button>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={reinitialiser}
            className="flex-1 bg-terra-100 border border-terra-border text-terra-muted rounded-xl py-2.5 text-xs"
          >
            Réinitialiser (test)
          </button>
        </div>
      )}
    </div>
  );
}

export default DetailFaune;
