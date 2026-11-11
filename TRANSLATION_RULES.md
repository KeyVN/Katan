# Quy tắc Việt hóa Dự án CatanTestFriendos (Katanittes)

## 1. Kiến trúc file ngôn ngữ & Quy tắc Kỹ thuật (BẮT BUỘC)
- **File đích:** `js/i18n/vi.js` (Được nhân bản từ `js/i18n/en.js`).
- **Cấu trúc Key - Value:**
  - **Key (Bên trái):** Là chuỗi gốc tiếng Tây Ban Nha (ví dụ: `"Turno de {name}"`). **TUYỆT ĐỐI KHÔNG** sửa, xóa dấu, hoặc dịch phần Key này dù chỉ 1 ký tự.
  - **Value (Bên phải):** Đang chứa bản dịch tiếng Anh (dùng làm ngữ cảnh tham chiếu). Hãy thay thế phần Value này bằng bản dịch tiếng Việt tương ứng.
- **Bảo toàn biến nội suy `{placeholder}`:**
  - Giữ nguyên 100% tên các biến nằm trong ngoặc nhọn đơn như `{name}`, `{n}`, `{res}`, `{player}`, `{pts}`, `{max}`...
  - Ví dụ: `"Turno de {name}": "{name}'s turn"` -> `"Turno de {name}": "Lượt của {name}"`.
- **Giữ nguyên định dạng:** Bảo toàn các ký tự xuống dòng `\n`, biểu tượng Emoji và thẻ HTML (nếu có trong chuỗi).

---

## 2. Văn phong & Giới hạn hiển thị (UI Constraints)
- **Ngôi xưng:** Hệ thống gọi người chơi là **"Bạn"**. Giọng văn hiện đại, tự nhiên, giữ nét hài hước của game nhưng thông báo luật chơi phải rõ ràng.
- **Độ dài chuỗi trên UI & Nhãn 3D:** Các nút bấm, nhãn cảng biển (`.port3d`) và bảng thông số khá hẹp. Ưu tiên dùng từ ngắn gọn, súc tích.

---

## 3. Từ điển thuật ngữ chuẩn (Glossary ES / EN -> VI)

### A. 6 Loại Tài nguyên & Địa hình (`js/engine/constants.js`)
- `Madera` (`Wood` / `Lumber`) -> **Gỗ**
- `Arcilla` (`Brick` / `Clay`) -> **Gạch**
- `Oveja` (`Sheep` / `Wool`) -> **Cừu**
- `Trigo` (`Wheat` / `Grain`) -> **Lúa**
- `Mineral` (`Ore` / `Rock`) -> **Quặng**
- `Oro` (`Gold`) -> **Vàng**
- `Desierto` (`Desert`) -> **Sa mạc**

### B. Công trình, Thẻ Phát triển & Danh hiệu
- `Camino` / `Carretera` (`Road`) -> **Đường**
- `Poblado` (`Settlement`) -> **Làng** (Dùng "Làng" thay vì "Khu định cư" để ngắn gọn vừa khung UI)
- `Ciudad` (`City`) -> **Thành phố**
- `Puerto` (`Port` / `Harbor`) -> **Cảng**
- `Ladrón` (`Robber` / `Thief`) -> **Tên cướp**
- `Carta de desarrollo` (`Development Card`) -> **Thẻ phát triển**
- `Caballero` (`Knight`) -> **Hiệp sĩ**
- `Punto de victoria` (`Victory Point` - VP) -> **Điểm chiến thắng** (Viết tắt: **ĐCT** hoặc **VP**)
- `Progreso: Construcción de carreteras` (`Road Building`) -> **Mở đường**
- `Progreso: Año de la abundancia` / `Invento` (`Year of Plenty`) -> **Năm sung túc**
- `Progreso: Monopolio` (`Monopoly`) -> **Độc quyền**
- `Gran Ruta Comercial` (`Longest Road`) -> **Con đường dài nhất**
- `Gran Ejército de Caballería` (`Largest Army`) -> **Đội quân lớn nhất**

### C. Chế độ chơi (Presets) & Bản đồ (`config.js` & `board.js`)
- `Clásico` (`Classic`) -> **Cổ điển**
- `Caos total` (`Total Chaos`) -> **Hỗn loạn tột độ**
- `Exploradores` (`Explorers`) -> **Nhà thám hiểm**
- `Isla Estándar` (`Standard Island`) -> **Đảo tiêu chuẩn**
- `Archipiélago` (`Archipelago`) -> **Quần đảo**
- `Dos Reinos` (`Two Kingdoms`) -> **Hai vương quốc**
- `Anillo del Lago` (`Lake Ring`) -> **Vòng hồ**

### D. 6 Minigame giải trí trong lúc chờ lượt (`js/ui/adhd.js`)
- `Plinko` -> **Thả bóng Plinko** (hoặc giữ nguyên **Plinko**)
- `Tragamonedas` (`Slots`) -> **Máy quay thưởng**
- `Cohete` (`Rocket` / `Crash`) -> **Phóng tên lửa**
- `Ruleta` (`Roulette`) -> **Vòng quay Ru-lét**
- `Carrera de ovejas` (`Sheep Race`) -> **Đua cừu**
- `La mina` (`Mines`) -> **Dò mìn đào mỏ**

### E. Hành động & Giao diện phòng chờ (`lobby.js` & `gameView.js`)
- `Tirar dados` (`Roll dice`) -> **Đổ xúc xắc**
- `Comerciar` (`Trade`) -> **Giao dịch** | `Banco` (`Bank`) -> **Ngân hàng**
- `Ofrecer` (`Offer`) -> **Đưa ra** | `Pedir` (`Request`) -> **Yêu cầu**
- `Aceptar` (`Accept`) -> **Đồng ý** | `Rechazar` (`Reject`) -> **Từ chối**
- `Descartar` (`Discard`) -> **Bỏ bớt bài**
- `Robar` (`Steal`) -> **Cướp bài**
- `Pasar turno` / `Terminar turno` (`End turn`) -> **Kết thúc lượt**
- `Anfitrión` (`Host`) -> **Chủ phòng** | `Espectador` (`Spectator`) -> **Khán giả**
- `Editor de mapas` (`Map Editor`) -> **Tạo bản đồ**