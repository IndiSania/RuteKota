import { useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import {
  MapPin, Compass, CalendarDays, Wallet, Plus, Search, Trash2, Clock3,
  Navigation, ArrowUpRight, Route, X, ChevronDown, Sparkles, Plane,
  CircleCheck, LocateFixed, Bookmark, SlidersHorizontal
} from 'lucide-react';

const initialPlaces = [
  { id: 1, name: 'Tugu Pahlawan', category: 'Sejarah', city: 'Surabaya', lat: -7.2458, lng: 112.7378, cost: 15000, duration: '1–2 jam', note: 'Monumen bersejarah dan museum perjuangan.' },
  { id: 2, name: 'House of Sampoerna', category: 'Museum', city: 'Surabaya', lat: -7.2308, lng: 112.7376, cost: 10000, duration: '1–2 jam', note: 'Museum dengan bangunan kolonial yang ikonik.' },
  { id: 3, name: 'Taman Bungkul', category: 'Taman', city: 'Surabaya', lat: -7.2913, lng: 112.7397, cost: 0, duration: '1 jam', note: 'Ruang terbuka untuk bersantai dan menikmati suasana kota.' },
  { id: 4, name: 'Monumen Kapal Selam', category: 'Sejarah', city: 'Surabaya', lat: -7.2654, lng: 112.7501, cost: 15000, duration: '1 jam', note: 'Lihat kapal selam KRI Pasopati dari dekat.' },
  { id: 5, name: 'Kebun Binatang Surabaya', category: 'Wisata', city: 'Surabaya', lat: -7.2965, lng: 112.7368, cost: 15000, duration: '2–3 jam', note: 'Destinasi keluarga dengan beragam satwa.' },
  { id: 6, name: 'Alun-Alun Surabaya', category: 'Kota', city: 'Surabaya', lat: -7.2588, lng: 112.7452, cost: 0, duration: '1 jam', note: 'Area publik untuk menikmati pusat kota.' }
];
const fmt = n => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n || 0);
const pinIcon = L.divIcon({ className: 'custom-pin-wrap', html: '<div class="custom-pin"><span></span></div>', iconSize: [30, 38], iconAnchor: [15, 34], popupAnchor: [0, -30] });

function FitMap({ places }) {
  const map = useMap();
  if (places.length > 1) {
    const bounds = L.latLngBounds(places.map(p => [p.lat, p.lng]));
    map.fitBounds(bounds.pad(0.22), { animate: false });
  } else if (places.length === 1) {
    map.setView([places[0].lat, places[0].lng], 14, { animate: false });
  }
  return null;
}

