# Firework Display - React Components

## Cấu trúc dự án đã được chuyển đổi

Logic pháo hoa đã được chuyển từ vanilla JavaScript sang React components.

### Cấu trúc Components

```
src/
├── components/
│   ├── FireworkApp.tsx          # Component chính tích hợp tất cả
│   ├── FireworkContext.tsx      # Context API để quản lý state toàn cục
│   ├── FireworkCanvas.tsx       # Canvas component với useRef và useEffect
│   ├── Controls.tsx             # Nút điều khiển (pause, sound, settings)
│   ├── Menu.tsx                 # Menu cài đặt
│   ├── HelpModal.tsx            # Modal hiển thị help
│   ├── SVGIcons.tsx             # SVG icons spritesheet
│   └── index.ts                 # Export tất cả components
└── assets/
    └── styles/
        └── firework.scss        # Styles cho fireworks
```

### Thay đổi chính

1. **State Management**: Chuyển từ custom store sang React Context API với hooks
2. **Event Handlers**: Chuyển từ vanilla event listeners sang React event handlers
3. **Canvas Rendering**: Sử dụng useRef và useEffect để quản lý canvas lifecycle
4. **Component Structure**: Tách logic thành các React components có thể tái sử dụng

### Cách sử dụng

```tsx
import FireworkApp from "@/components/FireworkApp";

export default function Page() {
  return <FireworkApp />;
}
```

### Dependencies

- React 19.2.3
- Next.js 16.1.6
- TypeScript 5
- Sass 1.97.3

### External Libraries (loaded via CDN)

- fscreen - Fullscreen API wrapper
- Stage - Canvas rendering library
- MyMath - Math utilities

### Features

- ✅ React Context API cho state management
- ✅ TypeScript support
- ✅ Client-side rendering với 'use client'
- ✅ localStorage persistence
- ✅ Responsive design
- ✅ Fullscreen mode
- ✅ Sound effects
- ✅ Multiple firework types
- ✅ Quality settings
- ✅ Auto-launch mode
- ✅ Finale mode

### Chạy dự án

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem kết quả.

## Ghi chú

File `app/main.js` vẫn còn để tham khảo logic gốc. Canvas rendering logic vẫn sử dụng các external libraries Stage và MyMath để giữ nguyên hiệu suất và hoạt động của pháo hoa.
