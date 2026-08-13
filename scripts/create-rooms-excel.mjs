import * as XLSX from 'xlsx'

const rooms = [
  { id: 1, title: 'Phòng mới đầy đủ nội thất', area: 'Gò Vấp, TP. HCM', address: '805/33 Phan Văn Trị - P1 - Gò Vấp', price: 5.8, size: 32, image: 'https://res.cloudinary.com/qang3dcs/image/upload/v1786597005/6309d7baa91c2842710d.jpg', tag: 'Xem nhiều', electricity: '4.000đ / kWh', water: '200.000đ / người', parking: '100.000đ / xe', description: 'Phòng studio sáng thoáng, có sẵn nội thất cơ bản. Khu dân cư an ninh, di chuyển thuận tiện đến các quận trung tâm.', amenities: 'Nội thất đầy đủ | Máy lạnh | Ban công | Giờ giấc tự do' },
  { id: 2, title: 'Phòng mới gần ĐH Kinh tế', area: 'Phường 4, Quận 10', address: 'Đường Thành Thái, Phường 4, Quận 10', price: 3.6, size: 24, image: 'https://res.cloudinary.com/qang3dcs/image/upload/v1786596361/b4d8b1abc331426f1b20.jpg', tag: 'Mới đăng', electricity: '3.800đ / kWh', water: '100.000đ / người', parking: '100.000đ / xe', description: 'Phòng mới, sạch sẽ, gần trường học và nhiều tiện ích.', amenities: 'Máy lạnh | Thang máy | Camera an ninh' },
  { id: 3, title: 'Căn hộ mini có ban công riêng', area: 'Bình Thạnh, TP. HCM', address: 'Đường Nguyễn Gia Trí, Bình Thạnh', price: 4.9, size: 28, image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80', tag: 'Còn phòng', electricity: '4.000đ / kWh', water: '150.000đ / người', parking: '120.000đ / xe', description: 'Không gian riêng tư, nhiều ánh sáng và có ban công thoáng mát.', amenities: 'Ban công | Máy giặt chung | Khóa vân tay' },
  { id: 4, title: 'Phòng trọ yên tĩnh, giờ giấc tự do', area: 'Hải Châu, Đà Nẵng', address: 'Đường Lê Thanh Nghị, Hải Châu, Đà Nẵng', price: 2.9, size: 20, image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80', tag: 'Giá tốt', electricity: '3.500đ / kWh', water: '100.000đ / người', parking: '80.000đ / xe', description: 'Phòng yên tĩnh, phù hợp sinh viên và người đi làm.', amenities: 'Giờ giấc tự do | Wifi | Camera an ninh' }
]

const sheet = XLSX.utils.json_to_sheet(rooms)
sheet['!cols'] = [
  { wch: 8 }, { wch: 32 }, { wch: 24 }, { wch: 38 }, { wch: 10 }, { wch: 10 }, { wch: 66 },
  { wch: 15 }, { wch: 18 }, { wch: 20 }, { wch: 18 }, { wch: 70 }, { wch: 48 }
]
const workbook = XLSX.utils.book_new()
XLSX.utils.book_append_sheet(workbook, sheet, 'Danh sách phòng')
XLSX.writeFile(workbook, 'public/rooms.xlsx')