function App() {
  const [places, setPlaces] = useState(initialPlaces);
  const [saved, setSaved] = useState([1, 3, 4]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Semua');
  const [activeTab, setActiveTab] = useState('Jelajahi');
  const [tripName, setTripName] = useState('Jelajah Surabaya');
  const [tripDate, setTripDate] = useState('2026-10-17');
  const [budget, setBudget] = useState('350000');
  const [selected, setSelected] = useState([1, 4, 3]);
  const [showAdd, setShowAdd] = useState(false);
  const [newPlace, setNewPlace] = useState({ name: '', category: 'Wisata', city: 'Surabaya', cost: '0', note: '' });
  const [notice, setNotice] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);

  const categories = ['Semua', ...new Set(places.map(p => p.category))];
  const filtered = useMemo(() => places.filter(p =>
    (category === 'Semua' || p.category === category) &&
    `${p.name} ${p.city} ${p.category}`.toLowerCase().includes(query.toLowerCase())
  ), [places, category, query]);
  const itinerary = selected.map(id => places.find(p => p.id === id)).filter(Boolean);
  const totalCost = itinerary.reduce((sum, p) => sum + Number(p.cost || 0), 0);
  const remaining = Number(budget || 0) - totalCost;
  const path = itinerary.map(p => [p.lat, p.lng]);
  const mapPlaces = activeTab === 'Tersimpan' ? places.filter(p => saved.includes(p.id)) : (itinerary.length ? itinerary : filtered.slice(0, 5));

  const flash = message => { setNotice(message); window.setTimeout(() => setNotice(''), 2600); };
  const toggleSaved = id => setSaved(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const toggleItinerary = id => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const addPlace = e => {
    e.preventDefault();
    const id = Math.max(0, ...places.map(p => p.id)) + 1;
    const place = { ...newPlace, id, cost: Number(newPlace.cost) || 0, lat: -7.2575 + (Math.random() - .5) * .04, lng: 112.7521 + (Math.random() - .5) * .04, duration: '1–2 jam' };
    setPlaces(prev => [...prev, place]);
    setNewPlace({ name: '', category: 'Wisata', city: 'Surabaya', cost: '0', note: '' });
    setShowAdd(false); setCategory('Semua'); setQuery('');
    flash('Destinasi berhasil ditambahkan.');
  };
  const removePlace = id => {
    setPlaces(prev => prev.filter(p => p.id !== id));
    setSelected(prev => prev.filter(x => x !== id));
    setSaved(prev => prev.filter(x => x !== id));
    flash('Destinasi dihapus dari daftar.');
  };
  const exportPlan = () => {
    const content = `${tripName}\nTanggal: ${tripDate || 'Belum ditentukan'}\nAnggaran: ${fmt(Number(budget))}\nEstimasi biaya tiket: ${fmt(totalCost)}\n\nRencana destinasi:\n${itinerary.map((p, i) => `${i + 1}. ${p.name} — ${p.category} — ${fmt(p.cost)}\n   ${p.note}`).join('\n')}\n\nCatatan: Biaya dan rute merupakan estimasi. Periksa kembali informasi sebelum berangkat.`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'rencana-perjalanan.txt'; a.click();
    URL.revokeObjectURL(url); flash('Rencana perjalanan berhasil diekspor.');
  };

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark"><Route size={22}/></div><div><strong>rutekota</strong><span>TRAVEL PLANNER</span></div></div>
      <div className="side-label">WORKSPACE</div>
      <nav className="nav-list">
        {[['Jelajahi', Compass], ['Rencana perjalanan', CalendarDays], ['Tersimpan', Bookmark]].map(([label, Icon]) =>
          <button key={label} className={`nav-item ${activeTab === label ? 'active' : ''}`} onClick={() => setActiveTab(label)}>
            <Icon size={18}/><span>{label}</span>{label === 'Tersimpan' && <small>{saved.length}</small>}
          </button>
        )}
      </nav>
      <div className="sidebar-bottom">
        <div className="mini-card"><div className="mini-icon"><Sparkles size={16}/></div><strong>Perjalanan lebih terencana</strong><p>Simpan tempat favorit dan susun rute dalam satu ruang.</p></div>
        <div className="profile"><div className="avatar">RK</div><div><strong>Traveler</strong><span>Perencana perjalanan</span></div><ChevronDown size={16} className="muted"/></div>
      </div>
    </aside>

    <main className="main-content">
      <header className="topbar">
        <div className="breadcrumbs">Workspace <span>/</span> <strong>{activeTab}</strong></div>
        <div className="top-actions"><span className="today"><span className="live-dot"></span> Perencana perjalanan pribadi</span><button className="icon-button" title="Pengaturan filter" onClick={() => setFilterOpen(!filterOpen)}><SlidersHorizontal size={18}/></button></div>
      </header>

      <section className="welcome-row">
        <div><div className="eyebrow"><span className="eyebrow-line"></span> YOUR NEXT ADVENTURE</div><h1>Jelajahi lebih jauh,<br/><em>rencanakan lebih mudah.</em></h1><p className="welcome-copy">Susun destinasi, atur anggaran, dan rencanakan perjalananmu tanpa ribet.</p></div>
        <div className="hero-stamp"><div className="stamp-circle"><Compass size={28}/></div><span>GO EXPLORE</span><small>MAKE IT COUNT</small></div>
      </section>

      <section className="trip-overview">
        <div className="trip-title"><div className="trip-icon"><Plane size={19}/></div><div><span className="overline">PERJALANAN AKTIF</span><input className="trip-name-input" value={tripName} onChange={e => setTripName(e.target.value)} aria-label="Nama perjalanan"/></div></div>
        <div className="trip-meta"><label><CalendarDays size={16}/><span>Tanggal berangkat</span><input type="date" value={tripDate} onChange={e => setTripDate(e.target.value)}/></label><div className="trip-divider"></div><label><Wallet size={16}/><span>Anggaran (Rp)</span><input type="number" min="0" value={budget} onChange={e => setBudget(e.target.value)}/></label></div>
        <button className="export-btn" onClick={exportPlan}><ArrowUpRight size={16}/> Ekspor rencana</button>
      </section>

      <section className="stats-grid">
        <div className="stat-card"><div className="stat-top"><span>Destinasi dipilih</span><span className="stat-icon purple"><MapPin size={17}/></span></div><div className="stat-number">{itinerary.length}<small> tempat</small></div><div className="stat-foot"><span className="stat-indicator"></span> Dalam rencana perjalanan</div></div>
        <div className="stat-card"><div className="stat-top"><span>Estimasi tiket</span><span className="stat-icon orange"><Wallet size={17}/></span></div><div className="stat-number compact">{fmt(totalCost)}</div><div className="stat-foot">Total biaya destinasi yang dipilih</div></div>
        <div className="stat-card"><div className="stat-top"><span>Sisa anggaran</span><span className="stat-icon green"><CircleCheck size={17}/></span></div><div className={`stat-number compact ${remaining < 0 ? 'over-budget' : ''}`}>{fmt(remaining)}</div><div className="budget-track"><span style={{ width: `${Math.min(100, Number(budget) > 0 ? totalCost / Number(budget) * 100 : 0)}%` }}></span></div><div className="stat-foot">{remaining < 0 ? 'Anggaran terlampaui' : 'Dari anggaran yang ditentukan'}</div></div>
      </section>

      <div className="section-heading"><div><h2>{activeTab === 'Tersimpan' ? 'Destinasi tersimpan' : activeTab === 'Rencana perjalanan' ? 'Susunan perjalanan' : 'Temukan destinasi'}</h2><p>{activeTab === 'Tersimpan' ? 'Kumpulan tempat yang kamu tandai untuk dikunjungi.' : activeTab === 'Rencana perjalanan' ? 'Atur destinasi yang ingin kamu kunjungi.' : 'Pilihan tempat menarik untuk memulai petualanganmu.'}</p></div><button className="primary-btn" onClick={() => setShowAdd(true)}><Plus size={17}/> Tambah destinasi</button></div>

      <div className="explore-layout">
        <section className="places-panel">
          <div className="search-row"><div className="search-box"><Search size={17}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Cari destinasi, kota, kategori..."/></div><button className={`filter-btn ${filterOpen ? 'filter-active' : ''}`} onClick={() => setFilterOpen(!filterOpen)}><SlidersHorizontal size={17}/><span>Filter</span></button></div>
          {filterOpen && <div className="filter-options"><span>Kategori</span><div className="chips">{categories.map(c => <button key={c} className={`chip ${category === c ? 'selected' : ''}`} onClick={() => setCategory(c)}>{c}</button>)}</div></div>}
          <div className="results-label"><span>{(activeTab === 'Tersimpan' ? places.filter(p => saved.includes(p.id)) : filtered).length} destinasi</span><button onClick={() => {setQuery('');setCategory('Semua')}}>Atur ulang</button></div>
          <div className="place-list">
            {(activeTab === 'Tersimpan' ? places.filter(p => saved.includes(p.id)) : activeTab === 'Rencana perjalanan' ? itinerary : filtered).map((p, index) =>
              <article className={`place-card ${selected.includes(p.id) ? 'in-plan' : ''}`} key={p.id}>
                <div className={`place-art art-${index % 5}`}><div className="art-sun"></div><div className="art-hill hill-one"></div><div className="art-hill hill-two"></div><span className="art-tag">{p.category}</span><div className="art-number">{String(index + 1).padStart(2, '0')}</div></div>
                <div className="place-info"><div className="place-heading"><h3>{p.name}</h3><button className={`save-btn ${saved.includes(p.id) ? 'saved' : ''}`} title={saved.includes(p.id) ? 'Hapus dari tersimpan' : 'Simpan destinasi'} onClick={() => toggleSaved(p.id)}><Bookmark size={17} fill={saved.includes(p.id) ? 'currentColor' : 'none'}/></button></div><div className="place-location"><MapPin size={13}/>{p.city}</div><p>{p.note || 'Tambahkan catatan untuk destinasi ini.'}</p><div className="place-bottom"><div><span className="price-label">ESTIMASI TIKET</span><strong>{fmt(p.cost)}</strong></div><span className="duration"><Clock3 size={13}/>{p.duration || '1–2 jam'}</span></div><div className="place-actions"><button className={`add-plan-btn ${selected.includes(p.id) ? 'added' : ''}`} onClick={() => {toggleItinerary(p.id);flash(selected.includes(p.id) ? 'Destinasi dihapus dari rencana.' : 'Destinasi ditambahkan ke rencana.')}}>{selected.includes(p.id) ? <><CircleCheck size={15}/> Ditambahkan</> : <><Plus size={15}/> Tambah ke rencana</>}</button><button className="delete-place" title="Hapus destinasi" onClick={() => removePlace(p.id)}><Trash2 size={15}/></button></div></div>
              </article>
            )}
            {(activeTab === 'Tersimpan' ? places.filter(p => saved.includes(p.id)) : activeTab === 'Rencana perjalanan' ? itinerary : filtered).length === 0 && <div className="empty-state"><MapPin size={28}/><strong>Belum ada destinasi</strong><span>Coba ubah pencarian atau tambahkan tempat baru.</span></div>}
          </div>
        </section>

        <aside className="map-panel">
          <div className="map-header"><div><span className="overline">VISUAL PLANNER</span><h3>Peta perjalanan</h3></div><span className="map-live"><span></span> LIVE MAP</span></div>
          <div className="map-container"><MapContainer center={[-7.265, 112.742]} zoom={13} scrollWheelZoom={true} zoomControl={true} className="leaflet-map"><TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>{mapPlaces.map((p, i) => <Marker key={p.id} position={[p.lat, p.lng]} icon={pinIcon}><Popup><strong>{p.name}</strong><br/>{p.category}<br/>{fmt(p.cost)}</Popup></Marker>)}{path.length > 1 && activeTab !== 'Tersimpan' && <Polyline positions={path} pathOptions={{ color: '#7464d9', weight: 4, opacity: .8, dashArray: '7 8' }}/>}<FitMap places={mapPlaces}/></MapContainer><div className="map-overlay-label"><LocateFixed size={14}/> Surabaya, Jawa Timur</div></div>
          <div className="map-legend"><span><i className="legend-pin"></i> Destinasi</span><span><i className="legend-route"></i> Urutan pilihan</span></div>
          <div className="route-summary"><div className="route-summary-title"><div><Route size={17}/><strong>Ringkasan rute</strong></div><span>{itinerary.length} titik</span></div>{itinerary.length ? <div className="route-stops">{itinerary.map((p, i) => <div className="route-stop" key={p.id}><div className="stop-marker">{i + 1}</div><div className="stop-text"><strong>{p.name}</strong><span>{p.duration || '1–2 jam'} · {fmt(p.cost)}</span></div>{i < itinerary.length - 1 && <div className="stop-connector"></div>}</div>)}</div> : <div className="empty-route">Tambahkan destinasi untuk menyusun rute perjalanan.</div>}<button className="directions-btn" onClick={() => {if (!itinerary.length) return flash('Tambahkan destinasi terlebih dahulu.');const dest = itinerary.map(p => `${p.lat},${p.lng}`).join('/');window.open(`https://www.google.com/maps/dir/${dest}`, '_blank', 'noopener,noreferrer')}}><Navigation size={16}/> Buka petunjuk di Google Maps <ArrowUpRight size={15}/></button><p className="route-note">Garis pada peta menunjukkan urutan pilihan, bukan rute jalan yang telah dioptimalkan.</p></div>
        </aside>
      </div>
      <footer className="footer"><span>© 2026 RuteKota. Rencanakan perjalananmu.</span><span>Dibuat untuk penjelajah yang suka terencana <Compass size={14}/></span></footer>
    </main>

    {showAdd && <div className="modal-backdrop" onClick={() => setShowAdd(false)}><div className="modal" onClick={e => e.stopPropagation()}><div className="modal-heading"><div><span className="overline">DESTINASI BARU</span><h2>Tambahkan tempat</h2><p>Masukkan detail destinasi yang ingin kamu kunjungi.</p></div><button className="icon-button" onClick={() => setShowAdd(false)}><X size={18}/></button></div><form onSubmit={addPlace} className="add-form"><label>Nama destinasi<input required value={newPlace.name} onChange={e => setNewPlace({...newPlace, name: e.target.value})} placeholder="Contoh: Museum Kota"/></label><div className="form-two"><label>Kategori<select value={newPlace.category} onChange={e => setNewPlace({...newPlace, category: e.target.value})}>{['Wisata','Sejarah','Museum','Taman','Kuliner','Alam','Kota','Lainnya'].map(c => <option key={c}>{c}</option>)}</select></label><label>Kota<input required value={newPlace.city} onChange={e => setNewPlace({...newPlace, city: e.target.value})}/></label></div><label>Estimasi biaya tiket (Rp)<input type="number" min="0" value={newPlace.cost} onChange={e => setNewPlace({...newPlace, cost: e.target.value})}/></label><label>Catatan singkat<textarea rows="3" value={newPlace.note} onChange={e => setNewPlace({...newPlace, note: e.target.value})} placeholder="Apa yang menarik dari tempat ini?"/></label><div className="modal-actions"><button type="button" className="secondary-btn" onClick={() => setShowAdd(false)}>Batal</button><button type="submit" className="primary-btn"><Plus size={16}/> Simpan destinasi</button></div><p className="form-note">Catatan: destinasi baru memakai titik peta perkiraan di sekitar Surabaya. Untuk lokasi yang akurat, pilih koordinat pada peta di versi pengembangan berikutnya.</p></form></div></div>}
    {notice && <div className="toast"><CircleCheck size={17}/>{notice}</div>}
  </div>;
}

export default App;
