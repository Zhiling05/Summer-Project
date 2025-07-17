// src/pages/optometrist/assess/recommendations/DynamicRecommendation.tsx
import React from 'react';
import { useParams, Navigate, Outlet } from 'react-router-dom';
import RecommendationsRouter from './RecommendationsRouter';
import './recommendation.css';

/**
 * recommendations.json 写好后：
 *    - 确认文件路径（下面 require 里的相对路径）。
 *    - 确认 JSON 里每条记录的字段名和结构，对应到下面的 ResultRecord 接口。
 */
export interface ResultRecord {
  id: string;
  /** 
   *  recommendations.json 中此字段用全大写下划线：
   *    e.g. "EMERGENCY_DEPARTMENT", "URGENT_TO_OPH" 等
   */
  recommendationType: RecommendationType;
  // TODO: 补充其他字段，比如 title, description, imageUrl 等
  // title: string;
  // description: string;
  // imageUrl?: string;
}

/**
 * 如果在 recommendations.json 里添加了新的类型，
 *    也要在这里加一行，并在 RecommendationsRouter.tsx 注册对应的 path（用连字符小写）。
 */
export enum RecommendationType {
  EMERGENCY_DEPARTMENT   = 'EMERGENCY_DEPARTMENT',
  IMMEDIATE              = 'IMMEDIATE',
  URGENT_TO_OPH          = 'URGENT_TO_OPH',
  URGENT_TO_GP_OR_NEUR   = 'URGENT_TO_GP_OR_NEUR',
  TO_GP                  = 'TO_GP',
  NO_REFERRAL            = 'NO_REFERRAL',
}

const DynamicRecommendation: React.FC = () => {
  // 路由里约定的 param 名，根据 Route 定义调整
  const { resultId } = useParams<{ resultId: string }>();

  // ▶这里 require 的路径，等 recommendations.json 确定放在哪调整
  const allResults: ResultRecord[] = require('../../../../data/recommendations.json');
  const result = allResults.find((r) => r.id === resultId);

  if (!result) {
    return (
      <div className="recommendation-page">
        <h2>Result “{resultId}” not found</h2>
      </div>
    );
  }

  /**
   * 把 UPPER_SNAKE_CASE 转回小写连字符：
   * EMERGENCY_DEPARTMENT → emergency-department
   * 正好匹配 RecommendationsRouter.tsx 里注册的 path
   */
  const pathSegment = result.recommendationType
    .toLowerCase()
    .replace(/_/g, '-');

  return (
    <div className="recommendation-page">
      {/* 子路由入口（EmergencyDepartment、Immediate…等） */}
      <RecommendationsRouter />

      {/* 将页面导航到对应的子路由 */}
      <Navigate to={pathSegment} replace />

      {/* 渲染子路由组件 */}
      <Outlet />
    </div>
  );
};

export default DynamicRecommendation;
