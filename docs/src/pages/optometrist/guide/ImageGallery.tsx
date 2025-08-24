import { useState, useRef, useCallback, useEffect } from 'react';
import Header from '../../../components/Header';
import BottomNav from '../../../components/BottomNav';
import BackButton from '../../../components/BackButton';
import '../../../styles/image-card.css';
import '../../../styles/image-gallery.css';
import '../../../styles/image-modal.css';

/*把image-gallery文件夹一次性全部导入进来*/
const _IMG = import.meta.glob('../../../assets/image-gallery/**/*.{png,PNG,jpg,JPG,jpeg,JPEG,webp,WEBP}', {
  eager: true,
  import: 'default'
}) as Record<string, string>;

const byName: Record<string, string> = Object.fromEntries(
    Object.entries(_IMG).map(([path, url]) => [path.split('/').pop()!.toLowerCase(), url])
);

/** 根据文件名取 URL；大小写不敏感，取不到时返回空串 */
const pick = (filename: string) => byName[filename.toLowerCase()] ?? '';

interface ImageItem {
  id: number;
  title: string;
  description: string;
  category: 'papilloedema' | 'pseudo' | 'normal';
  images?: string[]; 
  placeholderText?: string; 
}


const ImageModal: React.FC<{
  isOpen: boolean;
  images: string[];
  currentIndex: number;
  titles: string[];
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
}> = ({ isOpen, images, currentIndex, titles, onClose, onPrevious, onNext }) => {
  // 缩放和位移状态
  const [zoomState, setZoomState] = useState({
    scale: 1,
    translateX: 0,
    translateY: 0
  });
  
  // 拖拽状态
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 重置缩放和位移
  const resetZoom = useCallback(() => {
    setZoomState({ scale: 1, translateX: 0, translateY: 0 });
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
  }, []);

  // 背景滚动控制
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.classList.add('modal-open');
      document.body.style.top = `-${scrollY}px`;
      resetZoom();
      
      return () => {
        document.body.classList.remove('modal-open');
        document.body.style.top = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen, resetZoom]);

  // 图片切换时重置
  useEffect(() => {
    resetZoom();
  }, [currentIndex, resetZoom]);

  // 以鼠标位置为中心的缩放函数
  const zoomAtPoint = useCallback((delta: number, clientX?: number, clientY?: number) => {
    setZoomState(prev => {
      const newScale = Math.min(Math.max(prev.scale + delta, 0.5), 5);
      
      // 如果没有鼠标坐标，使用中心点缩放
      if (clientX === undefined || clientY === undefined || !containerRef.current) {
        return { ...prev, scale: newScale };
      }
      
      const containerRect = containerRef.current.getBoundingClientRect();
      const offsetX = clientX - (containerRect.left + containerRect.width / 2);
      const offsetY = clientY - (containerRect.top + containerRect.height / 2);
      
      const scaleDiff = newScale / prev.scale;
      
      const newTranslateX = prev.translateX - offsetX * (scaleDiff - 1);
      const newTranslateY = prev.translateY - offsetY * (scaleDiff - 1);
      
      return {
        scale: newScale,
        translateX: newTranslateX,
        translateY: newTranslateY
      };
    });
  }, []);

  // 滚轮事件 - 传递鼠标坐标
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const delta = e.deltaY > 0 ? -0.2 : 0.2;
    zoomAtPoint(delta, e.clientX, e.clientY);
  }, [zoomAtPoint]);

  // 缩放按钮点击 - 使用中心点缩放
  const handleZoomButtonClick = useCallback((delta: number) => {
    zoomAtPoint(delta);
  }, [zoomAtPoint]);

  // 拖拽开始
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // 只有在放大状态下才能拖拽
    if (zoomState.scale <= 1) return;
    
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setDragOffset({ x: zoomState.translateX, y: zoomState.translateY });
    
    // 改变光标样式
    if (containerRef.current) {
      containerRef.current.style.cursor = 'grabbing';
    }
  }, [zoomState.scale, zoomState.translateX, zoomState.translateY]);

  // 拖拽移动
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || zoomState.scale <= 1) return;

    e.preventDefault();
    
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    setZoomState(prev => ({
      ...prev,
      translateX: dragOffset.x + deltaX,
      translateY: dragOffset.y + deltaY
    }));
  }, [isDragging, dragStart, dragOffset, zoomState.scale]);

  // 拖拽结束
  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      
      // 恢复光标样式
      if (containerRef.current) {
        containerRef.current.style.cursor = zoomState.scale > 1 ? 'grab' : 'default';
      }
    }
  }, [isDragging, zoomState.scale]);

  // 鼠标离开容器时结束拖拽
  const handleMouseLeave = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      
      // 恢复光标样式
      if (containerRef.current) {
        containerRef.current.style.cursor = zoomState.scale > 1 ? 'grab' : 'default';
      }
    }
  }, [isDragging, zoomState.scale]);

  // 键盘事件
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft' && currentIndex > 0) onPrevious();
    if (e.key === 'ArrowRight' && currentIndex < images.length - 1) onNext();
    if (e.key === '0' || e.key === 'Home') resetZoom();
  }, [onClose, onPrevious, onNext, currentIndex, images.length, resetZoom]);

  // 背景点击
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  // 阻止所有滚动事件冒泡到document
  const handleOverlayWheel = useCallback((e: React.WheelEvent) => {
    e.stopPropagation();
  }, []);

  if (!isOpen) return null;

  const zoomPercentage = Math.round(zoomState.scale * 100);
  const isZoomed = zoomState.scale > 1;

  return (
    <div 
      className="image-modal-overlay" 
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      onWheel={handleOverlayWheel}
      tabIndex={0}
    >
      <div className="image-modal-close-hint">
        Click anywhere to close
      </div>

      <div className="image-modal-zoom-controls">
        <button
          className="image-modal-zoom-btn"
          onClick={() => handleZoomButtonClick(-0.25)}
          disabled={zoomState.scale <= 0.5}
          title="Zoom out"
        >
          −
        </button>
        <div className="image-modal-zoom-level">
          {zoomPercentage}%
        </div>
        <button
          className="image-modal-zoom-btn"
          onClick={() => handleZoomButtonClick(0.25)}
          disabled={zoomState.scale >= 5}
          title="Zoom in"
        >
          +
        </button>
        <button
          className="image-modal-zoom-btn"
          onClick={resetZoom}
          disabled={zoomState.scale === 1}
          title="Reset zoom"
        >
          ⌂
        </button>
      </div>

      <div className="image-modal-container">
        <div 
          ref={containerRef}
          className="image-modal-image-wrapper"
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          style={{
            cursor: isDragging ? 'grabbing' : (isZoomed ? 'grab' : 'default')
          }}
        >
          <img
            ref={imageRef}
            src={images[currentIndex]}
            alt={titles[currentIndex]}
            className="image-modal-image"
            style={{
              transform: `scale(${zoomState.scale}) translate(${zoomState.translateX / zoomState.scale}px, ${zoomState.translateY / zoomState.scale}px)`,
              transformOrigin: 'center center'
            }}
            draggable={false}
          />
        </div>
        
        {/* 图片信息区域保持不变 */}
        <div className="image-modal-info">
          <h3 className="image-modal-title">{titles[currentIndex]}</h3>
          {images.length > 1 && (
            <div className="image-modal-counter">
              <div className="image-modal-indicators">
                {images.map((_, index) => (
                  <div
                    key={index}
                    className={`image-modal-indicator ${
                      index === currentIndex 
                        ? 'image-modal-indicator--active' 
                        : 'image-modal-indicator--inactive'
                    }`}
                  />
                ))}
              </div>
              <span className="image-modal-counter-text">
                {currentIndex + 1} of {images.length}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 导航按钮保持不变 */}
      {images.length > 1 && (
        <>
          <button
            className="image-modal-nav-btn image-modal-nav-btn--prev"
            onClick={onPrevious}
            disabled={currentIndex === 0}
            aria-label="Previous image"
          >
            ‹
          </button>
          <button
            className="image-modal-nav-btn image-modal-nav-btn--next"
            onClick={onNext}
            disabled={currentIndex === images.length - 1}
            aria-label="Next image"
          >
            ›
          </button>
        </>
      )}
    </div>
  );
};


