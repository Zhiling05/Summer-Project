import { useState } from 'react';
import Header from '../../../components/Header';
import BottomNav from '../../../components/BottomNav';
import BackButton from '../../../components/BackButton';
import '../../../styles/image-card.css';
import '../../../styles/image-gallery.css';

interface ImageItem {
  id: number;
  title: string;
  description: string;
  category: 'true' | 'pseudo' | 'uncertain' | 'normal';
  images?: string[]; // 图片URL数组，支持多张图片
  placeholderText?: string; // 占位符文字
}

export default function ImageGallery() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const imageItems: ImageItem[] = [
    {
      id: 1,
      title: 'Cotton wool spots on surface or around optic disc and affecting retina',
      description: 'Eye finding that positively identifies papilloedema',
      category: 'true',
      placeholderText: 'Cotton Wool Spots',
      images: [] // 暂时没有真实图片，用的占位符
    },
    {
      id: 2,
      title: 'Flame or blot haemorrhages on surface or around optic disc and affecting retina', 
      description: 'Eye finding that positively identifies papilloedema',
      category: 'true',
      placeholderText: 'Flame Haemorrhages',
      images: [] 
    },
    {
      id: 3,
      title: 'Obscuration of blood vessels overlying disc',
      description: 'Uncertain for papilloedema, requires further ophthalmology examination',
      category: 'uncertain',
      placeholderText: 'Blood Vessel Obscuration',
      images: [] 
    },
    {
      id: 4,
      title: 'Hyperaemia of small blood vessels overlying disc',
      description: 'Uncertain for papilloedema, requires further ophthalmology examination',
      category: 'uncertain',
      placeholderText: 'Vessel Hyperaemia',
      images: []
    },
    {
      id: 5,
      title: 'Peripapillary retinal folds',
      description: 'Uncertain for papilloedema, requires further ophthalmology examination',
      category: 'uncertain',
      placeholderText: 'Retinal Folds',
      images: [] 
    },
    {
      id: 6,
      title: 'Choroidal folds',
      description: 'Uncertain for papilloedema, requires further ophthalmology examination',
      category: 'uncertain',
      placeholderText: 'Choroidal Folds',
      images: []
    },
    {
      id: 7,
      title: 'Crowded optic discs',
      description: 'Eye finding that represents pseudopapilloedema (benign anatomical variation)',
      category: 'pseudo',
      placeholderText: 'Crowded Discs',
      images: []
    },
    {
      id: 8,
      title: 'Obvious distinct white-yellow bodies(drusen) within the optic disc',
      description: 'Eye finding that represents pseudopapilloedema (benign anatomical variation)',
      category: 'pseudo',
      placeholderText: 'Drusen Bodies',
      images: []
    },
    {
      id: 9,
      title: 'PHOMS',
      description: 'Eye finding that represents pseudopapilloedema (benign anatomical variation)',
      category: 'pseudo',
      placeholderText: 'PHOMS',
      images: []
    },
    {
      id: 10,
      title: 'Tilted discs',
      description: 'Eye finding that represents pseudopapilloedema (benign anatomical variation)',
      category: 'pseudo',
      placeholderText: 'Tilted Discs',
      images: []
    },
    {
      id: 11,
      title: 'Normal optic disc',
      description: 'Healthy optic disc appearance with normal characteristics',
      category: 'normal',
      placeholderText: 'Normal Disc',
      images: []
    }
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
      case 'uncertain': return 'UNCERTAIN';
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
        <BackButton />

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
                  <option value="uncertain">Uncertain Appearance</option>
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