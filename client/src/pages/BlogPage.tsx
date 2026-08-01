import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BlogSection } from '../components/BlogSection';
import { useApp } from '../context/AppContext';

export const BlogPage: React.FC = () => {
  const { lang } = useApp();
  return <BlogSection lang={lang} />;
};
