
import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchAndFilterProps {
  onSearch: (term: string) => void;
  onCategoryFilter: (category: string) => void;
  categories: string[];
  selectedCategory: string;
  searchTerm: string;
}

export const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  onSearch,
  onCategoryFilter,
  categories,
  selectedCategory,
  searchTerm,
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  const handleCategoryClick = (category: string) => {
    const newCategory = selectedCategory === category ? '' : category;
    onCategoryFilter(newCategory);
  };

  const clearSearch = () => {
    onSearch('');
  };

  return (
    <div className="space-y-6">
      <div className="relative max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search for recipes..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">Filter by Category</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                selectedCategory === category
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