export default function ImageGallery() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  
  // 模态框状态
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState<string[]>([]);
  const [modalCurrentIndex, setModalCurrentIndex] = useState(0);
  const [modalTitles, setModalTitles] = useState<string[]>([]);


  // 图片数据: 改成以组为单位了
  const imageItems: ImageItem[] = [
    /** ---------- papilloedema：乳头水肿 / Swelling ---------- */
    { id: 1, title: 'Swelling (Right)', description: '', category: 'papilloedema',
      placeholderText: 'Swelling OD',
      images: [pick('1376 Right swelling.png'), pick('1376 Right swelling OCT.png')]
    },
    { id: 2, title: 'Swelling (Left)', description: '', category: 'papilloedema',
      placeholderText: 'Swelling OS',
      images: [pick('1376 Left swelling.png'), pick('1376 Left swelling OCT.png')]
    },

    { id: 3, title: 'Swelling (Right)', description: '', category: 'papilloedema',
      placeholderText: 'Swelling OD',
      images: [pick('5701 right swelling.PNG'), pick('5701 Right swelling OCT.png')]
    },
    { id: 4, title: 'Swelling (Left)', description: '', category: 'papilloedema',
      placeholderText: 'Swelling OS',
      images: [pick('5701 left swelling.PNG'), pick('5701 Left swelling OCT.png')]
    },

    { id: 5, title: 'Swelling (Right)', description: '', category: 'papilloedema',
      placeholderText: 'Swelling OD',
      images: [pick('7835 right swelling.PNG'), pick('7835 Right swelling OCT.png')]
    },
    { id: 6, title: 'Swelling (Left)', description: '', category: 'papilloedema',
      placeholderText: 'Swelling OS',
      images: [pick('7835 left swelling.PNG'), pick('7835 Left swelling OCT.png')]
    },

    /** ---------- pseudo：假性乳头水肿 ---------- */
    { id: 7, title: 'Crowded optic disc (Right)', description: '', category: 'pseudo',
      placeholderText: 'Crowded OD',
      images: [pick('0362 right crowded disc.PNG'), pick('0362 right crowded disc OCT.PNG')]
    },
    { id: 8, title: 'Crowded optic disc (Left)', description: '', category: 'pseudo',
      placeholderText: 'Crowded OS',
      images: [pick('0362 left crowded disc.PNG'), pick('0362 left crowded disc OCT.PNG')]
    },

    { id: 9, title: 'Crowded optic disc (Right)', description: '', category: 'pseudo',
      placeholderText: 'Crowded OD',
      images: [pick('3258 right crowded disc.PNG'), pick('3258 right crowded disc OCT.PNG')]
    },
    { id: 10, title: 'Crowded optic disc (Left)', description: '', category: 'pseudo',
      placeholderText: 'Crowded OS',
      images: [pick('3258 left crowded disc.PNG'), pick('3258 left crowded disc  OCT.PNG')]
    },

    { id: 11, title: 'Crowded optic disc (Right)', description: '', category: 'pseudo',
      placeholderText: 'Crowded OD',
      images: [pick('5955 right crowded disc.PNG'), pick('5955 right crowded optic disc OCT.PNG')]
    },
    { id: 12, title: 'Crowded optic disc (Left)', description: '', category: 'pseudo',
      placeholderText: 'Crowded OS',
      images: [pick('5955 left crowded disc.PNG'), pick('5955 left crowded disc OCT.PNG')]
    },

    { id: 13, title: 'Crowded optic disc (Right)', description: '', category: 'pseudo',
      placeholderText: 'Crowded OD',
      images: [pick('6023 right crowded disc.PNG'), pick('6023 right crowded disc OCT.PNG')]
    },
    { id: 14, title: 'Crowded optic disc (Left)', description: '', category: 'pseudo',
      placeholderText: 'Crowded OS',
      images: [pick('6023 left crowded disc.PNG'), pick('6023 left crowded disc OCT.PNG')]
    },

    { id: 15, title: 'Crowded optic disc (Right)', description: '', category: 'pseudo',
      placeholderText: 'Crowded OD',
      images: [pick('8209 right crowded disc.PNG'), pick('8209 right crowded disc OCT.PNG')]
    },
    { id: 16, title: 'Crowded optic disc (Left)', description: '', category: 'pseudo',
      placeholderText: 'Crowded OS',
      images: [pick('8209 left crowded disc.PNG'), pick('8209 left crowded disc OCT.PNG')]
    },

    { id: 17, title: 'Tilted + crowded discs (Right)', description: '', category: 'pseudo',
      placeholderText: 'Tilted+Crowded OD',
      images: [pick('8514 right tilted and crowded disc.PNG'), pick('8514 right tilted and crowded disc OCT.PNG')]
    },
    { id: 18, title: 'Tilted + crowded discs (Left)', description: '', category: 'pseudo',
      placeholderText: 'Tilted+Crowded OS',
      images: [pick('8514 left tilted and crowded disc.PNG'), pick('8514 left tilted and crowded disc OCT.PNG')]
    },

    { id: 19, title: 'Optic disc drusen (Right)', description: '', category: 'pseudo',
      placeholderText: 'Drusen OD',
      images: [pick('1312 right drusen.PNG'), pick('1312 right drusen OCT.PNG')]
    },
    { id: 20, title: 'Optic disc drusen (Left)', description: '', category: 'pseudo',
      placeholderText: 'Drusen OS',
      images: [pick('1312 left drusen.PNG'), pick('1312 left drusen OCT.PNG')]
    },

    /** ---------- normal：正常 ---------- */
    { id: 21, title: 'Normal optic disc (Right)', description: '', category: 'normal',
      placeholderText: 'Normal OD',
      images: [pick('6332 normal right.PNG'), pick('6332 normal right OCT.PNG')]
    },
    { id: 22, title: 'Normal optic disc (Left)', description: '', category: 'normal',
      placeholderText: 'Normal OS',
      images: [pick('6332 normal left.PNG'), pick('6332 normal left OCT.PNG')]
    },
  ];


  // 筛选逻辑（改进版，支持模糊搜索）
  const filteredItems = imageItems.filter(item => {
    // 先判断下拉框
    if (activeCategory !== 'all' && item.category !== activeCategory) return false;

    // 搜索框为空则直接通过
    if (!searchTerm.trim()) return true;

    // 搜索逻辑
    const terms = searchTerm.toLowerCase().split(/\s+/).filter(Boolean);
    const text = `${item.title} ${item.description} ${item.placeholderText || ''}`.toLowerCase();

    return terms.every(term => text.includes(term) || text.replace(/ing\b/g, '').includes(term));
  });


  // 模态框处理函数
  const openModal = (item: ImageItem) => {
    const validImages = item.images?.filter(img => img) || [];
    if (validImages.length === 0) return;
    setModalImages(validImages);
    setModalCurrentIndex(0);

    // 这里生成 [fundusTitle, OCTTitle]
    const titles = validImages.map((_, index) => 
      index === 0 ? item.title : `${item.title} (OCT)`
    );
    setModalTitles(titles);
    setIsModalOpen(true);

  };


  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setModalImages([]);
      setModalCurrentIndex(0);
      setModalTitles([]);
    }, 300);
  };

  const goToPrevious = () => {
    if (modalCurrentIndex > 0) {
      setModalCurrentIndex(modalCurrentIndex - 1);
    }
  };

  const goToNext = () => {
    if (modalCurrentIndex < modalImages.length - 1) {
      setModalCurrentIndex(modalCurrentIndex + 1);
    }
  };

  const getCategoryLabel = (category: ImageItem['category']) => {
    switch (category) {
      case 'papilloedema': return 'PAPILLOEDEMA';
      case 'pseudo': return 'PSEUDO';
      case 'normal': return 'NORMAL';
      default: return '';
    }
  };

  // 渲染图片 - 保持原有样式，只添加点击功能
  const renderImageArea = (item: ImageItem) => {
    const hasImages = item.images && item.images.length > 0;
    const imageCount = hasImages ? item.images!.length : 0;
    const hasValidImage = hasImages && item.images![0];
    
    return (
      <div 
        className="image-card__image-area"
        onClick={() => hasValidImage && openModal(item)}
        style={{ 
          cursor: hasValidImage ? 'pointer' : 'default'
        }}
      >
        {hasValidImage ? (
          <img
            src={item.images![0]}
            alt={item.title}
            className="image-card__image"
          />
        ) : (
          <div className="image-card__placeholder">
            {item.placeholderText}
          </div>
        )}
        
        <div className={`image-card__category-badge image-card__category-badge--${item.category}`}>
          {getCategoryLabel(item.category)}
        </div>
        
        {imageCount > 1 && (
          <div className="image-card__count-indicator">
            <span>+{imageCount - 1} more</span>
          </div>
        )}
      </div>
    );
  };

  return (
      <>
        <Header title="Reference Image Gallery" />
        <BackButton className="tutorial-back-button" />

        <div className="gallery-container">
          <div className="gallery-wrapper">

            <h1 className="gallery-heading">Reference Image Gallery</h1>

            <section className="filter-bar">
              <label className="filter-group">
                Search Images
                <div className="filter-input-wrapper">
                  <svg
                      className="filter-icon"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                  <input
                      type="text"
                      placeholder="Search conditions, symptoms..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="filter-input"
                  />
                </div>
              </label>

              <label className="filter-group">
                Condition Type
                <select
                    value={activeCategory}
                    onChange={(e) => setActiveCategory(e.target.value)}
                    className="filter-select"
                >
                  <option value="all">All Images</option>
                  <option value="papilloedema">Papilloedema</option>
                  <option value="pseudo">Pseudopapilloedema</option>
                  <option value="normal">Normal Appearance</option>
                </select>
              </label>
            </section>

            <div className="image-cards-grid">
              {filteredItems.map((item) => (
                  <div key={item.id} className="image-card">
                    {renderImageArea(item)}
                    <div className="image-card__content">
                      <h3 className="image-card__title">{item.title}</h3>
                      <p className="image-card__description">{item.description}</p>
                    </div>
                  </div>
              ))}
            </div>

            {filteredItems.length === 0 && (
                <div className="gallery-empty-state">
                  <h3>No images found</h3>
                  <p>Try adjusting your search terms or category filter</p>
                </div>
            )}
          </div>
        </div>

        {/* 图片模态框 */}
        <ImageModal
          isOpen={isModalOpen}
          images={modalImages}
          currentIndex={modalCurrentIndex}
          titles={modalTitles}
          onClose={closeModal}
          onPrevious={goToPrevious}
          onNext={goToNext}
        />

        <BottomNav />
      </>
  );
}