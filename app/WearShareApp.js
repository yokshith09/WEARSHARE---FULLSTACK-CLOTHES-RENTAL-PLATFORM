'use client'
import { useState, useEffect, useCallback } from 'react'

const PRIMARY = '#8B5CF6'
const ACCENT = '#EC4899'
const DARK = '#1F2937'
const LIGHT = '#F9FAFB'
const BORDER = '#E5E7EB'
const SUCCESS = '#10B981'
const DANGER = '#EF4444'

const styles = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%); color: #1F2937; }
  @keyframes fadeInUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
  @keyframes slideIn { from { transform:translateX(400px); opacity:0; } to { transform:translateX(0); opacity:1; } }
  @keyframes spin { to { transform:rotate(360deg); } }
  .fadeInUp { animation: fadeInUp 0.6s ease-out forwards; }
  .btn { border:none; cursor:pointer; font-weight:600; transition:all 0.2s; font-family:inherit; }
  .btn:hover { transform:translateY(-1px); }
  .btn:disabled { opacity:0.6; cursor:not-allowed; transform:none; }
  .input { width:100%; padding:0.8rem 1rem; border:2px solid #E5E7EB; border-radius:8px; font-size:0.95rem; font-family:inherit; outline:none; transition:border-color 0.2s; }
  .input:focus { border-color:#8B5CF6; box-shadow:0 0 0 3px rgba(139,92,246,0.1); }
  .card { background:white; border-radius:16px; border:1px solid #E5E7EB; box-shadow:0 2px 8px rgba(0,0,0,0.06); transition:all 0.3s; }
  .card:hover { box-shadow:0 12px 36px rgba(0,0,0,0.12); transform:translateY(-4px); }
  .badge { display:inline-block; padding:0.35rem 0.75rem; border-radius:6px; font-size:0.8rem; font-weight:700; }
  .gradient-text { background:linear-gradient(135deg,#8B5CF6,#EC4899); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
  .gradient-bg { background:linear-gradient(135deg,#8B5CF6,#7C3AED); }
  .spinner { width:20px; height:20px; border:2px solid rgba(255,255,255,0.3); border-top-color:white; border-radius:50%; animation:spin 0.8s linear infinite; display:inline-block; }
  select.input { background:white; }
  textarea.input { resize:vertical; min-height:100px; }
  @media(max-width:768px) { .hide-mobile { display:none !important; } }
`

function Toast({ toasts }) {
  return (
    <div style={{ position:'fixed', bottom:'2rem', right:'2rem', zIndex:9999, display:'flex', flexDirection:'column', gap:'0.5rem' }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background:'white', padding:'1rem 1.5rem', borderRadius:'10px',
          boxShadow:'0 8px 24px rgba(0,0,0,0.15)',
          borderLeft:`4px solid ${t.type === 'success' ? SUCCESS : DANGER}`,
          animation:'slideIn 0.3s ease-out', display:'flex', alignItems:'center', gap:'0.75rem',
          minWidth:'280px'
        }}>
          <i className={`fas fa-${t.type === 'success' ? 'check-circle' : 'exclamation-circle'}`}
            style={{ color: t.type === 'success' ? SUCCESS : DANGER, fontSize:'1.1rem' }} />
          <span style={{ fontSize:'0.95rem', fontWeight:500 }}>{t.msg}</span>
        </div>
      ))}
    </div>
  )
}

function Modal({ show, onClose, title, children, wide }) {
  if (!show) return null
  return (
    <div onClick={onClose} style={{
      position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:1000,
      display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem',
      backdropFilter:'blur(4px)'
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background:'white', borderRadius:'20px', padding:'2rem',
        width:'100%', maxWidth: wide ? '700px' : '480px',
        boxShadow:'0 20px 60px rgba(0,0,0,0.3)',
        animation:'fadeInUp 0.3s ease-out', maxHeight:'90vh', overflowY:'auto'
      }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
          <h2 style={{ fontSize:'1.4rem', fontWeight:800 }} className="gradient-text">{title}</h2>
          <button onClick={onClose} className="btn" style={{
            background:'none', fontSize:'1.4rem', color:'#9CA3AF', padding:'0.25rem 0.5rem', borderRadius:'6px'
          }}>×</button>
        </div>
        {children}
      </div>
    </div>
  )
}

function FormGroup({ label, children }) {
  return (
    <div style={{ marginBottom:'1.25rem' }}>
      <label style={{ display:'block', fontWeight:600, marginBottom:'0.4rem', fontSize:'0.9rem', color:DARK }}>{label}</label>
      {children}
    </div>
  )
}

export default function WearShareApp() {
  const [page, setPage] = useState('home')
  const [user, setUser] = useState(null)
  const [toasts, setToasts] = useState([])
  const [cartCount, setCartCount] = useState(0)
  const [loading, setLoading] = useState(true)

  // Modals
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [showCreateListing, setShowCreateListing] = useState(false)
  const [showCart, setShowCart] = useState(false)

  const toast = useCallback((msg, type='success') => {
    const id = Date.now()
    setToasts(p => [...p, { id, msg, type }])
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500)
  }, [])

  const refreshCart = useCallback(async () => {
    if (!user) return setCartCount(0)
    try {
      const r = await fetch('/api/cart')
      if (r.ok) {
        const d = await r.json()
        setCartCount(d.items?.length || 0)
      }
    } catch {}
  }, [user])

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.ok ? r.json() : null).then(u => {
      setUser(u)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  useEffect(() => { refreshCart() }, [refreshCart])

  const logout = async () => {
    await fetch('/api/auth/me', { method:'DELETE' })
    setUser(null)
    setCartCount(0)
    setPage('home')
    toast('Logged out successfully')
  }

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh' }}>
      <div className="spinner" style={{ borderTopColor:PRIMARY, width:40, height:40, borderWidth:3 }} />
    </div>
  )

  return (
    <>
      <style>{styles}</style>
      <Toast toasts={toasts} />

      <Header
        user={user} page={page} setPage={setPage}
        cartCount={cartCount} logout={logout}
        onLogin={() => setShowLogin(true)}
        onRegister={() => setShowRegister(true)}
        onCart={() => setShowCart(true)}
      />

      {page === 'home' && <HomePage user={user} setPage={setPage} onRegister={() => setShowRegister(true)} />}
      {page === 'explore' && (
        <ExplorePage user={user} toast={toast} refreshCart={refreshCart} onLogin={() => setShowLogin(true)} setCartCount={setCartCount} />
      )}
      {page === 'dashboard' && user && (
        <DashboardPage user={user} toast={toast} onCreateListing={() => setShowCreateListing(true)} />
      )}

      <LoginModal show={showLogin} onClose={() => setShowLogin(false)}
        setUser={setUser} toast={toast} switchToRegister={() => { setShowLogin(false); setShowRegister(true) }} />
      <RegisterModal show={showRegister} onClose={() => setShowRegister(false)}
        setUser={setUser} toast={toast} switchToLogin={() => { setShowRegister(false); setShowLogin(true) }} />
      <CreateListingModal show={showCreateListing} onClose={() => setShowCreateListing(false)} toast={toast} user={user} />
      <CartModal show={showCart} onClose={() => setShowCart(false)} toast={toast} user={user} refreshCart={refreshCart} setPage={setPage} />
    </>
  )
}

function Header({ user, page, setPage, cartCount, logout, onLogin, onRegister, onCart }) {
  return (
    <header style={{
      background:'rgba(255,255,255,0.97)', boxShadow:'0 4px 20px rgba(0,0,0,0.08)',
      position:'sticky', top:0, zIndex:500, padding:'1rem 2rem'
    }}>
      <nav style={{ maxWidth:1300, margin:'0 auto', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div onClick={() => setPage('home')} style={{
          fontSize:'1.7rem', fontWeight:900, cursor:'pointer',
          background:`linear-gradient(135deg,${PRIMARY},${ACCENT})`,
          WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text'
        }}>
          <i className="fas fa-shirt" style={{ marginRight:'0.4rem' }} />WearShare
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:'1.5rem' }}>
          <button onClick={() => setPage('explore')} className="btn" style={{
            background:'none', color: page==='explore' ? PRIMARY : DARK, padding:'0.4rem 0.75rem',
            borderRadius:'8px', fontSize:'0.95rem', fontWeight: page==='explore' ? 700 : 500
          }}>
            <i className="fas fa-search" style={{ marginRight:'0.4rem' }} />Explore
          </button>

          {user && (
            <button onClick={() => setPage('dashboard')} className="btn" style={{
              background:'none', color: page==='dashboard' ? PRIMARY : DARK, padding:'0.4rem 0.75rem',
              borderRadius:'8px', fontSize:'0.95rem', fontWeight: page==='dashboard' ? 700 : 500
            }}>
              <i className="fas fa-chart-pie" style={{ marginRight:'0.4rem' }} />Dashboard
            </button>
          )}

          {user && (
            <button onClick={onCart} className="btn" style={{
              background:'none', color:DARK, padding:'0.4rem 0.75rem',
              borderRadius:'8px', fontSize:'0.95rem', position:'relative'
            }}>
              <i className="fas fa-shopping-cart" />
              {cartCount > 0 && (
                <span style={{
                  position:'absolute', top:'-4px', right:'-4px',
                  background:ACCENT, color:'white', borderRadius:'50%',
                  width:'18px', height:'18px', fontSize:'0.7rem',
                  display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700
                }}>{cartCount}</span>
              )}
            </button>
          )}

          {!user ? (
            <div style={{ display:'flex', gap:'0.75rem' }}>
              <button onClick={onLogin} className="btn" style={{
                padding:'0.6rem 1.25rem', borderRadius:'50px', border:`2px solid ${PRIMARY}`,
                color:PRIMARY, background:'white', fontSize:'0.9rem'
              }}>Login</button>
              <button onClick={onRegister} className="btn gradient-bg" style={{
                padding:'0.6rem 1.25rem', borderRadius:'50px', color:'white', fontSize:'0.9rem',
                boxShadow:`0 4px 12px rgba(139,92,246,0.3)`
              }}>Sign Up</button>
            </div>
          ) : (
            <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
              <span style={{ fontSize:'0.9rem', color:'#6B7280' }}>Hi, {user.name?.split(' ')[0]}</span>
              <button onClick={logout} className="btn" style={{
                padding:'0.6rem 1rem', borderRadius:'8px', background:LIGHT,
                color:DARK, fontSize:'0.85rem', border:`1px solid ${BORDER}`
              }}>Logout</button>
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}

function HomePage({ user, setPage, onRegister }) {
  const features = [
    { icon:'fa-tag', title:'Affordable Luxury', desc:'Premium brands at a fraction of retail price' },
    { icon:'fa-lock', title:'100% Secure', desc:'Verified users and deposits protect everyone' },
    { icon:'fa-leaf', title:'Eco-Friendly', desc:'Reduce fashion waste, promote sustainability' },
    { icon:'fa-star', title:'Curated Selection', desc:'Quality-checked items only' },
    { icon:'fa-shipping-fast', title:'Fast Delivery', desc:'Get items within 24-48 hours' },
    { icon:'fa-users', title:'Community Trust', desc:'Ratings and reviews build confidence' },
  ]
  return (
    <div>
      {/* Hero */}
      <section style={{
        background:'linear-gradient(135deg, rgba(139,92,246,0.08) 0%, rgba(236,72,153,0.08) 100%)',
        padding:'7rem 2rem', textAlign:'center'
      }}>
        <div style={{ maxWidth:700, margin:'0 auto' }} className="fadeInUp">
          <h1 style={{ fontSize:'clamp(2rem,5vw,3.5rem)', fontWeight:900, lineHeight:1.2, marginBottom:'1.25rem' }} className="gradient-text">
            Luxury Fashion,<br/>Without the Price Tag
          </h1>
          <p style={{ fontSize:'1.15rem', color:'#6B7280', marginBottom:'2.5rem', lineHeight:1.6 }}>
            Rent premium clothing for every occasion. Share your wardrobe and earn. Sustainable fashion at your fingertips.
          </p>
          <div style={{ display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap' }}>
            <button onClick={() => setPage('explore')} className="btn gradient-bg" style={{
              padding:'1rem 2.5rem', borderRadius:'50px', color:'white', fontSize:'1.05rem',
              boxShadow:'0 6px 20px rgba(139,92,246,0.4)'
            }}>
              <i className="fas fa-search" style={{ marginRight:'0.5rem' }} />Explore Now
            </button>
            {!user && (
              <button onClick={onRegister} className="btn" style={{
                padding:'1rem 2.5rem', borderRadius:'50px', fontSize:'1.05rem',
                border:'2px solid #8B5CF6', color:'#8B5CF6', background:'white'
              }}>
                <i className="fas fa-plus" style={{ marginRight:'0.5rem' }} />List Your Clothes
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ maxWidth:1200, margin:'0 auto', padding:'3rem 2rem' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'1.5rem' }}>
          {[['10K+','Premium Items'],['5K+','Happy Renters'],['₹50L+','Saved Together'],['4.8★','Avg Rating']].map(([num,label]) => (
            <div key={label} className="card" style={{ padding:'1.75rem', textAlign:'center' }}>
              <div style={{ fontSize:'2.2rem', fontWeight:900, marginBottom:'0.4rem' }} className="gradient-text">{num}</div>
              <div style={{ color:'#6B7280', fontWeight:600 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ maxWidth:1200, margin:'0 auto', padding:'3rem 2rem' }}>
        <h2 style={{ textAlign:'center', fontSize:'2.2rem', fontWeight:900, marginBottom:'0.75rem' }} className="gradient-text">Why WearShare?</h2>
        <p style={{ textAlign:'center', color:'#6B7280', marginBottom:'2.5rem' }}>The smartest way to access premium fashion</p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'1.5rem' }}>
          {features.map(f => (
            <div key={f.icon} className="card" style={{ padding:'2rem', textAlign:'center' }}>
              <i className={`fas ${f.icon}`} style={{
                fontSize:'2.5rem', marginBottom:'1rem', display:'block',
                background:`linear-gradient(135deg,#8B5CF6,#EC4899)`,
                WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text'
              }} />
              <h3 style={{ fontWeight:700, marginBottom:'0.5rem' }}>{f.title}</h3>
              <p style={{ color:'#6B7280', fontSize:'0.9rem', lineHeight:1.5 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background:'linear-gradient(135deg,#8B5CF6,#EC4899)', padding:'4rem 2rem', textAlign:'center', marginTop:'2rem' }}>
        <h2 style={{ color:'white', fontSize:'2.2rem', fontWeight:900, marginBottom:'1rem' }}>Ready to Join?</h2>
        <p style={{ color:'rgba(255,255,255,0.9)', marginBottom:'2rem', fontSize:'1.05rem' }}>
          Thousands are saving money and the planet
        </p>
        <button onClick={() => setPage('explore')} className="btn" style={{
          background:'white', color:'#8B5CF6', padding:'1rem 2.5rem',
          borderRadius:'50px', fontSize:'1.05rem', fontWeight:700
        }}>
          Browse Items <i className="fas fa-arrow-right" style={{ marginLeft:'0.5rem' }} />
        </button>
      </section>

      <footer style={{ background:'#1F2937', color:'#9CA3AF', textAlign:'center', padding:'2rem', fontSize:'0.9rem' }}>
        © 2024 WearShare. Made with ❤️ for sustainable fashion.
      </footer>
    </div>
  )
}

function ExplorePage({ user, toast, refreshCart, onLogin }) {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [size, setSize] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [selectedListing, setSelectedListing] = useState(null)

  const loadListings = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (category) params.set('category', category)
    if (size) params.set('size', size)
    if (minPrice) params.set('min_price', minPrice)
    if (maxPrice) params.set('max_price', maxPrice)
    try {
      const r = await fetch('/api/listings?' + params)
      const d = await r.json()
      setListings(Array.isArray(d) ? d : [])
    } catch { setListings([]) }
    setLoading(false)
  }

  useEffect(() => { loadListings() }, [])

  const addToCart = async (listing) => {
    if (!user) { onLogin(); return }
    const r = await fetch('/api/cart', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ listingId: listing._id, days: 1 })
    })
    if (r.ok) { toast('Added to cart! 🛒'); refreshCart() }
    else toast('Failed to add to cart', 'error')
  }

  const colors = ['linear-gradient(135deg,#8B5CF6,#EC4899)','linear-gradient(135deg,#EC4899,#F59E0B)','linear-gradient(135deg,#10B981,#3B82F6)','linear-gradient(135deg,#F59E0B,#EF4444)','linear-gradient(135deg,#3B82F6,#8B5CF6)']

  return (
    <div style={{ maxWidth:1300, margin:'0 auto', padding:'2rem' }}>
      <div style={{ marginBottom:'2rem' }}>
        <h1 style={{ fontSize:'2.2rem', fontWeight:900, marginBottom:'0.4rem' }} className="gradient-text">
          <i className="fas fa-tshirt" style={{ marginRight:'0.5rem' }} />Explore Fashion
        </h1>
        <p style={{ color:'#6B7280' }}>Discover premium clothing to rent for any occasion</p>
      </div>

      {/* Filters */}
      <div className="card" style={{ padding:'1.25rem', marginBottom:'2rem', display:'flex', flexWrap:'wrap', gap:'0.75rem', alignItems:'flex-end' }}>
        <div style={{ flex:'2 1 200px' }}>
          <input className="input" value={search} onChange={e=>setSearch(e.target.value)}
            onKeyDown={e=>e.key==='Enter'&&loadListings()}
            placeholder="🔍 Search clothes, brands..." style={{ marginBottom:0 }} />
        </div>
        <div style={{ flex:'1 1 150px' }}>
          <select className="input" value={category} onChange={e=>setCategory(e.target.value)}>
            <option value="">All Categories</option>
            {['Dress','Suit','Jacket','Saree','Lehenga','Kurta','Shoes','Accessories'].map(c=><option key={c} value={c.toLowerCase()}>{c}</option>)}
          </select>
        </div>
        <div style={{ flex:'1 1 100px' }}>
          <select className="input" value={size} onChange={e=>setSize(e.target.value)}>
            <option value="">All Sizes</option>
            {['XS','S','M','L','XL','XXL'].map(s=><option key={s}>{s}</option>)}
          </select>
        </div>
        <div style={{ flex:'1 1 120px' }}>
          <input className="input" type="number" value={minPrice} onChange={e=>setMinPrice(e.target.value)} placeholder="Min ₹" />
        </div>
        <div style={{ flex:'1 1 120px' }}>
          <input className="input" type="number" value={maxPrice} onChange={e=>setMaxPrice(e.target.value)} placeholder="Max ₹" />
        </div>
        <button onClick={loadListings} className="btn gradient-bg" style={{ color:'white', padding:'0.8rem 1.5rem', borderRadius:'8px', whiteSpace:'nowrap' }}>
          <i className="fas fa-search" style={{marginRight:'0.4rem'}} />Search
        </button>
      </div>

      {loading ? (
        <div style={{ display:'flex', justifyContent:'center', padding:'4rem' }}>
          <div className="spinner" style={{ borderTopColor:PRIMARY, width:40, height:40, borderWidth:3 }} />
        </div>
      ) : listings.length === 0 ? (
        <div style={{ textAlign:'center', padding:'4rem', color:'#9CA3AF' }}>
          <i className="fas fa-search" style={{ fontSize:'3rem', marginBottom:'1rem', display:'block' }} />
          <h3 style={{ marginBottom:'0.5rem' }}>No items found</h3>
          <p>Try adjusting your filters</p>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(270px,1fr))', gap:'1.5rem' }}>
          {listings.map((l, idx) => (
            <div key={l._id} className="card" style={{ overflow:'hidden', cursor:'pointer' }} onClick={()=>setSelectedListing(l)}>
              <div style={{ height:200, background:colors[idx%colors.length], display:'flex', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden' }}>
                {l.imageUrl
                  ? <img src={l.imageUrl} alt={l.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e=>{e.target.style.display='none'}} />
                  : <i className="fas fa-tshirt" style={{ fontSize:'4rem', color:'rgba(255,255,255,0.4)' }} />
                }
                <span style={{ position:'absolute', top:'1rem', right:'1rem', background:'rgba(0,0,0,0.5)', color:'white', padding:'0.3rem 0.7rem', borderRadius:'6px', fontSize:'0.8rem', fontWeight:700 }}>
                  {l.condition}
                </span>
              </div>
              <div style={{ padding:'1.25rem' }}>
                <h3 style={{ fontWeight:700, marginBottom:'0.25rem', fontSize:'1rem' }}>{l.name}</h3>
                <p style={{ color:'#9CA3AF', fontSize:'0.85rem', marginBottom:'0.75rem' }}>{l.brand || 'Brand'} · Size {l.size}</p>
                <div style={{ fontSize:'1.4rem', fontWeight:900, color:PRIMARY, marginBottom:'1rem' }}>₹{l.rentalPricePerDay}<span style={{fontSize:'0.85rem',fontWeight:500,color:'#6B7280'}}>/day</span></div>
                <div style={{ display:'flex', gap:'0.75rem' }}>
                  <button onClick={e=>{e.stopPropagation();setSelectedListing(l)}} className="btn" style={{
                    flex:1, padding:'0.65rem', borderRadius:'8px', border:`2px solid ${PRIMARY}`,
                    color:PRIMARY, background:'white', fontSize:'0.85rem'
                  }}>Details</button>
                  <button onClick={e=>{e.stopPropagation();addToCart(l)}} className="btn gradient-bg" style={{
                    flex:1, padding:'0.65rem', borderRadius:'8px', color:'white', fontSize:'0.85rem'
                  }}>
                    <i className="fas fa-cart-plus" style={{marginRight:'0.3rem'}}/>Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedListing && (
        <ListingDetailModal listing={selectedListing} onClose={()=>setSelectedListing(null)}
          addToCart={addToCart} />
      )}
    </div>
  )
}

function ListingDetailModal({ listing, onClose, addToCart }) {
  const colors = ['linear-gradient(135deg,#8B5CF6,#EC4899)','linear-gradient(135deg,#EC4899,#F59E0B)','linear-gradient(135deg,#10B981,#3B82F6)']
  return (
    <Modal show={true} onClose={onClose} title={listing.name} wide>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem' }}>
        <div>
          <div style={{ height:250, background:colors[0], borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'1rem', overflow:'hidden' }}>
            {listing.imageUrl
              ? <img src={listing.imageUrl} alt={listing.name} style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:'12px' }} onError={e=>{e.target.style.display='none'}} />
              : <i className="fas fa-tshirt" style={{ fontSize:'5rem', color:'rgba(255,255,255,0.4)' }} />
            }
          </div>
          <p style={{ color:'#6B7280', lineHeight:1.6 }}>{listing.description || 'Beautiful item in excellent condition, perfect for any occasion.'}</p>
        </div>
        <div>
          <div style={{ fontSize:'2rem', fontWeight:900, color:PRIMARY, marginBottom:'0.25rem' }}>₹{listing.rentalPricePerDay}</div>
          <p style={{ color:'#6B7280', marginBottom:'1.5rem', fontSize:'0.9rem' }}>per day</p>
          {[['Brand',listing.brand||'-'],['Size',listing.size],['Condition',listing.condition],['Deposit',`₹${listing.securityDeposit}`],['Lender',listing.ownerName||'Community Member']].map(([k,v])=>(
            <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'0.6rem 0', borderBottom:`1px solid ${BORDER}` }}>
              <span style={{ color:'#6B7280', fontSize:'0.9rem' }}>{k}</span>
              <span style={{ fontWeight:600, fontSize:'0.9rem' }}>{v}</span>
            </div>
          ))}
          <button onClick={()=>{addToCart(listing);onClose()}} className="btn gradient-bg" style={{
            width:'100%', padding:'0.9rem', borderRadius:'10px', color:'white',
            fontSize:'1rem', marginTop:'1.5rem',
            boxShadow:'0 4px 12px rgba(139,92,246,0.3)'
          }}>
            <i className="fas fa-shopping-cart" style={{marginRight:'0.5rem'}}/>Add to Cart
          </button>
        </div>
      </div>
    </Modal>
  )
}

function CartModal({ show, onClose, toast, user, refreshCart, setPage }) {
  const [items, setItems] = useState([])
  const [rentalStart, setRentalStart] = useState('')
  const [paying, setPaying] = useState(false)

  const loadCart = async () => {
    if (!user) return
    const r = await fetch('/api/cart')
    if (r.ok) { const d = await r.json(); setItems(d.items || []) }
  }

  useEffect(() => { if (show) loadCart() }, [show, user])

  const removeItem = async (listingId) => {
    await fetch('/api/cart?listingId=' + listingId, { method:'DELETE' })
    loadCart(); refreshCart()
  }

  const updateDays = async (listingId, days) => {
    await fetch('/api/cart', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ listingId, days: Number(days) })
    })
    loadCart()
  }

  const subtotal = items.reduce((s,i) => s + i.rentalPricePerDay * i.days, 0)
  const deposit = items.reduce((s,i) => s + i.securityDeposit, 0)
  const platformFee = Math.round((subtotal + deposit) * 0.05)
  const total = subtotal + deposit + platformFee

  const checkout = async () => {
    if (!rentalStart) { toast('Please select a rental start date', 'error'); return }
    setPaying(true)
    try {
      const r = await fetch('/api/checkout', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ rentalStart })
      })
      const d = await r.json()
      if (!d.orderId) { toast(d.error || 'Checkout failed', 'error'); setPaying(false); return }

      // Load Razorpay
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      document.body.appendChild(script)
      script.onload = () => {
        const rzp = new window.Razorpay({
          key: d.keyId,
          amount: d.amount,
          currency: d.currency,
          name: 'WearShare',
          description: 'Clothing Rental',
          order_id: d.orderId,
          theme: { color: '#8B5CF6' },
          handler: async (response) => {
            const confirmR = await fetch('/api/checkout/confirm', {
              method:'POST', headers:{'Content-Type':'application/json'},
              body: JSON.stringify({
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                signature: response.razorpay_signature,
                rentalStart
              })
            })
            if (confirmR.ok) {
              toast('Payment successful! Booking confirmed 🎉')
              onClose(); refreshCart(); setItems([]); setPage('dashboard')
            } else toast('Payment verification failed', 'error')
            setPaying(false)
          },
          modal: { ondismiss: () => setPaying(false) }
        })
        rzp.open()
      }
    } catch (e) { toast('Payment error: ' + e.message, 'error'); setPaying(false) }
  }

  return (
    <Modal show={show} onClose={onClose} title="🛒 Your Cart" wide>
      {items.length === 0 ? (
        <div style={{ textAlign:'center', padding:'3rem', color:'#9CA3AF' }}>
          <i className="fas fa-shopping-bag" style={{ fontSize:'3rem', marginBottom:'1rem', display:'block' }} />
          <h3 style={{ marginBottom:'0.5rem' }}>Your cart is empty</h3>
          <button onClick={onClose} className="btn gradient-bg" style={{ color:'white', padding:'0.75rem 1.5rem', borderRadius:'8px', marginTop:'1rem' }}>
            Browse Items
          </button>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:'1.5rem' }}>
          <div>
            {items.map(item => (
              <div key={item.listingId} style={{ display:'flex', gap:'1rem', padding:'1rem', border:`1px solid ${BORDER}`, borderRadius:'10px', marginBottom:'0.75rem', alignItems:'center' }}>
                <div style={{ width:70, height:70, background:'linear-gradient(135deg,#8B5CF6,#EC4899)', borderRadius:'8px', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <i className="fas fa-tshirt" style={{ color:'rgba(255,255,255,0.6)', fontSize:'1.5rem' }} />
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, marginBottom:'0.2rem' }}>{item.name}</div>
                  <div style={{ color:'#6B7280', fontSize:'0.85rem' }}>₹{item.rentalPricePerDay}/day · Size {item.size}</div>
                  <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginTop:'0.5rem' }}>
                    <span style={{ fontSize:'0.85rem', color:'#6B7280' }}>Days:</span>
                    <input type="number" min="1" defaultValue={item.days} className="input"
                      style={{ width:'70px', padding:'0.3rem 0.5rem', fontSize:'0.9rem' }}
                      onBlur={e => updateDays(item.listingId, e.target.value)} />
                    <span style={{ fontWeight:700, color:PRIMARY }}>₹{item.rentalPricePerDay * item.days}</span>
                  </div>
                </div>
                <button onClick={()=>removeItem(item.listingId)} className="btn" style={{
                  background:'#FEE2E2', color:DANGER, padding:'0.4rem 0.75rem', borderRadius:'6px', fontSize:'0.85rem'
                }}>
                  <i className="fas fa-trash" />
                </button>
              </div>
            ))}
          </div>
          <div>
            <div className="card" style={{ padding:'1.25rem', position:'sticky', top:'1rem' }}>
              <h3 style={{ fontWeight:700, marginBottom:'1rem' }}>Order Summary</h3>
              <FormGroup label="📅 Rental Start Date">
                <input type="date" className="input" value={rentalStart}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e=>setRentalStart(e.target.value)} />
              </FormGroup>
              {[['Rental Subtotal', `₹${subtotal}`],['Security Deposit', `₹${deposit}`],['Platform Fee (5%)', `₹${platformFee}`]].map(([k,v])=>(
                <div key={k} style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.6rem', fontSize:'0.9rem' }}>
                  <span style={{ color:'#6B7280' }}>{k}</span>
                  <span style={{ fontWeight:600 }}>{v}</span>
                </div>
              ))}
              <div style={{ display:'flex', justifyContent:'space-between', borderTop:`2px solid ${BORDER}`, paddingTop:'0.75rem', marginTop:'0.5rem', marginBottom:'1.25rem' }}>
                <span style={{ fontWeight:700, fontSize:'1.05rem' }}>Total</span>
                <span style={{ fontWeight:900, fontSize:'1.2rem', color:PRIMARY }}>₹{total}</span>
              </div>
              <button onClick={checkout} disabled={paying} className="btn gradient-bg" style={{
                width:'100%', padding:'0.9rem', borderRadius:'10px', color:'white',
                fontSize:'1rem', boxShadow:'0 4px 12px rgba(139,92,246,0.3)'
              }}>
                {paying ? <span className="spinner" /> : <><i className="fas fa-lock" style={{marginRight:'0.5rem'}}/>Pay with Razorpay</>}
              </button>
              <p style={{ textAlign:'center', fontSize:'0.75rem', color:'#9CA3AF', marginTop:'0.75rem' }}>
                <i className="fas fa-shield-alt" style={{marginRight:'0.25rem'}}/>Secured by Razorpay
              </p>
            </div>
          </div>
        </div>
      )}
    </Modal>
  )
}

