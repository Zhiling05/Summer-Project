import { useState } from 'react';
import Header from '../../../components/Header';
import BottomNav from '../../../components/BottomNav';
import BackButton from '../../../components/BackButton';
import '../../../styles/image-card.css';
import '../../../styles/image-gallery.css';


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
  category: 'true' | 'pseudo' | 'normal';
  images?: string[]; // 图片URL数组，支持多张图片
  placeholderText?: string; // 占位符文字
}

export default function ImageGallery() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // const imageItems: ImageItem[] = [
  //   {
  //     id: 1,
  //     title: 'Cotton wool spots on surface or around optic disc and affecting retina',
  //     description: 'Eye finding that positively identifies papilloedema',
  //     category: 'true',
  //     placeholderText: 'Cotton Wool Spots',
  //     images: [] // 暂时没有真实图片，用的占位符
  //   },
  //   {
  //     id: 2,
  //     title: 'Flame or blot haemorrhages on surface or around optic disc and affecting retina',
  //     description: 'Eye finding that positively identifies papilloedema',
  //     category: 'true',
  //     placeholderText: 'Flame Haemorrhages',
  //     images: []
  //   },
  //   {
  //     id: 7,
  //     title: 'Crowded optic discs',
  //     description: 'Eye finding that represents pseudopapilloedema (benign anatomical variation)',
  //     category: 'pseudo',
  //     placeholderText: 'Crowded Discs',
  //     images: []
  //   },
  //   {
  //     id: 8,
  //     title: 'Obvious distinct white-yellow bodies(drusen) within the optic disc',
  //     description: 'Eye finding that represents pseudopapilloedema (benign anatomical variation)',
  //     category: 'pseudo',
  //     placeholderText: 'Drusen Bodies',
  //     images: []
  //   },
  //   {
  //     id: 9,
  //     title: 'PHOMS',
  //     description: 'Eye finding that represents pseudopapilloedema (benign anatomical variation)',
  //     category: 'pseudo',
  //     placeholderText: 'PHOMS',
  //     images: []
  //   },
  //   {
  //     id: 10,
  //     title: 'Tilted discs',
  //     description: 'Eye finding that represents pseudopapilloedema (benign anatomical variation)',
  //     category: 'pseudo',
  //     placeholderText: 'Tilted Discs',
  //     images: []
  //   },
  //   {
  //     id: 11,
  //     title: 'Normal optic disc',
  //     description: 'Healthy optic disc appearance with normal characteristics',
  //     category: 'normal',
  //     placeholderText: 'Normal Disc',
  //     images: ['docs/src/assets/image-gallery/normal-left.PNG']
  //   }
  // ];

  const imageItems: ImageItem[] = [
    /** ---------- TRUE：乳头水肿 / Swelling ---------- */
    { id: 1,  title: 'Papilloedema — Swelling (Right, fundus)', description: '', category: 'true',
      placeholderText: 'Swelling OD', images: [pick('1376 Right swelling.png')] },
    { id: 2,  title: 'Papilloedema — Swelling (Left, fundus)', description: '', category: 'true',
      placeholderText: 'Swelling OS', images: [pick('1376 Left swelling.png')] },
    { id: 3,  title: 'Papilloedema — Swelling (Right, OCT)', description: '', category: 'true',
      placeholderText: 'Swelling OCT OD', images: [pick('1376 Right swelling OCT.png')] },
    { id: 4,  title: 'Papilloedema — Swelling (Left, OCT)', description: '', category: 'true',
      placeholderText: 'Swelling OCT OS', images: [pick('1376 Left swelling OCT.png')] },

    { id: 5,  title: 'Papilloedema — Swelling (Right, fundus)', description: '', category: 'true',
      placeholderText: 'Swelling OD', images: [pick('5701 right swelling.PNG')] },
    { id: 6,  title: 'Papilloedema — Swelling (Left, fundus)', description: '', category: 'true',
      placeholderText: 'Swelling OS', images: [pick('5701 left swelling.PNG')] },
    { id: 7,  title: 'Papilloedema — Swelling (Right, OCT)', description: '', category: 'true',
      placeholderText: 'Swelling OCT OD', images: [pick('5701 Right swelling OCT.png')] },
    { id: 8,  title: 'Papilloedema — Swelling (Left, OCT)', description: '', category: 'true',
      placeholderText: 'Swelling OCT OS', images: [pick('5701 Left swelling OCT.png')] },

    { id: 9,  title: 'Papilloedema — Swelling (Right, fundus)', description: '', category: 'true',
      placeholderText: 'Swelling OD', images: [pick('7835 right swelling.PNG')] },
    { id: 10,  title: 'Papilloedema — Swelling (Left, fundus)', description: '', category: 'true',
      placeholderText: 'Swelling OS', images: [pick('7835 left swelling.PNG')] },
    { id: 11,  title: 'Papilloedema — Swelling (Right, OCT)', description: '', category: 'true',
      placeholderText: 'Swelling OCT OD', images: [pick('7835 Right swelling OCT.png')] },
    { id: 12,  title: 'Papilloedema — Swelling (Left, OCT)', description: '', category: 'true',
      placeholderText: 'Swelling OCT OS', images: [pick('7835 Left swelling OCT.png')] },

    /** ---------- PSEUDO：假性乳头水肿（crowded / tilted+crowded / drusen） ---------- */
    // Crowded disc
    { id: 13,  title: 'Crowded optic disc (Right, fundus)', description: '', category: 'pseudo',
      placeholderText: 'Crowded OD', images: [pick('0362 right crowded disc.PNG')] },
    { id: 14,  title: 'Crowded optic disc (Left, fundus)', description: '', category: 'pseudo',
      placeholderText: 'Crowded OS', images: [pick('0362 left crowded disc.PNG')] },
    { id: 15,  title: 'Crowded optic disc (Right, OCT)', description: '', category: 'pseudo',
      placeholderText: 'Crowded OCT OD', images: [pick('0362 right crowded disc OCT.PNG')] },
    { id: 16,  title: 'Crowded optic disc (Left, OCT)', description: '', category: 'pseudo',
      placeholderText: 'Crowded OCT OS', images: [pick('0362 left crowded disc OCT.PNG')] },

    { id: 17,  title: 'Crowded optic disc (Right, fundus)', description: '', category: 'pseudo',
      placeholderText: 'Crowded OD', images: [pick('3258 right crowded disc.PNG')] },
    { id: 18,  title: 'Crowded optic disc (Left, fundus)', description: '', category: 'pseudo',
      placeholderText: 'Crowded OS', images: [pick('3258 left crowded disc.PNG')] },
    { id: 19,  title: 'Crowded optic disc (Right, OCT)', description: '', category: 'pseudo',
      placeholderText: 'Crowded OCT OD', images: [pick('3258 right crowded disc OCT.PNG')] },
    { id: 20,  title: 'Crowded optic disc (Left, OCT)', description: '', category: 'pseudo',
      placeholderText: 'Crowded OCT OS', images: [pick('3258 left crowded disc  OCT.PNG')] },

    { id: 21,  title: 'Crowded optic disc (Right, fundus)', description: '', category: 'pseudo',
      placeholderText: 'Crowded OD', images: [pick('5955 right crowded disc.PNG')] },
    { id: 22,  title: 'Crowded optic disc (Left, fundus)', description: '', category: 'pseudo',
      placeholderText: 'Crowded OS', images: [pick('5955 left crowded disc.PNG')] },
    { id: 23,  title: 'Crowded optic disc (Right, OCT)', description: '', category: 'pseudo',
      placeholderText: 'Crowded OCT OD', images: [pick('5955 right crowded optic disc OCT.PNG')] },
    { id: 24,  title: 'Crowded optic disc (Left, OCT)', description: '', category: 'pseudo',
      placeholderText: 'Crowded OCT OS', images: [pick('5955 left crowded disc OCT.PNG')] },

    { id: 25,  title: 'Crowded optic disc (Right, fundus)', description: '', category: 'pseudo',
      placeholderText: 'Crowded OD', images: [pick('6023 right crowded disc.PNG')] },
    { id: 26,  title: 'Crowded optic disc (Left, fundus)', description: '', category: 'pseudo',
      placeholderText: 'Crowded OS', images: [pick('6023 left crowded disc.PNG')] },
    { id: 27,  title: 'Crowded optic disc (Right, OCT)', description: '', category: 'pseudo',
      placeholderText: 'Crowded OCT OD', images: [pick('6023 right crowded disc OCT.PNG')] },
    { id: 28,  title: 'Crowded optic disc (Left, OCT)', description: '', category: 'pseudo',
      placeholderText: 'Crowded OCT OS', images: [pick('6023 left crowded disc OCT.PNG')] },

    { id: 29,  title: 'Crowded optic disc (Right, fundus)', description: '', category: 'pseudo',
      placeholderText: 'Crowded OD', images: [pick('8209 right crowded disc.PNG')] },
    { id: 30,  title: 'Crowded optic disc (Left, fundus)', description: '', category: 'pseudo',
      placeholderText: 'Crowded OS', images: [pick('8209 left crowded disc.PNG')] },
    { id: 31,  title: 'Crowded optic disc (Right, OCT)', description: '', category: 'pseudo',
      placeholderText: 'Crowded OCT OD', images: [pick('8209 right crowded disc OCT.PNG')] },
    { id: 32,  title: 'Crowded optic disc (Left, OCT)', description: '', category: 'pseudo',
      placeholderText: 'Crowded OCT OS', images: [pick('8209 left crowded disc OCT.PNG')] },



    // Tilted + crowded
    { id: 33,  title: 'Tilted + crowded discs (Right, fundus)', description: '', category: 'pseudo',
      placeholderText: 'Tilted+Crowded OD', images: [pick('8514 right tilted and crowded disc.PNG')] },
    { id: 34, title: 'Tilted + crowded discs (Left, fundus)', description: '', category: 'pseudo',
      placeholderText: 'Tilted+Crowded OS', images: [pick('8514 left tilted and crowded disc.PNG')] },
    { id: 35, title: 'Tilted + crowded discs (Right, OCT)', description: '', category: 'pseudo',
      placeholderText: 'Tilted+Crowded OCT OD', images: [pick('8514 right tilted and crowded disc OCT.PNG')] },
    { id: 36, title: 'Tilted + crowded discs (Left, OCT)', description: '', category: 'pseudo',
      placeholderText: 'Tilted+Crowded OCT OS', images: [pick('8514 left tilted and crowded disc OCT.PNG')] },

    // Drusen
    { id: 37, title: 'Optic disc drusen (Right, fundus)', description: '', category: 'pseudo',
      placeholderText: 'Drusen OD', images: [pick('1312 right drusen.PNG')] },
    { id: 38, title: 'Optic disc drusen (Left, fundus)', description: '', category: 'pseudo',
      placeholderText: 'Drusen OS', images: [pick('1213 left drusen.PNG')] },
    { id: 39, title: 'Optic disc drusen (Right, OCT)', description: '', category: 'pseudo',
      placeholderText: 'Drusen OCT OD', images: [pick('1312 right drusen OCT.PNG')] },
    { id: 40, title: 'Optic disc drusen (Left, OCT)', description: '', category: 'pseudo',
      placeholderText: 'Drusen OCT OS', images: [pick('1312 left drusen OCT.PNG')] },

    /** ---------- NORMAL：正常 ---------- */
    { id: 41, title: 'Normal optic disc (Right, fundus)', description: '', category: 'normal',
      placeholderText: 'Normal OD', images: [pick('6332 normal right.PNG')] },
    { id: 42, title: 'Normal optic disc (Left, fundus)', description: '', category: 'normal',
      placeholderText: 'Normal OS', images: [pick('6332 normal left.PNG')] },
    { id: 43, title: 'Normal optic disc (Right, OCT)', description: '', category: 'normal',
      placeholderText: 'Normal OCT OD', images: [pick('6332 normal right OCT.PNG')] },
    { id: 44, title: 'Normal optic disc (Left, OCT)', description: '', category: 'normal',
      placeholderText: 'Normal OCT OS', images: [pick('6332 normal left OCT.PNG')] },
  ];


  // 筛选逻辑
  const filteredItems = imageItems.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  // const handleItemClick = (item: ImageItem) => {
  //   // 这里可以导航到详情页或打开模态框
  //   // 例如：navigate(`/optometrist/guide/gallery/${item.id}`);
  // };

  const getCategoryLabel = (category: ImageItem['category']) => {
    switch (category) {
      case 'true': return 'TRUE';
      case 'pseudo': return 'PSEUDO';
      case 'normal': return 'NORMAL';
      default: return '';
    }
  };

  // 渲染图片
  const renderImageArea = (item: ImageItem) => {
    const hasImages = item.images && item.images.length > 0;
    const imageCount = hasImages ? item.images!.length : 0;
    
    return (
      <div className="image-card__image-area">
        {hasImages && item.images![0] ? (
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
        
        {/* 分类标签 */}
        <div className={`image-card__category-badge image-card__category-badge--${item.category}`}>
          {getCategoryLabel(item.category)}
        </div>
        
        {/* 图片数量提示（只在多于1张时显示） */}
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
                  <option value="true">Papilloedema</option>
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

        <BottomNav />
      </>
  );
}