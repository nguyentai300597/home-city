import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Cloudinary } from '@cloudinary/url-gen'
import { auto } from '@cloudinary/url-gen/actions/resize'
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity'
import { AdvancedImage } from '@cloudinary/react'
import * as XLSX from 'xlsx'

const Icon = ({ children }) => <span className="icon">{children}</span>
const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'qang3dcs'
const cld = new Cloudinary({ cloud: { cloudName } })

function CloudinaryImage({ publicId, alt, className }) {
  const image = cld.image(publicId)
    .format('auto')
    .quality('auto')
    .resize(auto().gravity(autoGravity()).width(900).height(600))
  return <AdvancedImage cldImg={image} alt={alt} className={className} />
}

function App() {
  const [rooms, setRooms] = useState([])
  const [roomsError, setRoomsError] = useState('')
  useEffect(() => {
    const openZalo = event => {
      if (!event.target.closest('.contact')) return
      window.open('https://zalo.me/0924884435', '_blank', 'noopener,noreferrer')
    }
    document.addEventListener('click', openZalo)
    return () => document.removeEventListener('click', openZalo)
  }, [])

  useEffect(() => {
    async function loadRooms() {
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}rooms.xlsx`)
        if (!response.ok) throw new Error('Không tìm thấy file rooms.xlsx')
          console.log('rooms.xlsx loaded successfully')
        const workbook = XLSX.read(await response.arrayBuffer(), { type: 'array' })
        const sheet = workbook.Sheets[workbook.SheetNames[0]]
        const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' })
        const mappedRooms = rows.map((room, index) => ({ ...room, id: Number(room.id) || index + 1, price: Number(room.price) || 0, size: Number(room.size) || 0, amenities: String(room.amenities).split('|').map(item => item.trim()).filter(Boolean) }))
        console.log('Số lượng phòng:', mappedRooms.length)
        setRooms(mappedRooms)
      } catch (error) { setRoomsError(error.message) }
    }
    loadRooms()
  }, [])

  const [location, setLocation] = useState('')
  const [budget, setBudget] = useState('')
  const [favourites, setFavourites] = useState([])
  const [showPost, setShowPost] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [uploadedImage, setUploadedImage] = useState('')
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const fileRef = useRef(null)

  const filteredRooms = useMemo(() => rooms.filter(room => {
    const matchesLocation = !location || room.area.toLowerCase().includes(location.toLowerCase())
    const matchesBudget = !budget || room.price <= Number(budget)
    return matchesLocation && matchesBudget
  }), [rooms, location, budget])

  const toggleFavourite = id => setFavourites(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id])

  async function uploadToCloudinary(event) {
    const file = event.target.files?.[0]
    if (!file) return
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    if (!cloudName || !uploadPreset) {
      setMessage('Hãy thêm Cloud name và Upload preset vào file .env để tải ảnh lên Cloudinary.')
      return
    }
    setUploading(true); setMessage('')
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', uploadPreset)
    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: 'POST', body: formData })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error?.message || 'Không thể tải ảnh')
      setUploadedImage(result.public_id)
      setMessage('Đã tải ảnh lên Cloudinary thành công!')
    } catch (error) { setMessage(error.message) }
    finally { setUploading(false) }
  }

  return <>
    <header>
      <a className="brand" href="#top"><span></span> Trọ Miền Nam</a>
      <nav><a href="#phong">Tìm phòng</a><a href="#how">Cách hoạt động</a><a href="#about">Về chúng tôi</a></nav>
      {/* <button className="outline" onClick={() => setShowPost(true)}>Đăng tin miễn phí <span>↗</span></button> */}
    </header>

    <main id="top">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">TÌM NƠI AN CƯ THẬT DỄ</p>
          <h1>Chốn nhỏ bình yên,<br /><em>đúng nơi bạn cần.</em></h1>
          <p className="intro">Khám phá những căn phòng phù hợp với nhịp sống của bạn. Minh bạch thông tin, kết nối nhanh chóng.</p>
          <div className="search-box">
            <label><Icon>⌖</Icon><span>Khu vực</span><input value={location} onChange={e => setLocation(e.target.value)} placeholder="Bạn muốn ở đâu?" /></label>
            <label><Icon>◌</Icon><span>Ngân sách</span><select value={budget} onChange={e => setBudget(e.target.value)}><option value="">Tất cả mức giá</option><option value="3">Dưới 3 triệu</option><option value="5">Dưới 5 triệu</option><option value="7">Dưới 7 triệu</option></select></label>
            <a href="#phong" className="search-btn">Tìm phòng <b>→</b></a>
          </div>
          <div className="quick"><span>Phổ biến:</span><button onClick={() => setLocation('Thủ Đức')}>Thủ Đức</button><button onClick={() => setLocation('Bình Thạnh')}>Bình Thạnh</button><button onClick={() => setLocation('Quận 10')}>Quận 10</button></div>
        </div>
        <div className="hero-art"><div className="sun"></div><div className="arch arch-back"></div><div className="arch arch-front"><div className="window"><i></i><i></i><i></i></div></div><div className="plant">♣</div><p>HOME IS A FEELING</p></div>
      </section>

      <section className="trust"><div><b>2,500+</b><span>Phòng trọ đã xác thực</span></div><div><b>98%</b><span>Người thuê hài lòng</span></div><div><b>24h</b><span>Phản hồi nhanh chóng</span></div><div><b>0đ</b><span>Chi phí tìm phòng</span></div></section>

      <section className="listing" id="phong">
        <div className="section-heading"><div><p className="eyebrow">KHÁM PHÁ KHÔNG GIAN MỚI</p><h2>Phòng đang chờ bạn</h2></div><a href="#all">Xem tất cả <b>→</b></a></div>
        <div className="cards">{filteredRooms.map(room => <article className="room-card" key={room.id} onClick={() => setSelectedRoom(room)}><div className="room-image">{room.publicId ? <CloudinaryImage publicId={room.publicId} alt={room.title} /> : <img src={room.image} alt={room.title} />}<span>{room.tag}</span><button aria-label="Lưu phòng" onClick={event => { event.stopPropagation(); toggleFavourite(room.id) }}>{favourites.includes(room.id) ? '♥' : '♡'}</button></div><div className="room-info"><h3>{room.title}</h3><p className="place">⌖ {room.area}</p><div><strong>{room.price.toFixed(1)} triệu<span>/tháng</span></strong><small>{room.size} m²</small></div></div></article>)}</div>
        {!filteredRooms.length && <p className="no-result">Chưa có phòng phù hợp. Hãy thử một khu vực hoặc ngân sách khác.</p>}
        {roomsError && <p className="no-result">Không thể đọc dữ liệu phòng: {roomsError}</p>}
      </section>

      <section className="how" id="how"><div className="how-visual"><div className="tiny-card">⌂<br /><small>Nhà là nơi<br />trái tim thuộc về</small></div><div className="orange-circle"></div></div><div><p className="eyebrow">ĐƠN GIẢN & AN TÂM</p><h2>Tìm phòng không còn<br />là một chuyến phiêu lưu.</h2><p className="intro">Từ lúc tìm kiếm đến khi nhận chìa khóa, Trọ Gần Đây luôn đồng hành để mọi quyết định của bạn thêm vững tâm.</p>
        {/* <a className="text-link" href="#about">Tìm hiểu thêm <b>→</b></a> */}
      </div></section>
    </main>
    <footer id="about"><a className="brand" href="#top"><span></span> Trọ gần đây</a><p>Không gian sống phù hợp, hành trình mới bắt đầu.</p><small>© 2024 Trọ Gần Đây</small></footer>
    <a className="zalo-float" href="https://zalo.me/0924884435" target="_blank" rel="noreferrer" aria-label="Tư vấn qua Zalo"><span className="zalo-logo">Zalo</span><span>Tư vấn nhanh</span></a>

    {showPost && <div className="modal-backdrop" onMouseDown={() => setShowPost(false)}><div className="modal" onMouseDown={e => e.stopPropagation()}><button className="close" onClick={() => setShowPost(false)}>×</button><p className="eyebrow">ĐĂNG TIN CÙNG CHÚNG TÔI</p><h2>Thêm ảnh phòng trọ</h2><p>Ảnh được tải trực tiếp lên Cloudinary, không chiếm dung lượng máy chủ.</p><button className="upload-zone" onClick={() => fileRef.current?.click()}>{uploadedImage ? <CloudinaryImage publicId={uploadedImage} alt="Phòng đã tải lên" /> : <><b>{uploading ? 'Đang tải...' : '↑'}</b><span>{uploading ? 'Vui lòng chờ một chút' : 'Chọn ảnh từ máy tính'}</span><small>JPG, PNG hoặc WEBP</small></>}</button><input ref={fileRef} type="file" accept="image/*" hidden onChange={uploadToCloudinary} />{message && <p className="upload-message">{message}</p>}<button className="publish" disabled={!uploadedImage}>Tiếp tục đăng tin →</button></div></div>}
    {selectedRoom && <div className="modal-backdrop" onMouseDown={() => setSelectedRoom(null)}><section className="detail-modal" onMouseDown={event => event.stopPropagation()}><button className="close" onClick={() => setSelectedRoom(null)}>×</button><div className="detail-image">{selectedRoom.publicId ? <CloudinaryImage publicId={selectedRoom.publicId} alt={selectedRoom.title} /> : <img src={selectedRoom.image} alt={selectedRoom.title} />}<span>{selectedRoom.tag}</span></div><div className="detail-content"><p className="eyebrow">PHÒNG TRỌ ĐANG CHO THUÊ</p><h2>{selectedRoom.title}</h2><p className="detail-address">⌖ {selectedRoom.address}</p><div className="detail-price"><strong>{selectedRoom.price.toFixed(1)} triệu<span>/tháng</span></strong><small>{selectedRoom.size} m²</small></div><p className="detail-description">{selectedRoom.description}</p><div className="amenities">{selectedRoom.amenities.map(item => <span key={item}>✓ {item}</span>)}</div><h3>Chi phí dịch vụ</h3><div className="fees"><div><span>⚡ Điện</span><b>{selectedRoom.electricity}</b></div><div><span>◉ Nước & dịch vụ</span><b>{selectedRoom.water}</b></div><div><span>⌂ Gửi xe</span><b>{selectedRoom.parking}</b></div></div><button className="contact">Liên hệ xem phòng <b>→</b></button></div></section></div>}
  </>
}

export default App