function DashboardPage({ user, toast, onCreateListing }) {
  const [tab, setTab] = useState('overview')
  const [rentals, setRentals] = useState([])
  const [lending, setLending] = useState([])
  const [myListings, setMyListings] = useState([])
  const [profile, setProfile] = useState({ name: user.name, phone: user.phone||'', address: user.address||'' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/bookings').then(r=>r.json()).then(d => {
      setRentals(d.rentals||[]); setLending(d.lending||[])
    })
    fetch('/api/listings?user=true').then(r=>r.json()).then(d => setMyListings(Array.isArray(d)?d:[]))
  }, [])

  const deleteListing = async (id) => {
    if (!confirm('Delete this listing?')) return
    const r = await fetch('/api/listings/' + id, { method:'DELETE' })
    if (r.ok) { toast('Listing deleted'); setMyListings(p=>p.filter(l=>l._id!==id)) }
    else toast('Failed to delete', 'error')
  }

  const saveProfile = async () => {
    setSaving(true)
    const r = await fetch('/api/profile', {
      method:'PUT', headers:{'Content-Type':'application/json'},
      body: JSON.stringify(profile)
    })
    setSaving(false)
    toast(r.ok ? 'Profile updated!' : 'Failed to save', r.ok ? 'success' : 'error')
  }

  const tabs = [
    { id:'overview', icon:'fa-chart-pie', label:'Overview' },
    { id:'rentals', icon:'fa-shopping-bag', label:'My Rentals' },
    { id:'lending', icon:'fa-hand-holding-heart', label:'Lending' },
    { id:'listings', icon:'fa-list', label:'My Listings' },
    { id:'profile', icon:'fa-user', label:'Profile' },
  ]

  const statusColor = s => s==='confirmed' ? '#D1FAE5' : s==='pending' ? '#FEF3C7' : '#DBEAFE'
  const statusText = s => s==='confirmed' ? '#065F46' : s==='pending' ? '#92400E' : '#1E40AF'

  return (
    <div style={{ maxWidth:1200, margin:'0 auto', padding:'2rem' }}>
      <h1 style={{ fontSize:'2rem', fontWeight:900, marginBottom:'0.4rem' }} className="gradient-text">
        <i className="fas fa-user-circle" style={{marginRight:'0.5rem'}}/>My Dashboard
      </h1>
      <p style={{ color:'#6B7280', marginBottom:'2rem' }}>Manage your rentals and listings</p>

      <div style={{ display:'grid', gridTemplateColumns:'220px 1fr', gap:'2rem' }}>
        {/* Sidebar */}
        <div className="card" style={{ padding:'1.25rem', height:'fit-content', position:'sticky', top:'80px' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={()=>setTab(t.id)} className="btn" style={{
              width:'100%', padding:'0.75rem 1rem', borderRadius:'8px', textAlign:'left',
              marginBottom:'0.25rem', fontSize:'0.9rem', display:'flex', alignItems:'center', gap:'0.75rem',
              background: tab===t.id ? 'linear-gradient(135deg,#8B5CF6,#7C3AED)' : 'none',
              color: tab===t.id ? 'white' : DARK,
            }}>
              <i className={`fas ${t.icon}`} />{t.label}
            </button>
          ))}
          <hr style={{ margin:'0.75rem 0', border:'none', borderTop:`1px solid ${BORDER}` }}/>
          <button onClick={onCreateListing} className="btn gradient-bg" style={{
            width:'100%', padding:'0.75rem', borderRadius:'8px', color:'white', fontSize:'0.9rem'
          }}>
            <i className="fas fa-plus" style={{marginRight:'0.5rem'}}/>List New Item
          </button>
        </div>

        {/* Content */}
        <div className="card" style={{ padding:'2rem' }}>
          {tab === 'overview' && (
            <div>
              <h2 style={{ fontWeight:700, marginBottom:'1.5rem' }}>Your Stats</h2>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))', gap:'1rem', marginBottom:'2rem' }}>
                {[['Total Rentals',rentals.length,'fa-shopping-bag'],['Active Lending',lending.length,'fa-hand-holding-heart'],['My Listings',myListings.length,'fa-list']].map(([label,val,icon])=>(
                  <div key={label} style={{ background:'linear-gradient(135deg,#8B5CF6,#EC4899)', borderRadius:'12px', padding:'1.5rem', color:'white' }}>
                    <i className={`fas ${icon}`} style={{ fontSize:'1.5rem', marginBottom:'0.5rem', display:'block', opacity:0.8 }}/>
                    <div style={{ fontSize:'2rem', fontWeight:900 }}>{val}</div>
                    <div style={{ fontSize:'0.85rem', opacity:0.9 }}>{label}</div>
                  </div>
                ))}
              </div>
              <h3 style={{ fontWeight:700, marginBottom:'1rem' }}>Recent Rentals</h3>
              {rentals.slice(0,3).length ? rentals.slice(0,3).map(b=>(
                <div key={b._id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0.75rem', background:LIGHT, borderRadius:'8px', marginBottom:'0.5rem' }}>
                  <span style={{ fontWeight:600, fontSize:'0.9rem' }}>{b.listingName}</span>
                  <span className="badge" style={{ background:statusColor(b.status), color:statusText(b.status) }}>{b.status}</span>
                </div>
              )) : <p style={{ color:'#9CA3AF' }}>No rentals yet. Start browsing!</p>}
            </div>
          )}

          {tab === 'rentals' && (
            <div>
              <h2 style={{ fontWeight:700, marginBottom:'1.5rem' }}>My Rentals</h2>
              {rentals.length ? (
                <table style={{ width:'100%', borderCollapse:'collapse' }}>
                  <thead><tr style={{ background:LIGHT }}>{['Item','Days','Amount','Start Date','Status'].map(h=><th key={h} style={{ padding:'0.75rem', textAlign:'left', fontSize:'0.85rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.5px' }}>{h}</th>)}</tr></thead>
                  <tbody>{rentals.map(b=>(
                    <tr key={b._id} style={{ borderBottom:`1px solid ${BORDER}` }}>
                      <td style={{ padding:'0.75rem', fontWeight:600 }}>{b.listingName}</td>
                      <td style={{ padding:'0.75rem', color:'#6B7280' }}>{b.days} days</td>
                      <td style={{ padding:'0.75rem', color:PRIMARY, fontWeight:700 }}>₹{b.totalAmount}</td>
                      <td style={{ padding:'0.75rem', color:'#6B7280', fontSize:'0.85rem' }}>{b.rentalStart}</td>
                      <td style={{ padding:'0.75rem' }}><span className="badge" style={{ background:statusColor(b.status), color:statusText(b.status) }}>{b.status}</span></td>
                    </tr>
                  ))}</tbody>
                </table>
              ) : <p style={{ color:'#9CA3AF' }}>No rentals yet.</p>}
            </div>
          )}

          {tab === 'lending' && (
            <div>
              <h2 style={{ fontWeight:700, marginBottom:'1.5rem' }}>Items Being Rented Out</h2>
              {lending.length ? (
                <table style={{ width:'100%', borderCollapse:'collapse' }}>
                  <thead><tr style={{ background:LIGHT }}>{['Item','Renter','Days','Amount','Status'].map(h=><th key={h} style={{ padding:'0.75rem', textAlign:'left', fontSize:'0.85rem', fontWeight:700, textTransform:'uppercase' }}>{h}</th>)}</tr></thead>
                  <tbody>{lending.map(b=>(
                    <tr key={b._id} style={{ borderBottom:`1px solid ${BORDER}` }}>
                      <td style={{ padding:'0.75rem', fontWeight:600 }}>{b.listingName}</td>
                      <td style={{ padding:'0.75rem', color:'#6B7280' }}>{b.renterName}</td>
                      <td style={{ padding:'0.75rem', color:'#6B7280' }}>{b.days}</td>
                      <td style={{ padding:'0.75rem', color:SUCCESS, fontWeight:700 }}>₹{b.totalAmount}</td>
                      <td style={{ padding:'0.75rem' }}><span className="badge" style={{ background:statusColor(b.status), color:statusText(b.status) }}>{b.status}</span></td>
                    </tr>
                  ))}</tbody>
                </table>
              ) : <p style={{ color:'#9CA3AF' }}>No one has rented your items yet.</p>}
            </div>
          )}

          {tab === 'listings' && (
            <div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
                <h2 style={{ fontWeight:700 }}>My Listings</h2>
                <button onClick={onCreateListing} className="btn gradient-bg" style={{ color:'white', padding:'0.65rem 1.25rem', borderRadius:'8px', fontSize:'0.9rem' }}>
                  <i className="fas fa-plus" style={{marginRight:'0.4rem'}}/>Add New
                </button>
              </div>
              {myListings.length ? (
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:'1rem' }}>
                  {myListings.map(l=>(
                    <div key={l._id} className="card" style={{ overflow:'hidden' }}>
                      <div style={{ height:120, background:'linear-gradient(135deg,#8B5CF6,#EC4899)', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
                        {l.imageUrl
                          ? <img src={l.imageUrl} alt={l.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e=>{e.target.style.display='none'}} />
                          : <i className="fas fa-tshirt" style={{ fontSize:'2.5rem', color:'rgba(255,255,255,0.5)' }}/>
                        }
                      </div>
                      <div style={{ padding:'0.75rem' }}>
                        <div style={{ fontWeight:700, fontSize:'0.9rem', marginBottom:'0.25rem' }}>{l.name}</div>
                        <div style={{ color:PRIMARY, fontWeight:700, fontSize:'0.85rem', marginBottom:'0.75rem' }}>₹{l.rentalPricePerDay}/day</div>
                        <button onClick={()=>deleteListing(l._id)} className="btn" style={{
                          width:'100%', padding:'0.4rem', borderRadius:'6px',
                          background:'#FEE2E2', color:DANGER, fontSize:'0.8rem'
                        }}><i className="fas fa-trash" style={{marginRight:'0.25rem'}}/>Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign:'center', padding:'3rem', color:'#9CA3AF' }}>
                  <i className="fas fa-inbox" style={{ fontSize:'3rem', marginBottom:'1rem', display:'block' }}/>
                  <p>No listings yet. Share your wardrobe!</p>
                  <button onClick={onCreateListing} className="btn gradient-bg" style={{ color:'white', padding:'0.75rem 1.5rem', borderRadius:'8px', marginTop:'1rem' }}>Create Listing</button>
                </div>
              )}
            </div>
          )}

          {tab === 'profile' && (
            <div style={{ maxWidth:450 }}>
              <h2 style={{ fontWeight:700, marginBottom:'1.5rem' }}>Edit Profile</h2>
              <FormGroup label="Full Name">
                <input className="input" value={profile.name} onChange={e=>setProfile(p=>({...p,name:e.target.value}))} />
              </FormGroup>
              <FormGroup label="Email (read-only)">
                <input className="input" value={user.email} readOnly style={{ background:LIGHT }} />
              </FormGroup>
              <FormGroup label="Phone">
                <input className="input" value={profile.phone} onChange={e=>setProfile(p=>({...p,phone:e.target.value}))} placeholder="+91 XXXXX XXXXX" />
              </FormGroup>
              <FormGroup label="Address">
                <input className="input" value={profile.address} onChange={e=>setProfile(p=>({...p,address:e.target.value}))} placeholder="Your city/area" />
              </FormGroup>
              <button onClick={saveProfile} disabled={saving} className="btn gradient-bg" style={{ color:'white', padding:'0.85rem 2rem', borderRadius:'10px', fontSize:'0.95rem', boxShadow:'0 4px 12px rgba(139,92,246,0.3)' }}>
                {saving ? <span className="spinner"/> : <><i className="fas fa-save" style={{marginRight:'0.5rem'}}/>Save Changes</>}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function LoginModal({ show, onClose, setUser, toast, switchToRegister }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    if (!email || !password) { toast('Please fill all fields', 'error'); return }
    setLoading(true)
    const r = await fetch('/api/auth/login', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ email, password })
    })
    const d = await r.json()
    setLoading(false)
    if (r.ok) {
      const me = await fetch('/api/auth/me').then(r=>r.json())
      setUser(me); toast('Welcome back, ' + me.name.split(' ')[0] + '! 👋'); onClose()
      setEmail(''); setPassword('')
    } else toast(d.error || 'Login failed', 'error')
  }

  return (
    <Modal show={show} onClose={onClose} title="👋 Welcome Back">
      <FormGroup label="Email Address">
        <input type="email" className="input" value={email} onChange={e=>setEmail(e.target.value)}
          placeholder="you@example.com" onKeyDown={e=>e.key==='Enter'&&submit()} />
      </FormGroup>
      <FormGroup label="Password">
        <input type="password" className="input" value={password} onChange={e=>setPassword(e.target.value)}
          placeholder="••••••••" onKeyDown={e=>e.key==='Enter'&&submit()} />
      </FormGroup>
      <button onClick={submit} disabled={loading} className="btn gradient-bg" style={{
        width:'100%', padding:'1rem', borderRadius:'10px', color:'white',
        fontSize:'1rem', boxShadow:'0 4px 12px rgba(139,92,246,0.3)'
      }}>
        {loading ? <span className="spinner"/> : <><i className="fas fa-sign-in-alt" style={{marginRight:'0.5rem'}}/>Sign In</>}
      </button>
      <p style={{ textAlign:'center', marginTop:'1rem', color:'#6B7280', fontSize:'0.9rem' }}>
        Don't have an account?{' '}
        <button onClick={switchToRegister} className="btn" style={{ background:'none', color:PRIMARY, padding:0, fontWeight:700 }}>Sign Up</button>
      </p>
    </Modal>
  )
}

function RegisterModal({ show, onClose, setUser, toast, switchToLogin }) {
  const [form, setForm] = useState({ name:'', email:'', phone:'', password:'' })
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    if (!form.name || !form.email || !form.password) { toast('Please fill all required fields', 'error'); return }
    if (form.password.length < 6) { toast('Password must be at least 6 characters', 'error'); return }
    setLoading(true)
    const r = await fetch('/api/auth/register', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify(form)
    })
    const d = await r.json()
    setLoading(false)
    if (r.ok) {
      const me = await fetch('/api/auth/me').then(r=>r.json())
      setUser(me); toast('Welcome to WearShare, ' + form.name.split(' ')[0] + '! 🎉'); onClose()
      setForm({ name:'', email:'', phone:'', password:'' })
    } else toast(d.error || 'Registration failed', 'error')
  }

  return (
    <Modal show={show} onClose={onClose} title="🌟 Create Account">
      {['name','email','phone','password'].map(field => (
        <FormGroup key={field} label={field==='name'?'Full Name *':field==='email'?'Email *':field==='phone'?'Phone (WhatsApp)':'Password *'}>
          <input type={field==='password'?'password':field==='email'?'email':'text'} className="input"
            value={form[field]} onChange={e=>setForm(p=>({...p,[field]:e.target.value}))}
            placeholder={field==='name'?'Your full name':field==='email'?'you@example.com':field==='phone'?'+91 XXXXX XXXXX':'Min 6 characters'}
            onKeyDown={e=>e.key==='Enter'&&submit()} />
        </FormGroup>
      ))}
      <button onClick={submit} disabled={loading} className="btn gradient-bg" style={{
        width:'100%', padding:'1rem', borderRadius:'10px', color:'white',
        fontSize:'1rem', boxShadow:'0 4px 12px rgba(139,92,246,0.3)'
      }}>
        {loading ? <span className="spinner"/> : <><i className="fas fa-user-plus" style={{marginRight:'0.5rem'}}/>Create Account</>}
      </button>
      <p style={{ textAlign:'center', marginTop:'1rem', color:'#6B7280', fontSize:'0.9rem' }}>
        Already have an account?{' '}
        <button onClick={switchToLogin} className="btn" style={{ background:'none', color:PRIMARY, padding:0, fontWeight:700 }}>Sign In</button>
      </p>
    </Modal>
  )
}

function CreateListingModal({ show, onClose, toast, user }) {
  const [form, setForm] = useState({ name:'', brand:'', category:'dress', size:'M', condition:'excellent', description:'', rentalPricePerDay:'', securityDeposit:'', availableFrom:'', availableUntil:'', imageUrl:'' })
  const [loading, setLoading] = useState(false)

  const set = (k,v) => setForm(p=>({...p,[k]:v}))

  const submit = async () => {
    if (!user) { toast('Please login first', 'error'); return }
    if (!form.name || !form.rentalPricePerDay || !form.securityDeposit) {
      toast('Please fill required fields', 'error'); return
    }
    setLoading(true)
    const r = await fetch('/api/listings', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ ...form, rentalPricePerDay: Number(form.rentalPricePerDay), securityDeposit: Number(form.securityDeposit) })
    })
    setLoading(false)
    if (r.ok) {
      toast('Listing created! 🎊'); onClose()
      setForm({ name:'', brand:'', category:'dress', size:'M', condition:'excellent', description:'', rentalPricePerDay:'', securityDeposit:'', availableFrom:'', availableUntil:'', imageUrl:'' })
    } else {
      const d = await r.json()
      toast(d.error || 'Failed to create listing', 'error')
    }
  }

  return (
    <Modal show={show} onClose={onClose} title="✨ Create New Listing" wide>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
        <FormGroup label="Item Name *">
          <input className="input" value={form.name} onChange={e=>set('name',e.target.value)} placeholder="e.g. Blue Silk Saree" />
        </FormGroup>
        <FormGroup label="Brand">
          <input className="input" value={form.brand} onChange={e=>set('brand',e.target.value)} placeholder="e.g. Fabindia" />
        </FormGroup>
        <FormGroup label="Category">
          <select className="input" value={form.category} onChange={e=>set('category',e.target.value)}>
            {['dress','suit','jacket','saree','lehenga','kurta','shoes','accessories'].map(c=><option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>)}
          </select>
        </FormGroup>
        <FormGroup label="Size">
          <select className="input" value={form.size} onChange={e=>set('size',e.target.value)}>
            {['XS','S','M','L','XL','XXL'].map(s=><option key={s}>{s}</option>)}
          </select>
        </FormGroup>
        <FormGroup label="Condition">
          <select className="input" value={form.condition} onChange={e=>set('condition',e.target.value)}>
            {[['new','New - Never Worn'],['excellent','Excellent'],['good','Good'],['fair','Fair']].map(([v,l])=><option key={v} value={v}>{l}</option>)}
          </select>
        </FormGroup>
        <FormGroup label="Rental Price / Day (₹) *">
          <input className="input" type="number" value={form.rentalPricePerDay} onChange={e=>set('rentalPricePerDay',e.target.value)} placeholder="500" min="50" />
        </FormGroup>
        <FormGroup label="Security Deposit (₹) *">
          <input className="input" type="number" value={form.securityDeposit} onChange={e=>set('securityDeposit',e.target.value)} placeholder="2000" min="100" />
        </FormGroup>
        <FormGroup label="Available From">
          <input className="input" type="date" value={form.availableFrom} onChange={e=>set('availableFrom',e.target.value)} min={new Date().toISOString().split('T')[0]} />
        </FormGroup>
      </div>
      <FormGroup label="Description">
        <textarea className="input" value={form.description} onChange={e=>set('description',e.target.value)} placeholder="Describe your item - style, fabric, occasion it's perfect for..." />
      </FormGroup>
      <FormGroup label="Photo URL (paste a Google Photos / WhatsApp / hosted image link)">
        <input className="input" value={form.imageUrl} onChange={e=>set('imageUrl',e.target.value)} placeholder="https://i.imgur.com/yourphoto.jpg" />
        {form.imageUrl && (
          <img src={form.imageUrl} alt="preview" onError={e=>{e.target.style.display='none'}}
            style={{ marginTop:'0.5rem', width:'100%', height:'160px', objectFit:'cover', borderRadius:'8px', border:`1px solid ${BORDER}` }} />
        )}
        <p style={{ fontSize:'0.8rem', color:'#9CA3AF', marginTop:'0.35rem' }}>
          💡 Upload your photo to <a href="https://imgur.com/upload" target="_blank" rel="noreferrer" style={{color:PRIMARY}}>imgur.com</a> (free) and paste the link here
        </p>
      </FormGroup>
      <button onClick={submit} disabled={loading} className="btn gradient-bg" style={{
        width:'100%', padding:'1rem', borderRadius:'10px', color:'white',
        fontSize:'1rem', boxShadow:'0 4px 12px rgba(139,92,246,0.3)'
      }}>
        {loading ? <span className="spinner"/> : <><i className="fas fa-plus" style={{marginRight:'0.5rem'}}/>Create Listing</>}
      </button>
    </Modal>
  )
}
